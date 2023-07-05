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
    <div className='min-h-screen bg-white  bg-[length:30px_30px] bg-[0_0,15px_15px]' style={{ backgroundImage }}>
      <div className='relative flex h-[800px] max-h-[60vh] min-h-[350px] flex-col bg-rose-700'>
        <div className='flex-1' />
        <Header />
      </div>

      <div className='mt-10'>
        <GetStarted />
      </div>

      <div className='mt-10 py-4 text-center text-xs text-rose-300'>
        <div className='flex items-center justify-center'>
          <div>
            © <a href='https://github.com/arianrhodsandlot/'> arianrhodsandlot</a> 2023
          </div>
          <div className='mx-2'>|</div>
          <div className='flex items-center justify-center'>
            <span className='icon-[mdi--github] mr-1 h-4 w-4' />
            <a href='https://github.com/arianrhodsandlot/retro-assembly'>GitHub</a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
