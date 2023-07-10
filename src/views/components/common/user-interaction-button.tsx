import { BaseDialogContent } from '../primitives/base-dialog-content'

interface UserInteractionButtonProps {
  onUserInteract: () => void
}

export function UserInteractionButton({ onUserInteract }: UserInteractionButtonProps) {
  return (
    <BaseDialogContent>
      <div
        aria-hidden
        className='relative flex cursor-pointer items-center justify-center rounded border-2 border-rose-700 bg-rose-700 px-4 py-2 text-white'
        onClick={onUserInteract}
      >
        <span className='icon-[mdi--gesture-tap] mr-2 h-5 w-5' />
        Tap here to launch the game
      </div>
      <div className='mt-2 flex max-w-xs text-xs'>
        <span className='icon-[mdi--lightbulb-on-outline] mr-2 h-4 w-4' />
        <div>
          This is due to a limitation of the browser.
          <br />A game can only run after the screen is tapped, rather than clicking a button on a gamepad.
        </div>
      </div>
    </BaseDialogContent>
  )
}
