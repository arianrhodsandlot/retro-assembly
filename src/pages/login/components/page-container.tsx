import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLoaderData } from 'react-router'
import { metadata } from '#@/constants/metadata.ts'
import { Logo } from '#@/pages/components/logo.tsx'
import type { loader } from '../../routes/login.tsx'

interface PageContainerProps extends PropsWithChildren {
  description?: string
  title: string
}

export function PageContainer({ children, description, title }: Readonly<PageContainerProps>) {
  const { t } = useTranslation()
  const { formType } = useLoaderData<typeof loader>()

  return (
    <>
      <title>{t('auth.loginToTitle', { title: metadata.title })}</title>
      <div className='min-h-dvh bg-(--accent-9) px-4 py-20'>
        <div className='mx-auto w-full max-w-full rounded bg-(--color-background) p-10 md:w-3xl'>
          <div className='flex items-center justify-center gap-4'>
            <Link className='flex items-center justify-center' reloadDocument to='/'>
              <Logo height='32' width='32' />
            </Link>
            <h1 className='text-3xl font-semibold'>{title}</h1>
          </div>

          {description ? <div className='mt-4 text-center text-(--color-text)/40'>{description}</div> : null}

          <div className='mt-4 border-t border-t-(--gray-6) py-8'>{children}</div>

          {formType === 'oauth' || formType === 'oidc' ? (
            <div className='text-center text-xs text-(--color-text)/40'>
              {t('auth.agreeToTermsPrefix')}{' '}
              <a className='underline' href='/privacy-policy.md' rel='noopener noreferrer' target='_blank'>
                {t('common.privacyPolicy')}
              </a>
              .
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
