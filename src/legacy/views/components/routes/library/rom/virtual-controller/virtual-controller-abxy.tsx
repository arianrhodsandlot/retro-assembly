import { VirtualButton } from './virtual-button'

export function VirtualControllerABXY() {
  return (
    <div className='relative left-1 flex size-48 flex-col items-center overflow-hidden'>
      <div className='absolute left-14 top-0 size-20 p-1'>
        <div className='size-full overflow-hidden rounded-full border-4 border-dashed border-white/50'>
          <VirtualButton name='x' />
        </div>
      </div>
      <div className='absolute left-0 top-14 size-20 p-1'>
        <div className='size-full overflow-hidden rounded-full border-4 border-dashed border-white/50'>
          <VirtualButton name='y' />
        </div>
      </div>
      <div className='absolute right-0 top-14 size-20 p-1'>
        <div className='size-full overflow-hidden rounded-full border-4 border-dashed border-white/50'>
          <VirtualButton name='a' />
        </div>
      </div>
      <div className='absolute bottom-0 left-14 size-20 p-1'>
        <div className='size-full overflow-hidden rounded-full border-4 border-dashed border-white/50'>
          <VirtualButton name='b' />
        </div>
      </div>
    </div>
  )
}
