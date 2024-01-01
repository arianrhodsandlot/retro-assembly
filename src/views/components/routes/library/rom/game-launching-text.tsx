import { useTranslation } from 'react-i18next'
import { BouncingEllipsis } from '../../../common/bouncing-ellipsis'
import { LoadingScreen } from '../../../common/loading-screen'

export function GameLaunchingText() {
  const { t } = useTranslation()

  return (
    <div className='absolute inset-0 z-[11] select-none bg-black'>
      <LoadingScreen>
        {t('Loading')}
        <BouncingEllipsis />
      </LoadingScreen>
    </div>
  )
}
