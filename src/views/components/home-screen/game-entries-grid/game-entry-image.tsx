export function GameEntryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -inset-[25px]'>
          <img
            alt={alt}
            className='absolute h-full w-full overflow-hidden object-cover blur-sm'
            src={src}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>
      <img
        alt={alt}
        className='absolute top-0 h-full w-full object-contain'
        src={src}
        style={{ imageRendering: 'pixelated' }}
      />
    </>
  )
}
