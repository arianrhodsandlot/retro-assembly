import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  return (
    <>
      <div className='flex-center gap-2 text-xs'>
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
        ·
        <div>
          <span>{t('Last Updated')}</span>
          <span className='ml-1'>{BUILD_TIME}</span>
        </div>
      </div>

      <div className='flex-center mb-4 mt-1 gap-2 text-xs'>
        <span>© 2024</span>
        <a className='underline' href='https://github.com/arianrhodsandlot' rel='noreferrer' target='_blank'>
          arianrhodsandlot
        </a>
        ·
        <a className='underline' href='/privacy-policy.html' target='_blank'>
          {t('Privacy Policy')}
        </a>
        ·
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
    </>
  )
}
