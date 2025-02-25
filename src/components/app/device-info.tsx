import { getPlatformInfo } from '@/controllers/get-platform-info.ts'
import { getCDNUrl } from '@/utils/cdn.ts'

export async function DeviceInfo({ platform }: { platform: string }) {
  const platformInfo = await getPlatformInfo(platform)
  if (!platformInfo) {
    return
  }

  return (
    <div className='flex'>
      <div className='flex flex-col gap-8 px-4'>
        <h1 className='px-8 pt-4 text-5xl font-bold'>{platformInfo.name}</h1>
        <div className='rounded bg-zinc-200 px-8 py-4'>
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
        <div className='prose-neutral prose max-w-none whitespace-pre-line px-8 text-justify font-[Roboto_Slab_Variable]'>
          {platformInfo.notes}
        </div>
      </div>
      <div className='w-lg shrink-0'>
        <img
          alt={platformInfo.name}
          className='h-auto w-full'
          src={getCDNUrl('Mattersons/es-theme-neutral', `systems/device/${platform}.png`)}
        />
      </div>
    </div>
  )
}
