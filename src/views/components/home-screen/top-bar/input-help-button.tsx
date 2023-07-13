import { useState } from 'react'
import { BaseDialogTrigger } from '../../primitives/base-dialog-trigger'
import { InputHelpDialogContent } from './input-help-dialog-content'
import { TopBarButton } from './top-bar-button'

export function InputHelpButton() {
  const [open, setOpen] = useState(false)

  function onOpenChange(open) {
    setOpen(open)
  }

  return (
    <BaseDialogTrigger content={<InputHelpDialogContent />} onOpenChange={onOpenChange} open={open}>
      <TopBarButton className='flex aspect-square items-center justify-center'>
        <span className='icon-[mdi--help-circle-outline] relative z-[1] h-8 w-8' />
      </TopBarButton>
    </BaseDialogTrigger>
  )
}
