import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BaseDialogTrigger } from '../../../../../../primitives/base-dialog-trigger'
import { TopBarButton } from '../top-bar-button'
import { ConfigGamepadDialogContent } from './config-gamepad-dialog-content'

export function ConfigGamepadButton() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  function onOpenChange(open) {
    setOpen(open)
  }

  return (
    <BaseDialogTrigger
      closableByGamepadCancel={false}
      content={<ConfigGamepadDialogContent />}
      onOpenChange={onOpenChange}
      open={open}
    >
      <TopBarButton>
        <div className='flex items-center gap-2 px-4'>
          <span className='icon-[mdi--controller] relative z-[1] size-8' />
          {t('Configure gamepads')}
        </div>
      </TopBarButton>
    </BaseDialogTrigger>
  )
}
