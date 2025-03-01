import { getPlatformInfo } from '@/controllers/get-platform-info.ts'
import { getCDNUrl } from '@/utils/cdn.ts'

export async function DeviceInfo({ platform }: { platform: string }) {
  const platformInfo = await getPlatformInfo(platform)
  if (!platformInfo) {
    return
  }

  const logo =
    platform === 'arcade'
      ? getCDNUrl('RetroPie/es-theme-carbon', `/${platform}/art/system.svg`)
      : getCDNUrl('batocera-linux/batocera-themes', `/themes/batocera/${platform}/_data/svg/logo.svg`)

  return (
    <div className='flex'>
      <div className='flex flex-col gap-8 px-4'>
        <h1>
          <img alt={platformInfo.name} className='h-20 w-auto px-8 pt-4' src={logo} />
        </h1>

        <div className='rounded bg-zinc-600/10 px-8 py-4'>
          <div className='flex gap-8 *:min-w-36'>
            <div>
              <div className='flex items-center gap-2 font-semibold'>
                <span className='icon-[mdi--calendar]' />
                Released
              </div>
              <div className='pl-6'>{platformInfo.release_date?.toLocaleDateString() || 'unknown'}</div>
            </div>

            <div>
              <div className='flex items-center gap-2 font-semibold'>
                <span className='icon-[mdi--chip]' />
                Developer
              </div>
              <div className='pl-6'>{platformInfo.developer || 'unknown'}</div>
            </div>

            <div>
              <div className='flex items-center gap-2 font-semibold'>
                <span className='icon-[mdi--factory]' />
                Manufacturer
              </div>
              <div className='pl-6'>{platformInfo.manufacturer || 'unknown'}</div>
            </div>
          </div>
        </div>
        <div className='prose-neutral prose line-clamp-4 max-w-none whitespace-pre-line px-8 text-justify text-sm font-[Roboto_Slab_Variable] leading-relaxed'>
          {platformInfo.notes}
        </div>
      </div>
      <div className='w-lg shrink-0'>
        <img
          alt={platformInfo.name}
          className='h-auto w-full drop-shadow-2xl'
          src={getCDNUrl('Mattersons/es-theme-neutral', `systems/device/${platform}.png`)}
        />
      </div>
    </div>
  )
}
