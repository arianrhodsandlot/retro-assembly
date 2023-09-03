import { uniq } from 'lodash-es'
import { useAsync } from 'react-use'
import { Rom } from '../../../../core'
import { DistrictIcon } from './district-icon'

export function GameTitle({ rom }: { rom: Rom }) {
  const { codes } = rom.goodCode
  const { revision, countries, version = {} } = codes
  const districts = uniq(countries?.map(({ code }) => code))

  const gameNameState = useAsync(async () => {
    await rom.ready()
    return rom.displayName
  })

  const title = [`File: ${rom.fileAccessor.name}`, `Game: ${rom.standardizedName}`].join('\n')

  return (
    <div
      className='relative w-full overflow-hidden bg-slate-200 px-1 py-1 text-center text-xs text-slate-400'
      title={title}
    >
      {districts?.map((district) => <DistrictIcon district={district} key={district} />)}

      <span className='align-middle'>{gameNameState.value ?? rom.displayName}</span>

      {revision !== undefined && (
        <span className='ml-2 inline-block rounded bg-gray-300 px-1'>
          <span className='icon-[octicon--versions-16] h-4 w-4 align-middle' />
          {revision > 1 && (
            <span className='ml-2 h-4 align-middle font-["Noto_Mono",ui-monospace,monospace]'>{revision}</span>
          )}
        </span>
      )}

      {version.alpha ? (
        <span className='ml-2 inline-block rounded bg-gray-300 px-1'>
          <span className='icon-[mdi--alpha] h-4 w-4 align-middle' />
        </span>
      ) : version.beta ? (
        <span className='ml-2 inline-block rounded bg-gray-300 px-1'>
          <span className='icon-[mdi--beta] h-4 w-4 align-middle' />
        </span>
      ) : version.prototype ? (
        <span className='ml-2 inline-block rounded bg-gray-300 px-1'>
          <span className='icon-[mdi--flask] h-4 w-4 align-middle' />
        </span>
      ) : null}
    </div>
  )
}
