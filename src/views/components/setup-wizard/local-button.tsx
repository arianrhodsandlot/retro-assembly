import { useAtomValue } from 'jotai'
import { system } from '../../../core'
import { BaseButton } from '../primitives/base-button'
import { onSetupAtom } from './atoms'

export function LocalButton() {
  const onSetup = useAtomValue(onSetupAtom)

  async function selectLocalDirectory() {
    try {
      // @ts-expect-error `showDirectoryPicker` is not defined in ts's default declaration files
      const handle = await showDirectoryPicker({ mode: 'readwrite' })
      await system.updateSettings({ fileSystem: 'local', directory: '', handle })
      onSetup?.()
    } catch {}
  }

  return (
    <BaseButton onClick={selectLocalDirectory}>
      <span className='icon-[mdi--desktop-classic] h-5 w-5' />
      select a local directory
    </BaseButton>
  )
}
