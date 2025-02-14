import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

interface GameInfo {
  company: string
  fullName: string
  hardware: string
  name: string
  parent: string
  remarks: string
  status: string
  year: string
}

let gameInfoMap: Map<string, GameInfo>
async function loadGameList() {
  if (gameInfoMap) {
    return
  }
  const dirname = import.meta.dirname || path.parse(fileURLToPath(import.meta.url.replace('client/packages/', ''))).dir
  const gameListPath = path.resolve(dirname, '../assets/fbneo/gamelist.txt')
  const gameListContent = await fs.readFile(gameListPath, 'utf8')
  const rows = gameListContent.split('\n')
  gameInfoMap = new Map()
  for (const row of rows) {
    if (row.startsWith('| ') && !row.startsWith('| name')) {
      const [, name, status, fullName, parent, year, company, hardware, remarks] = row
        .split('|')
        .map((segment) => segment.trim())
      const game = { company, fullName, hardware, name, parent, remarks, status, year }
      gameInfoMap.set(name, game)
    }
  }
}

export async function getFBNeoGameInfo({ fileName, platform }: { fileName: string; platform: string }) {
  if (platform === 'arcade') {
    await loadGameList()

    const { name } = path.parse(fileName)
    const gameInfo = gameInfoMap.get(name)
    return gameInfo
  }
}
