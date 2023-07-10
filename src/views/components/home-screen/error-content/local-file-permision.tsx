import { grantLocalPermission } from '../../../../core'
import { ReturnToHomeButton } from '../../common/return-to-home-button'
import { BaseButton } from '../../primitives/base-button'

export function LocalFilePermision({ onSolve }: { onSolve: () => void }) {
  async function grant() {
    try {
      await grantLocalPermission()
      onSolve()
    } catch {}
  }

  return (
    <div className='w-96 max-w-full'>
      <div className='flex items-center text-lg font-bold'>
        <span className='icon-[mdi--alert] mr-2 h-5 w-5 text-yellow-400' />
        <h3>Local file permission is needed</h3>
      </div>
      <div className='mt-4 flex flex-col items-stretch justify-center px-10'>
        <BaseButton onClick={grant} styleType='primary'>
          <span className='icon-[mdi--folder-open] h-5 w-5' />
          Grant permission
        </BaseButton>
        <div className='mb-4 mt-2 flex gap-1 text-xs text-rose-700'>
          <span className='icon-[mdi--information-outline] -mt-1 h-6 w-6' />
          <div>
            <div>
              We have to ask you to grant permission to read your ROMs again, even though you have already done so last
              time.
            </div>
            <div className='mt-2'>This is due to a restriction of the security policy of your browser.</div>
          </div>
        </div>
        <ReturnToHomeButton />
      </div>
    </div>
  )
}
