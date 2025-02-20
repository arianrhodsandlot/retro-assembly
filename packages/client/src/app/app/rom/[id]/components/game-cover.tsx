'use client'
import { useRomCover } from '@/app/app/hooks/use-rom-cover'

export function GameCover({ rom }) {
  const { data: cover, isLoading } = useRomCover(rom)

  if (isLoading) {
    return <div className='size-64 bg-zinc-200 sticky top-0' />
  }

  return cover ? (
    <div className='w-64 sticky top-0'>
      <img alt={rom.name} className='block w-full h-auto' src={cover.src} />
    </div>
  ) : null
}
