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
  title: 'ListAgain - Buy and Sell Items Within Your College Community',
  description: 'ListAgain is the premier marketplace for college students to buy and sell items within their community. Safe, easy, and sustainable.',
  keywords: 'college marketplace, student marketplace, buy and sell, second-hand items, college community',
};

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