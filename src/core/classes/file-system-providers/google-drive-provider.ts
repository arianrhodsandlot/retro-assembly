import ky from 'ky'
import { compact, initial, last } from 'lodash-es'
import { GoogleDriveClient } from '../cloude-service/google-drive-client'
import { RequestCache } from '../request-cache'
import { FileAccessor } from './file-accessor'
import { type FileSystemProvider } from './file-system-provider'

const defaultFileFields = 'name,id,mimeType,modifiedTime,version,webContentLink'
const defaultFileNestedFields = `files(${defaultFileFields})`

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

  async getFileContent(path: string) {
    const segments = path.split('/')
    const fileDirectory = initial(segments).join('/')
    const fileName = last(segments)
    const directory = await this.getDirectory(fileDirectory)
    const conditions = ['trashed=false', `parents in '${directory.id}'`, `name='${fileName}'`]
    const q = conditions.join(' and ')
    const response = await this.client.list({ orderBy: 'name', q, fields: defaultFileNestedFields })
    const file = response.result.files?.[0]
    if (!file) {
      throw new Error('invalid file')
    }
    const fileId = file.id
    const { access_token: accessToken } = gapi.client.getToken()
    return await ky(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      searchParams: { alt: 'media' },
    }).blob()
  }

  async createFile({ file, path }) {
    const segments = path.split('/')

    const [fileName] = segments.slice(-1)

    const directoryPath = segments.slice(0, -1).join('/')
    const directory = await this.ensureDirectory(directoryPath)
    const directoryId = directory.id

    const form = new FormData()

    const metadata = { name: fileName, parents: [directoryId], mimeType: file.type }
    const metadataJson = JSON.stringify(metadata)
    const metadataBlob = new Blob([metadataJson], { type: 'application/json' })

    const { access_token: accessToken } = gapi.client.getToken()

    form.append('metadata', metadataBlob)
    form.append('file', file)

    await ky.post('https://www.googleapis.com/upload/drive/v3/files', {
      headers: { Authorization: `Bearer ${accessToken}` },
      searchParams: { uploadType: 'multipart', fields: 'id' },
      body: form,
    })
  }

  // todo: not implemented yet
  async deleteFile(path) {
    await this
    throw new Error('not implemented')
  }

  async listChildren(path: string) {
    let directoryId = 'root'
    if (path !== '/') {
      const directory = await this.getDirectory(path)
      directoryId = directory.id
    }

    const conditions = [`parents in '${directoryId}'`, 'trashed=false']
    const q = conditions.join(' and ')

    const folderMimeType = 'application/vnd.google-apps.folder'
    const fileAccessors: FileAccessor[] = []
    const pageSize = 200
    let pageToken = ''
    do {
      const fields = `${defaultFileNestedFields},nextPageToken`
      const {
        result: { files, nextPageToken },
      } = await this.client.list({ orderBy: 'name', q, fields, pageSize, pageToken })
      if (files) {
        fileAccessors.push(
          ...files.map(
            (file) =>
              new FileAccessor({
                name: file.name ?? '',
                directory: path,
                type: file.mimeType === folderMimeType ? 'directory' : 'file',
                temporaryUrl: file.webContentLink,
                fileSystemProvider: this,
              })
          )
        )
      }
      pageToken = nextPageToken ?? ''
    } while (pageToken)

    return fileAccessors
  }

  private async getRootChildren() {
    const { client } = this
    const conditions = ["parents in 'root'", 'trashed=false']
    const q = conditions.join(' and ')
    return await client.list({ orderBy: 'name', q, fields: defaultFileNestedFields })
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
          { orderBy: 'name', q, fields: defaultFileNestedFields },
          cacheIdentifier
        )
        directory = response.result.files[0]
      } else {
        const response = await this.client.list({ orderBy: 'name', q, fields: defaultFileNestedFields })
        directory = response.result.files?.[0]
      }

      if (!directory) {
        throw new Error(`directory not found: ${path}`)
      }
    }

    return directory
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
      const response = await client.list({ orderBy: 'name', q, fields: defaultFileNestedFields })

      directory = response.result.files?.[0]
      if (!directory) {
        // @ts-expect-error creating a directory does not need a file parameter
        const response = await client.create({
          resource: { name: segment, mimeType: 'application/vnd.google-apps.folder', parents: [directoryId] },
          fields: defaultFileFields,
        })
        directory ||= response.result
      }
    }

    return directory
  }

  private async listWithCache(gapiListParams, identifier) {
    const cachedList = await RequestCache.makeCacheable({
      func: async () => await this.client.list(gapiListParams),
      identifier: (...args) => ({
        functionName: 'GoogleDriveProvider.listWithCache',
        args,
        ...identifier,
      }),
    })
    return await cachedList(gapiListParams)
  }
}
