import { DialogClose } from '@radix-ui/react-dialog'
import { useTranslation } from 'react-i18next'
import logo from '../../../../../../../../assets/logo/logo-512x512.png'
import { BaseButton } from '../../../../../../primitives/base-button'
import { BaseDialogTrigger } from '../../../../../../primitives/base-dialog-trigger'
import { TopBarButton } from '../top-bar-button'

export function AboutButton() {
  const { t } = useTranslation()

  return (
    <BaseDialogTrigger
      content={
        <div className='w-72 text-rose-700'>
          <div className='flex-center m-auto gap-4 font-bold'>
            <img alt='RetroAssembly' className='size-12 rounded-full' src={logo} />
            <div className='font-["Fredoka_Variable",sans-serif] text-2xl tracking-wider'>RetroAssembly</div>
          </div>
          <div className='mt-4 text-center text-sm'>
            {t('A personal retro game collection cabinet in your browser')}
          </div>
          <div className='flex-center mt-6 flex-col gap-2 text-xs'>
            <div>
              <span>{t('Version')}</span>
              <a
                className='ml-1 underline'
                href={`https://github.com/arianrhodsandlot/retro-assembly/tree/${GIT_VERSION}`}
                rel='noreferrer'
                target='_blank'
              >
                {GIT_VERSION}
              </a>
            </div>
            <div>
              <span>{t('Last Updated')}</span>
              <span className='ml-1'>{BUILD_TIME}</span>
            </div>
          </div>

          <div className='flex-center mb-2 mt-1 gap-2 text-xs'>
            <span>© 2024</span>
            <a className='underline' href='https://github.com/arianrhodsandlot' rel='noreferrer' target='_blank'>
              arianrhodsandlot
            </a>
          </div>
          <div className='flex-center mb-2 mt-1 gap-2 text-xs'>
            <a className='underline' href='/privacy-policy.html' rel='noreferrer' target='_blank'>
              {t('Privacy Policy')}
            </a>
          </div>
          <div className='flex-center mb-2 mt-1 gap-2 text-xs'>
            <a
              className='flex-center gap-1'
              href='mailto:theguidanceofawhitetower@gmail.com'
              rel='noreferrer'
              target='_blank'
            >
              <span className='icon-[simple-icons--gmail] mr-1 size-4' />
            </a>
            <a
              className='flex-center gap-1'
              href='https://github.com/arianrhodsandlot/retro-assembly'
              rel='noreferrer'
              target='_blank'
            >
              <span className='icon-[simple-icons--github] mr-1 size-4' />
            </a>
            <a
              className='hidden items-center justify-center gap-1'
              href='https://discord.gg/RVVAMcCH'
              rel='noreferrer'
              target='_blank'
            >
              <span className='icon-[simple-icons--discord] mr-1 size-4' />
            </a>
            <a
              className='hidden items-center justify-center gap-1'
              href='https://twitter.com/arianrhodsand'
              rel='noreferrer'
              target='_blank'
            >
              <span className='icon-[simple-icons--x] mr-1 size-4' />
            </a>
          </div>

          <div className='flex-center mt-8 gap-5'>
            <DialogClose asChild>
              <BaseButton styleType='primary'>
                <span className='icon-[mdi--hand-okay] size-5' />
                {t('OK')}
              </BaseButton>
            </DialogClose>
          </div>
        </div>
      }
    >
      <TopBarButton>
        <div className='flex items-center gap-2 px-4'>
          <span className='icon-[mdi--info] relative z-[1] size-8' />
          {t('About')}
        </div>
      </TopBarButton>
    </BaseDialogTrigger>
  )
}
