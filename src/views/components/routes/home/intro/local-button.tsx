import { useSetAtom } from 'jotai'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { start, updatePreference, validateRomDirectory } from '../../../../../core'
import { useRouterHelpers } from '../../../hooks/use-router-helpers'
import { BaseButton } from '../../../primitives/base-button'
import { isInvalidDialogOpenAtom } from './atoms'

export function LocalButton({ children }: { children?: ReactNode } = {}) {
  const { t } = useTranslation()
  const setIsInvalidDialogOpen = useSetAtom(isInvalidDialogOpenAtom)
  const { navigateToLibrary } = useRouterHelpers()

  async function selectLocalDirectory() {
    try {
      const handle = await globalThis.showDirectoryPicker({ mode: 'readwrite' })

      const isValid = await validateRomDirectory({ handle, type: 'local' })
      if (isValid) {
        await updatePreference({ directory: '', fileSystem: 'local', handle })
        setIsInvalidDialogOpen(false)
        await start()
        navigateToLibrary('local')
      } else {
        setIsInvalidDialogOpen(true)
      }
    } catch {}
  }

  if (!children) {
    return (
      <BaseButton className='w-60' onClick={selectLocalDirectory} styleType='primary'>
        <span className='icon-[flat-color-icons--opened-folder] size-5' />
        {t('select a directory')}
      </BaseButton>
    )
  }

  if (typeof children === 'object' && 'type' in children) {
    const node: ReactNode = {
      ...children,
      props: {
        ...children.props,
        onClick: selectLocalDirectory,
      },
    }
    return node
  }
}
