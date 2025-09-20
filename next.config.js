/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  output: 'export',
  trailingSlash: true,
  distDir: 'dist',
}

module.exports = nextConfig
