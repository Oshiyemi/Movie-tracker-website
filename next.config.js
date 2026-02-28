/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NETLIFY_NEXT_EXPORT === 'true'

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
  ...(isStaticExport
    ? {
        output: 'export',
      }
    : {}),
}

module.exports = nextConfig