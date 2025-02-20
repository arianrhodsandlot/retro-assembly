import { getRequestContext } from '@/utils/request-context.ts'
import { getRomTitle } from '@/utils/rom.ts'
import { GameCover } from './components/game-cover.tsx'
import { GameInfo } from './components/game-info.tsx'
import { GameMedias } from './components/game-medias.tsx'
import { LaunchButton } from './components/launch-button.tsx'

export default async function Rom({ params }: NextPageProps) {
  const { id } = await params
  const requestContext = await getRequestContext()

  const { launchboxGameInfo, rom } = await requestContext.service.getRom(id)
  const title = getRomTitle(rom)

  return (
    <div className='flex gap-4'>
      <div>
        <GameCover rom={rom} />
      </div>

      <div className='flex flex-1 flex-col gap-8'>
        <h1 className='px-8 pt-4 text-6xl font-bold'>{title}</h1>

        <GameInfo gameInfo={launchboxGameInfo} rom={rom} />

        <div className='px-4'>
          <LaunchButton rom={rom} />
        </div>

        <div className='flex flex-col gap-4 pl-4 pr-64'>
          <GameMedias rom={rom} video={launchboxGameInfo.videourl} />

          {launchboxGameInfo?.overview ? (
            <div className='prose-neutral prose max-w-none whitespace-pre-line text-justify font-[Roboto_Slab_Variable]'>
              {launchboxGameInfo.overview}
            </div>
          ) : null}

          {launchboxGameInfo?.wikipediaurl ? (
            <div>
              <a className='inline-flex items-center gap-2 underline' href={launchboxGameInfo.wikipediaurl}>
                <span className='icon-[mdi--wikipedia] size-6' /> Read more on Wikipedia.
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
