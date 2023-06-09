import { motion } from 'framer-motion'
import { AnimatedIcons } from './animated-icons'

export function Header() {
  return (
    <div className='pb-16 text-center text-white'>
      <div className='container m-auto'>
        <h3 className='font-[audiowide,ui-sans-serif,sans-serif]'>
          <span className='flex items-center justify-center text-6xl font-bold tracking-widest'>
            <span className='icon-[mdi--controller-classic] mr-6 h-20 w-20' />
            Retro Assembly
          </span>
        </h3>
        <div className='mt-10 flex items-center justify-center text-sm tracking-wider'>
          <span>A</span>
          <span className='mx-2 flex items-center justify-center rounded-full border-2 border-white px-4 py-2'>
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
          <span>game application built for your</span>
          <span className='mx-2 flex items-center justify-center rounded-full border-2 border-white px-4 py-2'>
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
