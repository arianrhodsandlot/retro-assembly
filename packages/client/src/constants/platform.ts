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

interface Platform {
  displayName: string
  launchboxName: string
  libretroName: string
  name: PlatformName
}

const platforms: Platform[] = [
  { displayName: 'Arcade', launchboxName: 'Arcade', libretroName: 'FBNeo - Arcade Games', name: 'arcade' },
  { displayName: 'Atari 2600', launchboxName: 'Atari 2600', libretroName: 'Atari - 2600', name: 'atari2600' },
  { displayName: 'Atari 5200', launchboxName: 'Atari - 5200', libretroName: 'Atari - 5200', name: 'atari5200' },
  { displayName: 'Atari 7800', launchboxName: 'Atari - 7800', libretroName: 'Atari - 7800', name: 'atari7800' },
  {
    displayName: 'Family Computer Disk System',
    launchboxName: 'Nintendo Famicom Disk System',
    libretroName: 'Nintendo - Family Computer Disk System',
    name: 'fds',
  },
  { displayName: 'Game Gear', launchboxName: 'Sega Game Gear', libretroName: 'Sega - Game Gear', name: 'gamegear' },
  { displayName: 'Game Boy', launchboxName: 'Nintendo Game Boy', libretroName: 'Nintendo - Game Boy', name: 'gb' },
  {
    displayName: 'Game Boy Advance',
    launchboxName: 'Nintendo Game Boy Advance',
    libretroName: 'Nintendo - Game Boy Advance',
    name: 'gba',
  },
  {
    displayName: 'Game Boy Color',
    launchboxName: 'Nintendo Game Boy Color',
    libretroName: 'Nintendo - Game Boy Color',
    name: 'gbc',
  },
  {
    displayName: 'Genesis',
    launchboxName: 'Sega Genesis',
    libretroName: 'Sega - Mega Drive - Genesis',
    name: 'megadrive',
  },
  {
    displayName: 'NES',
    launchboxName: 'Nintendo Entertainment System',
    libretroName: 'Nintendo - Nintendo Entertainment System',
    name: 'nes',
  },
  {
    displayName: 'Neo Geo Pocket',
    launchboxName: 'SNK Neo Geo Pocket',
    libretroName: 'SNK - Neo Geo Pocket',
    name: 'ngp',
  },
  {
    displayName: 'Neo Geo Pocket Color',
    launchboxName: 'SNK Neo Geo Pocket Color',
    libretroName: 'SNK - Neo Geo Pocket Color',
    name: 'ngpc',
  },
  {
    displayName: 'Master System',
    launchboxName: 'Sega Master System',
    libretroName: 'Sega - Master System - Mark III',
    name: 'sms',
  },
  {
    displayName: 'Super Nintendo',
    launchboxName: 'Super Nintendo Entertainment System',
    libretroName: 'Nintendo - Super Nintendo Entertainment System',
    name: 'snes',
  },
  {
    displayName: 'Virtual Boy',
    launchboxName: 'Nintendo Virtual Boy',
    libretroName: 'Nintendo - Virtual Boy',
    name: 'vb',
  },
  { displayName: 'WonderSwan', launchboxName: 'WonderSwan', libretroName: 'Bandai - WonderSwan', name: 'wonderswan' },
  {
    displayName: 'WonderSwan Color',
    launchboxName: 'WonderSwan Color',
    libretroName: 'Bandai - WonderSwan Color',
    name: 'wonderswancolor',
  },
]

export const platformMap: Record<string, Platform> = {}
for (const platform of platforms) {
  const keys = Object.keys(platform) as (keyof Platform)[]
  for (const key of keys) {
    const value = platform[key]
    platformMap[value] = platform
  }
}

export const platformCoreMap: Record<PlatformName, string> = {
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
