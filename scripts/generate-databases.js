import fs from 'node:fs/promises'
import path from 'node:path'
import { Libretrodb } from 'libretrodb'

const enabledSystems = [
  'Sega - 32X',
  'Handheld Electronic Game',
  'Sega - Game Gear',
  'Nintendo - Game Boy',
  'Nintendo - Game Boy Advance',
  'Nintendo - Game Boy Color',
  'Sega - Mega Drive - Genesis',
  'Nintendo - Nintendo 64',
  'Nintendo - Nintendo Entertainment System',
  // 'Sony - PlayStation',
  'Sega - Master System - Mark III',
  'Nintendo - Super Nintendo Entertainment System',
  'Nintendo - Virtual Boy',
]

const rdbDir = 'retroarch/assets/frontend/bundle/database/rdb'
const distDir = 'src/generated/retroarch-databases'
async function main() {
  await fs.mkdir(distDir, { recursive: true })
  const items = await fs.readdir(rdbDir)
  for (const item of items) {
    if (item.endsWith('.rdb') && enabledSystems.some((s) => item.endsWith(`${s}.rdb`))) {
      const rdbPath = path.resolve(rdbDir, item)
      const libretrodb = await Libretrodb.from(rdbPath)
      const rdbJson = path.resolve(distDir, `${item}.json`)
      await fs.writeFile(rdbJson, JSON.stringify(libretrodb.getEntries(), undefined, 2), 'utf8')
    }
  }
}

await main()
