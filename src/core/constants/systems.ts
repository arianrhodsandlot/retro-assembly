export type SystemName =
  | '32x'
  | 'gamegear'
  | 'gb'
  | 'gba'
  | 'gbc'
  | 'gw'
  | 'megadrive'
  | 'n64'
  | 'nes'
  | 'psx'
  | 'sms'
  | 'snes'
  | 'vb'
  | 'atari2600'
  | 'atari5200'
  | 'atari7800'
  | 'atarilynx'

type CoreName =
  | 'beetle_vb'
  | 'fceumm'
  | 'gearboy'
  | 'genesis_plus_gx'
  | 'gw'
  | 'mgba'
  | 'mupen64plus_next'
  | 'nestopia'
  | 'pcsx2'
  | 'picodrive'
  | 'snes9x'
  | 'stella2014'
  | 'atari800'
  | 'prosystem'
  | 'mednafen_lynx'

// systems are currently sorted based upon their popularity, see https://en.wikipedia.org/wiki/List_of_best-selling_game_consoles
export const systemNamesSorted: SystemName[] = [
  'gb',
  'gbc',
  'gba',
  'psx',
  'nes',
  'snes',
  'gw',
  'n64',
  'megadrive',
  'atari2600',
  'sms',
  'gamegear',
  'atari7800',
  'atarilynx',
  'atari5200',
  '32x',
  'vb',
]

export const systemFullNameMap: Record<SystemName, string> = {
  '32x': 'Sega - 32X',
  gw: 'Handheld Electronic Game',
  gamegear: 'Sega - Game Gear',
  gb: 'Nintendo - Game Boy',
  gba: 'Nintendo - Game Boy Advance',
  gbc: 'Nintendo - Game Boy Color',
  megadrive: 'Sega - Mega Drive - Genesis',
  n64: 'Nintendo - Nintendo 64',
  nes: 'Nintendo - Nintendo Entertainment System',
  psx: 'Sony - PlayStation',
  sms: 'Sega - Master System - Mark III',
  snes: 'Nintendo - Super Nintendo Entertainment System',
  vb: 'Nintendo - Virtual Boy',
  atari2600: 'Atari - 2600',
  atari5200: 'Atari - 5200',
  atari7800: 'Atari - 7800',
  atarilynx: 'Atari - lynx',
}

export const systemCoreMap: Record<SystemName, CoreName> = {
  '32x': 'picodrive',
  gamegear: 'genesis_plus_gx',
  gb: 'gearboy',
  gba: 'mgba',
  gbc: 'gearboy',
  gw: 'gw',
  megadrive: 'genesis_plus_gx',
  n64: 'mupen64plus_next',
  nes: 'nestopia',
  psx: 'pcsx2',
  sms: 'genesis_plus_gx',
  snes: 'snes9x',
  vb: 'beetle_vb',
  atari2600: 'stella2014',
  atari5200: 'atari800',
  atari7800: 'prosystem',
  atarilynx: 'mednafen_lynx',
}

export const extSystemMap: Record<string, SystemName> = {
  '32x': '32x',
  fds: 'nes',
  gb: 'gb',
  gba: 'gba',
  gbc: 'gbc',
  gg: 'gamegear',
  md: 'megadrive',
  mgw: 'gw',
  nes: 'nes',
  sfc: 'snes',
  sms: 'sms',
  snes: 'snes',
  unf: 'nes',
  unif: 'nes',
  vb: 'vb',
  vboy: 'vb',
  a26: 'atari2600',
  a52: 'atari5200',
  a78: 'atari7800',
  lnx: 'atarilynx',
}
