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
      Press<LightInputButton>select</LightInputButton>+<LightInputButton>L2</LightInputButton>to rewind while playing.
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
    <div className='flex gap-3 px-10 pb-10 sm:absolute sm:bottom-0 sm:right-0'>
      <span className='icon-[mdi--lightbulb-on-outline] mt-1 h-4 w-4 shrink-0' />
      <div>
        {usingDemo ? demoTips : null}
        {connected ? controllerTips : isTouchDevice() ? null : keyboardTips}
      </div>
    </div>
  )
}
