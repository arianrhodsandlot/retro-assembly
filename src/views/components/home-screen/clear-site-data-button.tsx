import { DialogClose } from '@radix-ui/react-dialog'
import { clsx } from 'clsx'
import { useStore } from 'jotai'
import { useState } from 'react'
import { system } from '../../../core'
import { needsValidateSystemConfigAtom } from '../../lib/atoms'
import { BaseButton } from '../primitives/button'
import { BaseDialog } from '../primitives/dialog'

export function ClearSiteDataButton() {
  const store = useStore()
  const [confirmMessage, setConfirmMessage] = useState('')

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

  async function clearData() {
    await system.clearData()
    store.set(needsValidateSystemConfigAtom, true)
  }

  const dialogContent = (
    <div className='w-96'>
      <div>
        <div className='flex items-center text-lg'>
          <span className='icon-[mdi--alert] mr-2 h-5 w-5 text-yellow-600' />
          Are you sure to clear all data?
        </div>
        <div className='mt-4'>{confirmMessage}</div>
      </div>
      <div className='mt-8 flex items-center justify-center gap-5'>
        <BaseButton onClick={clearData} styleType='primary'>
          <span className='icon-[mdi--check] h-5 w-5' />
          Confirm
        </BaseButton>
        <DialogClose asChild>
          <BaseButton>
            <span className='icon-[mdi--close] h-5 w-5' />
            Cancel
          </BaseButton>
        </DialogClose>
      </div>
    </div>
  )

  return (
    <BaseDialog content={dialogContent} onOpenChange={updateSetConfirmMessage}>
      <button
        className={clsx(
          'relative flex aspect-square h-full items-center justify-center transition-[color,background-color]',
          'hover:bg-red-800',
          'focus:bg-red-800'
        )}
      >
        <span className='icon-[mdi--power] relative z-[1] h-8 w-8' />
      </button>
    </BaseDialog>
  )
}
