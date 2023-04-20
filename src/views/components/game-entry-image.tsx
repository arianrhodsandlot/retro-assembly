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
            className='w-full h-full bg-cover absolute top-0 bg-center'
            style={{
              backgroundImage: `url("${src}")`,
            }}
          />
          <div className='w-full h-full backdrop-blur-sm absolute top-0' />
        </>
      )}
      {src && (
        <img
          className={classNames('w-full h-full object-contain absolute', loading ? '-top-[9999px]' : 'top-0')}
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
