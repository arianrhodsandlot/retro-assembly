import type { Emulator } from '../classes/emulator'
import type { FileSystemProvider } from '../classes/file-system-providers/file-system-provider'

export const globalContext: {
  isDemoRunning: boolean
  emulator: Emulator | undefined
  fileSystem: FileSystemProvider | undefined
} = {
  isDemoRunning: false,
  emulator: undefined,
  fileSystem: undefined,
}
