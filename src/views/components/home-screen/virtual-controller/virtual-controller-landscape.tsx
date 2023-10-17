import { VirtualButton } from './virtual-button'
import { VirtualControllerABXY } from './virtual-controller-abxy'
import { VirtualControllerDPad } from './virtual-controller-d-pad'

export function VirtualControllerLandscape({ onTapMenuButton }: { onTapMenuButton: () => void }) {
  return (
    <div className='fixed inset-0 z-[11] flex w-full flex-col px-10 py-10 portrait:hidden landscape:flex'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-4'>
          <div className='h-12 w-20 overflow-hidden rounded-md border-4 border-dashed border-white/50'>
            <VirtualButton name='l2' showText />
          </div>
          <div className='h-12 w-20 overflow-hidden rounded-md border-4 border-dashed border-white/50'>
            <VirtualButton name='l' showText />
          </div>
        </div>

        <div className='flex flex-1 items-center justify-center gap-4'>
          <div className='h-8 w-20 overflow-hidden rounded-md border-4 border-dashed border-white/50'>
            <VirtualButton name='select' showText />
          </div>

          <div className='h-12 w-12 overflow-hidden rounded-full border-4 border-dashed border-white/50'>
            <VirtualButton onTap={onTapMenuButton} showText />
          </div>

          <div className='h-8 w-20 overflow-hidden rounded-md border-4 border-dashed border-white/50'>
            <VirtualButton name='start' showText />
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <div className='h-12 w-20 overflow-hidden rounded-md border-4 border-dashed border-white/50'>
            <VirtualButton name='r2' showText />
          </div>
          <div className='h-12 w-20 overflow-hidden rounded-md border-4 border-dashed border-white/50'>
            <VirtualButton name='r' showText />
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
