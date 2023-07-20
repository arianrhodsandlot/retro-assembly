/* eslint-disable unicorn/prefer-node-protocol */
import { Buffer } from 'buffer/index'
/*
  Note: the file is fully read in memory (on open) because it's really faster
  than reading small piece on the hard-drive (and the db file is not that heavy)
  At first, it was read on demand, and, for a 7MB file, it took 33s versus 2s like this,
  on a Macbook with SSD.
*/

export enum SEEK_MODE {
  SEEK_SET = 0,
  SEEK_CUR = 1,
  SEEK_END = 2,
}

export class FileHandler {
  private pos = 0
  private buffer: Buffer | null = null

  load(buffer) {
    this.buffer = buffer
  }

  free() {
    this.buffer = null
  }

  seek(pos: number, whence: SEEK_MODE = SEEK_MODE.SEEK_CUR) {
    if (!this.buffer) {
      throw new Error('null buffer')
    }
    if (whence === SEEK_MODE.SEEK_CUR) {
      this.pos += pos
    } else if (whence === SEEK_MODE.SEEK_SET) {
      this.pos = pos
    } else {
      this.pos = this.buffer.length - pos
    }
    this.pos = Math.max(0, this.pos)
    this.pos = Math.min(this.pos, this.buffer.length)
  }

  tell() {
    return this.pos
  }

  read(len: number): Buffer {
    const { pos } = this
    if (!this.buffer) {
      throw new Error('null buffer')
    }
    if (pos + len > this.buffer.length) {
      throw new Error(`fail to read ${len} bytes (missing ${pos + len - this.buffer.length})`)
    }
    this.pos += len
    return this.buffer.slice(pos, pos + len)
  }

  readUInt64() {
    return this.read(8).readBigUInt64BE(0)
  }

  readUInt(len = 1) {
    const buffer = this.read(len)
    return len < 7 ? buffer.readUIntBE(0, len) : Number(buffer.readBigUInt64BE(0))
  }

  readInt(len = 1) {
    const buffer = this.read(len)
    return len < 7 ? buffer.readIntBE(0, len) : Number(buffer.readBigInt64BE(0))
  }

  readString(len = 1) {
    return this.read(len).toString()
  }
}
