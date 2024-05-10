/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API: 'http://localhost:8888/api'
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

export default nextConfig
