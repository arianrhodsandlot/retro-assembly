import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['opendal'],
  transpilePackages: ['supabase'],
}

export default nextConfig
