import { useAtomValue } from 'jotai'
import { hideButtonsAtom } from './atoms'
import { VirtualButton } from './virtual-button'
import { VirtualControllerABXY } from './virtual-controller-abxy'
import { VirtualControllerDPad } from './virtual-controller-d-pad'
import { VirtualControllerMenuButton } from './virtual-controller-menu-button'
import { VirtualControllerToggleButton } from './virtual-controller-toggle-button'

export function VirtualControllerPortrait() {
  const hideButtons = useAtomValue(hideButtonsAtom)

  if (hideButtons) {
    return (
      <div className='fixed inset-0 z-[11] flex w-full justify-end px-10 py-10 portrait:flex landscape:hidden'>
        <div className='h-12 w-12 overflow-hidden rounded-full border-4 border-dashed border-white/50'>
          <VirtualControllerToggleButton />
        </div>
      </div>
    )
  }

  return (
    <div className='fixed inset-0 z-[11] flex w-full flex-col px-2 py-10 portrait:flex landscape:hidden'>
      <div className='flex items-end justify-between gap-10'>
        <div className='h-8 w-20 overflow-hidden rounded-md border-4 border-dashed border-white/50'>
          <VirtualButton name='select'>
            <span className='icon-[mdi--minus-thick] h-6 w-6' />
          </VirtualButton>
        </div>
        <div className='h-12 w-12 overflow-hidden rounded-full border-4 border-dashed border-white/50'>
          <VirtualControllerMenuButton />
        </div>
        <div className='h-12 w-12 overflow-hidden rounded-full border-4 border-dashed border-white/50'>
          <VirtualControllerToggleButton />
        </div>
        <div className='h-8 w-20 overflow-hidden rounded-md border-4 border-dashed border-white/50'>
          <VirtualButton name='start'>
            <span className='icon-[mdi--play] h-6 w-6' />
          </VirtualButton>
        </div>
      </div>

      <div className='mt-4 flex items-center justify-between'>
        <div className='flex flex-col gap-4'>
          <div className='h-12 w-20 overflow-hidden rounded-md border-4 border-dashed border-white/50'>
            <VirtualButton name='l2'>l2</VirtualButton>
          </div>
          <div className='h-12 w-20 overflow-hidden rounded-md border-4 border-dashed border-white/50'>
            <VirtualButton name='l'>l</VirtualButton>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='h-12 w-20 overflow-hidden rounded-md border-4 border-dashed border-white/50'>
            <VirtualButton name='r2'>r2</VirtualButton>
          </div>
          <div className='h-12 w-20 overflow-hidden rounded-md border-4 border-dashed border-white/50'>
            <VirtualButton name='r'>r</VirtualButton>
          </div>
        </div>
      </div>

      <div className='flex-1' />

      <div className='flex w-full items-center justify-between'>
        <VirtualControllerDPad />
        <VirtualControllerABXY />
      </div>
    </div>
  )
}
