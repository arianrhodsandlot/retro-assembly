import { useLocation, useParams, useRoute, useRouter } from 'wouter'
import { isUsingDemo } from '../../../core'
import { routes } from '../../lib/routes'

const encode = encodeURIComponent

export function useRouterHelpers() {
  const [location, setLocation] = useLocation()
  const params = useParams()
  const router = useRouter()

  const [isHomeRoute] = useRoute(routes.home)
  const [isPlatformRoute] = useRoute(routes.platform)
  const [isRomRoute] = useRoute(routes.rom)

  const wouter = { location, params, router, setLocation, useRoute }

  let { library = 'public', platform = '', rom } = params
  if (isHomeRoute && isUsingDemo()) {
    platform ||= 'nes'
  }
  library = decodeURIComponent(library)
  platform = decodeURIComponent(platform)
  rom &&= decodeURIComponent(rom)
  const normalizedParams = { library, platform, rom }

  function linkToLibrary(library: string = normalizedParams.library) {
    return `/library/${encode(library)}/platform`
  }

  function linkToPlatform(platform: string = normalizedParams.platform, library: string = normalizedParams.library) {
    return `/library/${encode(library)}/platform/${encode(platform)}`
  }

  function linkToRom(rom: string, platform: string) {
    const { library } = normalizedParams
    return `/library/${encode(library)}/platform/${encode(platform)}/rom/${encode(rom)}`
  }

  function navigateToLibrary(library: string = normalizedParams.library) {
    const link = linkToLibrary(library)
    setLocation(link)
  }

  function navigateToPlatform(
    platform: string = normalizedParams.platform,
    library: string = normalizedParams.library,
  ) {
    const link = linkToPlatform(platform, library)
    setLocation(link)
  }

  function navigateToRom(rom: string, platform: string) {
    const link = linkToRom(rom, platform)
    setLocation(link)
  }

  function navigateToHome() {
    setLocation('/')
  }

  function redirectToLibrary(library: string = normalizedParams.library) {
    const link = linkToLibrary(library)
    setLocation(link, { replace: true })
  }

  function redirectToPlatform(
    platform: string = normalizedParams.platform,
    library: string = normalizedParams.library,
  ) {
    const link = linkToPlatform(platform, library)
    setLocation(link, { replace: true })
  }

  function redirectToRom(rom: string, platform: string) {
    const link = linkToRom(rom, platform)
    setLocation(link, { replace: true })
  }

  function redirectToHome() {
    setLocation('/', { replace: true })
  }

  return {
    isHomeRoute,
    isPlatformRoute,
    isRomRoute,
    linkToLibrary,
    linkToPlatform,
    linkToRom,
    navigateToHome,
    navigateToLibrary,
    navigateToPlatform,
    navigateToRom,
    params: normalizedParams,
    redirectToHome,
    redirectToLibrary,
    redirectToPlatform,
    redirectToRom,
    wouter,
  }
}
