import { ReactNode } from 'react'

interface MenuLoadingProps {
  children: ReactNode
}

export function MenuLoading({ children }: MenuLoadingProps) {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='flex flex-col items-center'>
        <span className='icon-[line-md--loading-loop] h-12 w-12' />
        <div className='mt-10 flex items-center text-sm text-zinc-600'>
          <span className='icon-[mdi--message] mr-2 h-4 w-4' />
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
