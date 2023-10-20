import { useAsync } from '@react-hookz/web'
import { useAtomValue, useSetAtom } from 'jotai'
import { updatePreference, validateRomDirectory } from '../../../../core'
import { BaseButton } from '../../primitives/base-button'
import { BaseDialogTrigger } from '../../primitives/base-dialog-trigger'
import { isInvalidDialogOpenAtom, onSetupAtom } from '../atoms'
import { GoogleDriveDirectoryPicker } from './google-drive-directory-picker'

export function GoogleDriveButton() {
  const onSetup = useAtomValue(onSetupAtom)
  const setIsInvalidDialogOpen = useSetAtom(isInvalidDialogOpenAtom)

  const [state, { execute: onSelect }] = useAsync(async (romDirectory: string) => {
    const isValid = await validateRomDirectory({ directory: romDirectory, type: 'google-drive' })

    if (isValid) {
      await updatePreference({ fileSystem: 'google-drive', directory: romDirectory })
      onSetup?.()
      setIsInvalidDialogOpen(false)
    } else {
      setIsInvalidDialogOpen(true)
    }
  })

  return (
    <BaseDialogTrigger
      content={
        <div className='w-96 max-w-full'>
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
