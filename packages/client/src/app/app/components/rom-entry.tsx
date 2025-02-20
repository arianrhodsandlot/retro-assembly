'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { getRomTitle } from '@/utils/rom.ts'
import { useRomCover } from '../hooks/use-rom-cover.ts'

export function RomEntry({ rom }) {
  const name = getRomTitle(rom)
  const { data: cover, isLoading } = useRomCover(rom)

  return (
    <Link className='block w-40 transition-transform hover:scale-[102%]' href={`/app/rom/${rom.id}`}>
      <div className='flex size-40 items-center justify-center'>
        {isLoading ? <div className='size-4/5 rounded bg-zinc-200' /> : null}

        {cover ? (
          <img
            alt={name}
            className={clsx('rounded object-contain drop-shadow-lg', {
              'max-w-4/5 max-h-4/max-w-4/5': cover.type === 'platform',
              'max-w-full max-h-full': cover.type === 'rom',
            })}
            src={cover.src}
          />
        ) : null}
      </div>

      <div className='mt-2 line-clamp-2 text-center text-sm font-semibold'>{name}</div>
    </Link>
  )
}
