export interface Entry<BinType extends Buffer | string> {
  name?: string
  description?: string
  rom_name?: string
  size?: number
  crc?: BinType
  md5?: BinType
  sha1?: BinType
  serial?: BinType
  genre?: string
  franchise?: string
  releasemonth?: number
  releaseyear?: number
  developer?: string
  publisher?: string
  users?: number
  edge_rating?: number
  edge_issue?: number
  esrb_rating?: string
  origin?: string
  rumble?: number
  edge_review?: string
  famitsu_rating?: number
  enhancement_hw?: string
  elspa_rating?: string
  analog?: number
}
