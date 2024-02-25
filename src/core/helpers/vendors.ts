import { Nostalgist } from 'nostalgist'

const { browserfs } = Nostalgist.vendors
const { BFSRequire } = browserfs

export const { Buffer } = BFSRequire('buffer')
export const path = BFSRequire('path')
