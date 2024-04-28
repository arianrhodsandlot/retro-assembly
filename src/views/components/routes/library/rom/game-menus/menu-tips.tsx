import { useTranslation } from 'react-i18next'
import { isUsingDemo } from '../../../../../../core'
import { LightInputButton } from '../../../../common/light-input-button'
import { isTouchDevice } from '../../lib/utils'
import { useGamepads } from '../../platform/home-screen/input-tips/hooks/use-gamepads'

export function MenuTips() {
  const { t } = useTranslation()
  const { connected } = useGamepads()
  const usingDemo = isUsingDemo()

  return (
    <div className='flex gap-3 px-10 pb-10 sm:absolute sm:bottom-0 sm:right-0'>
      <span className='icon-[mdi--lightbulb-on-outline] mt-1 size-4 shrink-0' />
      <div>
        {usingDemo ? (
          <div className='flex items-center gap-2'>
            {t('Some actions are not available while playing the public library.')}
          </div>
        ) : null}
        {connected ? (
          <>
            <div className='flex items-center gap-2'>
              {t('Press')}
              <LightInputButton>L1</LightInputButton>+<LightInputButton>R1</LightInputButton>
              {t('or')}
              <LightInputButton>ESC</LightInputButton>
              {t('to open/hide this menu.')}
            </div>
            <div className='flex items-center gap-2'>
              {t('Press')}
              <LightInputButton>select</LightInputButton>+<LightInputButton>L2</LightInputButton>
              {t('to rewind while playing.')}
            </div>
          </>
        ) : (isTouchDevice() ? null : (
          <div className='flex items-center gap-2'>
            {t('Press')} <LightInputButton>ESC</LightInputButton>
            {t('to open/hide this menu.')}
          </div>
        ))}
      </div>
    </div>
  )
}
