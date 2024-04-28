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

  async getContent(path: string) {
    const handle = await this.getHandleByPath({ path })
    if (handle instanceof FileSystemDirectoryHandle) {
      throw new TypeError(`path "${path}" is not a file but a directory (maybe)`)
    }
    return await handle.getFile()
  }

  async peekContent(path: string) {
    return await this.getContent(path)
  }

  async getContentAndCache(path: string) {
    return await this.getContent(path)
  }

  // path should not start with a slash
  // todo: maybe needs to make it be the same as the onedrive provider
  async create({ file, path }: { file: Blob; path: string }) {
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

  async delete(path: string) {
    const fileHandle = await this.getHandleByPath({ path, create: true })
    // @ts-expect-error "remove" is not listed in typescript's declaration files
    await fileHandle?.remove()
  }

  async list(path = '') {
    const handle = await this.getHandleByPath({ path })
    if (!(handle instanceof FileSystemDirectoryHandle)) {
      throw new TypeError('invalid file handle')
    }
    const childrenHandles = await listDirectoryByHandle({ handle })
    const fileAccessors = childrenHandles.map(
      ({ name, kind }) => new FileAccessor({ name, directory: path, type: kind, fileSystemProvider: this }),
    )
    return orderBy(fileAccessors, ['name'], ['asc'])
  }

  async peek(path: string) {
    noop(path)
    return await Promise.resolve(undefined)
  }

  private async load() {
    this.handle ??= await requestLocalHandle({ name: 'rom', mode: 'readwrite' })
  }

  private async getHandleByPath({ path, create = false }: { path: string; create?: boolean }) {
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
}
