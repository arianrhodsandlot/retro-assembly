export function Modal({
  isOpen,
  children,
  onClickBackdrop,
}: {
  isOpen: boolean
  children: JSX.Element
  onClickBackdrop?: () => void
}) {
  return isOpen ? (
    <div className='fixed left-0 top-0 flex h-screen w-screen'>
      <div className='absolute h-full w-full  bg-[#000000af]' onClick={() => onClickBackdrop?.()} aria-hidden></div>
      {children}
    </div>
  ) : (
    <></>
  )
}
