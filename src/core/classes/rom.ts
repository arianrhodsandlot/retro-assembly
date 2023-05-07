import { BlobReader, ZipReader } from '@zip.js/zip.js'
import { type GoodCodeResult } from 'goodcodes-parser'
import { groupBy } from 'lodash-es'
import { extSystemMap, systemCoreMap } from '../constants/systems'
import { parseGoodCode } from '../helpers/misc'
import { type FileSummary } from './file-system-providers/file-summary'
import { GamesDatabase } from './games-database'

const allowedExtensions = new Set(['zip', ...Object.keys(extSystemMap)])

export class Rom {
  id = ''
  fileSummary: FileSummary

  system = ''
  goodCode: GoodCodeResult
  gameInfo: any

  readyPromise: Promise<void>

  private constructor(romFileSummary: FileSummary) {
    this.fileSummary = romFileSummary
    this.goodCode = parseGoodCode(romFileSummary.name)
    this.readyPromise = this.load()
  }

  static fromFiles(files: FileSummary[]) {
    const roms: Rom[] = []
    for (const file of files) {
      const rom = Rom.fromFile(file)
      if (rom) {
        roms.push(rom)
      }
    }
    return roms
  }

  static fromFile(romFile: FileSummary) {
    if (Rom.isValidFileName(romFile.name)) {
      const rom = new Rom(romFile)
      rom.id = rom.fileSummary.path || rom.fileSummary.name
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
    return await this.fileSummary.getBlob()
  }

  async updateGameInfo() {
    if (!this.system) {
      await this.updateSystem()
    }
    const gameInfo = await GamesDatabase.queryByFileNameFromSystem({
      fileName: this.fileSummary.name,
      system: this.system,
    })
    this.gameInfo = gameInfo
  }

  async updateSystem() {
    if (!this.fileSummary.name) {
      throw new Error('Invalid file')
    }

    let system = this.guessSystemByPath() || this.guessSystemByFileName()
    if (!system && this.fileSummary.isLoaded() && this.fileSummary.name.endsWith('.zip')) {
      system = await this.guessSystemByExtractedContent()
    }

    if (!system) {
      throw new Error(`Unknown system for ${this.fileSummary.name}`)
    }

    this.system = system
  }

  private guessSystemByFileName(name: string = this.fileSummary.name) {
    const extname = name.split('.').pop()
    if (!extname) {
      return ''
    }
    return extSystemMap[extname] ?? ''
  }

  private async guessSystemByExtractedContent() {
    if (!this.fileSummary.isLoaded()) {
      return ''
    }
    const blob = await this.fileSummary.getBlob()
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

  private guessSystemByPath() {
    const systems = Object.keys(systemCoreMap).sort((core1, core2) => core2.length - core1.length)
    if (!this.fileSummary.path) {
      return
    }
    for (const system of systems) {
      if (this.fileSummary.path.includes(system)) {
        return system
      }
    }
  }
}
