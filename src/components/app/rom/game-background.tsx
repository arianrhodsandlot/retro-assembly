'use client'
import { useRomCover } from '@/hooks/use-rom-cover.ts'

export function GameBackground({ rom }) {
  const { data: cover, isLoading } = useRomCover(rom)

  if (isLoading) {
    return
  }

  return cover ? (
    <div className='blur-xs pointer-events-none absolute inset-y-0 right-0 aspect-square'>
      <img alt={rom.name} className='absolute size-full object-cover object-center' src={cover.src} />
      <div className='bg-linear-to-l absolute top-0 size-full from-zinc-50/40 to-zinc-50' />
      <div className='bg-linear-to-b absolute top-0 size-full from-zinc-50/40 to-zinc-50' />
    </div>
  ) : null
}
