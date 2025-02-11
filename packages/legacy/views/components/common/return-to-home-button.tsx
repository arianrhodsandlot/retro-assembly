import { useTranslation } from 'react-i18next'
import { useTeardown } from '../hooks/use-teardown'
import { BaseButton } from '../primitives/base-button'

export function ReturnToHomeButton() {
  const { t } = useTranslation()
  const { teardown } = useTeardown()

  return (
    <BaseButton onClick={teardown}>
      <span className='icon-[mdi--home] size-6 text-rose-700' />
      {t('Return home')}
    </BaseButton>
  )
}
