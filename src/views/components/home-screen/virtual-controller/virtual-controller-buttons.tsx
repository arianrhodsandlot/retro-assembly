import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { showMenuOverlayAtom } from '../../atoms'
import { VirtualButton } from './virtual-button'

export function VirtualControllerButtons() {
  const [show, setShow] = useState(false)
  const setShowMenuOverlayAtom = useSetAtom(showMenuOverlayAtom)

  function onTapMenuButton() {
    setShowMenuOverlayAtom(true)
    setShow(false)
  }

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
    <div className='fixed bottom-0 z-[11] w-full pb-10 portrait:px-4 landscape:px-10'>
      <div className='flex w-full items-end justify-between'>
        <div className='flex flex-col items-center overflow-hidden rounded-3xl border-8 border-gray-500 bg-white/60'>
          <div className='flex'>
            <div className='h-12 w-12 overflow-hidden'>
              <VirtualButton name='up,left' />
            </div>
            <div className='h-12 w-12 overflow-hidden rounded-t bg-white/80'>
              <VirtualButton name='up' />
            </div>
            <div className='h-12 w-12 overflow-hidden'>
              <VirtualButton name='up,right' />
            </div>
          </div>
          <div className='flex'>
            <div className='h-12 w-12 overflow-hidden rounded-l bg-white/80'>
              <VirtualButton name='left' />
            </div>
            <div className='h-12 w-12 overflow-hidden bg-white/80' />
            <div className='h-12 w-12 overflow-hidden rounded-r bg-white/80'>
              <VirtualButton name='right' />
            </div>
          </div>
          <div className='flex'>
            <div className='h-12 w-12 overflow-hidden'>
              <VirtualButton name='down,left' />
            </div>
            <div className='h-12 w-12 overflow-hidden rounded-b bg-white/80 '>
              <VirtualButton name='down' />
            </div>
            <div className='h-12 w-12 overflow-hidden'>
              <VirtualButton name='down,right' />
            </div>
          </div>
        </div>

        <div className='flex flex-col items-center'>
          <div className='h-16 w-16 overflow-hidden rounded-full border-8 border-gray-500 bg-white/80'>
            <VirtualButton name='x' />
          </div>
          <div className='flex'>
            <div className='h-16 w-16 overflow-hidden rounded-full border-8 border-gray-500 bg-white/80'>
              <VirtualButton name='y' />
            </div>
            <div className='h-16 w-16 overflow-hidden' />
            <div className='h-16 w-16 overflow-hidden rounded-full border-8 border-gray-500 bg-white/80'>
              <VirtualButton name='a' />
            </div>
          </div>
          <div className='h-16 w-16 overflow-hidden rounded-full border-8 border-gray-500 bg-white/80'>
            <VirtualButton name='b' />
          </div>
        </div>
      </div>

      <div className='mt-10 flex items-center justify-center gap-10'>
        <div className='h-8 w-20 overflow-hidden rounded-md border-8 border-gray-500 bg-white/80'>
          <VirtualButton name='select' />
        </div>
        <div className='h-12 w-12 overflow-hidden rounded-full border-8 border-gray-500 bg-white/80'>
          <VirtualButton onTap={onTapMenuButton} />
        </div>
        <div className='h-8 w-20 overflow-hidden rounded-md border-8 border-gray-500 bg-white/80'>
          <VirtualButton name='start' />
        </div>
      </div>
    </div>
  )
}
