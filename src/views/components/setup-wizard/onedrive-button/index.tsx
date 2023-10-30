import { useAsync } from '@react-hookz/web'
import { useSetAtom } from 'jotai'
import { start, updatePreference, validateRomDirectory } from '../../../../core'
import { useRouterHelpers } from '../../home-screen/hooks'
import { BaseButton } from '../../primitives/base-button'
import { BaseDialogTrigger } from '../../primitives/base-dialog-trigger'
import { isInvalidDialogOpenAtom } from '../atoms'
import { OnedriveDirectoryPicker } from './onedrive-directory-picker'

export function OnedriveButton() {
  const setIsInvalidDialogOpen = useSetAtom(isInvalidDialogOpenAtom)
  const { navigateToLibrary } = useRouterHelpers()

  const [state, { execute: onSelect }] = useAsync(async (romDirectory: string) => {
    const isValid = await validateRomDirectory({ directory: romDirectory, type: 'onedrive' })

    if (isValid) {
      await updatePreference({ fileSystem: 'onedrive', directory: romDirectory })
      await start()
      navigateToLibrary('onedrive')
    } else {
      setIsInvalidDialogOpen(true)
    }
  })

  return (
    <BaseDialogTrigger
      content={
        <div className='w-96 max-w-full'>
          <OnedriveDirectoryPicker isValidating={state.status === 'loading'} onSelect={onSelect} />
        </div>
      }
    >
      <BaseButton data-testid='select-onedrive-directory' styleType='primary'>
        <span className='icon-[logos--microsoft-onedrive] h-5 w-5' />
        OneDrive
      </BaseButton>
    </BaseDialogTrigger>
  )
}
