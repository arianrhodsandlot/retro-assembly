import { dirname, join } from 'path-browserify'
import { FileAccessor } from '../classes/file-system-providers/file-accessor'
import { PreferenceParser } from '../classes/preference-parser'
import { Rom } from '../classes/rom'
import { getHistory } from '../helpers/history'
import { globalContext } from '../internal/global-context'

export async function getHistoryRoms() {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const fileSystemProvider = globalContext.fileSystem
  const history = await getHistory()
  const historyItems = history.items
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
