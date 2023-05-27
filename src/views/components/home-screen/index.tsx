import { GameEntryContainer } from './game-entry-container'
import { Sidebar } from './sidebar'

export function HomeScreen() {
  return (
    <div className='relative h-screen'>
      <GameEntryContainer />
      <Sidebar />
    </div>
  )
}
