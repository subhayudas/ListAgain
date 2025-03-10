import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { AuthProvider } from '@/components/auth-provider';
import { Toaster as SonnerToaster } from 'sonner';
import './styles/animations.css'

// Use Inter for body text and Poppins for headings
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'ListAgain - Buy & Sell Items',
  description: 'The easiest way to buy, sell, and discover items in your community',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' }
    ],
    apple: { url: '/apple-icon.png', type: 'image/png' },
  },
  verification: {
    google: '4VJa27Ccaz6xGx_lCNGddmKqBqcqINaH_NJXe9kc7D0',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <script 
          type="module" 
          src="https://unpkg.com/@splinetool/viewer@1.9.71/build/spline-viewer.js"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <meta name="google-site-verification" content="4VJa27Ccaz6xGx_lCNGddmKqBqcqINaH_NJXe9kc7D0" />
      </head>
      <body className="min-h-screen font-sans flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <div className="pt-16 flex-grow"> {/* Add flex-grow to push footer to bottom */}
              {children}
            </div>
            <Footer />
            <Toaster />
            <SonnerToaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}