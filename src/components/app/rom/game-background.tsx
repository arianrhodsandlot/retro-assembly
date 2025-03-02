'use client'
import { useRomCover } from '@/hooks/use-rom-cover.ts'
import { MainBackground } from '../main-background.tsx'

export function GameBackground({ rom }) {
  const { data: cover, isLoading } = useRomCover(rom)

  if (isLoading) {
    return
  }

  return cover?.type === 'rom' ? <MainBackground alt={rom.name} src={cover.src} /> : null
}
