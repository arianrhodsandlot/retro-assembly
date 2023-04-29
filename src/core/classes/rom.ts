import { BlobReader, ZipReader } from '@zip.js/zip.js'
import { type GoodCodeResult } from 'goodcodes-parser'
import { extSystemMap, systemCoreMap } from '../constants/systems'
import { parseGoodCode } from '../helpers/misc'
import { GamesDatabase } from './games-database'
import { OneDriveCloudProvider } from './onedrive-cloud-provider'

const allowedExtensions = new Set(['zip', ...Object.keys(extSystemMap)])

const oneDrive = OneDriveCloudProvider.get()

export class Rom {
  id = ''
  fileName = ''
  isLocalFile = true
  path = ''
  system = ''
  blob: Blob
  goodCode: GoodCodeResult
  gameInfo: any

  readyPromise: Promise<void>

  private constructor({ fileName, path, blob, isLocalFile }) {
    this.fileName = fileName
    this.path = path
    this.goodCode = parseGoodCode(fileName)
    this.isLocalFile = isLocalFile
    this.blob = blob

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
      const rom = new Rom({
        blob: file,
        fileName: file.name,
        path: file.webkitRelativePath ?? '',
        isLocalFile: true,
      })
      rom.id = rom.path || rom.fileName
      return rom
    }
  }

  static fromOneDrivePaths(remoteItems: any[]) {
    const roms = []
    for (const remoteItem of remoteItems) {
      if (Rom.isValidFileName(remoteItem.fileName)) {
        const rom = new Rom({
          fileName: remoteItem.fileName,
          path: remoteItem.path ?? '',
          isLocalFile: false,
        })
        rom.id = rom.path || rom.fileName
        roms.push(rom)
      }
    }
    return roms
  }

  private static isValidFileName(fileName: string) {
    const ext = fileName.split('.').at(-1)
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
    if (this.blob) {
      return this.blob
    }
    if (!this.isLocalFile) {
      const blob = await oneDrive.download(this.path)
      this.blob = blob
      return blob
    }
  }

  async updateGameInfo() {
    if (!this.system) {
      await this.updateSystem()
    }
    const gameInfo = await GamesDatabase.queryByFileNameFromSystem({
      fileName: this.fileName,
      system: this.system,
    })
    this.gameInfo = gameInfo
  }

  async updateSystem() {
    if (!this.fileName) {
      throw new Error('Invalid file')
    }

    let system = this.guessSystemByPath() || this.guessSystemByFileName()
    if (!system && this.isLocalFile && this.fileName.endsWith('.zip')) {
      system = await this.guessSystemByExtractedContent()
    }

    if (!system) {
      throw new Error(`Unknown system for ${this.fileName}`)
    }

    this.system = system
  }

  private guessSystemByFileName(fileName: string = this.fileName) {
    const extname = fileName.split('.').pop()
    if (!extname) {
      return ''
    }
    return extSystemMap[extname] ?? ''
  }

  private async guessSystemByExtractedContent() {
    if (!this.blob) {
      return ''
    }
    const blobReader = new BlobReader(this.blob)
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
    if (!this.path) {
      return
    }
    for (const system of systems) {
      if (this.path.includes(system)) {
        return system
      }
    }
  }
}
