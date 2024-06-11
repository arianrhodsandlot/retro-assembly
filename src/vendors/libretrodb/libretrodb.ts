import { Buffer } from '../../core/helpers/vendors'
import { MAGIC_NUMBER, MPF } from './constants'
import { FileHandler, SEEK_MODE } from './file-handler'
import { isRecord } from './is-record'
import type { Entry } from './types'

export interface Options {
  bufferToString: boolean
  indexHashes: boolean
}

export class Libretrodb<T extends Buffer | string> {
  private metadataOffset = 0
  private firstIndexOffset = 0
  private count = 0
  private file: FileHandler
  private entries: Entry<T>[] = []
  private index: Record<string, Entry<T>> = {}
  private options: Options

  constructor(options: Partial<Options> = {}) {
    this.file = new FileHandler()
    this.options = {
      bufferToString: true,
      indexHashes: true,
      ...options,
    }
  }

  static async from<Ops extends Partial<Options>>(buffer, options?: Ops) {
    const db = new Libretrodb<Ops extends { bufferToString: false } ? Buffer : string>(options)
    await db.load(buffer)
    return db
  }

  async load(buffer): Promise<void> {
    await this.file.load(buffer)
    this.readMagicNumber()
    this.readMetadataOffset()
    this.firstIndexOffset = this.file.tell()
    this.readMetadata()
    this.file.seek(this.firstIndexOffset, SEEK_MODE.SEEK_SET)
    this.readEntries()
    this.file.free()
  }

  getEntries() {
    return [...this.entries]
  }

  searchHash(hex: string) {
    const len = hex.length
    if (len !== 8 && len !== 32 && len !== 40) {
      throw new Error(`hash length mismatch with crc (8), md5 (32) and sha1 (40) (got ${len})`)
    }
    if (this.options.indexHashes) {
      return this.index[hex]
    }
    const search = Buffer.from(hex, 'hex')
    const key: keyof Entry<T> = len === 8 ? 'crc' : len === 32 ? 'md5' : 'sha1'
    return this.entries.find((entry) => {
      const value = entry[key]
      if (value) {
        return this.options.bufferToString ? value === hex : (value as Buffer).compare(search) === 0
      }
    })
  }

  private readMagicNumber() {
    const buffer = this.file.read(MAGIC_NUMBER.length)
    const mismatch = Buffer.compare(buffer, Buffer.from(MAGIC_NUMBER)) !== 0
    if (mismatch) {
      throw new Error('not a libretro database (magic number mismatch)')
    }

    // MAGIC NUMBER length is 7,
    // Due to the data structure alignment with the uint64
    // The compiler pads it to 8, so add a byte
    this.file.seek(1)
  }

  private readMetadataOffset() {
    this.metadataOffset = Number(this.file.readUInt64())
    if (!this.metadataOffset) {
      this.metadataOffset = this.searchForMetadataOffset()
    }
    if (!this.metadataOffset) {
      throw new Error('metadata_offset not found')
    }
  }

  private readMetadata() {
    this.file.seek(this.metadataOffset, SEEK_MODE.SEEK_SET)
    const result = this.rmsgpackRead()
    if (isRecord(result) && typeof result.count === 'number') {
      this.count = result.count
    } else {
      throw new Error('failed to read metadata')
    }
  }

  private readEntries() {
    for (let i = 0; i < this.count; i++) {
      const pos = this.file.tell()
      const value = this.rmsgpackRead()
      if (isRecord(value)) {
        const entry = value as Entry<T>
        this.entries.push(entry)
        if (this.options.indexHashes) {
          this.addToIndex(entry)
        }
      } else {
        throw new Error(`unexpected data read at cursor 0x${pos.toString(16)}`)
      }
    }
    if (this.metadataOffset !== this.file.tell() + 1) {
      console.warn(
        `** WARNING **\n** Unexpected cursor position (0x${this.file.tell().toString(16)} instead of 0x${(
          this.metadataOffset - 1
        ).toString(16)}). **\n** There are some unidentified data after the last entry. **`,
      )
    }
  }

  private addToIndex(entry: Entry<T>) {
    const keys: (keyof Entry<T>)[] = ['crc', 'md5', 'sha1']
    for (const key of keys) {
      const value = entry[key] as Buffer | string
      if (value) {
        if (Buffer.isBuffer(value)) {
          this.index[value.toString('hex')] = entry
        } else {
          this.index[value] = entry
        }
      }
    }
  }

  private rmsgpackRead(): any {
    const type = this.file.readUInt()
    if (type < MPF.FIXMAP) {
      return type
    }
    if (type < MPF.FIXARRAY) {
      return this.readMap(type - MPF.FIXMAP)
    }
    if (type < MPF.FIXSTR) {
      return this.readArray(type - MPF.FIXARRAY)
    }
    if (type < MPF.NIL) {
      return this.file.readString(type - MPF.FIXSTR)
    }
    if (type > MPF.MAP32) {
      return type - 0xff - 1
    }

    let tmpLen: number

    switch (type) {
      case MPF.NIL:
        return null
      case MPF.FALSE:
        return false
      case MPF.TRUE:
        return true
      case MPF.BIN8:
      case MPF.BIN16:
      case MPF.BIN32:
        tmpLen = this.file.readInt(1 << (type - MPF.BIN8))
        const buffer = this.file.read(tmpLen)
        if (this.options.bufferToString) {
          return buffer.toString('hex')
        }
        return Buffer.from(buffer)
      case MPF.UINT8:
      case MPF.UINT16:
      case MPF.UINT32:
      case MPF.UINT64:
        return this.file.readUInt(1 << (type - MPF.UINT8))
      case MPF.INT8:
      case MPF.INT16:
      case MPF.INT32:
      case MPF.INT64:
        return this.file.readInt(1 << (type - MPF.INT8))
      case MPF.STR8:
      case MPF.STR16:
      case MPF.STR32:
        tmpLen = this.file.readUInt(1 << (type - MPF.STR8))
        return this.file.readString(tmpLen)
      case MPF.ARRAY16:
      case MPF.ARRAY32:
        tmpLen = this.file.readUInt(2 << (type - MPF.ARRAY16))
        return this.readArray(tmpLen)
      case MPF.MAP16:
      case MPF.MAP32:
        tmpLen = this.file.readUInt(2 << (type - MPF.MAP16))
        return this.readMap(tmpLen)
    }
    return 0
  }

  private readMap(len: number) {
    const result: any = {}
    for (let i = 0; i < len; i++) {
      const key = this.rmsgpackRead()
      result[key] = this.rmsgpackRead()
    }
    return result
  }

  private readArray(len: number) {
    const result: any[] = []
    for (let i = 0; i < len; i++) {
      result.push(this.rmsgpackRead())
    }
    return result
  }

  /**
   * Some rdb files are missing the metadata_offset, so
   * we duck search the position of the map+count+len from the end
   * of the file.
   * https://github.com/libretro/libretro-database/issues/1163
   */
  private searchForMetadataOffset() {
    const previousPos = this.file.tell()
    const searched = Buffer.from('count')
    for (let offset = 20; offset > searched.length; offset--) {
      this.file.seek(offset, SEEK_MODE.SEEK_END)
      const buffer = this.file.read(searched.length)
      if (buffer.compare(searched) === 0) {
        const metadata_offset = this.file.tell() - searched.length - 2
        this.file.seek(previousPos, SEEK_MODE.SEEK_SET)
        return metadata_offset
      }
    }
    return 0
  }
}
