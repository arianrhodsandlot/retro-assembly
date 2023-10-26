import { useTeardown } from '../hooks'
import { BaseButton } from '../primitives/base-button'

export function ReturnToHomeButton() {
  const { teardown } = useTeardown()

  return (
    <BaseButton onClick={teardown}>
      <span className='icon-[mdi--home] h-6 w-6 text-rose-700' />
      Return to home page
    </BaseButton>
  )
}
