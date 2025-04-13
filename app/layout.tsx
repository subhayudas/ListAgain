import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { AuthProvider } from '@/components/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

// Add metadata for SEO
export const metadata: Metadata = {
  title: {
    default: 'ListAgain | Buy & Sell in Your College Community',
    template: '%s | ListAgain'
  },
  description: 'The premier marketplace for college students to buy and sell items within their community. Safe, easy, and sustainable.',
  keywords: ['college marketplace', 'student marketplace', 'buy and sell', 'campus trading', 'student exchange', 'ListAgain'],
  authors: [{ name: 'ListAgain Team' }],
  creator: 'ListAgain',
  publisher: 'ListAgain',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://listagain.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ListAgain | Buy & Sell in Your College Community',
    description: 'The premier marketplace for college students to buy and sell items within their community.',
    url: 'https://listagain.vercel.app',
    siteName: 'ListAgain',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://listagain.vercel.app/og-image.jpg', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'ListAgain - College Marketplace',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ListAgain | Buy & Sell in Your College Community',
    description: 'The premier marketplace for college students to buy and sell items within their community.',
    images: ['https://listagain.vercel.app/og-image.jpg'], // Same as OG image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ListAgain",
              "url": "https://listagain.vercel.app",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://listagain.vercel.app/products?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {/* Add verification for Google Search Console */}
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}