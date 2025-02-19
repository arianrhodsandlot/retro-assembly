import Image from 'next/image'
import { getRequestContext } from '@/utils/request-context.ts'
import { getRomCover, getRomTitle } from '@/utils/rom'
import { LaunchButton } from './components/launch-button'

export default async function Rom({ params }: NextPageProps) {
  const { id } = await params
  const requestContext = await getRequestContext()

  const { launchboxGame, rom } = await requestContext.service.getRom(id)
  const cover = getRomCover(rom)
  const title = getRomTitle(rom)

  return (
    <div className='w-full'>
      <div className='flex gap-4'>
        <div className='w-56 shrink-0'>
          <Image alt={title} className='object-contain size-full block' height={224} src={cover} width={224} />
        </div>
        <div className='flex flex-col gap-4 flex-1'>
          <h1 className='text-3xl font-semibold'>{title}</h1>

          {launchboxGame ? (
            <div className='bg-zinc-200 rounded p-4'>
              <div>Released: {launchboxGame.releasedate}</div>
              <div>Developer: {launchboxGame.developer}</div>
              <div>Publisher: {launchboxGame.publisher}</div>
              <div>Players: {launchboxGame.maxplayers}</div>
              <div>Genres: {launchboxGame.genres}</div>
              <div>Rating: {launchboxGame.communityrating}</div>
              <div>Video: {launchboxGame.videourl}</div>
              <div>
                <a href={launchboxGame.wikipediaurl}>
                  <span className='icon-[mdi--wikipedia]' />
                </a>
              </div>
            </div>
          ) : null}

          <div>
            <LaunchButton rom={rom} />
          </div>
        </div>
      </div>

      {launchboxGame ? <div className='w-4xl text-justify'>{launchboxGame.overview}</div> : null}
    </div>
  )
}
