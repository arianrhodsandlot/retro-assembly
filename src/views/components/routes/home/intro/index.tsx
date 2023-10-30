import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useRouterHelpers } from '../../../hooks/use-router-helpers'
import { Banner } from './banner'
import { Footer } from './footer'
import { MainButtons } from './main-buttons'

export function Intro() {
  const { isHome } = useRouterHelpers()

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
          <Banner />
          <MainButtons />
          <Footer />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
