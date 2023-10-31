import { useLocation, useParams, useRoute, useRouter } from 'wouter'

const encode = encodeURIComponent

export function useRouterHelpers() {
  const [location, setLocation] = useLocation()
  const params = useParams()
  const router = useRouter()
  const [isHome] = useRoute('/')
  const wouter = { location, setLocation, router, params, useRoute }

  const { library = 'public', platform = isHome ? 'nes' : '', rom } = params
  const normalizedParams = { library, platform, rom }

  function replactLocation(to: string) {
    setLocation(to, { replace: true })
  }

  function linkToLibrary(library: string = normalizedParams.library) {
    return `/library/${encode(library)}/platform`
  }

  function linkToPlatform(platform: string = normalizedParams.platform, library: string = normalizedParams.library) {
    return `/library/${encode(library)}/platform/${encode(platform)}`
  }

  function linkToRom(rom: string) {
    const { library, platform } = normalizedParams
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

  function navigateToRom(rom: string) {
    const link = linkToRom(rom)
    replactLocation(link)
  }

  function navigateToHome() {
    replactLocation('/')
  }

  return {
    params: normalizedParams,
    isHome,
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
