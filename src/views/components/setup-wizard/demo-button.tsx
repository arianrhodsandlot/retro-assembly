import { useAtomValue } from 'jotai'
import { updatePreference } from '../../../core'
import { BaseButton } from '../primitives/base-button'
import { onSetupAtom } from './atoms'

export function DemoButton() {
  const onSetup = useAtomValue(onSetupAtom)

  async function tryDemo() {
    await updatePreference({ fileSystem: 'demo', directory: '' })
    onSetup?.()
  }

  return (
    <BaseButton className='w-full px-20 py-4 text-lg font-semibold sm:w-auto' onClick={tryDemo}>
      <span className='icon-[mdi--gamepad-square] h-8 w-8' />
      Try demo
    </BaseButton>
  )
}
