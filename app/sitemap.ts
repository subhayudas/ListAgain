import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://listagain.vercel.app'
  
  // Define your main routes
  const routes = [
    '',
    '/products',
    '/sell',
    '/login',
    '/register',
    '/my-listings',
    '/profile',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))
  
  return routes
}