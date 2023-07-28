import logo from '../../../assets/logo/logo-512x512.png'
import { AnimatedIcons } from './animated-icons'

export function Header() {
  return (
    <div className='pb-10 text-center text-white'>
      <div className='container m-auto'>
        <h3 className='font-["Fredoka_Variable",sans-serif]'>
          <span className='flex flex-col items-center justify-center text-2xl font-bold tracking-widest sm:flex-row sm:text-6xl'>
            <img alt='Retro Assembly' className='mb-4 mr-0 h-20 w-20 rounded-full sm:mb-0 sm:mr-6' src={logo} />
            Retro Assembly
          </span>
        </h3>
        <div className='mt-10 flex flex-col items-center justify-center gap-2 text-sm tracking-wider sm:flex-row sm:gap-0'>
          <span>A personal</span>
          <span className='mx-2 flex items-center justify-center rounded-full border-2 border-white bg-rose-700 px-4 py-2'>
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
            retro
          </span>
          <span>game collection cabinet in your</span>
          <span className='mx-2 flex items-center justify-center rounded-full border-2 border-white bg-rose-700 px-4 py-2'>
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
  )
}
