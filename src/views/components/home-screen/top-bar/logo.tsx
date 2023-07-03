import logo from '../../../assets/logo/logo.svg'

export function Logo() {
  return (
    <div className='flex items-center px-8 text-center font-[audiowide,ui-sans-serif,sans-serif] font-bold tracking-wider'>
      <img alt='Retro Assembly' className='mr-4 h-10 w-10 rounded-full' src={logo} />
      Retro Assembly
    </div>
  )
}
