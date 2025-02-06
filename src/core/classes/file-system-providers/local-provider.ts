import { compact, noop, orderBy } from 'lodash-es'
import { parse, sep } from 'path-browserify'
import { listDirectoryByHandle, requestLocalHandle } from '../../helpers/file'
import { FileAccessor } from './file-accessor'
import type { FileSystemProvider } from './file-system-provider'

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

  // path should not start with a slash
  // todo: maybe needs to make it be the same as the onedrive provider
  async create({ file, path }: { file: Blob; path: string }) {
    const handle = await this.getHandleByPath({ create: true, path })
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

  async delete(path: string) {
    const fileHandle = await this.getHandleByPath({ create: true, path })
    // @ts-expect-error "remove" is not listed in typescript's declaration files
    await fileHandle?.remove()
  }

  async getContent(path: string) {
    const handle = await this.getHandleByPath({ path })
    if (handle instanceof FileSystemDirectoryHandle) {
      throw new TypeError(`path "${path}" is not a file but a directory (maybe)`)
    }
    return await handle.getFile()
  }

  async getContentAndCache(path: string) {
    return await this.getContent(path)
  }

  async list(path = '') {
    const handle = await this.getHandleByPath({ path })
    if (!(handle instanceof FileSystemDirectoryHandle)) {
      throw new TypeError('invalid file handle')
    }
    const childrenHandles = await listDirectoryByHandle({ handle })
    const fileAccessors = childrenHandles.map(
      ({ kind, name }) => new FileAccessor({ directory: path, fileSystemProvider: this, name, type: kind }),
    )
    return orderBy(fileAccessors, ['name'], ['asc'])
  }

  async peek(path: string) {
    noop(path)
    return await Promise.resolve(undefined)
  }

  async peekContent(path: string) {
    return await this.getContent(path)
  }

  private async getHandleByPath({ create = false, path }: { create?: boolean; path: string }) {
    if (!this.handle) {
      await this.load()
      if (!this.handle) {
        throw new Error('invalid file system handle')
      }
    }

    const { base, dir } = parse(path)
    let directoryHandle = this.handle
    for (const segment of compact(dir.split(sep))) {
      directoryHandle = await directoryHandle.getDirectoryHandle(segment, { create })
    }

    if (base) {
      try {
        return await directoryHandle.getFileHandle(base, { create })
      } catch {
        return await directoryHandle.getDirectoryHandle(base, { create })
      }
    }
    return directoryHandle
  }

  private async load() {
    this.handle ??= await requestLocalHandle({ mode: 'readwrite', name: 'rom' })
  }
}
