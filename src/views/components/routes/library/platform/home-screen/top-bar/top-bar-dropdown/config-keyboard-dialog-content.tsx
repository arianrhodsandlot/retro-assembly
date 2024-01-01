import { DialogClose } from '@radix-ui/react-dialog'
import { useTranslation } from 'react-i18next'
import { BaseButton } from '../../../../../../primitives/base-button'
import { KeyboardMapping } from '../keyboard-mapping'

export function ConfigKeyboardDialogContent() {
  const { t } = useTranslation()

  return (
    <div>
      <KeyboardMapping />

      <div className='flex-center mt-8 gap-5'>
        <DialogClose asChild>
          <BaseButton className='autofocus' styleType='primary'>
            <span className='icon-[mdi--close] h-5 w-5' />
            {t('Close')}
          </BaseButton>
        </DialogClose>
      </div>
    </div>
  )
}
