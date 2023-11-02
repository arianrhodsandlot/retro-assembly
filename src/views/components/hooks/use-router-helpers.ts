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

  const wouter = { location, setLocation, router, params, useRoute }

  let { library = 'public', platform = '', rom } = params
  if (isHomeRoute && isUsingDemo()) {
    platform ||= 'nes'
  }
  library = decodeURIComponent(library)
  platform = decodeURIComponent(platform)
  rom &&= decodeURIComponent(rom)
  const normalizedParams = { library, platform, rom }

  function replactLocation(to: string) {
    setLocation(to, { replace: false })
  }

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
    replactLocation(link)
  }

  function navigateToPlatform(
    platform: string = normalizedParams.platform,
    library: string = normalizedParams.library,
  ) {
    const link = linkToPlatform(platform, library)
    replactLocation(link)
  }

  function navigateToRom(rom: string, platform: string) {
    const link = linkToRom(rom, platform)
    replactLocation(link)
  }

  function navigateToHome() {
    replactLocation('/')
  }

  return {
    params: normalizedParams,
    isHomeRoute,
    isPlatformRoute,
    isRomRoute,
    linkToLibrary,
    linkToPlatform,
    linkToRom,
    navigateToLibrary,
    navigateToPlatform,
    navigateToRom,
    navigateToHome,
    replactLocation,
    wouter,
  }
}
