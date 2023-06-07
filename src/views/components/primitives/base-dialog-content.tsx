import { Dialog, DialogContent, DialogOverlay, DialogPortal, type DialogProps } from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'

interface BaseDialogProps {
  onOpenChange?: DialogProps['onOpenChange']
  children: JSX.Element
}

export function BaseDialogContent({ children }: BaseDialogProps) {
  return (
    <Dialog open>
      <DialogPortal>
        <DialogOverlay asChild>
          <motion.div animate={{ opacity: 1 }} className='fixed inset-0 z-10 bg-[#000000aa]' initial={{ opacity: 0 }} />
        </DialogOverlay>

        <DialogContent className='modal fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2'>
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className='max-h-[60vh] overflow-auto rounded bg-white p-6'
            initial={{ opacity: 0, scale: 0.8 }}
          >
            {children}
          </motion.div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
