import { ThemeProvider } from '@/components/providers/theme-provider';
import Footer from '@/shared/components/layout/footer';
import Navbar from '@/shared/components/layout/navbar';
import BackToTop from '@/shared/components/ui-enhancements/back-to-top';
import CustomCursor from '@/shared/components/ui-enhancements/custom-cursor';
import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import ScrollProgress from '@/shared/components/ui-enhancements/scroll-progress';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import { StoreProvider } from '../components/providers/store-provider';
import { DirectionProvider } from '../lib/i18n/direction-provider';
import { TranslationsProvider } from '../lib/i18n/translations-context';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tanzim | Software Architect & Backend Developer',
  description:
    'Portfolio of Tanzim - Expert Software Architect & Backend Developer specializing in scalable systems, microservices, TypeScript, Java, Spring Boot, and Node.js. Building enterprise-grade solutions.',
  keywords: [
    'Software Architect',
    'Backend Developer',
    'TypeScript',
    'Java',
    'Spring Boot',
    'Node.js',
    'Microservices',
    'System Design',
    'Full Stack Developer',
    'Tanzim',
    'Portfolio',
  ],
  authors: [{ name: 'Tanzim', url: 'https://github.com/0xTanzim' }],
  creator: 'Tanzim',
  publisher: 'Tanzim',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://0xtanzim.dev',
    title: 'Tanzim | Software Architect & Backend Developer',
    description:
      'Expert Software Architect specializing in scalable backend systems, microservices architecture, and enterprise solutions.',
    siteName: 'Tanzim Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tanzim | Software Architect & Backend Developer',
    description:
      'Expert Software Architect specializing in scalable backend systems and microservices architecture.',
    creator: '@0xTanzim',
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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  generator: 'Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TranslationsProvider>
            <DirectionProvider>
              <StoreProvider>
                <ErrorBoundary>
                  <ScrollProgress />
                  {typeof window !== 'undefined' &&
                    window.innerWidth >= 1024 && <CustomCursor />}
                  <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <BackToTop />
                </ErrorBoundary>
              </StoreProvider>
            </DirectionProvider>
          </TranslationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
