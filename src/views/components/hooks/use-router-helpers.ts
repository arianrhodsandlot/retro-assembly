import { useLocation, useParams, useRoute, useRouter } from 'wouter'

const encode = encodeURIComponent

export function useRouterHelpers() {
  const [location, setLocation] = useLocation()
  const params = useParams()
  const router = useRouter()
  const [isHome] = useRoute('/')
  const wouter = { location, setLocation, router, params, useRoute }

  const { library = 'public', system = isHome ? 'nes' : '', rom } = params
  const normalizedParams = { library, system, rom }

  function replactLocation(to: string) {
    setLocation(to, { replace: true })
  }

  function linkToLibrary(library: string = normalizedParams.library) {
    return `/library/${encode(library)}/system`
  }

  function linkToSystem(system: string = normalizedParams.system, library: string = normalizedParams.library) {
    return `/library/${encode(library)}/system/${encode(system)}`
  }

  function linkToRom(rom: string) {
    const { library, system } = normalizedParams
    return `/library/${encode(library)}/system/${encode(system)}/rom/${encode(rom)}`
  }

  function navigateToLibrary(library: string = normalizedParams.library) {
    const link = linkToLibrary(library)
    replactLocation(link)
  }

  function navigateToSystem(system: string = normalizedParams.system, library: string = normalizedParams.library) {
    const link = linkToSystem(system, library)
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
    linkToSystem,
    linkToRom,
    navigateToLibrary,
    navigateToSystem,
    navigateToRom,
    navigateToHome,
    replactLocation,
    wouter,
  }
}
