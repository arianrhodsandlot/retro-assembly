export type SystemName =
  | 'arcade'
  | 'atari2600'
  | 'atari5200'
  | 'atari7800'
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
  'arcade',
]

export const systemFullNameMap: Record<SystemName, string> = {
  arcade: 'FBNeo - Arcade Games',
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
  arcade: 'fbneo',
  atari2600: 'stella2014',
  atari5200: 'a5200',
  atari7800: 'prosystem',
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

export const coreBiosMap = {
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
}

export const arcadeHardwareBiosMap: Record<string, string[]> = {
  'Super Kaneko Nova System': ['skns.zip'],
  'Neo Geo MVS': ['neogeo.zip'],
  'Neo Geo CDZ': ['neocdz.zip'],
  PolyGameMaster: ['pgm.zip'],
  'Cassette System': ['decocass.zip'],
  'ISG Selection Master Type 2006': ['isgsm.zip'],
  SSIO: ['midssio.zip'],
  NMK16: ['nmk004.zip'],
  'YM2608 Internal ROM': ['ym2608.zip'],
  'C-Chip Internal ROM': ['cchip.zip'],
  'NA-1 / NA-2': ['namcoc69.zip', 'namcoc70.zip'],
  'NB-1 / NB-2': ['namcoc75.zip'],
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

export const coreFullNameMap: Record<CoreName, string> = {
  a5200: 'a5200',
  fbneo: 'FinalBurn Neo',
  fceumm: 'FCEUmm',
  gearboy: 'Gearboy',
  genesis_plus_gx: 'Genesis Plus GX',
  mednafen_lynx: 'Beetle Lynx',
  mednafen_vb: 'Beetle VB',
  mednafen_wswan: 'Beetle WonderSwan',
  mednafen_ngp: 'Beetle NeoPop',
  mgba: 'mGBA',
  mupen64plus_next: 'Mupen64Plus-Next',
  nestopia: 'Nestopia',
  pcsx2: 'pcsx2',
  picodrive: 'PicoDrive',
  prosystem: 'ProSystem',
  snes9x: 'Snes9x',
  stella2014: 'Stella 2014',
}
