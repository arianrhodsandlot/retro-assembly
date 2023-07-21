import { ClearSiteDataButton } from './clear-site-data-button'
import { ConfigGamepadButton } from './config-gamepad-button'
import { InputHelpButton } from './input-help-button'
import { Logo } from './logo'
import { SystemNavigation } from './system-navigation'

export function TopBar() {
  return (
    <div className='system-navigation z-[1] flex h-16 w-full items-stretch overflow-x-auto overflow-y-hidden border-b border-black bg-rose-700 text-white'>
      <Logo />
      <SystemNavigation />
      <InputHelpButton />
      <ConfigGamepadButton />
      <ClearSiteDataButton />
    </div>
  )
}
