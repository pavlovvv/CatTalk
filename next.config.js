/** @type {import('next').NextConfig} */
const {i18n} = require('./next-i18next.config')


const nextConfig = {
  i18n,
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'upload.wikimedia.org', 'cdn.icon-icons.com'],
    loader: 'akamai',
    path: ''
  },
}

module.exports = nextConfig
