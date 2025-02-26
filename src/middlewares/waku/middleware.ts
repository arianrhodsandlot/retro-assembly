export function middleware() {
  return [
    import('waku/middleware/context'),

    import('./cloudflare.ts'),
    import('./globals.ts'),
    import('./auth.ts'),

    import('waku/middleware/dev-server'),
    import('waku/middleware/handler'),
  ]
}
