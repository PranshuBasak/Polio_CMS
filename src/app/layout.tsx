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
import { createClient } from '@/lib/supabase/server';
import { JsonLd, generatePersonSchema, generateWebsiteSchema } from '@/lib/seo/structured-data';
import { PageViewTracker } from '@/components/analytics/page-view-tracker';

const inter = Inter({ subsets: ['latin'] });

async function getSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('*').single();
  
  if (!data) return defaultSiteSettings;

  return {
    siteName: data.site_name || defaultSiteSettings.siteName,
    siteDescription: data.site_description || defaultSiteSettings.siteDescription,
    siteUrl: data.site_url || defaultSiteSettings.siteUrl,
    timezone: data.timezone || defaultSiteSettings.timezone,
    publicProfile: data.public_profile ?? defaultSiteSettings.publicProfile,
    social: (data.social as any) || defaultSiteSettings.social,
    seo: (data.seo as any) || defaultSiteSettings.seo,
    appearance: (data.appearance as any) || defaultSiteSettings.appearance,
    advanced: (data.advanced as any) || defaultSiteSettings.advanced,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings.seo.metaTitle,
    description: settings.seo.metaDescription,
    keywords: settings.seo.keywords,
    authors: [{ name: settings.siteName.replace(' Portfolio', ''), url: settings.social.github }],
    creator: settings.siteName.replace(' Portfolio', ''),
    publisher: settings.siteName.replace(' Portfolio', ''),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: settings.siteUrl,
      title: settings.seo.metaTitle,
      description: settings.seo.metaDescription,
      siteName: settings.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.seo.metaTitle,
      description: settings.seo.metaDescription,
      creator: settings.social.twitter,
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const personSchema = generatePersonSchema(settings);
  const websiteSchema = generateWebsiteSchema(settings);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={personSchema} />
        <JsonLd data={websiteSchema} />
      </head>
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
                <PageViewTracker />
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
