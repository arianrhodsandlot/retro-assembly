// eslint-disable-next-line @eslint-react/naming-convention/filename
import type { ReactNode } from 'react'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import '../style.css'

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const data = {
    description: 'An internet website!',
    icon: '/images/favicon.png',
  }

  return (
    <div>
      <meta content={data.description} name='description' />
      <link href={data.icon} rel='icon' type='image/png' />
      <Header />
      <main className='flex items-center *:min-h-64 *:min-w-64 lg:m-0 lg:min-h-svh lg:justify-center'>{children}</main>
      <Footer />
    </div>
  )
}
