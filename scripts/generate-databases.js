import fs from 'node:fs/promises'
import path from 'node:path'
import { Libretrodb } from 'libretrodb'

const rdbDir = 'retroarch/assets/frontend/bundle/database/rdb'
const distDir = 'src/generated/retroarch-databases'
async function main() {
  await fs.mkdir(distDir, { recursive: true })
  const items = await fs.readdir(rdbDir)
  for (const item of items) {
    if (item.endsWith('.rdb')) {
      const rdbPath = path.resolve(rdbDir, item)
      const libretrodb = await Libretrodb.from(rdbPath)
      console.log(item, libretrodb.getEntries().length)
      const rdbJson = path.resolve(distDir, `${item}.json`)
      await fs.writeFile(rdbJson, JSON.stringify(libretrodb.getEntries(), undefined, 2), 'utf8')
      const rdbMinJson = path.resolve(distDir, `${item}.min.json`)
      await fs.writeFile(rdbMinJson, JSON.stringify(libretrodb.getEntries()), 'utf8')
    }
  }
}

await main()
