import { isUsingDemo } from '../../../../../../core'
import { LightInputButton } from '../../../../common/light-input-button'
import { isTouchDevice } from '../../lib/utils'
import { useGamepads } from '../../platform/home-screen/input-tips/hooks/use-gamepads'

const demoTips = (
  <div className='flex items-center gap-2'>Some actions are not available while playing the public library.</div>
)

const controllerTips = (
  <>
    <div className='flex items-center gap-2'>
      Press<LightInputButton>L1</LightInputButton>+<LightInputButton>R1</LightInputButton>or
      <LightInputButton>ESC</LightInputButton>to open/hide this menu.
    </div>
    <div className='flex items-center gap-2'>
      Press<LightInputButton>select</LightInputButton>+<LightInputButton>L1</LightInputButton>to rewind while playing.
    </div>
  </>
)

const keyboardTips = (
  <div className='flex items-center gap-2'>
    Press <LightInputButton>ESC</LightInputButton>to open/hide this menu.
  </div>
)

export function MenuTips() {
  const { connected } = useGamepads()
  const usingDemo = isUsingDemo()

  return (
    <div className='absolute bottom-10 right-10 flex gap-3'>
      <span className='icon-[mdi--lightbulb-on-outline] mt-1 h-4 w-4' />
      <div>
        {usingDemo ? demoTips : null}
        {connected ? controllerTips : isTouchDevice() ? keyboardTips : null}
      </div>
    </div>
  )
}
