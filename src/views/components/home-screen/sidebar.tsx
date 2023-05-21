import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import logo from '../../assets/logo.png'
import { isSettingsModalOpenAtom } from '../../lib/atoms'

function Setting({ onClick }: { onClick: () => void }) {
  const { ref, focused, focusSelf } = useFocusable()

  useEffect(() => {
    focusSelf()
  }, [focusSelf])

  return (
    <button ref={ref} className={classNames('mx-auto mb-10', { focused })} onClick={onClick}>
      <Cog6ToothIcon className='h-20 w-20' />
    </button>
  )
}

export function Sidebar() {
  const { ref, focusKey } = useFocusable()
  const [, setShowSettings] = useAtom(isSettingsModalOpenAtom)

  function openSettings() {
    setShowSettings(true)
  }

  return (
    <>
      <FocusContext.Provider value={focusKey}>
        <div className='absolute z-[1] flex h-screen w-[200px] flex-col bg-[#fe0000] text-white' ref={ref}>
          <div className='pt-10 text-center text-xl'>
            <img
              src={logo}
              className='m-auto h-24 w-24 rounded-full border-4 border-solid border-white bg-[#ddd] object-contain shadow-[0_0_6px_rgba(0,0,0,0.6)]'
              alt='logo'
            />
          </div>
          <div className='flex-1'></div>
          <Setting onClick={openSettings} />
        </div>
      </FocusContext.Provider>
    </>
  )
}
