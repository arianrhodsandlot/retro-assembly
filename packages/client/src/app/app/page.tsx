import { getRequestContext } from '@/utils/request-context.ts'
import { ImportROMsButton } from './components/import-roms-button'
import { RomEntry } from './components/rom-entry'
import { ScanButton } from './components/scan-button'

export default async function App({ searchParams }: NextPageProps) {
  const { platform } = await searchParams
  const requestContext = await getRequestContext()

  const roms = await requestContext.service.getRoms({ platform })

  return (
    <div className='flex gap-10'>
      <div>
        <div className='flex flex-wrap gap-4'>
          {roms.map((rom) => (
            <RomEntry key={rom.id} rom={rom} />
          ))}
        </div>
        <div className='mt-10 flex gap-10'>
          <ImportROMsButton />
          <ScanButton />
        </div>
      </div>
    </div>
  )
}
