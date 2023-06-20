import { initial, last } from 'lodash-es'
import { listDirectoryByHandle, requestLocalHandle } from '../..'
import { FileAccessor } from './file-accessor'
import { type FileSystemProvider } from './file-system-provider'

export class LocalProvider implements FileSystemProvider {
  private handle: FileSystemDirectoryHandle | undefined

  private constructor({ handle }: { handle?: FileSystemDirectoryHandle }) {
    if (handle) {
      this.handle = handle
    }
  }

  static getSingleton({ handle }: { handle?: FileSystemDirectoryHandle } = {}) {
    return new LocalProvider({ handle })
  }

  async getFileContent(path: string) {
    const handle = await this.getHandleByPath({ path })
    if (handle instanceof FileSystemDirectoryHandle) {
      throw new TypeError(`path "${path}" is not a file but a directory (maybe)`)
    }
    return await handle.getFile()
  }

  // path should not start with a slash
  // todo: maybe needs to make it be the same as the onedrive provider
  async createFile({ file, path }: { file: Blob; path: string }) {
    const handle = await this.getHandleByPath({ path, create: true })
    if (handle instanceof FileSystemDirectoryHandle) {
      throw new TypeError(`path "${path}" is not a file but a directory (maybe)`)
    }

    const writableStream = await handle.createWritable()
    try {
      await writableStream.write(file)
    } finally {
      await writableStream.close()
    }

    await this.load()
  }

  async deleteFile(path: string) {
    const fileHandle = await this.getHandleByPath({ path, create: true })
    // @ts-expect-error "remove" is not listed in typescript's declaration files
    await fileHandle?.remove()
  }

  async listChildren(path = '') {
    const handle = await this.getHandleByPath({ path })
    const childrenHandles = await listDirectoryByHandle({ handle })
    return childrenHandles.map(
      ({ name, kind }) => new FileAccessor({ name, directory: path, type: kind, fileSystemProvider: this })
    )
  }

  private async load() {
    this.handle ??= await requestLocalHandle({ name: 'rom', mode: 'readwrite' })
  }

  private async getHandleByPath({ path, create = false }: { path: string; create?: boolean }) {
    const segments = path.split('/')
    const directorySegments = segments.length > 1 ? initial(segments) : []
    const fileName = last(segments)

    if (!this.handle) {
      await this.load()
    }
    if (!this.handle) {
      throw new Error('invalid file system handle')
    }

    let directoryHandle = this.handle
    for (const segment of directorySegments) {
      directoryHandle = await directoryHandle.getDirectoryHandle(segment, { create })
    }
    if (fileName) {
      return await directoryHandle.getFileHandle(fileName, { create })
    }
    return directoryHandle
  }
}
