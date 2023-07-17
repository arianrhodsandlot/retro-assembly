import { Emulator } from '../classes/emulator'
import { DummyProvider } from '../classes/file-system-providers/dummy-provider'
import { FileAccessor } from '../classes/file-system-providers/file-accessor'
import { Rom } from '../classes/rom'
import { globalContext } from '../internal/global-context'
import { exitGame } from './exit-game'

export async function previewGame(
  file: File,
  { waitForUserInteraction }: { waitForUserInteraction?: () => Promise<void> } = {},
) {
  globalContext.fileSystem = new DummyProvider(file)
  try {
    exitGame()
  } catch {}

  const fileAccessor = new FileAccessor({
    name: file.name,
    directory: '',
    type: 'file',
    fileSystemProvider: globalContext.fileSystem,
  })
  await fileAccessor.getBlob()
  const rom = Rom.fromFileAccessor(fileAccessor)
  const emulator = new Emulator({ rom })
  globalContext.emulator = emulator
  await emulator.launch(waitForUserInteraction)
}
