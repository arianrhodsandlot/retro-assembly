import { getSupportedSystemNames } from '../../../core'
import { BaseCallout } from '../primitives/base-callout'

const supportedSystemNames = [...getSupportedSystemNames()].sort()

export function DirectoryInstruction() {
  return (
    <>
      <div>
        The directory you choose should match a certain structure.
        <br />
        Here is an example:
      </div>

      <BaseCallout className='my-4'>
        <div className='flex items-center'>
          <span className='icon-[mdi--folder-open] mr-2 h-6 w-6 text-rose-500' />
          roms
          <pre className='ml-2 flex items-center rounded bg-rose-300 px-2 text-xs text-rose-100'>
            <span className='icon-[mdi--hand-pointing-left] mr-2 h-4 w-4' />
            Choose a directory like this one!
          </pre>
        </div>
        <div className='ml-6 flex flex-wrap'>
          {supportedSystemNames.map((name) => (
            <div className='flex w-1/2 items-center' key={name}>
              <span className='icon-[mdi--folder] mr-2 h-6 w-6 text-rose-500' />
              {name}
            </div>
          ))}
        </div>
      </BaseCallout>

      <div>Your should choose a directory containing at least one of the above sub directories.</div>
    </>
  )
}
