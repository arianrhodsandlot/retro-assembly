import ky from 'ky'
import { getRomLibretroThumbnail } from '@/utils/rom'
import { YouTubeEmbed } from './youtube-embed'

async function checkImage(url: string) {
  try {
    await ky.head(url)
    return true
  } catch {}
  return false
}

export async function GameMedias({ rom, video }) {
  const title = getRomLibretroThumbnail(rom, 'title')
  const snap = getRomLibretroThumbnail(rom, 'snap')

  const [hasTitle, hasSnap] = await Promise.all([checkImage(title), checkImage(snap)])
  if (!video && !hasTitle && !hasSnap) {
    return
  }

  return (
    <div className='flex gap-4 p-4 bg-zinc-200 rounded overflow-auto w-full'>
      {video ? <YouTubeEmbed className='h-48' url={video} /> : null}
      {hasTitle ? <img alt={title} className='h-48 w-auto' src={title} /> : null}
      {hasSnap ? <img alt={snap} className='h-48 w-auto' src={snap} /> : null}
    </div>
  )
}
