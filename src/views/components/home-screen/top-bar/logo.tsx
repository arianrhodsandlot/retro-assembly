import { Link } from 'wouter'
import logo from '../../../../assets/logo/logo-192x192.png'

export function Logo() {
  return (
    <Link href='/' replace>
      <a
        className='flex items-center px-8 text-center font-["Fredoka_Variable",sans-serif] text-lg font-bold tracking-wider'
        href='/'
      >
        <img alt='Retro Assembly' className='h-10 w-10 rounded-full' src={logo} />
        <div className='ml-4 hidden lg:block'>Retro Assembly</div>
      </a>
    </Link>
  )
}
