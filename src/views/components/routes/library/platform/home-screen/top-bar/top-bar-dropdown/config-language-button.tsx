import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BaseDialogTrigger } from '../../../../../../primitives/base-dialog-trigger'
import { TopBarButton } from '../top-bar-button'
import { ConfigLanguageDialogContent } from './config-language-dialog-content'

export function ConfigLanguageButton() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  function onOpenChange(open) {
    setOpen(open)
  }

  return (
    <BaseDialogTrigger content={<ConfigLanguageDialogContent />} onOpenChange={onOpenChange} open={open}>
      <TopBarButton>
        <div className='flex items-center gap-2 px-4'>
          <span className='icon-[mdi--translate-variant] relative z-[1] size-8' />
          {t('Language')}
        </div>
      </TopBarButton>
    </BaseDialogTrigger>
  )
}
