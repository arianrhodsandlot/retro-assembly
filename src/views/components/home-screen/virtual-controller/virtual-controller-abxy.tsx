import { VirtualButton } from './virtual-button'

export function VirtualControllerABXY() {
  return (
    <div className='relative left-1 flex h-48 w-48 flex-col items-center overflow-hidden'>
      <div className='absolute left-14 top-0 h-20 w-20 p-1'>
        <div className='h-full w-full overflow-hidden rounded-full border-4 border-dashed border-white/50'>
          <VirtualButton name='x' />
        </div>
      </div>
      <div className='absolute left-0 top-14 h-20 w-20 p-1'>
        <div className='h-full w-full overflow-hidden rounded-full border-4 border-dashed border-white/50'>
          <VirtualButton name='y' />
        </div>
      </div>
      <div className='absolute right-0 top-14 h-20 w-20 p-1'>
        <div className='h-full w-full overflow-hidden rounded-full border-4 border-dashed border-white/50'>
          <VirtualButton name='a' />
        </div>
      </div>
      <div className='absolute bottom-0 left-14 h-20 w-20 p-1'>
        <div className='h-full w-full overflow-hidden rounded-full border-4 border-dashed border-white/50'>
          <VirtualButton name='b' />
        </div>
      </div>
    </div>
  )
}
