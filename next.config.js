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
      'lh3.googleusercontent.com'
    ]
  },
};

module.exports = nextConfig;
