import classNames from 'classnames'

export default function GameEntryImage({
  status: { valid, loading },
  src,
  alt,
  onLoad,
  onError,
}: {
  status: {
    valid: boolean
    loading: boolean
  }
  src: string
  alt: string
  onLoad: any
  onError: any
}) {
  const isLoaded = valid && !loading
  return (
    <>
      {isLoaded && (
        <>
          <div
            className='absolute top-0 h-full w-full bg-cover bg-center'
            style={{
              backgroundImage: `url("${src}")`,
            }}
          />
          <div className='absolute top-0 h-full w-full backdrop-blur-sm' />
        </>
      )}
      {src && (
        <img
          className={classNames('absolute h-full w-full object-contain', loading ? '-top-[9999px]' : 'top-0')}
          style={{ imageRendering: 'pixelated' }}
          src={src}
          alt={alt}
          onLoad={onLoad}
          onError={onError}
        />
      )}
    </>
  )
}
