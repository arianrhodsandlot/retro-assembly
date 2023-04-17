import { $, fs } from 'zx'

const rafileUrl = 'https://buildbot.libretro.com/stable/1.15.0/emscripten/RetroArch.7z'
const rafileName = 'retroarch.7z'

if (!(await fs.exists('retroarch'))) {
  await $`curl ${rafileUrl} -o ${rafileName}`
}

if (await fs.exists(rafileName)) {
  await $`7z x ${rafileName}`
  await $`mv ${rafileName} retroarch`
}

await $`node scripts/generate-cores`
await $`node scripts/generate-databases`
