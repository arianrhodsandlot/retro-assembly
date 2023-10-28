import { join, parse } from 'path-browserify'
import { type FileSystemProvider } from './file-system-provider'

export interface FileAccessorOptions {
  name: string
  directory: string
  type: string
  temporaryUrl?: string
  meta?: any
  fileSystemProvider: FileSystemProvider
}

export class FileAccessor {
  readonly name: string
  readonly directory: string
  readonly path: string

  readonly basename: string
  readonly extname: string

  public readonly meta: any

  private type: string
  private temporaryUrl: string
  private blobUrl: string | undefined
  private blob: Blob | undefined
  private fileSystemProvider: FileSystemProvider

  constructor({ name, directory, type, temporaryUrl = '', meta, fileSystemProvider }: FileAccessorOptions) {
    this.name = name
    this.directory = directory
    this.type = type
    this.temporaryUrl = temporaryUrl
    this.fileSystemProvider = fileSystemProvider
    this.path = join(directory, name)
    this.meta = meta
    const { name: base, ext } = parse(name)
    this.basename = base
    this.extname = ext.slice(1)
  }

  get isDirectory() {
    return this.type === 'directory'
  }

  get isFile() {
    return this.type === 'file'
  }

  get isLoaded() {
    return Boolean(this.blob)
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
