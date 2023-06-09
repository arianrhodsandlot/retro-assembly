import { system } from '../../../../core'
import { BaseButton } from '../../primitives/base-button'

export function LocalFilePermision({ onSolve }: { onSolve: () => void }) {
  async function grant() {
    try {
      await system.grantPermissionManually()
      onSolve()
    } catch {}
  }

  return (
    <div className='max-w-xl'>
      <div className='flex items-center text-lg font-bold'>
        <span className='icon-[mdi--alert] mr-2 h-5 w-5 text-yellow-400' />
        <h3>Local file permission is needed</h3>
      </div>
      <div className='mt-4'>
        We have to ask you to grant the permission to read your ROMs again, though you have done this last time.
      </div>
      <div className='mt-4'>
        <BaseButton className='mx-auto' onClick={grant} styleType='primary'>
          <span className='icon-[mdi--folder-open] h-5 w-5' />
          grant the permission
        </BaseButton>
      </div>
      <div className='mt-4'>This is due to a restriction of the security police of your browser.</div>
      <div className='mt-4'>
        For more fluent experience, You can also consider using OneDrive as your ROMs directory latter.
      </div>
    </div>
  )
}
