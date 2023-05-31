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
  return isOpen ? (
    <div className='fixed left-0 top-0 flex h-screen w-screen'>
      <div aria-hidden className='absolute h-full w-full  bg-[#000000af]' onClick={() => onClickBackdrop?.()} />
      <div
        className='absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 rounded bg-white shadow'
        style={style}
      >
        <div className='h-full w-full overflow-auto'>{children}</div>
      </div>
    </div>
  ) : null
}
