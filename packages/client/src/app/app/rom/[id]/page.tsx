import Image from 'next/image'
import { getRequestContext } from '@/utils/request-context.ts'
import { getRomCover, getRomTitle } from '@/utils/rom'
import { LaunchButton } from './components/launch-button'

export default async function Rom({ params }: NextPageProps) {
  const { id } = await params
  const requestContext = await getRequestContext()

  const rom = await requestContext.service.getRom(id)
  const cover = getRomCover(rom)
  const title = getRomTitle(rom)

  return (
    <div className='flex gap-4'>
      <div className='w-56 shrink-0'>
        <Image alt={title} className='object-contain size-full block' height={224} src={cover} width={224} />
      </div>
      <div className='flex flex-col gap-4'>
        <h1 className='text-3xl font-semibold'>{title}</h1>
        <div>
          <LaunchButton rom={rom} />
        </div>
      </div>
    </div>
  )
}
