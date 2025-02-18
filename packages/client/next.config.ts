import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.jsdelivr.net',
        protocol: 'https',
      },
    ],
  },
  serverExternalPackages: ['opendal'],
}

export default nextConfig
