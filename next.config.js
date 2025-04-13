/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Add custom headers for SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
    ]
  },
  // Add custom rewrites to handle any old Vercel URLs
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite any old Vercel URLs to your domain
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?!listagain.vercel.app).*\\.vercel\\.app',
            },
          ],
          destination: 'https://listagain.vercel.app/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig
