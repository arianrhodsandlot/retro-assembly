import { useAtomValue, useSetAtom } from 'jotai'
import { useAsyncFn } from 'react-use'
import { updatePreference, validateRomDirectory } from '../../../../core'
import { BaseButton } from '../../primitives/base-button'
import { BaseDialogTrigger } from '../../primitives/base-dialog-trigger'
import { isInvalidDialogOpenAtom, onSetupAtom } from '../atoms'
import { DropboxDirectoryPicker } from './dropbox-directory-picker'

export function DropboxButton() {
  const onSetup = useAtomValue(onSetupAtom)
  const setIsInvalidDialogOpen = useSetAtom(isInvalidDialogOpenAtom)

  const [state, onSelect] = useAsyncFn(
    async (romDirectory: string) => {
      const isValid = await validateRomDirectory({ directory: romDirectory, type: 'dropbox' })

      if (isValid) {
        await updatePreference({ fileSystem: 'dropbox', directory: romDirectory })
        onSetup?.()
        setIsInvalidDialogOpen(false)
      } else {
        setIsInvalidDialogOpen(true)
      }
    },
    [onSetup],
  )

  return (
    <BaseDialogTrigger
      content={
        <div className='w-96 max-w-full'>
          <DropboxDirectoryPicker isValidating={state.loading} onSelect={onSelect} />
        </div>
      }
    >
      <BaseButton styleType='primary'>
        <span className='icon-[logos--dropbox] h-5 w-5' />
        Dropbox
      </BaseButton>
    </BaseDialogTrigger>
  )
}
