export const systems = ['nes', 'megadrive', 'vb', 'gb', 'gbc', 'gba', 'gamegear']

type SystemName =
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
}
