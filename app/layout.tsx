import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import { AuthProvider } from '@/components/auth-provider';
import { Toaster as SonnerToaster } from 'sonner';
import './styles/animations.css'


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'College Marketplace',
  description: 'Buy and sell items within your college community',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script 
          type="module" 
          src="https://unpkg.com/@splinetool/viewer@1.9.71/build/spline-viewer.js"
        />
      </head>
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}