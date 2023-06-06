import { LocalButton } from './local-button'
import { OnedriveButton } from './onedrive-button'

export function GetStarted() {
  return (
    <div className='container m-auto max-w-5xl px-10'>
      <div className='px-12'>To get started, you can:</div>

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
      </div>

      <div className='m-auto mt-10 px-12'>
        Notice:
        <br />
        The directory you choose should match a certain structure:
        <br />
        The roms of retro games should be grouped in seperate directories, and the directories should be named in these
        conviention:
        <ul>
          <li>
            {`NES/Famicom roms should be placed in a directory whose name contains "nes" or "Nintendo - Nintendo
Entertainment System".`}
          </li>
        </ul>
      </div>
    </div>
  )
}
