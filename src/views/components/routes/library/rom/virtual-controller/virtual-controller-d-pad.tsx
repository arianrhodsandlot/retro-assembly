import { VirtualButton } from './virtual-button'

export function VirtualControllerDPad() {
  return (
    <div className='flex flex-col items-center overflow-hidden rounded-full border-4 border-dashed border-white/50'>
      <div className='flex'>
        <div className='size-12 overflow-hidden border-4 border-dashed border-white/50'>
          <VirtualButton name='up,left' />
        </div>
        <div className='size-12 overflow-hidden'>
          <VirtualButton name='up' />
        </div>
        <div className='size-12 overflow-hidden border-4 border-dashed border-white/50'>
          <VirtualButton name='up,right' />
        </div>
      </div>

      <div className='flex'>
        <div className='size-12 overflow-hidden'>
          <VirtualButton name='left' />
        </div>
        <div className='size-12 overflow-hidden'>
          <VirtualButton />
        </div>
        <div className='size-12 overflow-hidden'>
          <VirtualButton name='right' />
        </div>
      </div>

      <div className='flex'>
        <div className='size-12 overflow-hidden border-4 border-dashed border-white/50'>
          <VirtualButton name='down,left' />
        </div>
        <div className='size-12 overflow-hidden '>
          <VirtualButton name='down' />
        </div>
        <div className='size-12 overflow-hidden border-4 border-dashed border-white/50'>
          <VirtualButton name='down,right' />
        </div>
      </div>
    </div>
  )
}
