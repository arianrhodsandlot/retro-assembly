import { start, updatePreference } from '../../../core'
import { BaseButton } from '../primitives/base-button'

async function tryDemo() {
  await updatePreference({ fileSystem: 'public', directory: '' })
  await start()
}

export function DemoButton() {
  return (
    <BaseButton className='w-full px-20 py-4 text-lg font-semibold sm:w-auto' onClick={tryDemo}>
      <span className='icon-[mdi--gamepad-square] h-8 w-8' />
      Try demo
    </BaseButton>
  )
}
