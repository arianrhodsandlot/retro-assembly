import fileSelect from 'file-select'
import { previewGame } from '../../../core'
import { UserInteractionButton } from '../common/user-interaction-button'
import { GameMenus } from '../home-screen/game-menus'
import { useUserInteraction } from '../hooks'
import { BaseButton } from '../primitives/base-button'

export function LocalFileButton() {
  const {
    mayNeedsUserInteraction,
    showInteractionButton,
    setNeedsUserInteraction,
    onUserInteract,
    waitForUserInteraction,
  } = useUserInteraction()

  async function onClick() {
    setNeedsUserInteraction(mayNeedsUserInteraction)

    const file: File = await fileSelect()
    if (file) {
      try {
        await (mayNeedsUserInteraction ? previewGame(file, { waitForUserInteraction }) : previewGame(file))
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <>
      <BaseButton className='w-60' onClick={onClick}>
        <span className='icon-[mdi--zip-box-outline] h-5 w-5' />
        select a file
      </BaseButton>

      {showInteractionButton ? <UserInteractionButton onUserInteract={onUserInteract} /> : null}

      <GameMenus />
    </>
  )
}
