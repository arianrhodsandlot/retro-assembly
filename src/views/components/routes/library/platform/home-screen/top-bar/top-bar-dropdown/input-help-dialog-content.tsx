import { DialogClose } from '@radix-ui/react-dialog'
import { useTranslation } from 'react-i18next'
import { DarkInputButton } from '../../../../../../common/dark-input-button'
import { BaseButton } from '../../../../../../primitives/base-button'

export function InputHelpDialogContent() {
  const { t } = useTranslation()

  return (
    <div className='w-96'>
      <div>
        <h3 className='flex items-center gap-2 font-semibold'>
          <span className='icon-[mdi--apps-box] h-5 w-5' />
          {t('UI controls')}
        </h3>
        <div className='mt-2 flex flex-wrap gap-x-4 gap-y-2 px-8'>
          <div className='flex items-center gap-2'>
            {t('Move')}
            <span className='icon-[mdi--gamepad] h-5 w-5' /> / <DarkInputButton>↑ ↓ → ← </DarkInputButton>
          </div>
          <div className='flex items-center gap-2'>
            {t('Confirm')}
            <span className='icon-[mdi--gamepad-circle-right] h-5 w-5' />/<DarkInputButton>Enter</DarkInputButton>
          </div>
          <div className='flex items-center gap-2'>
            {t('Cancel')}
            <span className='icon-[mdi--gamepad-circle-down] h-5 w-5' />
          </div>
          <div className='flex items-center gap-2'>
            {t('Previous console')}
            <DarkInputButton>L1</DarkInputButton>
          </div>
          <div className='flex items-center gap-2'>
            {t('Next console')}
            <DarkInputButton>R1</DarkInputButton>
          </div>
        </div>

        <h3 className='mt-4 flex items-center gap-2 font-semibold'>
          <span className='icon-[mdi--fit-to-screen-outline] h-5 w-5' />
          {t('In game shortcuts')}
        </h3>
        <div className='mt-2 flex flex-wrap gap-x-4 gap-y-2 px-8'>
          <div className='flex items-center gap-2'>
            {t('Show/hide menu')}
            <div className='flex items-center gap-2'>
              <DarkInputButton>L1</DarkInputButton>+<DarkInputButton>R1</DarkInputButton> /{' '}
              <DarkInputButton>ESC</DarkInputButton>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {t('Rewind')}
            <div className='flex items-center gap-2'>
              <DarkInputButton>select</DarkInputButton>+<DarkInputButton>L1</DarkInputButton>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {t('Fast forward')}
            <div className='flex items-center gap-2'>
              <DarkInputButton>select</DarkInputButton>+<DarkInputButton>R1</DarkInputButton>
            </div>
          </div>
        </div>
      </div>

      <h3 className='mt-4 flex items-center gap-2 font-semibold'>
        <span className='icon-[mdi--keyboard] h-5 w-5' />
        {t('Gameplay controller-keyboard mappings')}
      </h3>
      <div className='mt-2 flex flex-wrap gap-x-4 gap-y-2 px-8'>
        <div className='flex items-center gap-2'>
          <span className='icon-[mdi--gamepad] h-5 w-5' /> - <DarkInputButton>↑ ↓ → ← </DarkInputButton>
        </div>
        <div className='flex w-full flex-wrap gap-x-4'>
          <div className='flex items-center gap-2'>
            <span className='icon-[mdi--gamepad-circle-up] h-5 w-5' /> - <DarkInputButton>S</DarkInputButton>
          </div>
          <div className='flex items-center gap-2'>
            <span className='icon-[mdi--gamepad-circle-left] h-5 w-5' /> - <DarkInputButton>A</DarkInputButton>
          </div>
          <div className='flex items-center gap-2'>
            <span className='icon-[mdi--gamepad-circle-right] h-5 w-5' /> - <DarkInputButton>X</DarkInputButton>
          </div>
          <div className='flex items-center gap-2'>
            <span className='icon-[mdi--gamepad-circle-down] h-5 w-5' /> - <DarkInputButton>Z</DarkInputButton>
          </div>
        </div>
        <div className='flex w-full flex-wrap gap-x-4'>
          <div className='flex items-center gap-2'>
            <DarkInputButton>select</DarkInputButton> - <DarkInputButton>Shift</DarkInputButton>
          </div>
          <div className='flex items-center gap-2'>
            <DarkInputButton>start</DarkInputButton> - <DarkInputButton>Enter</DarkInputButton>
          </div>
        </div>
        <div className='flex w-full flex-wrap gap-x-4'>
          <div className='flex items-center gap-2'>
            <DarkInputButton>L1</DarkInputButton> - <DarkInputButton>Q</DarkInputButton>
          </div>
          <div className='flex items-center gap-2'>
            <DarkInputButton>R1</DarkInputButton> - <DarkInputButton>W</DarkInputButton>
          </div>
        </div>
      </div>

      <div className='flex-center mt-8 gap-5'>
        <DialogClose asChild>
          <BaseButton styleType='primary'>
            <span className='icon-[mdi--hand-okay] h-5 w-5' />
            {t('OK')}
          </BaseButton>
        </DialogClose>
      </div>
    </div>
  )
}
