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
  const jsDistDir = 'src/generated/retroarch-cores'
  const wasmDistDir = 'src/generated/public'
  await fs.mkdir(jsDistDir, { recursive: true })
  await fs.mkdir(wasmDistDir, { recursive: true })
  const items = await fs.readdir(originalCoresDir)
  for (const item of items) {
    const isJs = item.endsWith('_libretro.js')
    const isWasm = item.endsWith('_libretro.wasm')
    const isEnabled = enabledCores.some((c) => item.includes(c))
    if (isEnabled) {
      const originalPath = path.resolve(originalCoresDir, item)
      const distPath = path.resolve(isWasm ? wasmDistDir : jsDistDir, item)
      await fs.copyFile(originalPath, distPath)
      if (isJs) {
        const content = await fs.readFile(distPath, 'utf8')
        const modifiedContent = modifyContent(content)
        await fs.writeFile(distPath, modifiedContent, 'utf8')
      }
    }
  }
}

await main()
