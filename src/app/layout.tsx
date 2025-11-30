import CustomCursorWrapper from '@/components/custom-cursor-wrapper';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { defaultSiteSettings } from '@/lib/stores/site-settings-store';
import Footer from '@/shared/components/layout/footer';
import Navbar from '@/shared/components/layout/navbar';
import BackToTop from '@/shared/components/ui-enhancements/back-to-top';
import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import ScrollProgress from '@/shared/components/ui-enhancements/scroll-progress';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import { StoreProvider } from '../components/providers/store-provider';
import { DirectionProvider } from '../lib/i18n/direction-provider';
import { TranslationsProvider } from '../lib/i18n/translations-context';
import { InitialDataFetcher } from '@/components/initial-data-fetcher';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: defaultSiteSettings.seo.metaTitle,
  description: defaultSiteSettings.seo.metaDescription,
  keywords: defaultSiteSettings.seo.keywords,
  authors: [{ name: defaultSiteSettings.siteName.replace(' Portfolio', ''), url: defaultSiteSettings.social.github }],
  creator: defaultSiteSettings.siteName.replace(' Portfolio', ''),
  publisher: defaultSiteSettings.siteName.replace(' Portfolio', ''),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: defaultSiteSettings.siteUrl,
    title: defaultSiteSettings.seo.metaTitle,
    description: defaultSiteSettings.seo.metaDescription,
    siteName: defaultSiteSettings.siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultSiteSettings.seo.metaTitle,
    description: defaultSiteSettings.seo.metaDescription,
    creator: defaultSiteSettings.social.twitter,
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
                <InitialDataFetcher />
                <ErrorBoundary>
                  <ScrollProgress />
                  <CustomCursorWrapper />
                  <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <BackToTop />
                  <Analytics />
                </ErrorBoundary>
              </StoreProvider>
            </DirectionProvider>
          </TranslationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
