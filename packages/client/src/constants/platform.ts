export type PlatformName =
  | 'arcade'
  | 'atari2600'
  | 'atari5200'
  | 'atari7800'
  | 'fds'
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
  | 'wonderswan'
  | 'wonderswancolor'

type CoreName =
  | 'a5200'
  | 'fbneo'
  | 'fceumm'
  | 'gearboy'
  | 'genesis_plus_gx'
  | 'mednafen_lynx'
  | 'mednafen_ngp'
  | 'mednafen_vb'
  | 'mednafen_wswan'
  | 'mgba'
  | 'mupen64plus_next'
  | 'nestopia'
  | 'pcsx2'
  | 'picodrive'
  | 'prosystem'
  | 'snes9x'
  | 'stella2014'

// platforms are sorted based upon their popularity, see https://en.wikipedia.org/wiki/List_of_best-selling_game_consoles
export const platformNamesSorted: PlatformName[] = [
  'gb',
  'gbc',
  'gba',
  'nes',
  'snes',
  'megadrive',
  'atari2600',
  'sms',
  'gamegear',
  'fds',
  'wonderswan',
  'wonderswancolor',
  'ngp',
  'ngpc',
  'atari7800',
  'atari5200',
  'vb',
  'arcade',
]

export const platformLibretroFullNameMap: Record<PlatformName, string> = {
  arcade: 'FBNeo - Arcade Games',
  atari2600: 'Atari - 2600',
  atari5200: 'Atari - 5200',
  atari7800: 'Atari - 7800',
  fds: 'Nintendo - Family Computer Disk System',
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
export const platformFullNameMap: Record<PlatformName, string> = {
  arcade: 'Arcade',
  atari2600: 'Atari 2600',
  atari5200: 'Atari 5200',
  atari7800: 'Atari 7800',
  fds: 'Family Computer Disk System',
  gamegear: 'Game Gear',
  gb: 'Game Boy',
  gba: 'Game Boy Advance',
  gbc: 'Game Boy Color',
  megadrive: 'Genesis',
  nes: 'NES',
  ngp: 'Neo Geo Pocket',
  ngpc: 'Neo Geo Pocket Color',
  sms: 'Master System',
  snes: 'Super Nintendo',
  vb: 'Virtual Boy',
  wonderswan: 'WonderSwan',
  wonderswancolor: 'WonderSwan Color',
}

export const platformCoreMap: Record<PlatformName, CoreName> = {
  arcade: 'fbneo',
  atari2600: 'stella2014',
  atari5200: 'a5200',
  atari7800: 'prosystem',
  fds: 'fceumm',
  gamegear: 'genesis_plus_gx',
  gb: 'mgba',
  gba: 'mgba',
  gbc: 'mgba',
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

export const platformNeedsBios = ['arcade', 'fds']

export const coreBiosMap: Record<string, string[]> = {
  fbneo: [
    'neogeo.zip',
    'neocdz.zip',
    'decocass.zip',
    'isgsm.zip',
    'midssio.zip',
    'nmk004.zip',
    'pgm.zip',
    'skns.zip',
    'ym2608.zip',
    'cchip.zip',
    'bubsys.zip',
    'namcoc69.zip',
    'namcoc70.zip',
    'namcoc75.zip',
    'coleco.zip',
    'fdsbios.zip',
    'msx.zip',
    'ngp.zip',
    'spectrum.zip',
    'spec128.zip',
    'spec1282a.zip',
    'channelf.zip',
  ],
  fceumm: ['disksys.rom'],
}

export const arcadeHardwareBiosMap: Record<string, string[]> = {
  'C-Chip Internal ROM': ['cchip.zip'],
  'Cassette System': ['decocass.zip'],
  'ISG Selection Master Type 2006': ['isgsm.zip'],
  'NA-1 / NA-2': ['namcoc69.zip', 'namcoc70.zip'],
  'NB-1 / NB-2': ['namcoc75.zip'],
  'Neo Geo CDZ': ['neocdz.zip'],
  'Neo Geo MVS': ['neogeo.zip'],
  NMK16: ['nmk004.zip'],
  PolyGameMaster: ['pgm.zip'],
  SSIO: ['midssio.zip'],
  'Super Kaneko Nova System': ['skns.zip'],
  'YM2608 Internal ROM': ['ym2608.zip'],
}

export const extPlatformMap: Record<string, PlatformName> = {
  a26: 'atari2600',
  a52: 'atari5200',
  a78: 'atari7800',
  bs: 'snes',
  fds: 'fds',
  fig: 'snes',
  gb: 'gb',
  gba: 'gba',
  gbc: 'gbc',
  gg: 'gamegear',
  md: 'megadrive',
  nes: 'nes',
  ngc: 'ngpc',
  ngp: 'ngp',
  sfc: 'snes',
  smc: 'snes',
  sms: 'sms',
  snes: 'snes',
  st: 'snes',
  swc: 'snes',
  unf: 'nes',
  unif: 'nes',
  vb: 'vb',
  vboy: 'vb',
  ws: 'wonderswan',
  wsc: 'wonderswancolor',
}
