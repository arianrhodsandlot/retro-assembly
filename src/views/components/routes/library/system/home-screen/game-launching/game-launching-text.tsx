import { BouncingEllipsis } from '../../../../../common/bouncing-ellipsis'
import { LoadingScreen } from '../../../../../common/loading-screen'

export function GameLaunchingText() {
  return (
    <div className='absolute inset-0 z-[11] select-none bg-black'>
      <LoadingScreen>
        Now loading
        <BouncingEllipsis />
      </LoadingScreen>
    </div>
  )
}
