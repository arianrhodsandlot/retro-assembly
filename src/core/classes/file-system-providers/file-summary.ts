import { initial, last } from 'lodash-es'

export class FileSummary {
  name: string
  directory: string
  path: string
  downloadUrl: string
  private getBlobRawMethod: (() => Promise<Blob>) | undefined
  private blob: Blob | undefined

  constructor(
    options:
      | {
          path: string
          downloadUrl: string
          blob?: Blob
        }
      | {
          path: string
          downloadUrl: string
          getBlob?: () => Promise<Blob>
        }
  ) {
    this.path = options.path
    this.downloadUrl = options.downloadUrl
    if ('blob' in options && options.blob) {
      this.blob = options.blob
    } else if ('getBlob' in options && options.getBlob) {
      this.getBlobRawMethod = options.getBlob
    }

    const pathSegments = options.path.split('/')

    const name = last(pathSegments)
    if (!name) {
      throw new Error(`Invalid file path: ${options.path}`)
    }
    this.name = name

    const directorySegments = initial(pathSegments)
    const directory = directorySegments.join('/')
    this.directory = directory
  }

  async getBlob() {
    if (this.blob) {
      return this.blob
    }
    if (this.getBlobRawMethod) {
      this.blob = await this.getBlobRawMethod()
    }
    return this.blob as Blob
  }

  isLoaded() {
    return Boolean(this.blob)
  }
}
