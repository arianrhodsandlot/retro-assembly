import { compact, initial, last } from 'lodash-es'
import { http } from '../../helpers/http'
import { GoogleDriveClient } from '../cloude-service/google-drive-client'
import { RequestCache } from '../request-cache'
import { FileAccessor } from './file-accessor'
import type { FileSystemProvider } from './file-system-provider'

interface ListOptions {
  orderBy?: string
  pageCursor?: string
  pageSize?: number
}

const defaultFileFields = 'name,id,mimeType,modifiedTime,version,webContentLink'
const defaultFileNestedFields = `files(${defaultFileFields})`

const folderMimeType = 'application/vnd.google-apps.folder'

export class GoogleDriveProvider implements FileSystemProvider {
  private client: GoogleDriveClient

  constructor({ client }) {
    this.client = client
  }

  static async getSingleton() {
    await GoogleDriveClient.loadGapi()
    const client = new GoogleDriveClient()
    return new GoogleDriveProvider({ client })
  }

  async create({ file, path }) {
    const segments = path.split('/')

    const [fileName] = segments.slice(-1)

    const directoryPath = segments.slice(0, -1).join('/')
    const directory = await this.ensureDirectory(directoryPath)
    const directoryId = directory.id

    const form = new FormData()

    const metadata = { mimeType: file.type, name: fileName, parents: [directoryId] }
    const metadataJson = JSON.stringify(metadata)
    const metadataBlob = new Blob([metadataJson], { type: 'application/json' })

    const { access_token: accessToken } = gapi.client.getToken()

    form.append('metadata', metadataBlob)
    form.append('file', file)

    await http.post('https://www.googleapis.com/upload/drive/v3/files', {
      body: form,
      headers: { Authorization: `Bearer ${accessToken}` },
      searchParams: { fields: 'id', uploadType: 'multipart' },
    })
  }

  // todo: not implemented yet
  async delete(path) {
    console.info(path)
    await this
    throw new Error('not implemented')
  }

