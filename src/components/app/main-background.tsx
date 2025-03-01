export function MainBackground({ alt, src }: { alt?: string; src?: string }) {
  return src ? (
    <div className='blur-xs pointer-events-none absolute inset-y-0 right-0 aspect-square'>
      <img alt={alt || ''} className='absolute size-full object-cover object-center' src={src} />
      <div className='bg-linear-to-l absolute top-0 size-full from-zinc-50/30 to-zinc-50' />
      <div className='bg-linear-to-b absolute top-0 size-full from-zinc-50/30 to-zinc-50' />
    </div>
  ) : null
}
