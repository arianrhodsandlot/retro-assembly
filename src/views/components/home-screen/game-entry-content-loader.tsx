import ContentLoader from 'react-content-loader'

export default function GameEntryContentLoader(props?) {
  return (
    <ContentLoader speed={2} width={240} height={240} backgroundColor='#f3f3f3' foregroundColor='#ecebeb' {...props}>
      <rect width='240' height='240' />
    </ContentLoader>
  )
}
