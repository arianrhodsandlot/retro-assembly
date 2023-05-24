export function Modal({
  isOpen = false,
  children,
  onClickBackdrop,
}: {
  isOpen?: boolean
  children: JSX.Element
  onClickBackdrop?: () => void
}) {
  return isOpen ? (
    <div className='fixed left-0 top-0 flex h-screen w-screen'>
      <div aria-hidden className='absolute h-full w-full  bg-[#000000af]' onClick={() => onClickBackdrop?.()} />
      <div className='absolute left-[50%] top-[50%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-white p-4'>
        {children}
      </div>
    </div>
  ) : null
}
