import { find, remove } from 'lodash-es'
import { isAbsolute, join, relative } from 'path-browserify'
import { type Rom } from '..'
import { PreferenceParser } from '../classes/preference-parser'
import { globalContext } from '../internal/global-context'

function getHistoryPath() {
  const configDirectory = PreferenceParser.get('configDirectory')
  return join(configDirectory, 'history.json')
}

export async function getHistory() {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const historyPath = getHistoryPath()
  try {
    const historyBlob = await globalContext.fileSystem.getContent(historyPath)
    const historyContent = await historyBlob.text()
    const history = JSON.parse(historyContent)
    return history || { items: [] }
  } catch (error) {
    console.warn(error)
    return { items: [] }
  }
}

export async function addHistoryItem(rom: Rom) {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const romDirectory = PreferenceParser.get('romDirectory')
  let relativePath = ''
  if (rom.fileAccessor.path?.startsWith(romDirectory)) {
    relativePath = isAbsolute(rom.fileAccessor.path)
      ? relative(romDirectory, rom.fileAccessor.path)
      : rom.fileAccessor.path
  }
  if (!relativePath) {
    return
  }

  const historyPath = getHistoryPath()
  const history = await getHistory()
  const historyItem = { name: rom.name, relativePath, lastPlayedDate: Date.now(), playedTimes: 1 }

  const playedItem = find(history.items, { relativePath })
  if (playedItem) {
    historyItem.playedTimes += 1
    remove(history.items, { relativePath })
  }

  history.items.unshift(historyItem)
  const historyContent = JSON.stringify(history, null, 2)

  const file = new Blob([historyContent], { type: 'application/json' })
  globalContext.fileSystem?.create({ path: historyPath, file })
}
