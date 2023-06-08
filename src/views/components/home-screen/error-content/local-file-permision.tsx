import { system } from '../../../../core'
import { BaseButton } from '../../primitives/base-button'

export function LocalFilePermision({ onSolve }: { onSolve: () => void }) {
  async function regrant() {
    try {
      await system.grantPermissionManually()
      onSolve()
    } catch {}
  }

  return (
    <div className='max-w-xl'>
      <div>
        We have to ask you to regrant the permission to read your ROMs again, though you have selected a local directory
        last time.
      </div>
      <div className='mt-4'>
        <BaseButton className='mx-auto' onClick={regrant} styleType='primary'>
          <span className='icon-[mdi--folder-open] h-5 w-5' />
          regrant the permission
        </BaseButton>
      </div>
      <div className='mt-4'>This is due to a restriction of the security police of your browser.</div>
      <div className='mt-4'>
        For more fluent experience, You can also consider using OneDrive as your ROMs directory latter.
      </div>
    </div>
  )
}
