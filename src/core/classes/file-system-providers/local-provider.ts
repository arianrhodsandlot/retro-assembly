import { initial, last, tail } from 'lodash-es'
import { listFilesByHandle, requestLocalHandle } from '../..'
import { FileSummary } from './file-summary'
import { type FileSystemProvider } from './file-system-provider'

export class LocalProvider implements FileSystemProvider {
  private files: File[]
  private handle: FileSystemDirectoryHandle | undefined

  private constructor() {
    this.files = []
  }

  static async getSingleton() {
    const local = new LocalProvider()
    // await local.load()
    return local
  }

  async listFilesRecursively(path?: string) {
    if (!this.files?.length) {
      await this.load()
    }
    const files: FileSummary[] = []
    for (const file of this.files) {
      const rawRelativePathSegments = file.webkitRelativePath.split('/')
      const relativePath = tail(rawRelativePathSegments).join('/')
      if (!path || relativePath.startsWith(path)) {
        const fileSummary = new FileSummary({
          path: relativePath,
          downloadUrl: URL.createObjectURL(file),
          blob: file,
        })
        files.push(fileSummary)
      }
    }
    return await Promise.resolve(files)
  }

  async getFileContent(path: string) {
    for (const file of this.files) {
      const rawRelativePathSegments = file.webkitRelativePath.split('/')
      const relativePath = tail(rawRelativePathSegments).join('/')
      if (relativePath === path) {
        const arrayBuffer = await file.arrayBuffer()
        const blob = new Blob([arrayBuffer])
        if (blob) {
          return blob
        }
      }
    }
  }

  // path should not start with a slash
  // todo: should make it be the same as the onedrive provider
  async createFile({ file, path }: { file: Blob; path: string }) {
    const fileHandle = await this.getFileHandle({ path, create: true })
    if (fileHandle) {
      const writableStream = await fileHandle.createWritable()
      try {
        await writableStream.write(file)
      } finally {
        await writableStream.close()
      }

      await this.load()
    }
  }

  async deleteFile(path: string) {
    const fileHandle = await this.getFileHandle({ path, create: true })
    // @ts-expect-error "remove" is not listed in typescript's declaration files
    await fileHandle?.remove()
  }

  private async load() {
    this.handle = await requestLocalHandle({ name: 'rom', mode: 'readwrite' })
    this.files = await listFilesByHandle({ handle: this.handle })
  }

  private async getFileHandle({ path, create }: { path: string; create: boolean }) {
    const segments = path.split('/')
    const directorySegments = segments.length > 1 ? initial(segments) : []
    const fileName = last(segments)
    let directoryHandle = this.handle
    for (const segment of directorySegments) {
      directoryHandle = await directoryHandle.getDirectoryHandle(segment, { create })
    }
    if (fileName) {
      return await directoryHandle.getFileHandle(fileName, { create })
    }
  }
}
