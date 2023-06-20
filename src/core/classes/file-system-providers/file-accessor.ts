import { type FileSystemProvider } from './file-system-provider'

interface FileAccessorOptions {
  name: string
  directory: string
  type: string
  fileSystemProvider: FileSystemProvider
}

export class FileAccessor {
  readonly name: string
  readonly directory: string
  readonly path: string

  private type: string
  private url: string | undefined
  private blob: Blob | undefined
  private fileSystemProvider: FileSystemProvider

  constructor({ name, directory, type, fileSystemProvider }: FileAccessorOptions) {
    this.name = name
    this.directory = directory
    this.type = type
    this.fileSystemProvider = fileSystemProvider
    // todo: eliminate multiple slashes outside instead of here
    this.path = `${directory}/${name}`.replaceAll(/\/+/g, '/')
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
    return this.blob ?? (await this.fileSystemProvider.getFileContent(this.path))
  }

  async getUrl() {
    if (this.url) {
      return this.url
    }
    const blob = await this.getBlob()
    if (!blob) {
      throw new Error('no blob for the file')
    }
    this.url = URL.createObjectURL(blob)
    return this.url
  }

  release() {
    if (this.url) {
      URL.revokeObjectURL(this.url)
      this.url = undefined
    }
    this.blob = undefined
  }
}
