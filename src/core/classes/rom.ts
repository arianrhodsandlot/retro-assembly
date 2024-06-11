import type { GoodCodeResult } from 'goodcodes-parser'
import { groupBy } from 'lodash-es'
import { isAbsolute, parse, relative } from 'path-browserify'
import { extPlatformMap, platformNamesSorted } from '../constants/platforms'
import { getCover, parseGoodCode } from '../helpers/misc'
import type { FileAccessor } from './file-system-providers/file-accessor'
import { type ArcadeGameInfo, GamesDatabase } from './games-database'
import type { Entry } from './libretrodb/types'
import { PreferenceParser } from './preference-parser'

const allowedExtensions = new Set(['zip', 'bin', ...Object.keys(extPlatformMap)])

export class Rom {
  id = ''
  fileAccessor: FileAccessor

  platform = ''
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
        getCover({ platform: this.platform, name: this.standardizedName, type: 'boxart' }),
        getCover({ platform: this.platform, name: this.standardizedName, type: 'title' }),
        getCover({ platform: this.platform, name: this.standardizedName, type: 'snap' }),
      ]
    }
    return ''
  }

  static fromFileAccessors(files: FileAccessor[]) {
    const roms: Rom[] = []
    for (const file of files) {
      const rom = Rom.fromFileAccessor(file)
      if (rom?.platform) {
        roms.push(rom)
      }
    }
    return roms
  }

  static fromFileAccessor(romFileAccessor: FileAccessor) {
    if (Rom.isValidFileName(romFileAccessor.name)) {
      const rom = new Rom(romFileAccessor)
      rom.id = rom.fileAccessor.path || rom.fileAccessor.name
      return rom
    }
  }

  static groupByPlatform(roms: Rom[]) {
    return groupBy(roms, 'platform')
  }

  private static isValidFileName(name: string) {
    const ext = name.split('.').at(-1)
    return ext && allowedExtensions.has(ext)
  }

  ready() {
    return this.readyPromise
  }

  async load() {
    await this.updatePlatform()
    await this.updateGameInfo()
    if (this.platform === 'arcade') {
      await this.updateArcadeGameInfo()
    }

    const goodCodeName = this.arcadeGameInfo?.fullName || this.gameInfo?.name || this.fileAccessor.name
    this.gameInfoGoodCode = parseGoodCode(goodCodeName)
  }

  async getBlob() {
    return await this.fileAccessor.getBlob()
  }

  async updateGameInfo() {
    const { platform, fileAccessor } = this
    if (!platform) {
      await this.updatePlatform()
    }

    if (fileAccessor.meta?.name) {
      this.gameInfo = { name: fileAccessor.meta?.name }
      return
    }

    this.gameInfo = await GamesDatabase.queryByFileNameFromPlatform({ fileName: fileAccessor.name, platform })
  }

  async updatePlatform() {
    const { fileAccessor } = this
    if (!fileAccessor.name) {
      throw new Error('Invalid file')
    }

    let platform = this.guessPlatformByPath() || this.guessPlatformByFileName()
    if (!platform && fileAccessor.isLoaded && fileAccessor.name.endsWith('.zip')) {
      platform = await this.guessPlatformByExtractedContent()
    }

    if (!platform) {
      throw new Error(`Unknown system for ${fileAccessor.name}`)
    }

    this.platform = platform
  }

  async updateArcadeGameInfo() {
    if (this.platform === 'arcade') {
      if (this.arcadeGameInfo) {
        return this.arcadeGameInfo
      }

      const arcadeGameInfo = await GamesDatabase.queryArcadeGameInfo(this.fileAccessor.name)
      this.arcadeGameInfo = arcadeGameInfo
      return arcadeGameInfo
    }
  }

  private guessPlatformByFileName(name: string = this.fileAccessor.name) {
    const extname = name.split('.').pop()
    if (!extname) {
      return ''
    }
    return extPlatformMap[extname] ?? ''
  }

  private async guessPlatformByExtractedContent() {
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
        const system = this.guessPlatformByFileName(filename)
        if (system) {
          return system
        }
      }
    } catch (error) {
      console.warn(error)
    }
    return ''
  }

  private guessPlatformByPath() {
    const romDirectory = PreferenceParser.get('romDirectory')
    if (this.fileAccessor.path?.startsWith(romDirectory)) {
      const relativePath = isAbsolute(this.fileAccessor.path)
        ? relative(romDirectory, this.fileAccessor.path)
        : this.fileAccessor.path
      const { dir } = parse(relativePath)
      if ((platformNamesSorted as string[]).includes(dir)) {
        return dir
      }
    }
  }
}
