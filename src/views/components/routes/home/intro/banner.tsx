import { useTranslation } from 'react-i18next'
import logo from '../../../../../assets/logo/logo-512x512.png'
import { AnimatedIcons } from './animated-icons'

export function Banner() {
  const { t } = useTranslation()

  return (
    <div className='m-auto mb-10 mt-10 w-full max-w-none pt-20 sm:max-w-4xl sm:pt-40'>
      <div className='relative bg-white/70 pb-10 pt-12 text-rose-700 backdrop-blur-sm'>
        <div className='flex-center m-auto gap-4 font-bold'>
          <img alt='RetroAssembly' className='h-16 w-16 rounded-full' src={logo} />
          <div className='font-["Fredoka_Variable",sans-serif] text-2xl tracking-wider sm:text-6xl'>RetroAssemly</div>
        </div>
        <div className='m-auto mt-4 flex max-w-[60%] flex-col items-center justify-center gap-2 text-xs tracking-wider sm:flex-row sm:gap-0'>
          <AnimatedIcons>
            <div className='icon-[mdi--space-invaders] h-4 w-4' />
            <div className='icon-[iconoir--pacman] h-4 w-4' />
            <div className='icon-[fluent--tetris-app-24-regular] h-4 w-4' />
            <div className='icon-[mdi--nintendo-game-boy] h-4 w-4' />
            <div className='icon-[mdi--zelda] h-4 w-4' />
            <div className='icon-[mdi--gamepad-square] h-4 w-4' />
            <div className='icon-[wpf--retro-tv] h-4 w-4' />
            <div className='icon-[teenyicons--gba-outline] h-4 w-4' />
          </AnimatedIcons>
          <span>{t('A personal retro game collection cabinet in your browser')}</span>
          <AnimatedIcons wait={500}>
            <span className='icon-[simple-icons--googlechrome] h-4 w-4' />
            <span className='icon-[simple-icons--firefox] h-4 w-4' />
            <span className='icon-[simple-icons--microsoftedge] h-4 w-4' />
            <span className='icon-[simple-icons--safari] h-4 w-4' />
            <span className='icon-[simple-icons--brave] h-4 w-4' />
            <span className='icon-[simple-icons--opera] h-4 w-4' />
            <span className='icon-[simple-icons--vivaldi] h-4 w-4' />
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
