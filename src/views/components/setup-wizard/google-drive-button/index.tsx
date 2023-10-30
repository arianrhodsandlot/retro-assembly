import { useAsync } from '@react-hookz/web'
import { useSetAtom } from 'jotai'
import { start, updatePreference, validateRomDirectory } from '../../../../core'
import { useRouterHelpers } from '../../home-screen/hooks'
import { BaseButton } from '../../primitives/base-button'
import { BaseDialogTrigger } from '../../primitives/base-dialog-trigger'
import { isInvalidDialogOpenAtom } from '../atoms'
import { GoogleDriveDirectoryPicker } from './google-drive-directory-picker'

export function GoogleDriveButton() {
  const setIsInvalidDialogOpen = useSetAtom(isInvalidDialogOpenAtom)
  const { navigateToLibrary } = useRouterHelpers()

  const [state, { execute: onSelect }] = useAsync(async (romDirectory: string) => {
    const isValid = await validateRomDirectory({ directory: romDirectory, type: 'google-drive' })

    if (isValid) {
      await updatePreference({ fileSystem: 'google-drive', directory: romDirectory })
      setIsInvalidDialogOpen(false)
      await start()
      navigateToLibrary('google-drive')
    } else {
      setIsInvalidDialogOpen(true)
    }
  })

  return (
    <BaseDialogTrigger
      content={
        <div className='w-80 max-w-full'>
          <GoogleDriveDirectoryPicker isValidating={state.status === 'loading'} onSelect={onSelect} />
        </div>
      }
    >
      <BaseButton styleType='primary'>
        <span className='icon-[logos--google-drive] h-5 w-5' />
        Google Drive
      </BaseButton>
    </BaseDialogTrigger>
  )
}
