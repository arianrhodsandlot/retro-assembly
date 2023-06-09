import { useAtom } from 'jotai'
import { BaseButton } from '../primitives/base-button'
import { BaseDialogContent } from '../primitives/base-dialog-content'
import { isInvalidDialogOpenAtom } from './atoms'
import { LocalButton } from './local-button'
import { OnedriveButton } from './onedrive-button'

export function GetStarted() {
  const [isInvalidDialogOpen, setIsInvalidDialogOpenAtom] = useAtom(isInvalidDialogOpenAtom)
  return (
    <div className='container m-auto max-w-5xl px-10'>
      <div className='mt-4 w-full rounded-xl border-2 border-red-600 bg-white px-10 py-6'>
        <div className='flex '>
          <div className='flex w-1/2 flex-col'>
            <div className='flex justify-center'>
              <OnedriveButton />
            </div>
            <div className='mt-2 flex items-center justify-center text-xs'>
              <span className='icon-[mdi--thumb-up] mr-1 h-3 w-3' />
              <div>Recommended. Seamlessly sync your games and progress.</div>
            </div>
          </div>

          <div className='w-1/2'>
            <div className='flex justify-center'>
              <LocalButton />
            </div>
            <div className='mt-2 flex items-center justify-center text-xs'>A simple way to try Retro Assembly.</div>
          </div>
        </div>

        <div className='m-auto mt-10 px-12 text-red-200' hidden>
          <div className='flex items-center font-bold'>
            <span className='icon-[mdi--bell] mr-2 h-4 w-4' />
            Notice:
          </div>
          <div className='mt-2 pl-6'>
            The directory you choose should match a certain structure:
            <br />
            The ROMs of retro games should be grouped in seperate directories, and the directories should be named in
            these conviention:
            <ul className='list-disc pl-4'>
              <li className='list-item'>NES/Famicom - nes</li>
              <li className='list-item'>SNES/Super Famicom - snes</li>
            </ul>
          </div>
        </div>
      </div>

      <BaseDialogContent onOpenChange={setIsInvalidDialogOpenAtom} open={isInvalidDialogOpen}>
        <div className='max-w-xl'>
          <div className='flex items-center text-lg font-bold'>
            <span className='icon-[mdi--alert] mr-2 h-5 w-5 text-yellow-400' />
            <h3>You selected an invalid directory as your ROMs directory</h3>
          </div>
          <div className='mt-4'>The directory you choose should match a certain structure. Here is an example:</div>

          <div className='mt-4'>
            <BaseButton className='m-auto' onClick={() => setIsInvalidDialogOpenAtom(false)} styleType='primary'>
              <span className='icon-[mdi--hand-okay] h-5 w-5' />
              OK
            </BaseButton>
          </div>
        </div>
      </BaseDialogContent>
    </div>
  )
}
