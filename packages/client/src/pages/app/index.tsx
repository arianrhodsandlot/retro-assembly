import { getRoms } from '@/controllers/get-roms.ts'
import { RomEntry } from '../../components/app/rom-entry.tsx'

export default async function App() {
  const roms = await getRoms()

  return (
    <div className='flex flex-col gap-8'>
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
