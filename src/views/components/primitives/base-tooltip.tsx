import { Arrow, Content, Portal, Provider, Root, TooltipTriggerProps, Trigger } from '@radix-ui/react-tooltip'
import { type ReactNode } from 'react'

interface BaseTooltipProps extends TooltipTriggerProps {
  tooltipContent: ReactNode
}

export function BaseTooltip({ tooltipContent, children, ...props }: BaseTooltipProps) {
  return (
    <Provider>
      <Root delayDuration={0}>
        <Trigger {...props}>{children}</Trigger>
        <Portal>
          <Content sideOffset={5}>
            {tooltipContent}
            <Arrow className='fill-rose-700' />
          </Content>
        </Portal>
      </Root>
    </Provider>
  )
}
