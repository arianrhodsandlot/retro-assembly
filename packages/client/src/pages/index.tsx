import { Link } from 'waku'
import { getContextData } from 'waku/middleware/context'

export default async function HomePage() {
  const {
    controller: { getRoms },
  } = getContextData()

  const roms = await getRoms()

  return (
    <div>
      <div className='text-center'>
        <div className='p-40 text-4xl'>Retroassembly</div>
        <div className='flex items-center justify-center'>
          <Link className='rounded bg-neutral-100 px-8 py-4 text-xl' to='/app'>
            Press any key to start
          </Link>
        </div>
      </div>
    </div>
  )
}
