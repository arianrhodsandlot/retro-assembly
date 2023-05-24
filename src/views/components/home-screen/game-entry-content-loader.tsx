import ContentLoader from 'react-content-loader'

export default function GameEntryContentLoader(props?) {
  return (
    <ContentLoader backgroundColor='#f3f3f3' foregroundColor='#ecebeb' height={240} speed={2} width={240} {...props}>
      <rect height='240' width='240' />
    </ContentLoader>
  )
}
