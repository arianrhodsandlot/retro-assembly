import { emitter } from '../../lib/emitter'
import { BaseButton } from '../primitives/base-button'

export function ReturnToHomeButton() {
  return (
    <BaseButton onClick={() => emitter.emit('reload')}>
      <span className='icon-[mdi--home] h-6 w-6 text-rose-700' />
      Return to home page
    </BaseButton>
  )
}
