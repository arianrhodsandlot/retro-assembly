import { openDB } from 'idb'
import ky from 'ky'
import { compact, identity, initial, last } from 'lodash-es'
import queryString from 'query-string'
import { getStorageByKey, setStorageByKey } from '../../helpers/storage'
import { RequestCache } from '../request-cache'
import { FileAccessor } from './file-accessor'
import { FileSummary } from './file-summary'
import { type FileSystemProvider } from './file-system-provider'

window.RequestCache = RequestCache
const authorizeUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

const googleDriveAuth = {
  clientId: '274532033666-qenp1uucqj33b57qphiojlc47198q972.apps.googleusercontent.com',
  projectId: 'retro-assembly',
  authUri: 'https://accounts.google.com/o/oauth2/auth',
  tokenUri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  redirectUri: 'http://localhost:5173/auth/googledrive',
  javascript_origins: ['http://localhost:5173'],
  scope: 'https://www.googleapis.com/auth/drive',
}

const { clientId, scope, redirectUri } = googleDriveAuth

const defaultFileFields = 'name,id,mimeType,modifiedTime,version,webContentLink'
const defaultFileNestedFields = `files(${defaultFileFields})`

export class GoogleDriveProvider implements FileSystemProvider {
  static tokenStorageKey = 'google-drive-token'

  private client

  constructor({ client }) {
    this.client = client
  }

  static async getSingleton() {
    await GoogleDriveProvider.loadGapi()
    return new GoogleDriveProvider({ client: gapi.client.drive.files })
  }

  static getAuthorizeUrl() {
    const query = {
      client_id: clientId,
      scope,
      response_type: 'token',
      redirect_uri: redirectUri,
    }
    return queryString.stringifyUrl({ url: authorizeUrl, query })
  }

  static isRetrievingToken() {
    const { access_token: accessToken } = queryString.parse(location.hash)
    return typeof accessToken === 'string'
  }

  static retrieveToken() {
    const isRetrievingToken = GoogleDriveProvider.isRetrievingToken()
    if (!isRetrievingToken) {
      throw new TypeError('token is empty')
    }

    const { access_token: accessToken, error, error_description: errorDescription } = queryString.parse(location.hash)
    if (error) {
      throw new Error(`error: ${error}, error description: ${errorDescription}`)
    } else if (typeof accessToken === 'string') {
      setStorageByKey({ key: GoogleDriveProvider.tokenStorageKey, value: { access_token: accessToken } })
    } else {
      throw new TypeError(`invalide code. code: ${accessToken}`)
    }
  }

  static async loadGapi() {
    await new Promise((resolve) => gapi.load('client', resolve))
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
    const accessToken = GoogleDriveProvider.getAccessToken()
    await gapi.client.init({
      apiKey: 'AIzaSyDPqjP2pwqA_ZgYcGwm3P336qEMUNssmsY',
      discoveryDocs: [DISCOVERY_DOC],
    })
    gapi.client.setToken({ access_token: accessToken })
  }

  static getAccessToken() {
    const tokenRecord = getStorageByKey(GoogleDriveProvider.tokenStorageKey)
    return tokenRecord?.access_token
  }

  static async validateAccessToken() {
    if (!GoogleDriveProvider.getAccessToken()) {
      return false
    }

    await GoogleDriveProvider.loadGapi()
    try {
      await gapi.client.drive.files.list({ pageSize: 1, fields: 'files(id)' })
    } catch (error) {
      console.warn(error)
      return false
    }
    return true
  }

  async getFileContent(path: string) {
    const segments = path.split('/')
    const fileDirectory = initial(segments).join('/')
    const fileName = last(segments)
    const directory = await this.getDirectory(fileDirectory)
    const conditions = ['trashed=false', `parents in '${directory.id}'`, `name='${fileName}'`]
    const q = conditions.join(' and ')
    const response = await this.client.list({ q, fields: defaultFileNestedFields })
    const [file] = response.result.files
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

  async listFilesRecursively(path) {
    const list = async (path?) => {
      const children = await this.listChildren(path)
      const files: any[] = []
      const directoriesPromises: Promise<any[]>[] = []
      for (const child of children) {
        const childParentPath = path
        if (child.isFile) {
          const childPath = `${childParentPath}${child.name}`
          const file = { path: childPath, downloadUrl: child.raw.webContentLink }
          files.push(file)
        } else if (child.isDirectory) {
          const childPath = `${childParentPath}${child.name}/`
          const cachableList = await RequestCache.makeCacheable({
            func: list,
            identifier: (...args) => ({
              functionName: 'GoogleDriveProvider.listFilesRecursively',
              args,
              version: child.raw.version,
              modifiedTime: child.raw.modifiedTime,
            }),
          })
          const foldersPromise = await cachableList(childPath)
          directoriesPromises.push(foldersPromise)
        }
      }
      const directories = await Promise.all(directoriesPromises)
      return [...files, ...directories.flat()]
    }

    const response = await list(path)

    return response.map(
      (fileSummaryObj) =>
        new FileSummary({ ...fileSummaryObj, getBlob: async () => await this.getFileContent(fileSummaryObj.path) })
    )
  }

  async listChildren(path = '/') {
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
      const { result } = await this.client.list({ q, fields, pageSize, pageToken })
      fileAccessors.push(
        ...result.files.map(
          (file) =>
            new FileAccessor({
              name: file.name,
              directory: path,
              type: file.mimeType === folderMimeType ? 'directory' : 'file',
              fileSystemProvider: this,
            })
        )
      )
      pageToken = result.nextPageToken ?? ''
    } while (pageToken)

    return fileAccessors
  }

  private async getRootChildren() {
    const { client } = this
    const conditions = ["parents in 'root'", 'trashed=false']
    const q = conditions.join(' and ')
    return await client.list({ q, fields: defaultFileNestedFields })
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
        const response = await this.listWithCache({ q, fields: defaultFileNestedFields }, cacheIdentifier)
        directory = response.result.files[0]
      } else {
        const response = await this.client.list({ q, fields: defaultFileNestedFields })
        directory = response.result.files[0]
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
      const response = await client.list({ q, fields: defaultFileNestedFields })

      directory = response.result.files[0]
      if (!directory) {
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
