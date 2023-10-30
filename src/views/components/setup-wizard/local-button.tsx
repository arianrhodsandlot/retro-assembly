import { useSetAtom } from 'jotai'
import { start, updatePreference, validateRomDirectory } from '../../../core'
import { useRouterHelpers } from '../home-screen/hooks'
import { BaseButton } from '../primitives/base-button'
import { isInvalidDialogOpenAtom } from './atoms'

export function LocalButton() {
  const setIsInvalidDialogOpen = useSetAtom(isInvalidDialogOpenAtom)
  const { navigateToLibrary } = useRouterHelpers()

  async function selectLocalDirectory() {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' })

      const isValid = await validateRomDirectory({ type: 'local', handle })
      if (isValid) {
        await updatePreference({ fileSystem: 'local', directory: '', handle })
        setIsInvalidDialogOpen(false)
        await start()
        navigateToLibrary('local')
      } else {
        setIsInvalidDialogOpen(true)
      }
    } catch {}
  }

  return (
    <BaseButton className='w-60' onClick={selectLocalDirectory} styleType='primary'>
      <span className='icon-[flat-color-icons--opened-folder] h-5 w-5' />
      select a directory
    </BaseButton>
  )
}
