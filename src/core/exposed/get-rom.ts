import { join } from 'path-browserify'
import { FileAccessor } from '../classes/file-system-providers/file-accessor'
import { PreferenceParser } from '../classes/preference-parser'
import { Rom } from '../classes/rom'
import { globalContext } from '../internal/global-context'

export function getRom({ platform, rom }) {
  const { fileSystem } = globalContext
  if (!fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const romDirectory = PreferenceParser.get('romDirectory')
  const directory = join(romDirectory, platform)

  const fileAccessor = new FileAccessor({
    directory,
    fileSystemProvider: fileSystem,
    name: rom,
    type: 'file',
  })
  return Rom.fromFileAccessor(fileAccessor)
}
