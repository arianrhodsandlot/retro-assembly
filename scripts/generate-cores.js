import fs from 'node:fs/promises'
import path from 'node:path'

function modifyContent(content) {
  return `export function getEmscripten({ Module }) {
    ${content}
    return { RA, RWC, GL, PATH, PATH_FS, TTY, MEMFS, FS, SYSCALLS, ERRNO_CODES, EGL, JSEvents, ENV, Module, Browser, exit: _emscripten_force_exit }
  }
  `.trim()
}
const enabledCores = [
  'beetle_vb',
  'fceumm',
  'gearboy',
  'genesis_plus_gx',
  'gw',
  'mgba',
  'mupen64plus_next',
  'nestopia',
  'pcsx2',
  'picodrive',
  'snes9x',
]

async function main() {
  const originalCoresDir = 'retroarch'
  const distDir = 'src/core/generated/retroarch-cores'
  await fs.mkdir(distDir, { recursive: true })
  const items = await fs.readdir(originalCoresDir)
  for (const item of items) {
    if (item.includes('_libretro.') && enabledCores.some((c) => item.includes(c))) {
      const corePath = path.resolve(originalCoresDir, item)
      const modifiedCorePath = path.resolve(distDir, item)
      await fs.copyFile(corePath, modifiedCorePath)
      if (item.endsWith('_libretro.js')) {
        const content = await fs.readFile(modifiedCorePath, 'utf8')
        const modifiedContent = modifyContent(content)
        await fs.writeFile(modifiedCorePath, modifiedContent, 'utf8')
      }
    }
  }
}

await main()
