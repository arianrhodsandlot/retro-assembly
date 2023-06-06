import { RegrantButton } from './regrant-button'

export function RegrantLocalPermission() {
  return (
    <div className='container m-auto max-w-5xl px-10'>
      <div className='px-12'>To continue, please:</div>

      <div className='mt-4 w-full rounded-xl border-2 border-red-600 bg-white px-10 py-6'>
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
