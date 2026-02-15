/**
 * JSON-LD Structured Data
 * Provides rich snippets for search engines
 */
import { SiteSettings } from '@/lib/stores/site-settings-store';

const toAbsoluteAssetUrl = (siteUrl: string, assetUrl: string) => {
  if (assetUrl.startsWith('/')) {
    return `${siteUrl}${assetUrl}`;
  }

  return assetUrl;
};

export function generatePersonSchema(settings: SiteSettings) {
  const personImage = toAbsoluteAssetUrl(
    settings.siteUrl,
    settings.seo.ogImage || '/android-chrome-512x512.png'
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: settings.siteName.replace(' Portfolio', ''),
    url: settings.siteUrl,
    image: personImage,
    sameAs: [
      settings.social.github,
      settings.social.linkedin,
      settings.social.medium,
      settings.social.twitter,
    ].filter(Boolean),
    jobTitle: 'Software Architect & Backend Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
    knowsAbout: [
      'Software Architecture',
      'Backend Development',
      'TypeScript',
      'Java',
      'Spring Boot',
      'Node.js',
      'Microservices',
      'System Design',
    ],
    email: settings.social.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chhattisgarh',
      addressCountry: 'India',
    },
  };
}

export function generateWebsiteSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName,
    url: settings.siteUrl,
    description: settings.siteDescription,
    author: {
      '@type': 'Person',
      name: settings.siteName.replace(' Portfolio', ''),
    },
    inLanguage: ['en', 'es', 'fr', 'zh', 'ar', 'bn'],
  };
}

export function generateBlogPostSchema(post: {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  content: string;
}, settings: SiteSettings) {
  const logoUrl = toAbsoluteAssetUrl(
    settings.siteUrl,
    settings.seo.iconUrl || '/favicon-32x32.png'
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: `${settings.siteUrl}/blog/${post.slug}`,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: settings.siteName.replace(' Portfolio', ''),
      url: settings.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: settings.siteName.replace(' Portfolio', ''),
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${settings.siteUrl}/blog/${post.slug}`,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Component to inject JSON-LD into page
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
