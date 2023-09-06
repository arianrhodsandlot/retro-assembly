import { find, remove } from 'lodash-es'
import { dirname, isAbsolute, join, relative } from 'path-browserify'
import { FileAccessor } from '../classes/file-system-providers/file-accessor'
import { PreferenceParser } from '../classes/preference-parser'
import { Rom } from '../classes/rom'
import { globalContext } from '../internal/global-context'

function getHistoryPath() {
  const configDirectory = PreferenceParser.get('configDirectory')
  return join(configDirectory, 'history.json')
}

function getEmptyHistory() {
  return { items: [] }
}

async function parseHistoryContent(blob?: Blob) {
  const emptyHistory = getEmptyHistory()
  if (!blob) {
    return
  }
  try {
    const historyContent = await blob.text()
    const history = JSON.parse(historyContent)
    return history || emptyHistory
  } catch (error) {
    console.warn(error)
    return emptyHistory
  }
}

export async function getHistory() {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  try {
    const historyBlob = await globalContext.fileSystem.getContentAndCache(getHistoryPath())
    return await parseHistoryContent(historyBlob)
  } catch (error) {
    console.warn(error)
    return getEmptyHistory()
  }
}

export async function peekHistory() {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  let historyBlob
  try {
    historyBlob = await globalContext.fileSystem.peekContent(getHistoryPath())
  } catch {}
  return await parseHistoryContent(historyBlob)
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
  const historyItem = { name: rom.fileAccessor.name, relativePath, lastPlayedDate: Date.now(), playedTimes: 1 }

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

export function historyToRom(history) {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }
  const fileSystemProvider = globalContext.fileSystem

  const historyItems = history?.items
  if (!historyItems) {
    return []
  }
  const romDirectory = PreferenceParser.get('romDirectory')
  const historyFileAccessors: FileAccessor[] = []
  for (const { relativePath, name } of historyItems) {
    if (relativePath) {
      const path = join(romDirectory, relativePath)
      const directory = dirname(path)
      const fileAccessor = new FileAccessor({ name, directory, type: 'file', fileSystemProvider })
      historyFileAccessors.push(fileAccessor)
    }
  }

  return Rom.fromFileAccessors(historyFileAccessors)
}
