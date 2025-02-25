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

function validateNumber(value, name) {
  if (typeof value !== 'number') {
    throw new TypeError(`ERR_INVALID_ARG_TYPE: ${name}`)
  }
}

function boundsError(value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new Error('ERR_OUT_OF_RANGE')
  }

  if (length < 0) {
    throw new Error('ERR_BUFFER_OUT_OF_BOUNDS')
  }

  throw new Error('ERR_OUT_OF_RANGE')
}

function readBigUInt64BE(buffer, offset) {
  offset >>>= 0
  validateNumber(offset, 'offset')
  const first = buffer[offset]
  const last = buffer[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, buffer.length - 8, undefined)
  }

  const hi = first * 2 ** 24 + buffer[++offset] * 2 ** 16 + buffer[++offset] * 2 ** 8 + buffer[++offset]

  const lo = buffer[++offset] * 2 ** 24 + buffer[++offset] * 2 ** 16 + buffer[++offset] * 2 ** 8 + last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
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
    return readBigUInt64BE(this.read(8), 0)
  }

  readUInt(len = 1) {
    const buffer = this.read(len)
    return len < 7 ? buffer.readUIntBE(0, len) : Number(readBigUInt64BE(buffer, 0))
  }

  readInt(len = 1) {
    const buffer = this.read(len)
    return len < 7 ? buffer.readIntBE(0, len) : Number(buffer.readBigInt64BE(0))
  }

  readString(len = 1) {
    return this.read(len).toString()
  }
}
