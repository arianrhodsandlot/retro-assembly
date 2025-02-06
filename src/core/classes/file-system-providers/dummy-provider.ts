import { noop } from 'lodash-es'
import type { FileSystemProvider } from './file-system-provider'

export class DummyProvider implements FileSystemProvider {
  private file: File

  constructor(file: File) {
    this.file = file
  }

  async create({ file, path }: { file: Blob; path: string }) {
    return await Promise.resolve(noop({ file, path }))
  }

  async delete(path: string) {
    return await Promise.resolve(noop(path))
  }

  async getContent(path: string) {
    console.assert(path)
    return await Promise.resolve(this.file)
  }

  async getContentAndCache(path: string) {
    return await this.getContent(path)
  }
  async list(path: string) {
    console.assert(path)
    return await Promise.resolve([])
  }

  async peek(path: string) {
    console.assert(path)
    return await Promise.resolve([])
  }
  async peekContent(path: string) {
    return await this.getContent(path)
  }
}
