import classNames from 'classnames'

export default function GameEntryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <div
        className='blur-25px absolute -inset-1/2 bg-cover bg-center blur'
        style={{
          imageRendering: 'pixelated',
          backgroundImage: `url("${src}")`,
        }}
      />
      <img
        className='absolute top-0 h-full w-full object-contain'
        style={{ imageRendering: 'pixelated' }}
        src={src}
        alt={alt}
      />
    </>
  )
}
