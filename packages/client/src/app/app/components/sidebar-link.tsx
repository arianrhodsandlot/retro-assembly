import Link from 'next/link'

export function SidebarLink({ children, href }) {
  return (
    <Link
      className='py-2 px-4 font-semibold text-white/80 hover:text-white flex items-center gap-1.5 hover:bg-rose-900'
      href={href}
      replace
    >
      {children}
    </Link>
  )
}
