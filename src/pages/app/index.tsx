import AppLayout from '@/components/app/app-layout.tsx'
import { GameList } from '@/components/app/game-list.tsx'
import { getRoms } from '@/controllers/get-roms.ts'

export default async function App() {
  const roms = await getRoms()

  return (
    <AppLayout>
      <title>All - RetroAssembly</title>
      <div className='flex flex-col gap-8'>
        <GameList roms={roms} />
      </div>
    </AppLayout>
  )
}
