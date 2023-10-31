import { DialogClose } from '@radix-ui/react-dialog'
import { BaseButton } from '../../../../../../primitives/base-button'
import { KeyboardMapping } from '../keyboard-mapping'

export function ConfigKeyboardDialogContent() {
  return (
    <div>
      <KeyboardMapping />

      <div className='flex-center mt-8 gap-5'>
        <DialogClose asChild>
          <BaseButton className='autofocus' styleType='primary'>
            <span className='icon-[mdi--close] h-5 w-5' />
            Close
          </BaseButton>
        </DialogClose>
      </div>
    </div>
  )
}
