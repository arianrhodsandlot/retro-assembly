type IntrinsicImgProps = Partial<JSX.IntrinsicElements['img']>
type GameEntryImageProps = Pick<IntrinsicImgProps, 'src' | 'alt'>

export function GameEntryImage({ src, alt }: GameEntryImageProps) {
  return (
    <div className='absolute inset-0 overflow-hidden bg-zinc-300'>
      <img
        alt={alt}
        className='absolute top-0 size-full scale-150 bg-cover object-cover opacity-20'
        src={src}
        style={{ imageRendering: 'pixelated' }}
      />
      <img
        alt={alt}
        className='absolute top-0 size-full bg-cover object-contain'
        src={src}
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
