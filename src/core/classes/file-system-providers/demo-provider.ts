import { noop } from 'lodash-es'
import { atari2600Games } from '../../constants/retrobrews/atari2600-games'
import { gbaGames } from '../../constants/retrobrews/gba-games'
import { gbcGames } from '../../constants/retrobrews/gbc-games'
import { mdGames } from '../../constants/retrobrews/md-games'
import { nesGames } from '../../constants/retrobrews/nes-games'
import { snesGames } from '../../constants/retrobrews/snes-games'
import { http } from '../../helpers/http'
import { FileAccessor } from './file-accessor'
import { type FileSystemProvider } from './file-system-provider'

const cdnBaseUrl = 'https://cdn.jsdelivr.net/gh'

export class DemoProvider implements FileSystemProvider {
  static getSingleton() {
    return new DemoProvider()
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
    const url = `${cdnBaseUrl}/${romRepo}@master/${encodedFile}`
    return await http(url).blob()
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
    await noop()
    const directories = ['atari2600', 'gba', 'gbc', 'megadrive', 'nes', 'snes']
    if (path === 'atari2600') {
      return atari2600Games.map(
        (name) => new FileAccessor({ name, directory: path, type: 'file', fileSystemProvider: this }),
      )
    }
    if (path === 'gba') {
      return gbaGames.map((name) => new FileAccessor({ name, directory: path, type: 'file', fileSystemProvider: this }))
    }
    if (path === 'gbc') {
      return gbcGames.map((name) => new FileAccessor({ name, directory: path, type: 'file', fileSystemProvider: this }))
    }
    if (path === 'megadrive') {
      return mdGames.map((name) => new FileAccessor({ name, directory: path, type: 'file', fileSystemProvider: this }))
    }
    if (path === 'nes') {
      return nesGames.map((name) => new FileAccessor({ name, directory: path, type: 'file', fileSystemProvider: this }))
    }
    if (path === 'snes') {
      return snesGames.map(
        (name) => new FileAccessor({ name, directory: path, type: 'file', fileSystemProvider: this }),
      )
    }
    return directories.map(
      (directory: string) =>
        new FileAccessor({ name: directory, directory: '', type: 'directory', fileSystemProvider: this }),
    )
  }

  async peek(path: string) {
    noop(path)
    return await Promise.resolve(undefined)
  }
}
