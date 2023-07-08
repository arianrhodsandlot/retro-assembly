import { useState } from 'react'
import { isUsingLocal, isUsingOnedrive } from '../../../../core'
import { isUsingGoogleDrive } from '../../../../core/exposed/is-using-google-drive'
import { emitter } from '../../../lib/emitter'
import { BaseDialogTrigger } from '../../primitives/base-dialog-trigger'
import { ClearSiteDataDialogContent } from './clear-site-data-dialog-content'
import { TopBarButton } from './top-bar-button'

export function ClearSiteDataButton() {
  const [confirmMessage, setConfirmMessage] = useState('')
  const [open, setOpen] = useState(false)

  function onConfirm() {
    emitter.emit('reload')
    setOpen(false)
  }

  function onOpenChange(open) {
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
    }

    setConfirmMessage(confirmMessage)
  }

  return (
    <BaseDialogTrigger
      content={<ClearSiteDataDialogContent onConfirm={onConfirm}>{confirmMessage}</ClearSiteDataDialogContent>}
      onOpenChange={onOpenChange}
      open={open}
    >
      <TopBarButton className='flex aspect-square items-center justify-center'>
        <span className='icon-[mdi--power] relative z-[1] h-8 w-8' />
      </TopBarButton>
    </BaseDialogTrigger>
  )
}
