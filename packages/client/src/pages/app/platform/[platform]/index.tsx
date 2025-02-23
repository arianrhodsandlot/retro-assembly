import { getContextData } from 'waku/middleware/context'
import { DeviceInfo } from '../../components/device-info.tsx'
import { RomEntry } from '../../components/rom-entry.tsx'

export default async function App({ platform }) {
  const {
    controller: { getRoms },
  } = getContextData()
  const roms = await getRoms({ platform })

  return (
    <div className='flex flex-col gap-8'>
      {platform ? <DeviceInfo platform={platform} /> : null}

      <div className='px-4'>
        {roms.length > 0 ? (
          <div className='flex flex-wrap items-start gap-4'>
            {roms.map((rom) => (
              <RomEntry key={rom.id} rom={rom} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
