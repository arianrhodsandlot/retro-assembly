export type SystemName =
  | 'gamegear'
  | 'gb'
  | 'gba'
  | 'gbc'
  | 'megadrive'
  | 'nes'
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
  'atari7800',
  'atarilynx',
  'atari5200',
  'vb',
]

export const systemFullNameMap: Record<SystemName, string> = {
  gamegear: 'Sega - Game Gear',
  gb: 'Nintendo - Game Boy',
  gba: 'Nintendo - Game Boy Advance',
  gbc: 'Nintendo - Game Boy Color',
  megadrive: 'Sega - Mega Drive - Genesis',
  nes: 'Nintendo - Nintendo Entertainment System',
  sms: 'Sega - Master System - Mark III',
  snes: 'Nintendo - Super Nintendo Entertainment System',
  vb: 'Nintendo - Virtual Boy',
  atari2600: 'Atari - 2600',
  atari5200: 'Atari - 5200',
  atari7800: 'Atari - 7800',
  atarilynx: 'Atari - lynx',
}

export const systemCoreMap: Record<SystemName, CoreName> = {
  gamegear: 'genesis_plus_gx',
  gb: 'gearboy',
  gba: 'mgba',
  gbc: 'gearboy',
  megadrive: 'genesis_plus_gx',
  nes: 'nestopia',
  sms: 'genesis_plus_gx',
  snes: 'snes9x',
  vb: 'beetle_vb',
  atari2600: 'stella2014',
  atari5200: 'atari800',
  atari7800: 'prosystem',
  atarilynx: 'mednafen_lynx',
}

export const extSystemMap: Record<string, SystemName> = {
  fds: 'nes',
  gb: 'gb',
  gba: 'gba',
  gbc: 'gbc',
  gg: 'gamegear',
  md: 'megadrive',
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
