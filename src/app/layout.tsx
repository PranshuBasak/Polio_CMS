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
    'Portfolio website of Tanzim, a Software Architect and Backend Developer specializing in TypeScript, Java, Spring Boot, and Node.js',
  generator: 'v0.app',
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
