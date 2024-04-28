import { DialogClose } from '@radix-ui/react-dialog'
import { useTranslation } from 'react-i18next'
import { BaseButton } from '../../../../../../primitives/base-button'
import { GamepadMapping } from '../gamepad-mapping'

export function ConfigGamepadDialogContent() {
  const { t } = useTranslation()

  return (
    <div>
      <GamepadMapping />

      <div className='flex-center mt-8 gap-5'>
        <DialogClose asChild>
          <BaseButton styleType='primary'>
            <span className='icon-[mdi--close] size-5' />
            {t('Close')}
          </BaseButton>
        </DialogClose>
      </div>
    </div>
  )
}
