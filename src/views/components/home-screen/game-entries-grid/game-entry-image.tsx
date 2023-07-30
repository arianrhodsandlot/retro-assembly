export function GameEntryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className='absolute inset-0 overflow-hidden bg-zinc-300'>
      <img
        alt={alt}
        className='absolute top-0 h-full w-full scale-150 bg-cover object-cover opacity-20'
        loading='lazy'
        src={src}
        style={{ imageRendering: 'pixelated' }}
      />
      <img
        alt={alt}
        className='absolute top-0 h-full w-full bg-cover object-contain'
        loading='lazy'
        src={src}
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
