import { AnimatePresence, motion } from 'framer-motion'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { onSetupAtom } from './atoms'
import { GetStarted } from './get-started'
import { Header } from './header'

export default function SetupWizard({ onSetup }: { onSetup: () => void }) {
  const setOnSetup = useSetAtom(onSetupAtom)

  useEffect(() => {
    setOnSetup(() => onSetup)
  }, [onSetup, setOnSetup])

  return (
    <AnimatePresence initial={false}>
      <div className='absolute inset-0 z-10 overflow-hidden text-red-600'>
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className='h-full w-full origin-top'
          exit={{ opacity: 0, scale: 2.1 }}
          transition={{ duration: 0.5 }}
        >
          <div className='relative flex h-1/2 flex-col bg-red-600'>
            <div className='flex-1' />
            <Header />
          </div>

          <div className='h-1/2 overflow-auto bg-white py-10'>
            <GetStarted />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
