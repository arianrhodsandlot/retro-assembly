import { path7za } from '7zip-bin'
import node7z from 'node-7z'
import { $, fs } from 'zx'

const raFileUrl = 'https://buildbot.libretro.com/stable/1.15.0/emscripten/RetroArch.7z'
const raFileName = 'retroarch.7z'

try {
  await $`mv node_modules/${raFileName} .`
} catch {}

if (!(await fs.exists('retroarch')) && !(await fs.exists(raFileName))) {
  await $`curl ${raFileUrl} -o ${raFileName}`
}

if (await fs.exists(raFileName)) {
  if (process.platform !== 'win32') {
    await $`chmod +x ${path7za}`
  }
  await new Promise((resolve, reject) =>
    node7z.extractFull(raFileName, '.', { $bin: path7za }).on('error', reject).on('end', resolve)
  )
  await $`mv ${raFileName} node_modules`
}

await $`node scripts/generate-cores`
await $`node scripts/generate-databases`
