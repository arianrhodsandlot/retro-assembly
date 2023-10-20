import { useAsync } from '@react-hookz/web'
import fileSelect from 'file-select'
import { useAtomValue, useSetAtom } from 'jotai'
import { getSupportedFileExtensions, previewGame } from '../../../core'
import { isGameLaunchedAtom, isGameRunningAtom } from '../atoms'
import { BouncingEllipsis } from '../common/bouncing-ellipsis'
import { UserInteractionButton } from '../common/user-interaction-button'
import { GameMenus } from '../home-screen/game-menus'
import { InputTips } from '../home-screen/input-tips'
import { VirtualController } from '../home-screen/virtual-controller'
import { useUserInteraction } from '../hooks'
import { BaseButton } from '../primitives/base-button'

const supportedFileExtensions = getSupportedFileExtensions()
supportedFileExtensions.unshift('zip')

export function LocalFileButton() {
  const setIsGameRunningAtom = useSetAtom(isGameRunningAtom)
  const isGameLaunched = useAtomValue(isGameLaunchedAtom)
  const { mayNeedsUserInteraction, showInteractionButton, onUserInteract, waitForUserInteraction } =
    useUserInteraction()

  const [state, { execute }] = useAsync(async () => {
    const file: File = await fileSelect({
      accept: supportedFileExtensions.map((extension) => `.${extension}`),
    })
    try {
      setIsGameRunningAtom(true)
      await (mayNeedsUserInteraction ? previewGame(file, { waitForUserInteraction }) : previewGame(file))
      document.body.dispatchEvent(new MouseEvent('mousemove'))
    } catch (error) {
      console.error(error)
    }
  })

  function onClick() {
    if (state.status !== 'loading') {
      execute()
    }
  }

  return (
    <>
      <BaseButton className='w-60' data-testid='select-a-rom' onClick={onClick}>
        <span className='icon-[mdi--zip-box-outline] h-5 w-5' />
        {state.status === 'loading' ? (
          <>
            Loading
            <BouncingEllipsis />
          </>
        ) : (
          'select a ROM'
        )}
      </BaseButton>

      {showInteractionButton ? <UserInteractionButton onUserInteract={onUserInteract} /> : null}

      {isGameLaunched ? (
        <>
          <GameMenus />
          <InputTips />
          <VirtualController />
        </>
      ) : null}
    </>
  )
}
