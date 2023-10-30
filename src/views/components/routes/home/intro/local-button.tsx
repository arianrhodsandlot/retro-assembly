import { useSetAtom } from 'jotai'
import { type ReactNode } from 'react'
import { start, updatePreference, validateRomDirectory } from '../../../../../core'
import { useRouterHelpers } from '../../../hooks/use-router-helpers'
import { BaseButton } from '../../../primitives/base-button'
import { isInvalidDialogOpenAtom } from './atoms'

export function LocalButton({ children }: { children?: ReactNode } = {}) {
  const setIsInvalidDialogOpen = useSetAtom(isInvalidDialogOpenAtom)
  const { navigateToLibrary } = useRouterHelpers()

  async function selectLocalDirectory() {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' })

      const isValid = await validateRomDirectory({ type: 'local', handle })
      if (isValid) {
        await updatePreference({ fileSystem: 'local', directory: '', handle })
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
        <span className='icon-[flat-color-icons--opened-folder] h-5 w-5' />
        select a directory
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
