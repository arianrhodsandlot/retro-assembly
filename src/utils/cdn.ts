const repositoryVersions = {
  'batocera-linux/batocera-themes': 'cc0de2f',
  'HerbFargus/es-theme-tronkyfran': 'a270311',
  'KyleBing/retro-game-console-icons': 'b0f42b0',
  'libretro-thumbnails/Atari_-_2600': 'a6a54d3',
  'libretro-thumbnails/FBNeo_-_Arcade_Games': '5209042',
  'libretro-thumbnails/Nintendo_-_Game_Boy': '9db9910',
  'libretro-thumbnails/Nintendo_-_Game_Boy_Advance': '8eb37c7',
  'libretro-thumbnails/Nintendo_-_Game_Boy_Color': '2c54e12',
  'libretro-thumbnails/Nintendo_-_Nintendo_Entertainment_System': 'dbac0d8',
  'libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System': '59a8381',
  'libretro-thumbnails/Sega_-_Mega_Drive_-_Genesis': 'fa29730',
  'libretro/retroarch-assets': '9afd2b8',
  'Mattersons/es-theme-neutral': 'c9b38e7',
  'RetroPie/es-theme-carbon': 'b09973e',
} as const

function encodeRFC3986URIComponent(str: string) {
  return encodeURIComponent(str).replaceAll(/[!'()*]/g, (c) => `%${c.codePointAt(0)?.toString(16).toUpperCase()}`)
}

export function getCDNUrl(repo: keyof typeof repositoryVersions, filePpath: string) {
  const [ghUser, ghRepoName] = repo.split('/')
  const version = repositoryVersions[repo]
  const url = new URL('', 'https://cdn.jsdelivr.net')
  const encode = encodeRFC3986URIComponent
  const urlPathSecments = ['gh', encode(ghUser), `${encode(ghRepoName)}@${encode(version)}`, filePpath]
  const urlPath = urlPathSecments.join('/')
  url.pathname = urlPath
  return url.href
}
