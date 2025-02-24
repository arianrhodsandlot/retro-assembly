export function shouldApplyMiddlware(pathname: string) {
  const [, subPath] = pathname.split('/')
  const pageSubPaths = ['', 'app', 'login', 'library', 'RSC']
  return pageSubPaths.includes(subPath)
}
