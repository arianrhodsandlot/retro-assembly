function extractYouTubeId(url: string) {
  const urlObject = new URL(url)
  return urlObject.searchParams.get('v')
}

export function YouTubeEmbed({ url }) {
  const id = extractYouTubeId(url)

  const iframeUrl = new URL(`/embed/${encodeURIComponent(id)}`, 'https://www.youtube.com').href

  return (
    <iframe
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowFullScreen
      className='aspect-video border-none'
      referrerPolicy='strict-origin-when-cross-origin'
      src={iframeUrl}
      title='YouTube video player'
      width='736'
    />
  )
}
