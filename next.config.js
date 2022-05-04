/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['upload.wikimedia.org', 'cdn.icon-icons.com'],
    loader: 'akamai',
    path: ''
  },
}

module.exports = nextConfig
