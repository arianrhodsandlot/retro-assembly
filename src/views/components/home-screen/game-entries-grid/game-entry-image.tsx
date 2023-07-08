export function GameEntryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className='absolute inset-0 overflow-hidden bg-black'>
      <img
        alt={alt}
        className='absolute inset-0 scale-150 bg-cover object-cover opacity-50'
        src={src}
        style={{ imageRendering: 'pixelated' }}
      />
      <img
        alt={alt}
        className='absolute top-0 h-full w-full bg-cover object-contain'
        src={src}
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
