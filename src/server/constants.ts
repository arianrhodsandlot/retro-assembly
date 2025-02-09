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
  | 'gw'
  | 'megadrive'
  | 'nes'
  | 'ngp'
  | 'ngpc'
  | 'sms'
  | 'snes'
  | 'vb'
  | 'wonderswan'
  | 'wonderswancolor'

interface PlatformDetail {
  fullName: string
  id: PlatformName
}

export const platformsMap: Record<PlatformName, PlatformDetail> = {
  arcade: { fullName: '', id: 'arcade' },
  atari2600: { fullName: '', id: 'atari2600' },
  atari5200: { fullName: '', id: 'atari5200' },
  atari7800: { fullName: '', id: 'atari7800' },
  fds: { fullName: '', id: 'fds' },
  gamegear: { fullName: '', id: 'gamegear' },
  gb: { fullName: '', id: 'gb' },
  gba: { fullName: '', id: 'gba' },
  gbc: { fullName: '', id: 'gbc' },
  gw: { fullName: '', id: 'gw' },
  megadrive: { fullName: '', id: 'megadrive' },
  nes: { fullName: '', id: 'nes' },
  ngp: { fullName: '', id: 'ngp' },
  ngpc: { fullName: '', id: 'ngpc' },
  sms: { fullName: '', id: 'sms' },
  snes: { fullName: '', id: 'snes' },
  vb: { fullName: '', id: 'vb' },
  wonderswan: { fullName: '', id: 'wonderswan' },
  wonderswancolor: { fullName: '', id: 'wonderswancolor' },
}
