import { RegrantButton } from './regrant-button'

export function RegrantLocalPermission() {
  return (
    <div className='m-auto w-[800px]'>
      <div className='mt-10'>To continue, please:</div>

      <div className='-ml-10 mt-4 box-content w-full rounded-xl border-2 border-red-600 px-10 py-6'>
        <div className='flex flex-col'>
          <div>
            <RegrantButton />
            <div className='mt-2 text-xs'>
              We have to ask you to regrant the permission to read your ROMs again, though you have selected a local
              directory last time, due to a limitation of the browser.
            </div>
            <div className='mt-2 text-xs'>
              For better experience, You can also consider using OneDrive as your ROMs directory latter.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
