import { GameEntryContainer } from './game-entry-container'
import { Sidebar } from './sidebar'

export function HomeScreen() {
  return (
    <div className='min-h-screen'>
      <div className='absolute z-[1] flex h-screen w-[200px] flex-col bg-[#fe0000] text-white'>
        <Sidebar />
      </div>
      <GameEntryContainer />
    </div>
  )
}
