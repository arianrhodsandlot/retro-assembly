import { createPages } from 'waku'
import type { PathsForPages } from 'waku/router'
import { LibraryPage } from './pages/library/page.tsx'
import { PlatformPage } from './pages/library/platform/page.tsx'
import { RomPage } from './pages/library/rom/page.tsx'
import { LoginPage } from './pages/login/page.tsx'
import { HomePage } from './pages/page.tsx'
import { Root } from './pages/root.tsx'

const pages = createPages(({ createPage, createRoot }) =>
  Promise.resolve([
    createRoot({ component: Root, render: 'static' }),
    createPage({ component: HomePage, path: '/', render: 'dynamic' }),
    createPage({ component: LoginPage, path: '/login', render: 'dynamic' }),
    createPage({ component: LibraryPage, path: '/library', render: 'dynamic' }),
    createPage({ component: PlatformPage, path: '/library/platform/[platform]', render: 'dynamic' }),
    createPage({ component: RomPage, path: '/library/rom/[id]', render: 'dynamic' }),
    createPage({
      component: ({ all }) => <h2>404 Catch-all: {all.join('/')}</h2>,
      path: '/[...all]',
      render: 'dynamic',
    }),
  ]),
)

declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<typeof pages>
  }

  interface CreatePagesConfig {
    pages: typeof pages
  }
}

export default pages
