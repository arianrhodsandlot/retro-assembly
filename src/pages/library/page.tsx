import { getRoms } from '@/controllers/get-roms.ts'
import AppLayout from './components/app-layout.tsx'
import { GameList } from './components/game-list.tsx'

export async function LibraryPage() {
  const roms = await getRoms()

  return (
    <AppLayout>
      <title>Library - RetroAssembly</title>
      <div className='flex flex-col gap-5'>
        <div className='relative flex justify-between px-4 pt-4'>
          <h1 className='text-5xl font-[Oswald_Variable] font-semibold'>Library</h1>
          <div className='mt-4 flex items-center gap-2 text-zinc-400'>
            <span className='icon-[mdi--bar-chart] text-black' />
            <span className='font-[DSEG7_Modern] font-bold text-rose-700'>{roms.length}</span> games for{' '}
            <span className='font-[DSEG7_Modern] font-bold text-rose-700'>{8}</span> platforms in total
          </div>
        </div>
        <hr className='border-t-1 border-t-black/20' />
        <GameList roms={roms} />
      </div>
    </AppLayout>
  )
}
