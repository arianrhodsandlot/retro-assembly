'use client'
import { clsx } from 'clsx'
import { ScrollArea } from 'radix-ui'
import type { ReactNode } from 'react'

export function ScrollContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ScrollArea.Root className={clsx('overflow-hidden', className)} scrollHideDelay={0}>
      <ScrollArea.Viewport className='size-full'>{children}</ScrollArea.Viewport>
      <ScrollArea.Scrollbar className='flex w-2 touch-none select-none' orientation='vertical'>
        <ScrollArea.Thumb className='flex-1 bg-zinc-700' />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar className='flex w-2 touch-none select-none' orientation='horizontal'>
        <ScrollArea.Thumb className='flex-1 bg-zinc-700' />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
