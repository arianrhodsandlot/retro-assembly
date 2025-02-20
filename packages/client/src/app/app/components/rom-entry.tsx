'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { getRomTitle } from '@/utils/rom'
import { useRomCover } from '../hooks/use-rom-cover'

export function RomEntry({ rom }) {
  const name = getRomTitle(rom)
  const { data: cover, isLoading } = useRomCover(rom)

  return (
    <Link className='block w-40 hover:scale-[102%] transition-transform' href={`/app/rom/${rom.id}`}>
      <div className='size-40 flex items-center justify-center'>
        {isLoading ? <div className='size-4/5 rounded bg-zinc-200' /> : null}

        {cover ? (
          <img
            alt={name}
            className={clsx('drop-shadow-lg rounded object-contain', {
              'max-w-4/5 max-h-4/max-w-4/5': cover.type === 'platform',
              'max-w-full max-h-full': cover.type === 'rom',
            })}
            src={cover.src}
          />
        ) : null}
      </div>

      <div className='text-center mt-2 text-sm line-clamp-2 font-semibold'>{name}</div>
    </Link>
  )
}
