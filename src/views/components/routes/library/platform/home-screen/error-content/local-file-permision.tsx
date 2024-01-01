import { useTranslation } from 'react-i18next'
import { grantLocalPermission } from '../../../../../../../core'
import { ReturnToHomeButton } from '../../../../../common/return-to-home-button'
import { BaseButton } from '../../../../../primitives/base-button'

export function LocalFilePermision({ onSolve }: { onSolve: () => void }) {
  const { t } = useTranslation()
  async function grant() {
    try {
      await grantLocalPermission()
      onSolve()
    } catch {}
  }

  return (
    <div className='w-80 max-w-full'>
      <div className='flex items-center text-lg font-bold'>
        <span className='icon-[mdi--alert] mr-2 h-5 w-5 text-yellow-400' />
        <h3>{t('Local file permission is needed')}</h3>
      </div>
      <div className='mt-4 flex flex-col items-stretch justify-center px-10'>
        <BaseButton onClick={grant} styleType='primary'>
          <span className='icon-[mdi--folder-open] h-5 w-5' />
          {t('Grant permission')}
        </BaseButton>
        <div className='mb-4 mt-2 flex gap-1 text-xs text-rose-700'>
          <span className='icon-[mdi--information-outline] h-4 w-4 shrink-0' />
          <div>
            <div>
              {t(
                'We have to ask you to grant permission to read your ROMs again, even though you have already done this last time.',
              )}
            </div>
            <div className='mt-2'>{t('This is due to a restriction of the security policy of your browser.')}</div>
          </div>
        </div>
        <ReturnToHomeButton />
      </div>
    </div>
  )
}
