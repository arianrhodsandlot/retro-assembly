import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BaseDialogTrigger } from '../../../../../../primitives/base-dialog-trigger'
import { TopBarButton } from '../top-bar-button'
import { InputHelpDialogContent } from './input-help-dialog-content'

export function InputHelpButton() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  function onOpenChange(open: boolean) {
    setOpen(open)
  }

  return (
    <BaseDialogTrigger content={<InputHelpDialogContent />} onOpenChange={onOpenChange} open={open}>
      <TopBarButton>
        <div className='flex items-center gap-2 px-4'>
          <span className='icon-[mdi--help-circle-outline] relative z-[1] h-8 w-8' />
          {t('Input help')}
        </div>
      </TopBarButton>
    </BaseDialogTrigger>
  )
}
