import type { ReactNode } from 'react'

interface MenuLoadingProps {
  children: ReactNode
}

export function LoadingScreen({ children }: MenuLoadingProps) {
  return (
    <div className='flex h-full w-full items-center justify-center text-white' data-testid='loading-screen'>
      <div className='flex flex-col items-center'>
        <span className='icon-[line-md--loading-loop] h-12 w-12' />
        <div className='mt-10 font-["Outfit_Variable",sans-serif] tracking-wider'>{children}</div>
      </div>
    </div>
  )
}
