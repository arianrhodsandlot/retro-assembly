import type { Emulator } from '../classes/emulator'
import type { FileSystemProvider } from '../classes/file-system-providers/file-system-provider'

export const globalContext: {
  emulator: Emulator | undefined
  fileSystem: FileSystemProvider | undefined
  isDemoRunning: boolean
} = {
  emulator: undefined,
  fileSystem: undefined,
  isDemoRunning: false,
}
