import { type Emulator } from '../classes/emulator'
import { type FileSystemProvider } from '../classes/file-system-providers/file-system-provider'
import { type Preference } from '../classes/preference'
import { preference } from '../helpers/preference'

export const globalInstances: {
  emulator: Emulator | undefined
  preference: Preference
  fileSystemProvider: FileSystemProvider | undefined
} = {
  emulator: undefined,
  preference,
  fileSystemProvider: undefined,
}
