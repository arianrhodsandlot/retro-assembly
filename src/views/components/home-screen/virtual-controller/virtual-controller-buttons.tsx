import { useEffect, useState } from 'react'
import { VirtualButton } from './virtual-button'

export function VirtualControllerButtons() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    function toggleShow(event: TouchEvent) {
      if (!(event.target instanceof HTMLCanvasElement)) {
        return
      }

      const shouldToggle = [...event.touches].some(({ clientY }) => clientY < innerHeight / 2)
      if (shouldToggle) {
        setShow((value) => !value)
      }
    }

    document.body.addEventListener('touchstart', toggleShow)

    return () => {
      document.body.removeEventListener('touchstart', toggleShow)
    }
  }, [])

  if (!show) {
    return null
  }

  return (
    <div className='fixed bottom-0 z-[11] w-full px-4 pb-12'>
      <div className='flex w-full items-end justify-between'>
        <div className='flex flex-col items-center'>
          <div className='h-12 w-12 overflow-hidden rounded-t-md bg-white/50'>
            <VirtualButton name='up' />
          </div>
          <div className='flex'>
            <div className='h-12 w-12 overflow-hidden rounded-l-md bg-white/50'>
              <VirtualButton name='left' />
            </div>
            <div className='h-12 w-12 overflow-hidden bg-white/50' />
            <div className='h-12 w-12 overflow-hidden rounded-r-md bg-white/50'>
              <VirtualButton name='right' />
            </div>
          </div>
          <div className='h-12 w-12 overflow-hidden rounded-b-md bg-white/50'>
            <VirtualButton name='down' />
          </div>
        </div>

        <div className='flex flex-col items-center'>
          <div className='h-14 w-14 overflow-hidden rounded-full bg-white/50'>
            <VirtualButton name='x' />
          </div>
          <div className='flex'>
            <div className='h-14 w-14 overflow-hidden rounded-full bg-white/50'>
              <VirtualButton name='y' />
            </div>
            <div className='h-14 w-14 overflow-hidden' />
            <div className='h-14 w-14 overflow-hidden rounded-full bg-white/50'>
              <VirtualButton name='a' />
            </div>
          </div>
          <div className='h-14 w-14 overflow-hidden rounded-full bg-white/50'>
            <VirtualButton name='b' />
          </div>
        </div>
      </div>

      <div className='mt-4 flex items-center justify-center gap-8'>
        <div className='h-6 w-16 overflow-hidden rounded-md bg-white/50'>
          <VirtualButton name='select' />
        </div>
        <div className='h-6 w-16 overflow-hidden rounded-md bg-white/50'>
          <VirtualButton name='start' />
        </div>
      </div>
    </div>
  )
}
