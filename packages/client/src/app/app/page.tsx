import Link from 'next/link'
import { getRequestContext } from '@/utils/request-context.ts'
import { ImportROMsButton } from './components/import-roms-button'
import { RomEntry } from './components/rom-entry'

export default async function App({ searchParams }: NextPageProps) {
  const { platform } = await searchParams
  const requestContext = await getRequestContext()

  const roms = await requestContext.service.getRoms({ platform })

  return (
    <div className='flex gap-10'>
      <div className='flex flex-col'>
        <Link href='/app' replace>
          all
        </Link>
        <Link href='/app?platform=nes' replace>
          nes
        </Link>
      </div>
      <div>
        <div className='flex flex-col'>
          {roms.map((rom) => (
            <RomEntry key={rom.id} rom={rom} />
          ))}
        </div>
        <div className='mt-10'>
          <ImportROMsButton />
        </div>
      </div>
    </div>
  )
}
