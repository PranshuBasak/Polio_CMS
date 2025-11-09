import { defaultSiteSettings } from '@/lib/stores/site-settings-store';
import type { Metadata } from 'next';

/**
 * SEO Metadata Helper
 * Generates optimized metadata for all pages using store configuration
 */

const siteConfig = {
  name: defaultSiteSettings.siteName,
  title: defaultSiteSettings.seo.metaTitle,
  description: defaultSiteSettings.seo.metaDescription,
  url: defaultSiteSettings.siteUrl,
  ogImage: defaultSiteSettings.seo.ogImage,
  author: {
    name: defaultSiteSettings.siteName.replace(' Portfolio', ''),
    url: defaultSiteSettings.social.github,
    twitter: defaultSiteSettings.social.twitter,
  },
  keywords: defaultSiteSettings.seo.keywords,
};

export function generateMetadata(
  title?: string,
  description?: string,
  path?: string,
  image?: string
): Metadata {
  const pageTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | ${siteConfig.title}`;
  const pageDescription = description || siteConfig.description;
  const pageUrl = path ? `${siteConfig.url}${path}` : siteConfig.url;
  const pageImage = image || siteConfig.ogImage;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      creator: siteConfig.author.twitter,
      images: [pageImage],
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
  };
}

export { siteConfig };
