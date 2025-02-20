'use client'
import ky from 'ky'
import Link from 'next/link'
import useSWRImmutable from 'swr/immutable'
import { getRomCover, getRomTitle } from '@/utils/rom'

export function RomEntry({ rom }: { rom: any }) {
  const name = getRomTitle(rom)
  const cover = getRomCover(rom)

  const { data, error, isLoading } = useSWRImmutable(cover, ky)

  return (
    <Link className='block w-40 hover:scale-[102%] transition-transform' href={`/app/rom/${rom.id}`}>
      <div className='size-40 flex items-center justify-center'>
        {isLoading ? <div className='size-36 rounded bg-zinc-100' /> : null}

        {data ? (
          <img alt={name} className='max-w-full max-h-full shadow-lg rounded object-contain' src={cover} />
        ) : null}

        {error ? <div className='size-36 rounded  bg-zinc-200' /> : null}
      </div>

      <div className='text-center mt-2 text-sm line-clamp-2 font-semibold'>{name}</div>
    </Link>
  )
}
