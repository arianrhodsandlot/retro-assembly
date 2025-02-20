import Link from 'next/link'

export function SidebarLink({ children, href }) {
  return (
    <Link
      className='flex items-center gap-1.5 px-4 py-2 font-semibold text-white/80 hover:bg-rose-900 hover:text-white'
      href={href}
      replace
    >
      {children}
    </Link>
  )
}
