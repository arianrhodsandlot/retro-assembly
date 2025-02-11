import { DialogClose } from '@radix-ui/react-dialog'
import { type ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isUsingDemo } from '../../../../../../../../core'
import { BaseButton } from '../../../../../../primitives/base-button'

export function ClearSiteDataDialogContent({ children, onConfirm }: { children: ReactNode; onConfirm: () => void }) {
  const { t } = useTranslation()

  useEffect(() => {
    if (isUsingDemo()) {
      onConfirm()
    }
  }, [onConfirm])

  return (
    <div className='w-96'>
      <div>
        <div className='flex items-center text-lg font-bold'>
          <span className='icon-[mdi--alert] mr-2 size-5 text-yellow-400' />
          {t('Are you sure to logout?')}
        </div>
        <div className='mt-4'>{children}</div>
      </div>
      <div className='flex-center mt-8 gap-5'>
        <BaseButton onClick={onConfirm} styleType='primary'>
          <span className='icon-[mdi--check] size-5' />
          {t('Confirm')}
        </BaseButton>
        <DialogClose asChild>
          <BaseButton>
            <span className='icon-[mdi--close] size-5' />
            {t('Cancel')}
          </BaseButton>
        </DialogClose>
      </div>
    </div>
  )
}
