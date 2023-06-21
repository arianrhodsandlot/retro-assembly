import { useAtomValue, useSetAtom } from 'jotai'
import { updatePreference, validateRomDirectory } from '../../../core'
import { BaseButton } from '../primitives/base-button'
import { isInvalidDialogOpenAtom, onSetupAtom } from './atoms'

export function LocalButton() {
  const onSetup = useAtomValue(onSetupAtom)
  const setIsInvalidDialogOpen = useSetAtom(isInvalidDialogOpenAtom)

  async function selectLocalDirectory() {
    try {
      // @ts-expect-error `showDirectoryPicker` is not defined in ts's default declaration files
      const handle = await showDirectoryPicker({ mode: 'readwrite' })

      const isValid = await validateRomDirectory({ type: 'local', handle })
      if (isValid) {
        await updatePreference({ fileSystem: 'local', directory: '', handle })
        onSetup?.()
      } else {
        setIsInvalidDialogOpen(true)
      }
    } catch {}
  }

  return (
    <BaseButton className='w-60' onClick={selectLocalDirectory}>
      <span className='icon-[mdi--desktop-classic] h-5 w-5' />
      select a directory
    </BaseButton>
  )
}
