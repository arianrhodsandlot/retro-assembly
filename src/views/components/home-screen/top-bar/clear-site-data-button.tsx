import { clsx } from 'clsx'
import { useState } from 'react'
import { system } from '../../../../core'
import { emitter } from '../../../lib/emitter'
import { BaseDialogTrigger } from '../../primitives/base-dialog-trigger'
import { ClearSiteDataDialogContent } from './clear-site-data-dialog-content'

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

    if (system.isUsingLocal()) {
      confirmMessage =
        'The position of your selected directory will be cleared, while your ROMs and save states will be preserved.'
    } else if (system.isUsingOnedrive()) {
      confirmMessage =
        'Your login status to Microsoft OneDrive will be cleared, while your ROMs and save states will be preserved.'
    }

    setConfirmMessage(confirmMessage)
  }

  return (
    <BaseDialogTrigger
      content={<ClearSiteDataDialogContent onConfirm={onConfirm}>{confirmMessage}</ClearSiteDataDialogContent>}
      onOpenChange={onOpenChange}
      open={open}
    >
      <button
        className={clsx(
          'relative flex aspect-square h-full items-center justify-center transition-[color,background-color]',
          'hover:bg-red-800',
          'focus:bg-red-800'
        )}
      >
        <span className='icon-[mdi--power] relative z-[1] h-8 w-8' />
      </button>
    </BaseDialogTrigger>
  )
}
