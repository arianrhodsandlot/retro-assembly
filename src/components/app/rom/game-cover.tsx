'use client'
import { useRomCover } from '@/hooks/use-rom-cover.ts'

export function GameCover({ rom }) {
  const { data: cover, isLoading } = useRomCover(rom)

  if (isLoading) {
    return <div className='sticky top-4 size-64 bg-zinc-200' />
  }

  return cover ? (
    <div className='sticky top-4 w-64'>
      <img alt={rom.name} className='block h-auto w-full' src={cover.src} />
    </div>
  ) : null
}
