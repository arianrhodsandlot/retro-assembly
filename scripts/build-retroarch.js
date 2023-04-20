import { path7za } from '7zip-bin'
import node7z from 'node-7z'
import { $, fs } from 'zx'

const rafileUrl = 'https://buildbot.libretro.com/stable/1.15.0/emscripten/RetroArch.7z'
const rafileName = 'retroarch.7z'

if (!(await fs.exists('retroarch')) && !(await fs.exists(rafileName))) {
  await $`curl ${rafileUrl} -o ${rafileName}`
}

if (await fs.exists(rafileName)) {
  await new Promise((resolve, reject) =>
    node7z.extractFull(rafileName, '.', { $bin: path7za }).on('error', reject).on('end', resolve)
  )
  await $`mv ${rafileName} retroarch`
}

await $`node scripts/generate-cores`
await $`node scripts/generate-databases`
