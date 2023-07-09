import fileSelect from 'file-select'
import { previewGame } from '../../../core'
import { GameMenus } from '../home-screen/game-menus'
import { BaseButton } from '../primitives/base-button'

async function onClick() {
  const file: File = await fileSelect()
  if (file) {
    await previewGame(file)
  }
}

export function LocalFileButton() {
  return (
    <>
      <BaseButton className='w-60' onClick={onClick}>
        <span className='icon-[mdi--desktop-classic] h-5 w-5' />
        select a file
      </BaseButton>

      <GameMenus />
    </>
  )
}
