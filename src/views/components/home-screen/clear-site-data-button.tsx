import { clsx } from 'clsx'
import { useStore } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { system } from '../../../core'
import { needsValidateSystemConfigAtom } from '../../lib/atoms'
import { Modal } from '../modals/modal'

export function ClearSiteDataButton() {
  const store = useStore()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
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

  function openModal() {
    setShowConfirmModal(true)
    updateSetConfirmMessage()
  }

  function cancel() {
    setShowConfirmModal(false)
  }

  async function confirm() {
    await system.clearData()
    store.set(needsValidateSystemConfigAtom, true)
  }

  useEffect(() => {
    if (showConfirmModal) {
      cancelButtonRef.current?.focus()
    }
  }, [showConfirmModal])

  return (
    <>
      <button
        className={clsx(
          'relative rounded-md p-2 transition-[color,background-color]',
          'focus:text-red-600',
          'focus:after:absolute focus:after:inset-0 focus:after:animate-pulse focus:after:rounded-full focus:after:bg-white'
        )}
        onClick={openModal}
      >
        <span className='icon-[mdi--power] relative z-[1] h-8 w-8' />
      </button>

      <Modal isOpen={showConfirmModal} onClickBackdrop={cancel} style={{ width: '400px', height: 'auto' }}>
        <div className='p-6'>
          <div>
            <div className='text-lg'>Are you sure to clear all data?</div>
            <div className='mt-4'>{confirmMessage}</div>
          </div>
          <div className='mt-8 flex items-center justify-center gap-5'>
            <button
              className='rounded border-2 border-red-600 bg-red-600 px-4 py-2 text-white focus:animate-pulse'
              onClick={confirm}
            >
              Confirm
            </button>
            <button
              className='rounded border-2 border-red-600 bg-white px-4 py-2 text-red-600 focus:animate-pulse'
              onClick={cancel}
              ref={cancelButtonRef}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
