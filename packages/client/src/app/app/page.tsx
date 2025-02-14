import { getRequestContext } from '@/utils/request-context.ts'
import { RomEntry } from './components/rom-entry'

export default async function App() {
  const requestContext = await getRequestContext()

  const roms = await requestContext.service.getRoms()

  return (
    <div className='grid col-auto gap-10'>
      {roms.map((rom) => (
        <RomEntry key={rom.id} rom={rom} />
      ))}
    </div>
  )
}
