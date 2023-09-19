#!/usr/bin/env zx
import { invert } from 'lodash-es'
import path from 'path-browserify'
import { $, cd, fs } from 'zx'

const testRomsBaseUrl = 'https://buildbot.libretro.com/assets/cores/'

const testRomsGroups = {
  Arcade: ['Alien Arena.zip'],
  'Atari - 2600': ['Sheep It Up.zip'],
  'Bandai - WonderSwan Color': ['swandriving.wsc'],
  'Nintendo - GameBoy': ['Tobu Tobu Girl.zip'],
  'Nintendo - GameBoy Advance': ['Celeste Classic (v1.0).zip'],
  'Nintendo - Nintendo Entertainment System': ['240p Test Suite.nes'],
  'Nintendo - Super Nintendo Entertainment System': ['240pTestSuite-SNES-latest.zip'],
  'Nintendo - Virtual Boy': ['VB Racing (FlashBoy Version) (PVBCC).vb'],
  'Sega - Game Gear': ['ButtonTest.zip'],
  'Sega - Mega Drive - Genesis': ['30YearsOfNintendont.zip'],
  'Sega - Master System - Mark III': ['Genesis 6 Button Controller Test by Charles MacDonald (PD).sms'],
  'SNK - Neo Geo Pocket': ['Gears of Fate.zip'],
}

const systemFullNameMap = invert({
  arcade: 'Arcade',
  atari2600: 'Atari - 2600',
  gamegear: 'Sega - Game Gear',
  gb: 'Nintendo - GameBoy',
  gba: 'Nintendo - GameBoy Advance',
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
})

const wd = process.cwd()
async function downloadTestRoms() {
  for (const systemFullName in testRomsGroups) {
    const system = systemFullNameMap[systemFullName]
    const systemRomsDirectory = path.join(wd, 'tests/fixtures/roms', system)

    if (!(await fs.exists(systemRomsDirectory))) {
      await $`mkdir -p ${systemRomsDirectory}`
    }

    cd(systemRomsDirectory)

    const roms = testRomsGroups[systemFullName]
    for (const rom of roms) {
      if (!(await fs.exists(path.join(systemRomsDirectory, rom)))) {
        const romUrl = `${testRomsBaseUrl}${encodeURIComponent(systemFullName)}/${encodeURIComponent(rom)}`
        await $`curl ${romUrl} -o ${rom}`
      }
    }
  }
}

await downloadTestRoms()
