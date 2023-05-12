import { GameEntryContainer } from './game-entry-container'
import { Sidebar } from './sidebar'

export function HomeScreen() {
  return (
    <div className='min-h-screen'>
      <div className='absolute flex h-screen w-[200px] flex-col bg-[#fe0000] text-white'>
        <Sidebar />
      </div>
      <div className='h-screen w-full overflow-x-hidden pl-[200px]'>
        <GameEntryContainer />
      </div>
    </div>
  )
}
