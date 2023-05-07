import { type Emulator } from '../classes/emulator'
import { type FileSystemProvider } from '../classes/file-system-providers/file-system-provider'
import { Preference } from '../classes/preference'

const preference = new Preference()

export const globalInstances: {
  emulator: Emulator | undefined
  preference: Preference | undefined
  fileSystemProvider: FileSystemProvider | undefined
} = {
  emulator: undefined,
  preference,
  fileSystemProvider: undefined,
}
