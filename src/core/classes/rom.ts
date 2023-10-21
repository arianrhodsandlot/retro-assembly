import { type GoodCodeResult } from 'goodcodes-parser'
import { groupBy } from 'lodash-es'
import { isAbsolute, parse, relative } from 'path-browserify'
import { extSystemMap, systemNamesSorted } from '../constants/systems'
import { getCover, parseGoodCode } from '../helpers/misc'
import { type FileAccessor } from './file-system-providers/file-accessor'
import type { ArcadeGameInfo } from './games-database'
import { GamesDatabase } from './games-database'
import { type Entry } from './libretrodb/types'
import { PreferenceParser } from './preference-parser'

const allowedExtensions = new Set(['zip', ...Object.keys(extSystemMap)])

export class Rom {
  id = ''
  fileAccessor: FileAccessor

  system = ''
  gameInfo: Entry<string> | undefined
  arcadeGameInfo: ArcadeGameInfo | undefined

  readyPromise: Promise<void>

  private originalGoodCode: GoodCodeResult
  private gameInfoGoodCode: GoodCodeResult | undefined

  private constructor(romFileAccessor: FileAccessor) {
    this.fileAccessor = romFileAccessor
    this.originalGoodCode = parseGoodCode(romFileAccessor.name)
    this.readyPromise = this.load()
  }

  get goodCode() {
    return this.gameInfoGoodCode || this.originalGoodCode
  }

  get standardizedName() {
    return this.arcadeGameInfo?.fullName || this.gameInfo?.name || this.goodCode.rom
  }

  get displayName() {
    return this.goodCode.rom
  }

  get covers() {
    if (this.standardizedName) {
      return [
        getCover({ system: this.system, name: this.standardizedName, type: 'boxart' }),
        getCover({ system: this.system, name: this.standardizedName, type: 'title' }),
        getCover({ system: this.system, name: this.standardizedName, type: 'snap' }),
      ]
    }
    return ''
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
    if (this.system === 'arcade') {
      await this.updateArcadeGameInfo()
    }

    const goodCodeName = this.arcadeGameInfo?.fullName || this.gameInfo?.name || this.fileAccessor.name
    this.gameInfoGoodCode = parseGoodCode(goodCodeName)
  }

  async getBlob() {
    return await this.fileAccessor.getBlob()
  }

  async updateGameInfo() {
    const {
      system,
      fileAccessor: { name },
    } = this
    if (!system) {
      await this.updateSystem()
    }

    this.gameInfo = await GamesDatabase.queryByFileNameFromSystem({ fileName: name, system })
  }

  async updateSystem() {
    const { fileAccessor } = this
    if (!fileAccessor.name) {
      throw new Error('Invalid file')
    }

    let system = this.guessSystemByPath() || this.guessSystemByFileName()
    if (!system && fileAccessor.isLoaded && fileAccessor.name.endsWith('.zip')) {
      system = await this.guessSystemByExtractedContent()
    }

    if (!system) {
      throw new Error(`Unknown system for ${fileAccessor.name}`)
    }

    this.system = system
  }

  async updateArcadeGameInfo() {
    if (this.system === 'arcade') {
      if (this.arcadeGameInfo) {
        return this.arcadeGameInfo
      }

      const arcadeGameInfo = await GamesDatabase.queryArcadeGameInfo(this.fileAccessor.name)
      this.arcadeGameInfo = arcadeGameInfo
      return arcadeGameInfo
    }
  }

  private guessSystemByFileName(name: string = this.fileAccessor.name) {
    const extname = name.split('.').pop()
    if (!extname) {
      return ''
    }
    return extSystemMap[extname] ?? ''
  }

  private async guessSystemByExtractedContent() {
    const { BlobReader, ZipReader } = await import('@zip.js/zip.js')
    if (!this.fileAccessor.isLoaded) {
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

  private guessSystemByPath() {
    const romDirectory = PreferenceParser.get('romDirectory')
    if (this.fileAccessor.path?.startsWith(romDirectory)) {
      const relativePath = isAbsolute(this.fileAccessor.path)
        ? relative(romDirectory, this.fileAccessor.path)
        : this.fileAccessor.path
      const { dir } = parse(relativePath)
      if ((systemNamesSorted as string[]).includes(dir)) {
        return dir
      }
    }
  }
}
