import ky from 'ky'
import { noop } from 'lodash-es'
import { FileAccessor } from './file-accessor'
import { type FileSystemProvider } from './file-system-provider'

export class ServerProvider implements FileSystemProvider {
  static getSingleton() {
    return new ServerProvider()
  }

  async getContent(path: string) {
    return await ky('/api/content', { json: { path } }).blob()
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
    const body = new FormData()
    body.append('path', path)
    body.append('file', file)
    await ky('/api/create', { body })
  }

  // todo: not implemented yet
  async delete(path: string) {
    noop(path)
    await Promise.resolve(undefined)
  }

  async list(path = '') {
    const files = await ky('/api/create', { json: { path } }).json<any>()

    return files.map(
      (item) =>
        new FileAccessor({
          name: item.name ?? '',
          directory: path,
          type: item.type,
          temporaryUrl: item.temporaryUrl,
          fileSystemProvider: this,
        }),
    )
  }

  async peek(path: string) {
    noop(path)
    return await Promise.resolve(undefined)
  }
}
