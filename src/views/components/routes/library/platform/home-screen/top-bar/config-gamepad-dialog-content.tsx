import { DialogClose } from '@radix-ui/react-dialog'
import { BaseButton } from '../../../../../primitives/base-button'
import { GamepadMapping } from './gamepad-mapping'

export function ConfigGamepadDialogContent() {
  return (
    <div>
      <GamepadMapping />

      <div className='flex-center mt-8 gap-5'>
        <DialogClose asChild>
          <BaseButton styleType='primary'>
            <span className='icon-[mdi--close] h-5 w-5' />
            Close
          </BaseButton>
        </DialogClose>
      </div>
    </div>
  )
}
