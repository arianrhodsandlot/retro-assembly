import { BlobReader, ZipReader } from '@zip.js/zip.js'
import { type GoodCodeResult } from 'goodcodes-parser'
import { groupBy } from 'lodash-es'
import { Preference } from '../classes/preference'
import { extSystemMap, systemNamesSorted } from '../constants/systems'
import { parseGoodCode } from '../helpers/misc'
import { type FileAccessor } from './file-system-providers/file-accessor'
import { GamesDatabase } from './games-database'

const allowedExtensions = new Set(['zip', ...Object.keys(extSystemMap)])

export class Rom {
  id = ''
  name = ''
  fileAccessor: FileAccessor

  system = ''
  goodCode: GoodCodeResult
  gameInfo: any

  readyPromise: Promise<void>

  private constructor(romFileAccessor: FileAccessor) {
    this.name = romFileAccessor.name
    this.fileAccessor = romFileAccessor
    this.goodCode = parseGoodCode(romFileAccessor.name)
    this.readyPromise = this.load()
  }

  static fromFileAccessors(files: FileAccessor[]) {
    const roms: Rom[] = []
    for (const file of files) {
      const rom = Rom.fromFileAccessor(file)
      if (rom?.system) {
        roms.push(rom)
      }
    }
    return roms
  }

  static fromFile(romFile: FileAccessor) {
    if (Rom.isValidFileName(romFile.name)) {
      const rom = new Rom(romFile)
      rom.id = rom.fileAccessor.path || rom.fileAccessor.name
      return rom
    }
  }

  static fromFileAccessor(romFileAccessor: FileAccessor) {
    if (Rom.isValidFileName(romFileAccessor.name)) {
      const rom = new Rom(romFileAccessor)
      rom.id = rom.fileAccessor.path || rom.fileAccessor.name
      return rom
    }
  }

  static groupBySystem(roms: Rom[]) {
    return groupBy(roms, 'system')
  }

  private static isValidFileName(name: string) {
    const ext = name.split('.').at(-1)
    return ext && allowedExtensions.has(ext)
  }

  ready() {
    return this.readyPromise
  }

  async load() {
    await this.updateSystem()
    await this.updateGameInfo()
  }

  async getBlob() {
    return await this.fileAccessor.getBlob()
  }

  async updateGameInfo() {
    if (!this.system) {
      await this.updateSystem()
    }
    const gameInfo = await GamesDatabase.queryByFileNameFromSystem({
      fileName: this.fileAccessor.name,
      system: this.system,
    })
    this.gameInfo = gameInfo
  }

  async updateSystem() {
    if (!this.fileAccessor.name) {
      throw new Error('Invalid file')
    }

    const preference = new Preference()
    let system = this.guessSystemByPath({ root: preference.get('romDirectory') }) || this.guessSystemByFileName()
    if (!system && this.fileAccessor.isLoaded() && this.fileAccessor.name.endsWith('.zip')) {
      system = await this.guessSystemByExtractedContent()
    }

    if (!system) {
      throw new Error(`Unknown system for ${this.fileAccessor.name}`)
    }

    this.system = system
  }

  private guessSystemByFileName(name: string = this.fileAccessor.name) {
    const extname = name.split('.').pop()
    if (!extname) {
      return ''
    }
    return extSystemMap[extname] ?? ''
  }

  private async guessSystemByExtractedContent() {
    if (!this.fileAccessor.isLoaded()) {
      return ''
    }
    const blob = await this.fileAccessor.getBlob()
    const blobReader = new BlobReader(blob)
    const zipReader = new ZipReader(blobReader)
    try {
      const entries = await zipReader.getEntries()
      for (const { filename } of entries) {
        const system = this.guessSystemByFileName(filename)
        if (system) {
          return system
        }
      }
    } catch (error) {
      console.warn(error)
    }
    return ''
  }

  private guessSystemByPath({ root }: { root: string }) {
    if (this.fileAccessor.path?.startsWith(root)) {
      const relativePath = this.fileAccessor.path.slice(root.length)
      const segments = relativePath.split('/')
      const [system] = segments
      if (systemNamesSorted.includes(system)) {
        return system
      }
    }
  }
}
