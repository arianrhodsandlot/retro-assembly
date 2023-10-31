import { type ReactNode } from 'react'
import { TopBar } from './top-bar'

const backgroundImage =
  'repeating-linear-gradient(45deg, #fafafa 25%, transparent 25%, transparent 75%, #fafafa 75%, #fafafa), repeating-linear-gradient(45deg, #fafafa 25%, white 25%, white 75%, #fafafa 75%, #fafafa)'

export function HomeScreenLayout({ children }: { children: ReactNode }) {
  return (
    <div className='home-screen-layout relative h-screen w-screen'>
      <div
        className='absolute inset-0 flex flex-col bg-[length:30px_30px] bg-[0_0,15px_15px]'
        style={{ backgroundImage }}
      >
        <TopBar />
        <div className='flex-1 overflow-hidden'>
          <div className='flex h-full items-center justify-center '>{children}</div>
        </div>
      </div>
    </div>
  )
}
