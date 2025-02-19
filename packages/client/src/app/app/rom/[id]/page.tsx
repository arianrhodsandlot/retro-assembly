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
        <div className='w-64 shrink-0'>
          <img alt={title} className='rounded object-contain object-top size-full block' src={cover} width={224} />
        </div>
        <div className='flex flex-col gap-8 flex-1'>
          <h1 className='text-5xl px-8 pt-4 font-semibold'>{title}</h1>

          {launchboxGame ? (
            <div className='bg-zinc-200 rounded px-8 py-4'>
              <div className='flex'>
                <div>
                  <div className='font-semibold flex items-center gap-2'>
                    <span className='icon-[mdi--computer-classic]' />
                    Platform
                  </div>
                  <div className='pl-6'>{launchboxGame.platform}</div>
                </div>
              </div>

              <div className='flex gap-8 *:min-w-36 mt-4'>
                <div>
                  <div className='font-semibold flex items-center gap-2'>
                    <span className='icon-[mdi--calendar]' />
                    Released
                  </div>
                  <div className='pl-6'>{launchboxGame.releasedate}</div>
                </div>

                <div>
                  <div className='font-semibold flex items-center gap-2'>
                    <span className='icon-[mdi--chip]' />
                    Developer
                  </div>
                  <div className='pl-6'>{launchboxGame.developer}</div>
                </div>

                <div>
                  <div className='font-semibold flex items-center gap-2'>
                    <span className='icon-[mdi--earth]' />
                    Publisher
                  </div>
                  <div className='pl-6'>{launchboxGame.publisher}</div>
                </div>

                <div>
                  <div className='font-semibold flex items-center gap-2'>
                    <span className='icon-[mdi--tag-multiple]' />
                    Genres
                  </div>
                  <div className='pl-6'>{launchboxGame.genres}</div>
                </div>

                <div>
                  <div className='font-semibold flex items-center gap-2'>
                    <span className='icon-[mdi--person-multiple]' />
                    Players
                  </div>
                  <div className='pl-6'>{launchboxGame.maxplayers}</div>
                </div>
              </div>

              <div className='mt-4'>
                <div className='font-semibold flex items-center gap-2'>
                  <span className='icon-[mdi--star-rate]' />
                  Rating
                </div>
                <div className='pl-6'>{launchboxGame.communityrating.toFixed(1)}</div>
              </div>
            </div>
          ) : null}

          <div className='px-4'>
            <LaunchButton rom={rom} />
          </div>

          <div className='px-4 prose-neutral	prose-lg  text-justify max-w-3xl'>
            {launchboxGame ? <div className='whitespace-pre-line'>{launchboxGame.overview}</div> : null}

            <div className='mt-4'>
              <a className='inline-flex items-center gap-2 underline' href={launchboxGame.wikipediaurl}>
                <span className='icon-[mdi--wikipedia] size-6' /> Read more on Wikipedia.
              </a>
            </div>
          </div>

          <div className='px-4'>Video: {launchboxGame.videourl}</div>
        </div>
      </div>
    </div>
  )
}
