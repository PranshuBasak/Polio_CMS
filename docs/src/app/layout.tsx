import type { Metadata } from 'next'
import { Banner, Head } from 'nextra/components'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'

import themeConfig from '../../theme.config'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'), // Replace with actual domain
  title: {
    default: 'DynamicFolio Docs',
    template: '%s | DynamicFolio'
  },
  description: 'Comprehensive documentation, architecture, and API reference for the DynamicFolio CMS.',
  applicationName: 'DynamicFolio',
  keywords: ['Next.js', 'Portfolio', 'CMS', 'Documentation', 'Zustand', 'Supabase'],
  authors: [{ name: 'Pranshu Basak', url: 'https://github.com/PranshuBasak' }],
  creator: 'Pranshu Basak',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    siteName: 'DynamicFolio Docs',
    title: 'DynamicFolio Docs - The Ultimate Portfolio CMS',
    description: 'Architecture, routing, components, state, API, and implementation references.',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'DynamicFolio Documentation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DynamicFolio Docs',
    description: 'The Ultimate Portfolio CMS Documentation',
    images: ['/og.jpg'],
    creator: '@0xPranshu', 
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

const banner = (
  <Banner storageKey="docs-launch-v1">
    DynamicFolio docs are now powered by Nextra.
  </Banner>
)

const navbar = (
  <Navbar
    logo={
      <div className="flex items-center gap-2 font-bold text-lg">
        <img src="/logo.png" alt="DynamicFolio" className="h-8 w-8 object-contain" />
        <span>DynamicFolio Docs</span>
      </div>
    }
    projectLink="https://github.com/PranshuBasak/dynamicFolio_CMS"
    chatLink="mailto:pranshubasak@gmail.com"
  />
)

const footer = <Footer>MIT {new Date().getFullYear()} © DynamicFolio</Footer>

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pageMap = await getPageMap()

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="📚" />
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase={themeConfig.docsRepositoryBase}
          footer={footer}
          navigation
          sidebar={{
            autoCollapse: true,
            defaultMenuCollapseLevel: 2
          }}
          feedback={{
            content: 'Question? Give feedback',
            labels: 'docs-feedback'
          }}
          editLink="Edit this page on GitHub"
          toc={{ float: true }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
