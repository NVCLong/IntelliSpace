/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API: 'http://localhost:8888/api'
  },
  experimental: {
    forceSwcTransforms: false
  }
}

export default nextConfig
