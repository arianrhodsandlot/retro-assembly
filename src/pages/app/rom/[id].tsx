import AppLayout from '@/components/app/app-layout.tsx'
import { GameCover } from '@/components/app/rom/game-cover.tsx'
import { GameInfo } from '@/components/app/rom/game-info.tsx'
import { GameMedias } from '@/components/app/rom/game-medias.tsx'
import { LaunchButton } from '@/components/app/rom/launch-button.tsx'
import { SidebarLinks } from '@/components/app/sidebar-links.tsx'
import { getRom } from '@/controllers/get-rom.ts'
import { getRomTitle } from '@/utils/rom.ts'

export default async function Rom({ id }) {
  const rom = await getRom(id)
  if (!rom) {
    return '404'
  }

  const title = getRomTitle(rom)
  const { launchboxGame } = rom

  return (
    <AppLayout sidebar={<SidebarLinks platform={rom.platform} />}>
      <div className='flex gap-4'>
        <title>{`${title} - RetroAssembly`}</title>

        <div>
          <GameCover rom={rom} />
        </div>

        <div className='flex flex-1 flex-col gap-8'>
          <h1 className='px-8 pt-4 text-5xl font-bold'>{title}</h1>

          <GameInfo gameInfo={launchboxGame} rom={rom} />

          <div className='px-4'>
            <LaunchButton rom={rom} />
          </div>

          <div className='flex flex-col gap-4 pl-4 pr-64'>
            <GameMedias rom={rom} video={launchboxGame?.video_url} />

            {launchboxGame?.overview ? (
              <div className='prose-neutral prose max-w-none whitespace-pre-line text-justify font-[Roboto_Slab_Variable]'>
                {launchboxGame.overview}
              </div>
            ) : null}

            {launchboxGame?.wikipedia_url ? (
              <div>
                <a
                  className='inline-flex items-center gap-2 underline'
                  href={launchboxGame.wikipedia_url}
                  rel='noreferrer'
                  target='_blank'
                >
                  <span className='icon-[mdi--wikipedia] size-6' /> Read more on Wikipedia.
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
