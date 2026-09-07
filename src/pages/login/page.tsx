import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import { metadata } from '#@/constants/metadata.ts'
import type { loader } from '../routes/login.tsx'
import { LoginForm } from './components/log-in-form.tsx'
import { LogInWithGoogleButton } from './components/log-in-with-google-button.tsx'
import { LogInWithOidcButton } from './components/log-in-with-oidc-button.tsx'
import { PageContainer } from './components/page-container.tsx'
import { RegisterForm } from './components/register-form.tsx'

export function LoginPage() {
  const { t } = useTranslation()
  const { error, formType, redirectTo } = useLoaderData<typeof loader>()

  if (error) {
    return <PageContainer title={t('auth.login')}>{error.message}</PageContainer>
  }

  const title = formType === 'register' ? metadata.title : t('auth.loginToTitle', { title: metadata.title })
  const description = {
    oauth: t('auth.loginToBuildCollection'),
    oidc: t('auth.loginToBuildCollection'),
    register: t('auth.createAccountToGetStarted'),
  }[formType]
  return (
    <PageContainer description={description} title={title}>
      {formType === 'register' ? <RegisterForm redirectTo={redirectTo} /> : null}
      {formType === 'login' ? <LoginForm redirectTo={redirectTo} /> : null}
      {formType === 'oauth' ? <LogInWithGoogleButton redirectTo={redirectTo} /> : null}
      {formType === 'oidc' ? <LogInWithOidcButton redirectTo={redirectTo} /> : null}
    </PageContainer>
  )
}
