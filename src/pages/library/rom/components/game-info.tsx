import { platformMap } from '@/constants/platform.ts'

export function GameInfo({ gameInfo, rom }) {
  return (
    <div className='rounded bg-zinc-600/10 px-8 py-4'>
      <div className='flex'>
        <div>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='icon-[mdi--computer-classic]' />
            Platform
          </div>
          <div className='pl-6'>{platformMap[rom.platform].displayName}</div>
        </div>
      </div>

      <div className='mt-4 flex gap-8 *:min-w-36'>
        <div>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='icon-[mdi--calendar]' />
            Released
          </div>
          <div className='pl-6'>
            {gameInfo?.release_date?.toLocaleDateString() || <span className='opacity-40'>Unknown</span>}
          </div>
        </div>

        <div>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='icon-[mdi--chip]' />
            Developer
          </div>
          <div className='pl-6'>{gameInfo?.developer || <span className='opacity-40'>Unknown</span>}</div>
        </div>

        <div>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='icon-[mdi--earth]' />
            Publisher
          </div>
          <div className='pl-6'>{gameInfo?.publisher || <span className='opacity-40'>Unknown</span>}</div>
        </div>

        <div>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='icon-[mdi--tag-multiple]' />
            Genres
          </div>
          <div className='pl-6'>{gameInfo?.genres || ''}</div>
        </div>

        <div>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='icon-[mdi--person-multiple]' />
            Players
          </div>
          <div className='pl-6'>{gameInfo?.max_players || <span className='opacity-40'>Unknown</span>}</div>
        </div>
      </div>
    </div>
  )
}
