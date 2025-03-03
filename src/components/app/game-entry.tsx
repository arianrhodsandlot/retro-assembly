'use client'
import clsx from 'clsx'
import { Link } from 'waku/router/client'
import { useRomCover } from '@/hooks/use-rom-cover.ts'
import { getRomTitle } from '@/utils/rom.ts'

export function GameEntry({ rom, width }) {
  const name = getRomTitle(rom)
  const { data: cover, isLoading } = useRomCover(rom)

  return (
    <Link className='block transition-transform' style={{ width: width || 'auto' }} to={`/app/rom/${rom.id}`}>
      <div className='flex aspect-square size-full items-center justify-center'>
        {isLoading ? <div className='size-4/5 rounded bg-zinc-200' /> : null}

        {cover ? (
          <img
            alt={name}
            className={clsx('max-w-4/5 max-h-full rounded object-contain drop-shadow-lg', {
              rounded: cover.type === 'rom',
            })}
            src={cover.src}
          />
        ) : null}
      </div>

      <div className='mt-2 line-clamp-2 text-center text-sm font-semibold'>{name}</div>
    </Link>
  )
}
