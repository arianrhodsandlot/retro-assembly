import { noop } from 'lodash-es'
import { getCDNHost } from '../../constants/dependencies'
import { retrobrewsGames } from '../../constants/retrobrews'
import { http } from '../../helpers/http'
import { FileAccessor } from './file-accessor'
import type { FileSystemProvider } from './file-system-provider'

export class DemoProvider implements FileSystemProvider {
  static getSingleton() {
    return new DemoProvider()
  }

  async create({ file, path }: { file: Blob; path: string }) {
    noop(file, path)
    return await Promise.resolve(undefined)
  }

  async delete(path: string) {
    return await noop(path)
  }

  async getContent(path: string) {
    const file = path.split('/').at(-1)
    if (!file) {
      throw new Error('invalid file')
    }
    let romRepo = ''
    if (path.startsWith('nes/')) {
      romRepo = 'retrobrews/nes-games'
    } else if (path.startsWith('snes/')) {
      romRepo = 'retrobrews/snes-games'
    } else if (path.startsWith('gbc/')) {
      romRepo = 'retrobrews/gbc-games'
    } else if (path.startsWith('gba/')) {
      romRepo = 'retrobrews/gba-games'
    } else if (path.startsWith('megadrive/')) {
      romRepo = 'retrobrews/md-games'
    } else if (path.startsWith('atari2600/')) {
      romRepo = 'retrobrews/atari2600-games'
    }
    if (!romRepo) {
      throw new Error('invalid romRepo')
    }

    const encodedFile = encodeURIComponent(file)
    const cdnBaseUrl = `${getCDNHost()}/gh`
    const url = `${cdnBaseUrl}/${romRepo}@master/${encodedFile}`
    return await http(url).blob()
  }

  async getContentAndCache(path: string) {
    return await this.getContent(path)
  }

  async list(path = '') {
    const createFileAccessor = ({ fileName, name }) =>
      new FileAccessor({ directory: path, fileSystemProvider: this, meta: { name }, name: fileName, type: 'file' })

    await Promise.resolve()
    if (path in retrobrewsGames) {
      const games = retrobrewsGames[path]
      return games.map((game) => createFileAccessor(game))
    }

    const directories = ['atari2600', 'gba', 'gbc', 'megadrive', 'nes', 'snes']
    return directories.map(
      (directory: string) =>
        new FileAccessor({ directory: '', fileSystemProvider: this, name: directory, type: 'directory' }),
    )
  }

  async peek(path: string) {
    noop(path)
    return await Promise.resolve(undefined)
  }

  async peekContent(path: string) {
    return await this.getContent(path)
  }
}
