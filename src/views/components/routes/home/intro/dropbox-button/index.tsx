import { useAsync } from '@react-hookz/web'
import { useSetAtom } from 'jotai'
import { type ReactNode } from 'react'
import { start, updatePreference, validateRomDirectory } from '../../../../../../core'
import { useRouterHelpers } from '../../../../hooks/use-router-helpers'
import { BaseButton } from '../../../../primitives/base-button'
import { BaseDialogTrigger } from '../../../../primitives/base-dialog-trigger'
import { isInvalidDialogOpenAtom } from '../atoms'
import { DropboxDirectoryPicker } from './dropbox-directory-picker'

export function DropboxButton({ children }: { children?: ReactNode } = {}) {
  const setIsInvalidDialogOpen = useSetAtom(isInvalidDialogOpenAtom)
  const { navigateToLibrary } = useRouterHelpers()

  const [state, { execute: onSelect }] = useAsync(async (romDirectory: string) => {
    const isValid = await validateRomDirectory({ directory: romDirectory, type: 'dropbox' })

    if (isValid) {
      await updatePreference({ fileSystem: 'dropbox', directory: romDirectory })
      setIsInvalidDialogOpen(false)
      await start()
      navigateToLibrary('dropbox')
    } else {
      setIsInvalidDialogOpen(true)
    }
  })

  return (
    <BaseDialogTrigger
      content={
        <div className='w-80 max-w-full'>
          <DropboxDirectoryPicker isValidating={state.status === 'loading'} onSelect={onSelect} />
        </div>
      }
    >
      {children || (
        <BaseButton styleType='primary'>
          <span className='icon-[logos--dropbox] h-5 w-5' />
          Dropbox
        </BaseButton>
      )}
    </BaseDialogTrigger>
  )
}
