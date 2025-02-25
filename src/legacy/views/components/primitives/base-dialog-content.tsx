import { Dialog, DialogContent, DialogOverlay, DialogPortal, type DialogProps } from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { type ReactNode, useEffect } from 'react'
import { onCancel } from '../../../core'
import { SpatialNavigation } from '../../lib/spatial-navigation'

interface BaseDialogProps extends DialogProps {
  children: ReactNode
  closable?: boolean
  closableByGamepadCancel?: boolean
}

export function BaseDialogContent({
  children,
  closable = false,
  closableByGamepadCancel = true,
  onOpenChange,
  open = true,
  ...props
}: BaseDialogProps) {
  useEffect(() => {
    SpatialNavigation.focus('modal')
  }, [])

  useEffect(() => {
    if (!closable) {
      return
    }

    if (open && closableByGamepadCancel) {
      const offCancel = onCancel(() => {
        offCancel()
        onOpenChange?.(false)
      })

      return () => {
        offCancel()
      }
    }
  }, [onOpenChange, closable, open, closableByGamepadCancel])

  return (
    <Dialog open={open} {...props}>
      <DialogPortal>
        <DialogOverlay asChild>
          <motion.div animate={{ opacity: 1 }} className='fixed inset-0 z-20 bg-[#000000aa]' initial={{ opacity: 0 }} />
        </DialogOverlay>

        <DialogContent className='modal fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2'>
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
