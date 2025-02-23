import { clsx } from 'clsx'
import { Link } from 'waku/router/client'

export function SidebarLink({ children, href }) {
  const active = false

  return (
    <Link
      className={clsx(
        'flex items-center gap-1.5 px-4 py-2 font-semibold text-white/80 hover:bg-rose-900 hover:text-white',
        {
          'bg-rose-900 text-white': active,
        },
      )}
      to={href}
    >
      {children}
    </Link>
  )
}
