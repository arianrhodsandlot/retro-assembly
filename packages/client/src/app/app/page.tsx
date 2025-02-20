import { getRequestContext } from '@/utils/request-context.ts'
import { ImportROMsButton } from './components/import-roms-button.tsx'
import { RomEntry } from './components/rom-entry.tsx'

export default async function App({ searchParams }: NextPageProps) {
  const { platform } = await searchParams
  const requestContext = await getRequestContext()

  const roms = await requestContext.service.getRoms({ platform })

  return (
    <>
      {roms.length > 0 ? (
        <div className='flex flex-wrap gap-4'>
          {roms.map((rom) => (
            <RomEntry key={rom.id} rom={rom} />
          ))}
        </div>
      ) : (
        <div className='flex w-full items-center justify-center'>
          <button
            className='flex items-center gap-2 rounded-lg bg-rose-700 px-4 py-2 text-lg text-white'
            type='button'
          >
            <span className='icon-[mdi--upload] size-7' /> Upload
          </button>
        </div>
      )}

      {roms.length > 0 ? (
        <div className='fixed bottom-10 right-10'>
          <ImportROMsButton />
        </div>
      ) : null}
    </>
  )
}
