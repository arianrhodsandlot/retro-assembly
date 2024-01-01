import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BaseDialogTrigger } from '../../../../../../primitives/base-dialog-trigger'
import { TopBarButton } from '../top-bar-button'
import { ConfigKeyboardDialogContent } from './config-keyboard-dialog-content'

export function ConfigKeyboardButton() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  function onOpenChange(open) {
    setOpen(open)
  }

  return (
    <BaseDialogTrigger content={<ConfigKeyboardDialogContent />} onOpenChange={onOpenChange} open={open}>
      <TopBarButton>
        <div className='flex items-center gap-2 px-4'>
          <span className='icon-[mdi--keyboard] relative z-[1] h-8 w-8' />
          {t('Configure Keyboards')}
        </div>
      </TopBarButton>
    </BaseDialogTrigger>
  )
}
