import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { onSetupAtom } from './atoms'
import { GetStarted } from './get-started'
import { Header } from './header'

const backgroundImage =
  'repeating-linear-gradient(45deg, #fafafa 25%, transparent 25%, transparent 75%, #fafafa 75%, #fafafa), repeating-linear-gradient(45deg, #fafafa 25%, white 25%, white 75%, #fafafa 75%, #fafafa)'
export default function SetupWizard({ onSetup }: { onSetup: () => void }) {
  const setOnSetup = useSetAtom(onSetupAtom)

  useEffect(() => {
    setOnSetup(() => onSetup)
  }, [onSetup, setOnSetup])

  return createPortal(
    <div className='text-red-600'>
      <div className='relative flex h-[800px] max-h-[60vh] min-h-[350px] flex-col bg-red-600'>
        <div className='flex-1' />
        <Header />
      </div>

      <div
        className='overflow-auto bg-white bg-[length:30px_30px]  bg-[0_0,15px_15px] py-10'
        style={{ backgroundImage }}
      >
        <GetStarted />
      </div>
    </div>,
    document.body
  )
}
