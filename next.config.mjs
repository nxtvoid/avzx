/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path((?!docs|_next|favicon.ico).*)',
          destination: '/api/:path*'
        }
      ]
    }
  }
}

export default nextConfig
