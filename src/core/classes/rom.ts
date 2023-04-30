import { BlobReader, ZipReader } from '@zip.js/zip.js'
import { type GoodCodeResult } from 'goodcodes-parser'
import { extSystemMap, systemCoreMap } from '../constants/systems'
import { parseGoodCode } from '../helpers/misc'
import { GamesDatabase } from './games-database'
import { OneDriveCloudProvider } from './onedrive-cloud-provider'

const allowedExtensions = new Set(['zip', ...Object.keys(extSystemMap)])

const oneDrive = OneDriveCloudProvider.get()

interface RomFile {
  name: string
  path: string
  isLocal: boolean
  blob: Blob | undefined
}

export class Rom {
  id = ''
  file: RomFile = { name: '', path: '', isLocal: false, blob: undefined }

  system = ''
  goodCode: GoodCodeResult
  gameInfo: any

  readyPromise: Promise<void>

  private constructor(romFile: RomFile) {
    this.file = romFile
    this.goodCode = parseGoodCode(romFile.name)
    this.readyPromise = this.load()
  }

  static fromFiles(files: File[]) {
    const roms: Rom[] = []
    for (const file of files) {
      const rom = Rom.fromFile(file)
      if (rom) {
        roms.push(rom)
      }
    }
    return roms
  }

  static fromFile(file: File) {
    if (Rom.isValidFileName(file.name)) {
      const romFile: RomFile = { name: file.name, path: file.webkitRelativePath ?? '', isLocal: true, blob: file }
      const rom = new Rom(romFile)
      rom.id = rom.file.path || rom.file.name
      return rom
    }
  }

  static fromOneDrivePaths(remoteItems: any[]) {
    const roms: Rom[] = []
    for (const remoteItem of remoteItems) {
      if (Rom.isValidFileName(remoteItem.name)) {
        const romFile: RomFile = { name: remoteItem.name, path: remoteItem.path ?? '', blob: undefined, isLocal: false }
        const rom = new Rom(romFile)
        rom.id = rom.file.path || rom.file.name
        roms.push(rom)
      }
    }
    return roms
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
    if (this.file.isLocal) {
      return this.file.blob as Blob
    }
    const blob = await oneDrive.downloadFile(this.file.path)
    this.file.blob = blob
    return blob
  }

  async updateGameInfo() {
    if (!this.system) {
      await this.updateSystem()
    }
    const gameInfo = await GamesDatabase.queryByFileNameFromSystem({
      fileName: this.file.name,
      system: this.system,
    })
    this.gameInfo = gameInfo
  }

  async updateSystem() {
    if (!this.file.name) {
      throw new Error('Invalid file')
    }

    let system = this.guessSystemByPath() || this.guessSystemByFileName()
    if (!system && this.file.isLocal && this.file.name.endsWith('.zip')) {
      system = await this.guessSystemByExtractedContent()
    }

    if (!system) {
      throw new Error(`Unknown system for ${this.file.name}`)
    }

    this.system = system
  }

  private guessSystemByFileName(name: string = this.file.name) {
    const extname = name.split('.').pop()
    if (!extname) {
      return ''
    }
    return extSystemMap[extname] ?? ''
  }

  private async guessSystemByExtractedContent() {
    if (!this.file.blob) {
      return ''
    }
    const blobReader = new BlobReader(this.file.blob)
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
    if (!this.file.path) {
      return
    }
    for (const system of systems) {
      if (this.file.path.includes(system)) {
        return system
      }
    }
  }
}
