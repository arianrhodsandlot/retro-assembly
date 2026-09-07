import { Button } from '@radix-ui/themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, Link } from 'react-router'
import { routes } from '#@/pages/routes.ts'

export function LogInWithOidcButton({ redirectTo }: Readonly<{ redirectTo: string }>) {
  const { t } = useTranslation()
  const [clicked, setClicked] = useState(false)

  return (
    <div className='text-center'>
      <Button asChild disabled={clicked} onClick={() => setClicked(true)} size='3' variant='soft'>
        <Link
          className='flex items-center gap-2'
          to={{
            pathname: generatePath(routes.loginOidc),
            search: `?redirect_to=${encodeURIComponent(redirectTo)}`,
          }}
        >
          <span className='icon-[mdi--shield-account]' />
          {t('auth.loginWithSso')}
        </Link>
      </Button>
    </div>
  )
}
