import { DeviceInfo } from '../../../components/app/device-info.tsx'
import { UploadButton } from '../../../components/app/platform/upload-button.tsx'
import { RomEntry } from '../../../components/app/rom-entry.tsx'
import { getRoms } from '../../../controllers/get-roms.ts'

export default async function App({ platform }) {
  const roms = await getRoms({ platform })

  return (
    <div className='flex flex-col gap-8'>
      <DeviceInfo platform={platform} />

      <div className='px-4'>
        {roms.length > 0 ? (
          <div className='flex flex-wrap items-start gap-4'>
            {roms.map((rom) => (
              <RomEntry key={rom.id} rom={rom} />
            ))}
          </div>
        ) : null}
      </div>

      <UploadButton platform={platform} />
    </div>
  )
}
