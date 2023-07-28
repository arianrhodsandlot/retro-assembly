import logo from '../../../../assets/logo/logo-192x192.png'

export function Logo() {
  return (
    <div className='flex items-center px-8 text-center font-["Fredoka_Variable",sans-serif] text-lg font-bold tracking-wider'>
      <img alt='Retro Assembly' className='h-10 w-10 rounded-full' src={logo} />
      <div className='ml-4 hidden md:block'>Retro Assembly</div>
    </div>
  )
}
