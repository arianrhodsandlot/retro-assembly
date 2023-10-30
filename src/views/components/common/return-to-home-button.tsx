import { useTeardown } from '../hooks/use-teardown'
import { BaseButton } from '../primitives/base-button'

export function ReturnToHomeButton() {
  const { teardown } = useTeardown()

  return (
    <BaseButton onClick={teardown}>
      <span className='icon-[mdi--home] h-6 w-6 text-rose-700' />
      Return home
    </BaseButton>
  )
}
