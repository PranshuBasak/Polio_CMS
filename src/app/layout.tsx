import CustomCursorWrapper from '@/components/custom-cursor-wrapper';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { DynamicThemeProvider } from '@/components/providers/dynamic-theme-provider';
import Footer from '@/shared/components/layout/footer';
import Navbar from '@/shared/components/layout/navbar';
import BackToTop from '@/shared/components/ui-enhancements/back-to-top';
import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import ScrollProgress from '@/shared/components/ui-enhancements/scroll-progress';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense, type ReactNode } from 'react';
import { StoreProvider } from '../components/providers/store-provider';
import { DirectionProvider } from '../lib/i18n/direction-provider';
import { TranslationsProvider } from '../lib/i18n/translations-context';
import { InitialDataFetcher } from '@/components/initial-data-fetcher';
import { StrudelAudioProvider } from '@/components/providers/strudel-audio-provider';
import './globals.css';
import { JsonLd, generatePersonSchema, generateWebsiteSchema } from '@/lib/seo/structured-data';
import { PageViewTracker } from '@/components/analytics/page-view-tracker';
import { getRuntimeSiteSettings } from '@/lib/seo/runtime-site-settings';
import { seoFallbackSettings } from '@/config/seo-fallback';

const inter = Inter({ subsets: ['latin'] });
export const revalidate = 300;

async function getSiteSettings() {
  return getRuntimeSiteSettings();
}

function safeMetadataBase(siteUrl: string) {
  try {
    const parsedUrl = new URL(siteUrl);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('Invalid metadataBase protocol');
    }

    return parsedUrl;
  } catch {
    return new URL('https://pranshubasak.com');
  }
}

function safeMetadataTitle(metaTitle: string, siteName: string) {
  const candidate = metaTitle.trim() || siteName.trim();

  // Prevent URLs from rendering as the page title in production.
  if (/^https?:\/\//i.test(candidate)) {
    return seoFallbackSettings.seo.metaTitle;
  }

  return candidate || seoFallbackSettings.seo.metaTitle;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const ownerName = settings.siteName.replace(/\s*Portfolio$/i, '').trim() || settings.siteName;
  const ogImage = settings.seo.ogImage || '/android-chrome-512x512.png';
  const twitterImage = settings.seo.twitterImage || ogImage;
  const iconUrl = settings.seo.iconUrl || '/favicon-32x32.png';
  const appleIconUrl = settings.seo.appleIconUrl || '/apple-touch-icon.png';
  const resolvedTitle = safeMetadataTitle(settings.seo.metaTitle, settings.siteName);
  const resolvedDescription = settings.seo.metaDescription || settings.siteDescription;

  return {
    metadataBase: safeMetadataBase(settings.siteUrl),
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: settings.seo.keywords,
    authors: [{ name: ownerName, url: settings.social.github || settings.siteUrl }],
    creator: ownerName,
    publisher: ownerName,
    alternates: {
      canonical: settings.siteUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: settings.siteUrl,
      title: resolvedTitle,
      description: resolvedDescription,
      siteName: settings.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      creator: settings.social.twitter,
      images: [twitterImage],
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
        { url: iconUrl },
        { url: '/favicon.ico', sizes: '32x32' },
      ],
      shortcut: '/favicon.ico',
      apple: appleIconUrl,
    },
    manifest: '/manifest.json',
    other: {
      'msapplication-config': '/browserconfig.xml',
      'msapplication-TileColor': '#0f172a',
    },
    generator: 'Next.js',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
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
                <DynamicThemeProvider>
                  <StrudelAudioProvider>
                    <InitialDataFetcher />
                    <Suspense fallback={null}>
                      <PageViewTracker />
                    </Suspense>
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
                  </StrudelAudioProvider>
                </DynamicThemeProvider>
              </StoreProvider>
            </DirectionProvider>
          </TranslationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
