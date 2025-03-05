/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    domains: [
      'images.unsplash.com',
      'xsgames.co',
      'via.placeholder.com',
    ]
  },
  transpilePackages: ['framer-motion'],
}

module.exports = nextConfig
