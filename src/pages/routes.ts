import { route, type RouteConfig } from '@react-router/dev/routes'

export const routes = {
  demoHome: '/demo',
  demoPlatform: '/demo/platform/:platform',
  demoPlatformRom: '/demo/platform/:platform/rom/:fileName',
  home: '/:language?',
  libraryFavorites: '/library/favorites',
  libraryHistory: '/library/history',
  libraryHome: '/library',
  libraryPlatform: '/library/platform/:platform',
  libraryPlatformRom: '/library/platform/:platform/rom/:fileName',
  libraryRoms: '/library/roms',
  login: '/login',
  loginGoogle: '/login/google',
  loginOidc: '/login/oidc',
  loginOidcCallback: '/login/oidc/callback',
  logout: '/logout',
} as const

export default [
  route(routes.demoHome, 'routes/demo.tsx'),
  route(routes.demoPlatform, 'routes/demo-platform.tsx'),
  route(routes.demoPlatformRom, 'routes/demo-platform-rom.tsx'),
  route(routes.libraryFavorites, 'routes/library-favorites.tsx'),
  route(routes.libraryRoms, 'routes/library-roms.tsx'),
  route(routes.home, 'routes/home.tsx'),
  route(routes.libraryHistory, 'routes/library-history.tsx'),
  route(routes.libraryHome, 'routes/library-home.tsx'),
  route(routes.libraryPlatform, 'routes/library-platform.tsx'),
  route(routes.libraryPlatformRom, 'routes/library-platform-rom.tsx'),
  route(routes.login, 'routes/login.tsx'),
  route(routes.loginGoogle, 'routes/login-google.ts'),
  route(routes.loginOidc, 'routes/login-oidc.ts'),
  route(routes.loginOidcCallback, 'routes/login-oidc-callback.ts'),
  route(routes.logout, 'routes/logout.ts'),
] satisfies RouteConfig
