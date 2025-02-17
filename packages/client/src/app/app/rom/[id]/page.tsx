import Link from 'next/link'
import { getRequestContext } from '@/utils/request-context.ts'
import { LaunchButton } from './components/launch-button'

export default async function Rom({ params }: NextPageProps) {
  const { id } = await params
  const requestContext = await getRequestContext()

  const rom = await requestContext.service.getRom(id)
  return (
    <div className='max-w-7xl mx-auto'>
      <div>
        <Link href='/app'>app</Link> /{' '}
        <div>{rom.fbneo_game_info?.fullName || rom.libretro_rdb?.name || rom.good_code?.rom}</div>
      </div>
      <div className='py-10 text-neutral-400'>{JSON.stringify(rom)}</div>
      <LaunchButton rom={rom} />
    </div>
  )
}
