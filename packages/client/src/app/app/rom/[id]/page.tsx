import { getRequestContext } from '@/utils/request-context.ts'
import { LaunchButton } from './components/launch-button'

export default async function Rom({ params }: NextPageProps) {
  const { id } = await params
  const requestContext = await getRequestContext()

  const rom = await requestContext.service.getRom(id)
  return (
    <div>
      <div>{JSON.stringify(rom)}</div>
      <LaunchButton rom={rom} />
    </div>
  )
}
