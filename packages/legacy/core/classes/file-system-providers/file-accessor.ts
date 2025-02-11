import { path } from '../../helpers/vendors'
import type { FileSystemProvider } from './file-system-provider'

export interface FileAccessorOptions {
  directory: string
  fileSystemProvider: FileSystemProvider
  meta?: any
  name: string
  temporaryUrl?: string
  type: string
}

export class FileAccessor {
  readonly basename: string
  readonly directory: string
  readonly extname: string

  public readonly meta: any
  readonly name: string

  readonly path: string

  get isDirectory() {
    return this.type === 'directory'
  }
  get isFile() {
    return this.type === 'file'
  }
  get isLoaded() {
    return Boolean(this.blob)
  }
  private blob: Blob | undefined
  private blobUrl: string | undefined

  private fileSystemProvider: FileSystemProvider

  private temporaryUrl: string

  private type: string

  constructor({ directory, fileSystemProvider, meta, name, temporaryUrl = '', type }: FileAccessorOptions) {
    this.name = name
    this.directory = directory
    this.type = type
    this.temporaryUrl = temporaryUrl
    this.fileSystemProvider = fileSystemProvider
    this.path = path.join(directory, name)
    this.meta = meta
    const { ext, name: base } = path.parse(name)
    this.basename = base
    this.extname = ext.slice(1)
  }

  async getBlob() {
    this.blob ??= await this.fileSystemProvider.getContent(this.path)
    return this.blob
  }

  async getUrl() {
    if (this.temporaryUrl) {
      return this.temporaryUrl
    }
    if (this.blobUrl) {
      return this.blobUrl
    }
    const blob = await this.getBlob()
    if (!blob) {
      throw new Error('no blob for the file')
    }
    this.blobUrl = URL.createObjectURL(blob)
    return this.blobUrl
  }

  release() {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl)
      this.blobUrl = undefined
    }
    this.blob = undefined
  }
}
