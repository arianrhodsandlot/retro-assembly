import { DialogClose } from '@radix-ui/react-dialog'
import { type ReactNode } from 'react'
import { BaseButton } from '../../primitives/base-button'

export function ClearSiteDataDialogContent({ children, onConfirm }: { children: ReactNode; onConfirm: () => void }) {
  return (
    <div className='w-96'>
      <div>
        <div className='flex items-center text-lg font-bold'>
          <span className='icon-[mdi--alert] mr-2 h-5 w-5 text-yellow-400' />
          Are you sure to clear all data?
        </div>
        <div className='mt-4'>{children}</div>
      </div>
      <div className='mt-8 flex items-center justify-center gap-5'>
        <BaseButton onClick={onConfirm} styleType='primary'>
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
}
