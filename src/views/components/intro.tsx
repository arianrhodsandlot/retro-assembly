import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import logo from '../../assets/logo/logo-512x512.png'
import { useRouterHelpers } from './home-screen/hooks'
import { BaseDialogTrigger } from './primitives/base-dialog-trigger'
import { AnimatedIcons } from './setup-wizard/animated-icons'
import { GetStarted } from './setup-wizard/get-started'

export function Intro() {
  const { isHome, navigateToSystem } = useRouterHelpers()

  function onClickTryPublicLibrary() {
    navigateToSystem()
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.removeProperty('overflow')
    }
  })

  return (
    <AnimatePresence>
      {isHome ? (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className='absolute inset-0 z-10 flex flex-col overflow-auto bg-black/70 text-center text-white'
          exit={{ opacity: 0, scale: 1.2 }}
        >
          <div className='m-auto mb-10 mt-10 w-full max-w-none pt-20 sm:max-w-4xl sm:pt-40'>
            <div className='bg-white/70 pb-10 pt-12 text-rose-700 backdrop-blur-sm'>
              <div className='m-auto flex items-center justify-center gap-4 font-bold'>
                <img alt='Retro Assembly' className='h-16 w-16 rounded-full' src={logo} />
                <div className='font-["Fredoka_Variable",sans-serif] text-2xl tracking-wider sm:text-6xl'>
                  Retro Assemly
                </div>
              </div>
              <div className='mt-4 flex flex-col items-center justify-center gap-2 text-xs tracking-wider sm:flex-row sm:gap-0'>
                <span className='flex items-center justify-center px-1'>
                  A personal&nbsp;
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
                  retro game collection cabinet
                </span>
                <span className='flex items-center justify-center px-1'>
                  in your&nbsp;
                  <AnimatedIcons wait={500}>
                    <span className='icon-[simple-icons--googlechrome] h-4 w-4' />
                    <span className='icon-[simple-icons--firefox] h-4 w-4' />
                    <span className='icon-[simple-icons--microsoftedge] h-4 w-4' />
                    <span className='icon-[simple-icons--safari] h-4 w-4' />
                    <span className='icon-[simple-icons--brave] h-4 w-4' />
                    <span className='icon-[simple-icons--opera] h-4 w-4' />
                    <span className='icon-[simple-icons--vivaldi] h-4 w-4' />
                  </AnimatedIcons>
                  browser
                </span>
              </div>
            </div>
          </div>

          <div className='flex flex-1 flex-col items-center justify-center pb-10'>
            <div>
              <button
                className='flex w-80 max-w-full items-center justify-center rounded-full border-4 border-rose-700 bg-white py-4 text-rose-700'
                onClick={onClickTryPublicLibrary}
              >
                <span className='icon-[mdi--play] h-6 w-6' />
                <div className='ml-2'>Try public library</div>
              </button>
              <div className='mt-2 text-xs text-white/60'>
                Enjoy free (<b>legal</b>) retro games from&nbsp;
                <a className='underline' href='https://retrobrews.github.io/' rel='noreferrer' target='_blank'>
                  retrobrews
                </a>
              </div>
            </div>

            <div>
              <BaseDialogTrigger content={<GetStarted />}>
                <button className='mt-8 flex w-80 max-w-full items-center justify-center rounded-full border-4 border-white bg-rose-700 py-4'>
                  <span className='icon-[mdi--login] h-6 w-6' />
                  <div className='ml-2'>Continue with your own library</div>
                </button>
              </BaseDialogTrigger>
              <div className='mt-2 flex items-center justify-center gap-4 text-xs text-white/60'>
                <span className='icon-[logos--microsoft-onedrive] h-4 w-4' />
                <span>|</span>
                <span className='icon-[logos--google-drive] h-4 w-4' />
                <span>|</span>
                <span className='icon-[logos--dropbox] h-4 w-4' />
                <span>|</span>
                <span className='icon-[flat-color-icons--opened-folder] h-4 w-4' />
              </div>
              <div className='mt-2 text-xs text-white/60'>
                Your personal retro game collection cabinet
                <br />
                built with your own ROM files
              </div>
            </div>
          </div>

          <div className='flex items-center justify-center gap-2 text-xs'>
            <div>
              <span>Version</span>
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
              <span>Last Updated</span>
              <span className='ml-1'>{BUILD_TIME}</span>
            </div>
          </div>

          <div className='mb-2 mt-1 flex items-center justify-center gap-2 text-xs'>
            <span>© 2023</span>
            <a className='underline' href='https://github.com/arianrhodsandlot' rel='noreferrer' target='_blank'>
              arianrhodsandlot
            </a>
            ·
            <a className='underline' href='/privacy-policy.html' target='_blank'>
              Privacy Policy
            </a>
            ·
            <a
              className='flex items-center justify-center gap-1'
              href='mailto:theguidanceofawhitetower@gmail.com'
              rel='noreferrer'
              target='_blank'
            >
              <span className='icon-[simple-icons--gmail] mr-1 h-4 w-4' />
            </a>
            <a
              className='flex items-center justify-center gap-1'
              href='https://github.com/arianrhodsandlot/retro-assembly'
              rel='noreferrer'
              target='_blank'
            >
              <span className='icon-[simple-icons--github] mr-1 h-4 w-4' />
            </a>
            <a
              className='hidden items-center justify-center gap-1'
              href='https://discord.gg/RVVAMcCH'
              rel='noreferrer'
              target='_blank'
            >
              <span className='icon-[simple-icons--discord] mr-1 h-4 w-4' />
            </a>
            <a
              className='hidden items-center justify-center gap-1'
              href='https://twitter.com/arianrhodsand'
              rel='noreferrer'
              target='_blank'
            >
              <span className='icon-[simple-icons--x] mr-1 h-4 w-4' />
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
