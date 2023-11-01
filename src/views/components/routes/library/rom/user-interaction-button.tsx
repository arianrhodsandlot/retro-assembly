import { BaseDialogContent } from '../../../primitives/base-dialog-content'
import { isTouchDevice } from '../lib/utils'

interface UserInteractionButtonProps {
  onUserInteract: () => void
}

export function UserInteractionButton({ onUserInteract }: UserInteractionButtonProps) {
  return (
    <BaseDialogContent>
      <div className='flex-center flex-col'>
        <button
          aria-hidden
          className='flex-center relative w-72 cursor-pointer rounded border-2 border-rose-700 bg-rose-700 px-4 py-2 text-sm text-white'
          onClick={onUserInteract}
        >
          {isTouchDevice() ? (
            <>
              <span className='icon-[mdi--gesture-tap] mr-2 h-5 w-5 shrink-0' />
              Tap here to launch the game
            </>
          ) : (
            <>
              <span className='icon-[mdi--cursor-default-click] mr-2 h-5 w-5 shrink-0' />
              Click here to launch the game
            </>
          )}
        </button>
        <div className='mt-2 flex max-w-xs text-xs text-rose-700'>
          <span className='icon-[mdi--lightbulb-on-outline] mr-2 h-4 w-4 shrink-0' />
          <div>
            This is due to a limitation of the browser.
            <br />A game can only run after the screen is tapped, rather than clicking a button on a gamepad.
          </div>
        </div>
      </div>
    </BaseDialogContent>
  )
}