  async getContent(path: string) {
    const segments = path.split('/')
    const fileDirectory = initial(segments).join('/')
    const fileName = last(segments)
    const directory = await this.getDirectoryWithCache(fileDirectory)
    const conditions = ['trashed=false', `parents in '${directory.id}'`, `name='${fileName}'`]
    const q = conditions.join(' and ')
    const response = await this.client.list({ fields: defaultFileNestedFields, orderBy: 'name', q })
    const file = response.result.files?.[0]
    if (!file) {
      throw new Error('invalid file')
    }
    const fileId = file.id
    const { access_token: accessToken } = gapi.client.getToken()
    return await http(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      searchParams: { alt: 'media' },
    }).blob()
  }

  async getContentAndCache(path: string) {
    const cacheKey = { name: 'GoogleDriveProvider.peekContent', path }
    const blob = await this.getContent(path)

    const text = await blob.text()
    if (typeof text === 'string') {
      RequestCache.set(cacheKey, blob)
    }
    return blob
  }

  async list(path: string) {
    const children: { mimeType: string; name: string; webContentLink: string }[] = []
    let listNextPage = async () => await this.listChildrenByPages(path, {})
    do {
      const result = await listNextPage()
      children.push(...result.items)
      listNextPage = result.listNextPage
    } while (listNextPage)

    if (children?.length) {
      RequestCache.set({ name: 'GoogleDriveProvider.peek', path }, children)
    }

    return children.map(
      (item) =>
        new FileAccessor({
          directory: path,
          fileSystemProvider: this,
          name: item.name ?? '',
          temporaryUrl: item.webContentLink,
          type: item.mimeType === folderMimeType ? 'directory' : 'file',
        }),
    )
  }

  async peek(path: string) {
    const rawCache = await RequestCache.get({ name: 'GoogleDriveProvider.peek', path })
    const children = rawCache?.value
    const fileAccessors: FileAccessor[] | undefined = children?.map(
      (item) =>
        new FileAccessor({
          directory: path,
          fileSystemProvider: this,
          name: item.name ?? '',
          temporaryUrl: item.webContentLink,
          type: item.mimeType === folderMimeType ? 'directory' : 'file',
        }),
    )
    return fileAccessors
  }

  async peekContent(path: string) {
    const cacheKey = { name: 'GoogleDriveProvider.peekContent', path }
    const rawCache = await RequestCache.get(cacheKey)
    return rawCache?.value
  }

  private async ensureDirectory(path: string) {
    if (!path.startsWith('/')) {
      throw new Error(`invalid path: ${path}`)
    }
    if (path.endsWith('/')) {
      path = path.slice(0, -1)
    }
    const { client } = this
    const segments = compact(path.slice(1).split('/'))
    if (segments.length === 0) {
      return this.getRootChildren()
    }

    let directory
    for (const segment of segments) {
      const directoryId = directory?.id || 'root'
      const conditions = [`name='${segment}'`, `parents in '${directoryId}'`, 'trashed=false']
      const q = conditions.join(' and ')
      const response = await client.list({ fields: defaultFileNestedFields, orderBy: 'name', q })

      directory = response.result.files?.[0]
      if (!directory) {
        // @ts-expect-error creating a directory does not need a file parameter
        const response = await client.create({
          fields: defaultFileFields,
          resource: { mimeType: 'application/vnd.google-apps.folder', name: segment, parents: [directoryId] },
        })
        directory ||= response.result
      }
    }

    return directory
  }

  private async getDirectory(path) {
    if (!path.startsWith('/')) {
      throw new Error(`invalid path: ${path}`)
    }
    if (path.endsWith('/')) {
      path = path.slice(0, -1)
    }
    const segments = compact(path.slice(1).split('/'))
    if (segments.length === 0) {
      return this.getRootChildren()
    }

    let directory
    for (const segment of segments) {
      const directoryId = directory?.id ?? 'root'
      const conditions = [`name='${segment}'`, `parents in '${directoryId}'`, 'trashed=false']
      const q = conditions.join(' and ')

      if (directory) {
        const cacheIdentifier = { directory }
        const response = await this.listWithCache(
          { fields: defaultFileNestedFields, orderBy: 'name', q },
          cacheIdentifier,
        )
        directory = response.result.files[0]
      } else {
        const response = await this.client.list({ fields: defaultFileNestedFields, orderBy: 'name', q })
        directory = response.result.files?.[0]
      }

      if (!directory) {
        throw new Error(`directory not found: ${path}`)
      }
    }

    return directory
  }

  private async getDirectoryWithCache(path: string) {
    const { cacheable } = await RequestCache.makeCacheable({
      func: (path: string) => this.getDirectory(path),
      identifier: 'GoogleDriveProvider.getDirectory',
    })
    return cacheable(path)
  }

  private async getRootChildren() {
    const { client } = this
    const conditions = ["parents in 'root'", 'trashed=false']
    const q = conditions.join(' and ')
    return await client.list({ fields: defaultFileNestedFields, orderBy: 'name', q })
  }

  private async listChildrenByPages(path: string, { orderBy = 'name', pageCursor = '', pageSize = 200 }: ListOptions) {
    let directoryId = 'root'
    if (path !== '/') {
      const directory = await this.getDirectoryWithCache(path)
      directoryId = directory.id
    }

    const conditions = [`parents in '${directoryId}'`, 'trashed=false']
    const q = conditions.join(' and ')

    const pager = { cursor: '', size: pageSize }
    const fields = `${defaultFileNestedFields},nextPageToken`
    const {
      result: { files: items, nextPageToken },
    } = await this.client.list({ fields, orderBy, pageSize, pageToken: pageCursor, q })
    let listNextPage
    if (nextPageToken) {
      pager.size = pageSize
      pager.cursor = nextPageToken
      listNextPage = async () =>
        await this.listChildrenByPages(path, { orderBy, pageCursor: pager.cursor, pageSize: pager.size })
    }
    return { items, listNextPage, pager }
  }

  private async listWithCache(gapiListParams, identifier) {
    const { cacheable: cachedList } = await RequestCache.makeCacheable({
      func: async () => await this.client.list(gapiListParams),
      identifier: (...args) => ({
        args,
        functionName: 'GoogleDriveProvider.listWithCache',
        ...identifier,
      }),
    })
    return await cachedList(gapiListParams)
  }
}
