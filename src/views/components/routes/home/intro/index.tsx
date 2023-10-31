import { type TargetAndTransition } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { SpatialNavigation } from '../../../../lib/spatial-navigation'
import { useRouterHelpers } from '../../../hooks/use-router-helpers'
import { introVisibleAtom } from './atoms'
import { Banner } from './banner'
import { Footer } from './footer'
import { MainButtons } from './main-buttons'

export function Intro() {
  const [introVisible, setIntroVisible] = useAtom(introVisibleAtom)
  const { navigateToPlatform } = useRouterHelpers()

  function onAnimationComplete(animation: TargetAndTransition) {
    if (animation.opacity) {
      SpatialNavigation.focus('intro')
    } else {
      navigateToPlatform()
    }
  }

  useEffect(() => {
    setIntroVisible(true)
  }, [setIntroVisible])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.removeProperty('overflow')
    }
  }, [])

  return (
    <AnimatePresence>
      {introVisible ? (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className='intro absolute inset-0 z-10 flex flex-col overflow-auto bg-black/70 text-center text-white'
          exit={{ opacity: 0, scale: 1.2 }}
          initial={{ opacity: 0, scale: 1.2 }}
          onAnimationComplete={onAnimationComplete}
        >
          <Banner />
          <MainButtons />
          <Footer />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
