import { DialogClose } from '@radix-ui/react-dialog'
import { GamepadMapping } from '../../common/gamepad-mapping'
import { BaseButton } from '../../primitives/base-button'

export function ConfigGamepadDialogContent() {
  return (
    <div>
      <GamepadMapping />

      <div className='mt-8 flex items-center justify-center gap-5'>
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
