import { useTranslation } from 'react-i18next'
import logo from '../../../../../assets/logo/logo-512x512.png'
import { AnimatedIcons } from './animated-icons'

export function Banner() {
  const { t } = useTranslation()

  return (
    <div className='m-auto my-10 w-full max-w-none pt-20 sm:max-w-4xl sm:pt-40'>
      <div className='relative bg-white/70 pb-10 pt-12 text-rose-700 backdrop-blur-sm'>
        <div className='flex-center m-auto gap-4 font-bold'>
          <img alt='RetroAssembly' className='size-16 rounded-full' src={logo} />
          <div className='font-["Fredoka_Variable",sans-serif] text-2xl tracking-wider sm:text-6xl'>RetroAssembly</div>
        </div>
        <div className='m-auto mt-4 flex max-w-[60%] flex-col items-center justify-center gap-2 text-xs tracking-wider sm:flex-row sm:gap-0'>
          <AnimatedIcons>
            <div className='icon-[mdi--space-invaders] size-4' />
            <div className='icon-[iconoir--pacman] size-4' />
            <div className='icon-[fluent--tetris-app-24-regular] size-4' />
            <div className='icon-[mdi--nintendo-game-boy] size-4' />
            <div className='icon-[mdi--zelda] size-4' />
            <div className='icon-[mdi--gamepad-square] size-4' />
            <div className='icon-[wpf--retro-tv] size-4' />
            <div className='icon-[teenyicons--gba-outline] size-4' />
          </AnimatedIcons>
          <span>{t('A personal retro game collection cabinet in your browser')}</span>
          <AnimatedIcons wait={500}>
            <span className='icon-[simple-icons--googlechrome] size-4' />
            <span className='icon-[simple-icons--firefox] size-4' />
            <span className='icon-[simple-icons--microsoftedge] size-4' />
            <span className='icon-[simple-icons--safari] size-4' />
            <span className='icon-[simple-icons--brave] size-4' />
            <span className='icon-[simple-icons--opera] size-4' />
            <span className='icon-[simple-icons--vivaldi] size-4' />
          </AnimatedIcons>
        </div>
        <a
          className='github-fork-ribbon origin-top-right scale-75'
          data-ribbon={t('Star me on GitHub')}
          href='https://github.com/arianrhodsandlot/retro-assembly'
          rel='noreferrer'
          target='_blank'
          title={t('Star me on GitHub')}
        >
          {t('Star me on GitHub')}
        </a>
      </div>
    </div>
  )
}
