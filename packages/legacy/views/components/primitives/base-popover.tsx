import { Arrow, Content, type PopoverTriggerProps, Portal, Root, Trigger } from '@radix-ui/react-popover'
import type { ReactNode } from 'react'

interface BaseTooltipProps extends PopoverTriggerProps {
  tooltipContent: ReactNode
}

export function BasePopover({ children, tooltipContent, ...props }: BaseTooltipProps) {
  return (
    <Root>
      <Trigger {...props}>{children}</Trigger>
      <Portal>
        <Content className='z-10' sideOffset={5}>
          {tooltipContent}
          <Arrow className='fill-rose-700' />
        </Content>
      </Portal>
    </Root>
  )
}
