import { type Emulator } from '../classes/emulator'
import { type FileSystemProvider } from '../classes/file-system-providers/file-system-provider'

export const globalContext: {
  emulator: Emulator | undefined
  fileSystem: FileSystemProvider | undefined
} = {
  emulator: undefined,
  fileSystem: undefined,
}
