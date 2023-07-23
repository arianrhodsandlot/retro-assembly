import { useState } from 'react'
import { BaseDialogTrigger } from '../../primitives/base-dialog-trigger'
import { InputHelpDialogContent } from './input-help-dialog-content'
import { TopBarButton } from './top-bar-button'

export function InputHelpButton() {
  const [open, setOpen] = useState(false)

  function onOpenChange(open: boolean) {
    setOpen(open)
  }

  return (
    <BaseDialogTrigger content={<InputHelpDialogContent />} onOpenChange={onOpenChange} open={open}>
      <TopBarButton>
        <div className='flex items-center gap-2 px-4'>
          <span className='icon-[mdi--help-circle-outline] relative z-[1] h-8 w-8' />
          Input help
        </div>
      </TopBarButton>
    </BaseDialogTrigger>
  )
}
