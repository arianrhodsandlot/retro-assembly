import { clsx } from 'clsx'
import { Link } from 'waku/router/client'

export function SidebarLink({ active = false, children, href }) {
  return (
    <Link
      className={clsx(
        'mx-2 flex items-center gap-2 rounded px-4 py-2.5 font-semibold  transition-colors hover:bg-rose-900 hover:text-white',
        active ? 'bg-rose-900 font-semibold text-white' : 'text-white/80 ',
      )}
      to={href}
    >
      {children}
    </Link>
  )
}
