import { DialogClose } from '@radix-ui/react-dialog'
import { useLocalStorageValue } from '@react-hookz/web'
import { useTranslation } from 'react-i18next'
import { BaseButton } from '../../../../../../primitives/base-button'

export function ConfigLanguageDialogContent() {
  const { i18n, t } = useTranslation()

  const { remove, set, value } = useLocalStorageValue<string>('i18nextLng', {
    parse(str) {
      return str
    },
    stringify(data) {
      return `${data}`
    },
  })

  function updateLanguage(language: string) {
    if (language) {
      set(language)
    } else {
      remove()
    }
    i18n.changeLanguage()
  }

  return (
    <div>
      <select className='w-52' onChange={(e) => updateLanguage(e.target.value)} value={value || ''}>
        <option value=''>{t('Auto detect')}</option>
        <option value='ar'>عربي</option>
        <option value='de'>Deutsch</option>
        <option value='en'>English</option>
        <option value='es'>Española</option>
        <option value='fr'>Français</option>
        <option value='it'>Italiana</option>
        <option value='ja'>日本語</option>
        <option value='pl'>Polski</option>
        <option value='pt'>Português</option>
        <option value='ru'>Русский</option>
        <option value='zh'>中文</option>
      </select>
      <div className='flex-center mt-8 gap-5'>
        <DialogClose asChild>
          <BaseButton className='autofocus' styleType='primary'>
            <span className='icon-[mdi--close] size-5' />
            {t('Close')}
          </BaseButton>
        </DialogClose>
      </div>
    </div>
  )
}
