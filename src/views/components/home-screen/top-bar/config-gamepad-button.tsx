import { useState } from 'react'
import { BaseDialogTrigger } from '../../primitives/base-dialog-trigger'
import { ConfigGamepadDialogContent } from './config-gamepad-dialog-content'
import { TopBarButton } from './top-bar-button'

export function ConfigGamepadButton() {
  const [open, setOpen] = useState(false)

  function onOpenChange(open) {
    setOpen(open)
  }

  return (
    <BaseDialogTrigger content={<ConfigGamepadDialogContent />} onOpenChange={onOpenChange} open={open}>
      <TopBarButton className='flex aspect-square items-center justify-center'>
        <span className='icon-[mdi--controller] relative z-[1] h-8 w-8' />
      </TopBarButton>
    </BaseDialogTrigger>
  )
}
