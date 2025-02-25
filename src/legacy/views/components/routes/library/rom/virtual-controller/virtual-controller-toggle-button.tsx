import { useAtom } from 'jotai'
import { hideButtonsAtom } from './atoms'
import { VirtualButton } from './virtual-button'

export function VirtualControllerToggleButton() {
  const [hideButtons, setHideButtonsAtom] = useAtom(hideButtonsAtom)

  return (
    <VirtualButton onTap={() => setHideButtonsAtom(!hideButtons)}>
      <span className='icon-[mdi--controller] size-6' />
    </VirtualButton>
  )
}
