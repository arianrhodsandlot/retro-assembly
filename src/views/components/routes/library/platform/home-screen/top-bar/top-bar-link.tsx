import { TopBarButton } from './top-bar-button'

export function TopBarLink() {
  return (
    <a href='https://github.com/arianrhodsandlot/retro-assembly' rel='noreferrer' target='_blank'>
      <TopBarButton className='flex-center aspect-square'>
        <span className='icon-[simple-icons--github] relative z-[1] size-8' />
      </TopBarButton>
    </a>
  )
}
