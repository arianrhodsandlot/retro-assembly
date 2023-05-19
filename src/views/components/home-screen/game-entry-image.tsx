export default function GameEntryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <div className='absolute inset-0 overflow-hidden'>
        <div
          className='blur-25px absolute -inset-[25px] overflow-hidden bg-cover bg-center blur'
          style={{
            imageRendering: 'pixelated',
            backgroundImage: `url("${src}")`,
          }}
        />
      </div>
      <img
        className='absolute top-0 h-full w-full object-contain'
        style={{ imageRendering: 'pixelated' }}
        src={src}
        alt={alt}
      />
    </>
  )
}
