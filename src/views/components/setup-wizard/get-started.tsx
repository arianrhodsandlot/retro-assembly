import { LocalButton } from './local-button'
import { OnedriveButton } from './onedrive-button'

export function GetStarted() {
  return (
    <div className='m-auto w-[800px]'>
      <div className='mt-10'>To get started, you can:</div>

      <div className='-ml-10 mt-4 box-content w-full rounded-xl border-2 border-red-600 px-10 py-6'>
        <div className='flex flex-col'>
          <div>
            <OnedriveButton />
            <div className='mt-2 text-xs'>Recommended, since you can sync your games and progress seamlessly.</div>
          </div>
        </div>

        <div className='mt-2 text-lg'>or</div>

        <div className='mt-2'>
          <LocalButton />
          <div className='mt-2 text-xs'>A simple way to try Retro Assembly.</div>
        </div>

        <div className='mt-10 text-sm'>
          Notice:
          <br />
          The directory you choose should match a certain structure:
          <br />
          The roms of retro games should be grouped in seperate directories, and the directories should be named in
          these conviention:
          <ul>
            <li>
              {`NES/Famicom roms should be placed in a directory whose name contains "nes" or "Nintendo - Nintendo
    Entertainment System".`}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
