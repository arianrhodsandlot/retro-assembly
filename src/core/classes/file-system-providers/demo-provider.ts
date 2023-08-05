import type { ZipReader } from '@zip.js/zip.js'
import ky from 'ky'
import { noop } from 'lodash-es'
import { basename } from 'path-browserify'
import { FileAccessor } from './file-accessor'
import { type FileSystemProvider } from './file-system-provider'

export class DemoProvider implements FileSystemProvider {
  private zipReader: ZipReader<any>

  private constructor(zipReader: ZipReader<any>) {
    this.zipReader = zipReader
  }

  static async getSingleton() {
    const { BlobReader, ZipReader } = await import('@zip.js/zip.js')
    const blob = await ky('/demo-roms/archive.zip').blob()
    const blobReader = new BlobReader(blob)
    const zipReader = new ZipReader(blobReader)
    return new DemoProvider(zipReader)
  }

  async getContent(path: string) {
    const { BlobWriter } = await import('@zip.js/zip.js')
    const entries = await this.zipReader.getEntries()
    const file = entries.find(({ directory, filename }) => !directory && filename === path)
    if (!file) {
      throw new Error('file not found')
    }
    const blob = await file.getData?.(new BlobWriter())
    if (!blob) {
      throw new Error('invalid file')
    }
    return blob
  }

  async peekContent(path: string) {
    return await this.getContent(path)
  }

  async getContentAndCache(path: string) {
    return await this.getContent(path)
  }

  async create({ file, path }: { file: Blob; path: string }) {
    noop(file, path)
    return await Promise.resolve(undefined)
  }

  async delete(path: string) {
    return await noop(path)
  }

  async list(path = '') {
    const entries = await this.zipReader.getEntries()

    if (path) {
      const files = entries.filter(({ directory, filename }) => !directory && filename.startsWith(path))

      return files.map(
        (entry) =>
          new FileAccessor({
            name: basename(entry.filename),
            directory: path,
            type: 'file',
            fileSystemProvider: this,
          }),
      )
    }

    const allDirectories = entries.filter(({ directory }) => directory)

    return allDirectories.map(
      (entry) =>
        new FileAccessor({
          name: entry.filename.slice(0, -1),
          directory: '',
          type: 'directory',
          fileSystemProvider: this,
        }),
    )
  }

  async peek(path: string) {
    noop(path)
    return await Promise.resolve(undefined)
  }
}
