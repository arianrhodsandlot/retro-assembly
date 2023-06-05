import { AnimatePresence, motion } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { needsRegrantLocalPermissionAtom, needsShowGetStartedAtom, needsShowSetupWizardAtom } from '../../lib/atoms'
import { GetStarted } from './get-started'
import { Header } from './header'
import { RegrantLocalPermission } from './regrant-local-permission'

export default function SetupWizard() {
  const needsShowSetupWizard = useAtomValue(needsShowSetupWizardAtom)
  const needsGrantLocalPermission = useAtomValue(needsRegrantLocalPermissionAtom)
  const needsShowGetStarted = useAtomValue(needsShowGetStartedAtom)

  return (
    <AnimatePresence initial={false}>
      {needsShowSetupWizard ? (
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
              {needsGrantLocalPermission ? <RegrantLocalPermission /> : null}
              {needsShowGetStarted ? <GetStarted /> : null}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
