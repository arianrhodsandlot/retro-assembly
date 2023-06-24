export type SystemName = 'gamegear' | 'gb' | 'gba' | 'gbc' | 'megadrive' | 'nes' | 'sms' | 'snes' | 'vb' | 'atari2600'

type CoreName =
  | 'mednafen_vb'
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
  'vb',
]

export const systemFullNameMap: Record<SystemName, string> = {
  gamegear: 'Sega - Game Gear', // good
  gb: 'Nintendo - Game Boy', // good
  gba: 'Nintendo - Game Boy Advance', // good
  gbc: 'Nintendo - Game Boy Color', // good
  megadrive: 'Sega - Mega Drive - Genesis', // good
  nes: 'Nintendo - Nintendo Entertainment System', // good
  sms: 'Sega - Master System - Mark III', // good
  snes: 'Nintendo - Super Nintendo Entertainment System', // good
  vb: 'Nintendo - Virtual Boy', // good
  atari2600: 'Atari - 2600', // good
}

export const systemCoreMap: Record<SystemName, CoreName> = {
  gamegear: 'genesis_plus_gx',
  gb: 'gearboy',
  gba: 'mgba',
  gbc: 'gearboy',
  megadrive: 'genesis_plus_gx',
  nes: 'fceumm',
  sms: 'genesis_plus_gx',
  snes: 'snes9x',
  vb: 'mednafen_vb',
  atari2600: 'stella2014',
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
}
