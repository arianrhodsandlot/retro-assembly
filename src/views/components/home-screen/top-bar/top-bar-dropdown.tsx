import clsx from 'clsx'
import delay from 'delay'
import $ from 'jquery'
import { useRef, useState } from 'react'
import { onCancel } from '../../../../core'
import { ClearSiteDataButton } from './clear-site-data-button'
import { ConfigGamepadButton } from './config-gamepad-button'
import { InputHelpButton } from './input-help-button'
import { TopBarButton } from './top-bar-button'

export function TopBarDropdown() {
  const elementRef = useRef(null)
  const dropdownItemsContainerRef = useRef(null)
  const offCancelRef = useRef<() => void>()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  function onFocusCapture(event) {
    if (isDropdownOpen) {
      return
    }

    const isFocusingDropdownItems =
      dropdownItemsContainerRef.current && $.contains(dropdownItemsContainerRef.current, event.target)
    if (isFocusingDropdownItems) {
      closeDropdown()
    }
  }

  async function onBlurCapture() {
    // if we do not wait for a delay, `document.activeElement` will always be "body"
    await delay(0)

    const shouldKeepOpen =
      elementRef.current && document.activeElement && $.contains(elementRef.current, document.activeElement)

    if (shouldKeepOpen) {
      return
    }

    setIsDropdownOpen(false)
    offCancelRef.current?.()
  }

  async function openDropdown() {
    setIsDropdownOpen(true)
    const offCancel = onCancel(() => {
      const shouldClose =
        elementRef.current && document.activeElement && $.contains(elementRef.current, document.activeElement)
      if (shouldClose) {
        closeDropdown()
      }
      offCancel()
    })
    offCancelRef.current = offCancel

    await delay(0)

    if (elementRef.current) {
      const button = $('button:eq(1)', elementRef.current)
      button.trigger('focus')
    }
  }

  async function closeDropdown() {
    setIsDropdownOpen(false)
    offCancelRef.current?.()
    if (!elementRef.current || !document.activeElement) {
      return
    }
    await delay(0)
    if ($.contains(elementRef.current, document.activeElement)) {
      const button = $('button:first', elementRef.current)
      button.trigger('focus')
    }
  }

  function toggleDropdown() {
    if (isDropdownOpen) {
      closeDropdown()
    } else {
      openDropdown()
    }
  }

  return (
    <div onBlurCapture={onBlurCapture} onFocusCapture={onFocusCapture} ref={elementRef}>
      <TopBarButton className='flex aspect-square items-center justify-center' onClick={toggleDropdown}>
        <span className='icon-[mdi--menu] relative z-[1] h-8 w-8' />
      </TopBarButton>

      <div
        className={clsx(
          'absolute right-0 top-16 -mt-[1px] flex origin-top transform-gpu flex-col justify-stretch border border-r-0 border-t-0 border-b-black border-l-black bg-rose-700 transition-transform',
          { 'scale-y-0': !isDropdownOpen },
        )}
        ref={dropdownItemsContainerRef}
      >
        <InputHelpButton />
        <ConfigGamepadButton />
        <ClearSiteDataButton />
      </div>
    </div>
  )
}
