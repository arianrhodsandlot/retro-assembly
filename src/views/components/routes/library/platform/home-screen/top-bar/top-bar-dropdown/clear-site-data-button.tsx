import { useState } from 'react'
import { isUsingDropbox, isUsingLocal, isUsingOnedrive } from '../../../../../../../../core'
import { isUsingGoogleDrive } from '../../../../../../../../core/exposed/is-using-google-drive'
import { useTeardown } from '../../../../../../hooks/use-teardown'
import { BaseDialogTrigger } from '../../../../../../primitives/base-dialog-trigger'
import { TopBarButton } from '../top-bar-button'
import { ClearSiteDataDialogContent } from './clear-site-data-dialog-content'

export function ClearSiteDataButton() {
  const { teardown } = useTeardown()
  const [confirmMessage, setConfirmMessage] = useState('')
  const [open, setOpen] = useState(false)

  function onConfirm() {
    teardown()
    setOpen(false)
  }

  function onOpenChange(open: boolean) {
    if (open) {
      updateSetConfirmMessage()
    }
    setOpen(open)
  }

  function updateSetConfirmMessage() {
    let confirmMessage = ''

    if (isUsingLocal()) {
      confirmMessage =
        'The position of your selected directory will be cleared, while your ROMs and save states will be preserved.'
    } else if (isUsingOnedrive()) {
      confirmMessage =
        'Your login status to Microsoft OneDrive will be cleared, while your ROMs and save states will be preserved.'
    } else if (isUsingGoogleDrive()) {
      confirmMessage =
        'Your login status to Google Drive will be cleared, while your ROMs and save states will be preserved.'
    } else if (isUsingDropbox()) {
      confirmMessage =
        'Your login status to Dropbox will be cleared, while your ROMs and save states will be preserved.'
    }

    setConfirmMessage(confirmMessage)
  }

  return (
    <BaseDialogTrigger
      content={<ClearSiteDataDialogContent onConfirm={onConfirm}>{confirmMessage}</ClearSiteDataDialogContent>}
      onOpenChange={onOpenChange}
      open={open}
    >
      <TopBarButton>
        <div className='flex items-center gap-2 px-4'>
          <span className='icon-[mdi--power] relative z-[1] h-8 w-8' />
          Logout
        </div>
      </TopBarButton>
    </BaseDialogTrigger>
  )
}
