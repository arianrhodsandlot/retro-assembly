import { useTranslation } from 'react-i18next'
import { useGamepads } from './hooks/use-gamepads'

export function InputTipsContent() {
  const { t } = useTranslation()
  const { connected } = useGamepads()

  if (!connected) {
    return
  }

  return (
    <div className='flex gap-3 bg-black/90 px-4 py-2 font-["Noto_Mono",ui-monospace,monospace] text-sm text-white shadow shadow-black'>
      <div className='flex-center gap-2'>
        <kbd className='icon-[mdi--gamepad] h-4 w-4' />
        {t('Move')}
      </div>

      <div className='flex-center gap-2'>
        <kbd className='icon-[mdi--gamepad-circle-right] h-4 w-4' />
        {t('Confirm')}
      </div>

      <div className='flex-center gap-2'>
        <kbd className='icon-[mdi--gamepad-circle-down] h-4 w-4' />
        {t('Cancle')}
      </div>
    </div>
  )
}
