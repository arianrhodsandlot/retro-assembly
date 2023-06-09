import { useAtomValue, useSetAtom } from 'jotai'
import { system, ui } from '../../../core'
import { BaseButton } from '../primitives/base-button'
import { isInvalidDialogOpenAtom, onSetupAtom } from './atoms'

export function LocalButton() {
  const onSetup = useAtomValue(onSetupAtom)
  const setIsInvalidDialogOpen = useSetAtom(isInvalidDialogOpenAtom)

  async function selectLocalDirectory() {
    try {
      // @ts-expect-error `showDirectoryPicker` is not defined in ts's default declaration files
      const handle = await showDirectoryPicker({ mode: 'readwrite' })

      const isValid = await ui.validateRomsDirectory(handle)
      if (isValid) {
        await system.updateSettings({ fileSystem: 'local', directory: '', handle })
        onSetup?.()
      } else {
        setIsInvalidDialogOpen(true)
      }
    } catch {}
  }

  return (
    <BaseButton onClick={selectLocalDirectory}>
      <span className='icon-[mdi--desktop-classic] h-5 w-5' />
      select a local directory
    </BaseButton>
  )
}
