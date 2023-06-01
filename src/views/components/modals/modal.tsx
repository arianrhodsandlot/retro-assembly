import { createPortal } from 'react-dom'

export function Modal({
  isOpen = false,
  children,
  style,
  onClickBackdrop,
}: {
  isOpen?: boolean
  children: JSX.Element
  style?: object
  onClickBackdrop?: () => void
}) {
  style ??= { width: '500px', height: '500px' }

  const modal = isOpen ? (
    <div className='modal fixed left-0 top-0 z-10 flex h-screen w-screen'>
      <div aria-hidden className='absolute h-full w-full  bg-[#000000af]' onClick={() => onClickBackdrop?.()} />
      <div
        className='absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 rounded bg-white shadow'
        style={style}
      >
        <div className='h-full w-full overflow-auto'>{children}</div>
      </div>
    </div>
  ) : null

  return createPortal(modal, document.body)
}
