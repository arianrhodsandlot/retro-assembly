import { Button, Callout, Checkbox, Dialog, Text } from '@radix-ui/themes'
import { useState, type SubmitEvent } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { client, parseResponse } from '#@/api/client.ts'
import { libraryModeEnum } from '#@/databases/schema.ts'
import { AccountFormField } from '#@/pages/components/account-form-field.tsx'
import { useGlobalLoaderData } from '#@/pages/hooks/use-global-loader-data.ts'

interface CreateUserDialogProps {
  onOpenChange: (open: boolean) => void
  onSuccess: (newUserId?: string) => void
  open: boolean
}

export function CreateUserDialog({ onOpenChange, onSuccess, open }: Readonly<CreateUserDialogProps>) {
  const { t } = useTranslation()
  const { authMode } = useGlobalLoaderData()
  const [error, setError] = useState<null | string>(null)

  const { isMutating, trigger } = useSWRMutation(
    { endpoint: 'users', method: 'post' },
    async (_key, { arg }: { arg: { libraryMode: string; password?: string; username: string } }) => {
      setError(null)
      return await parseResponse(
        client.users.$post({
          form: { libraryMode: arg.libraryMode, password: arg.password, username: arg.username },
        }),
      )
    },
    {
      onError: (err) => {
        setError(err.message || t('error.unknown'))
      },
      onSuccess: (result) => {
        onSuccess(result?.id)
        onOpenChange(false)
      },
    },
  )

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')?.toString() || ''
    const password = formData.get('password')?.toString()
    const libraryMode =
      formData.get('libraryMode') === 'on' ? String(libraryModeEnum.shared) : String(libraryModeEnum.isolated)

    if (authMode === 'local' && formData.get('password') !== formData.get('repeat_password')) {
      setError(t('auth.passwordsDoNotMatch'))
      return
    }

    await trigger({ libraryMode, password, username })
  }

  function handleOpenChange(open: boolean) {
    if (!isMutating) {
      setError(null)
      onOpenChange(open)
    }
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Content>
        <Dialog.Title>
          <div className='flex items-center'>
            <span className='icon-[mdi--account-plus] mr-2' />
            {t('auth.createNewUser')}
          </div>
        </Dialog.Title>
        <form onSubmit={handleSubmit}>
          <div className='my-4 flex flex-col gap-4'>
            <AccountFormField
              iconClass='icon-[mdi--user-card-details]'
              label={t('auth.username')}
              name='username'
              required
            />
            {authMode === 'local' ? (
              <>
                <AccountFormField
                  autocomplete='new-password'
                  description={t('auth.passwordRecommendation')}
                  iconClass='icon-[mdi--password]'
                  label={t('auth.password')}
                  name='password'
                  required
                  type='password'
                />
                <AccountFormField
                  autocomplete='new-password'
                  iconClass='icon-[mdi--password-check]'
                  label={t('auth.repeatPassword')}
                  name='repeat_password'
                  required
                  type='password'
                />
              </>
            ) : null}
            <div className='mt-2'>
              <label className='flex cursor-pointer items-start gap-2'>
                <Checkbox defaultChecked name='libraryMode' />
                <div className='flex flex-col'>
                  <Text size='2' weight='medium'>
                    {t('auth.libraryModeShared')}
                  </Text>
                  <Text className='opacity-70' size='1'>
                    {t('auth.libraryModeDescription')}
                  </Text>
                </div>
              </label>
            </div>
          </div>
          {error ? (
            <Callout.Root className='mb-4' color='red'>
              <Callout.Icon>
                <span className='icon-[mdi--information]' />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          ) : null}
          <div className='flex justify-end gap-3'>
            <Dialog.Close>
              <Button disabled={isMutating} variant='soft'>
                <span className='icon-[mdi--close]' />
                {t('common.cancel')}
              </Button>
            </Dialog.Close>
            <Button loading={isMutating} type='submit'>
              <span className='icon-[mdi--account-plus]' />
              {t('auth.createUser')}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
