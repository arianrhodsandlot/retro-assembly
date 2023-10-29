import { getSupportedSystemNames } from '../../../core'
import { BaseCallout } from '../primitives/base-callout'

const supportedSystemNames = [...getSupportedSystemNames()].sort()

export function DirectoryInstruction() {
  return (
    <div className='text-sm'>
      The directory you choose should match a certain structure.
      <br />
      Here is an example:
      <BaseCallout className='my-4'>
        <pre className='flex items-center rounded bg-rose-300 px-2 py-1 text-xs text-rose-100'>
          <span className='icon-[mdi--hand-pointing-down] mr-1 h-4 w-4' />
          Choose one like this!
        </pre>
        <div className='text-xs'>
          <div className='flex items-center'>
            <span className='icon-[mdi--folder-open] mr-2 h-6 w-6 text-rose-500' />
            roms
          </div>
          <div className='ml-2 flex flex-wrap gap-x-4'>
            {supportedSystemNames.map((name) => (
              <div className='flex items-center' key={name}>
                <span className='icon-[mdi--folder] mr-1 h-6 w-6 text-rose-500' />
                {name}
              </div>
            ))}
          </div>
        </div>
      </BaseCallout>
      <div>Your should choose a directory containing at least one of the above sub directories.</div>
    </div>
  )
}
