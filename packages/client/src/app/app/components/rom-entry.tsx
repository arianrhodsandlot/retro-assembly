'use client'
import { capitalize } from 'es-toolkit'
import ky from 'ky'
import Link from 'next/link'
import useSWRImmutable from 'swr/immutable'
import { platformLibretroFullNameMap } from '@/constants/platform'

function encodeRFC3986URIComponent(str) {
  return encodeURIComponent(str).replaceAll(/[!'()*]/g, (c) => `%${c.codePointAt(0)?.toString(16).toUpperCase()}`)
}

function getCover({ name, platform, type = 'boxart' }: any) {
  if (!name || !platform) {
    return ''
  }
  const platformFullName = platformLibretroFullNameMap[platform]
  if (!platformFullName) {
    return ''
  }

  const typeUrlPart = `Named_${capitalize(type)}s`
  const normalizedPlatformFullName = platformFullName.replaceAll(' ', '_')
  const pathPrefix = `gh/libretro-thumbnails/${normalizedPlatformFullName}@master`
  const normalizedFileName = name.replaceAll(/[&*/:`<>?\\]|\|"/g, '_')
  const encode = encodeRFC3986URIComponent
  return `https://cdn.jsdelivr.net/${pathPrefix}/${encode(typeUrlPart)}/${encode(normalizedFileName)}.png`
}

export function RomEntry({ rom }: { rom: any }) {
  const name = rom.fbneo_game_info?.fullName || rom.good_code?.rom || rom.libretro_rdb?.name
  const cover = getCover({ name: rom.libretro_rdb?.name, platform: rom.platform })

  const { data, error, isLoading } = useSWRImmutable(cover, ky)

  return (
    <Link className='block w-40 hover:scale-105 transition-transform' href={`/app/rom/${rom.id}`}>
      <div className='size-40 flex items-center justify-center'>
        {isLoading ? <div className='size-36 rounded bg-zinc-100' /> : null}

        {data ? (
          <img
            alt={name}
            className='max-w-full max-h-full border-3 border-zinc-300 rounded object-contain'
            src={cover}
          />
        ) : null}

        {error ? <div className='size-36 rounded  bg-zinc-200' /> : null}
      </div>

      <div className='text-center mt-2 text-sm line-clamp-2' title={JSON.stringify(rom)}>
        {name}
      </div>
    </Link>
  )
}
