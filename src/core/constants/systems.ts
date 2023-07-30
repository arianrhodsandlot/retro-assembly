export type SystemName =
  | 'gamegear'
  | 'gb'
  | 'gba'
  | 'gbc'
  | 'megadrive'
  | 'nes'
  | 'ngp'
  | 'ngpc'
  | 'sms'
  | 'snes'
  | 'vb'
  | 'atari2600'
  | 'atari5200'
  | 'atari7800'
  | 'wonderswan'
  | 'wonderswancolor'

type CoreName =
  | 'a5200'
  | 'atari800'
  | 'fceumm'
  | 'gearboy'
  | 'genesis_plus_gx'
  | 'mednafen_lynx'
  | 'mednafen_vb'
  | 'mednafen_wswan'
  | 'mednafen_ngp'
  | 'mgba'
  | 'mupen64plus_next'
  | 'nestopia'
  | 'pcsx2'
  | 'picodrive'
  | 'prosystem'
  | 'snes9x'
  | 'stella2014'

// systems are sorted based upon their popularity, see https://en.wikipedia.org/wiki/List_of_best-selling_game_consoles
export const systemNamesSorted: SystemName[] = [
  'gb',
  'gbc',
  'gba',
  'nes',
  'snes',
  'megadrive',
  'atari2600',
  'sms',
  'gamegear',
  'wonderswan',
  'wonderswancolor',
  'ngp',
  'ngpc',
  'atari7800',
  'atari5200',
  'vb',
]

export const systemFullNameMap: Record<SystemName, string> = {
  atari2600: 'Atari - 2600',
  atari5200: 'Atari - 5200',
  atari7800: 'Atari - 7800',
  gamegear: 'Sega - Game Gear',
  gb: 'Nintendo - Game Boy',
  gba: 'Nintendo - Game Boy Advance',
  gbc: 'Nintendo - Game Boy Color',
  megadrive: 'Sega - Mega Drive - Genesis',
  nes: 'Nintendo - Nintendo Entertainment System',
  ngp: 'SNK - Neo Geo Pocket',
  ngpc: 'SNK - Neo Geo Pocket Color',
  sms: 'Sega - Master System - Mark III',
  snes: 'Nintendo - Super Nintendo Entertainment System',
  vb: 'Nintendo - Virtual Boy',
  wonderswan: 'Bandai - WonderSwan',
  wonderswancolor: 'Bandai - WonderSwan Color',
}

export const systemCoreMap: Record<SystemName, CoreName> = {
  atari2600: 'stella2014',
  atari5200: 'a5200',
  atari7800: 'prosystem',
  gamegear: 'genesis_plus_gx',
  gb: 'gearboy',
  gba: 'mgba',
  gbc: 'gearboy',
  megadrive: 'genesis_plus_gx',
  nes: 'fceumm',
  ngp: 'mednafen_ngp',
  ngpc: 'mednafen_ngp',
  sms: 'genesis_plus_gx',
  snes: 'snes9x',
  vb: 'mednafen_vb',
  wonderswan: 'mednafen_wswan',
  wonderswancolor: 'mednafen_wswan',
}

export const extSystemMap: Record<string, SystemName> = {
  a26: 'atari2600',
  a52: 'atari5200',
  a78: 'atari7800',
  gb: 'gb',
  gba: 'gba',
  gbc: 'gbc',
  gg: 'gamegear',
  md: 'megadrive',
  nes: 'nes',
  ngc: 'ngpc',
  ngp: 'ngp',
  sfc: 'snes',
  sms: 'sms',
  snes: 'snes',
  unf: 'nes',
  unif: 'nes',
  vb: 'vb',
  vboy: 'vb',
  ws: 'wonderswan',
  wsc: 'wonderswancolor',
}
