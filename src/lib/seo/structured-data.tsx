/**
 * JSON-LD Structured Data
 * Provides rich snippets for search engines
 */
import { defaultSiteSettings } from '@/lib/stores/site-settings-store';

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: defaultSiteSettings.siteName.replace(' Portfolio', ''),
    url: defaultSiteSettings.siteUrl,
    image: defaultSiteSettings.seo.ogImage,
    sameAs: [
      defaultSiteSettings.social.github,
      defaultSiteSettings.social.linkedin,
      defaultSiteSettings.social.medium,
    ],
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
    email: defaultSiteSettings.social.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressCountry: 'Bangladesh',
    },
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: defaultSiteSettings.siteName,
    url: defaultSiteSettings.siteUrl,
    description: defaultSiteSettings.siteDescription,
    author: {
      '@type': 'Person',
      name: defaultSiteSettings.siteName.replace(' Portfolio', ''),
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
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: `${defaultSiteSettings.siteUrl}/blog/${post.slug}`,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: defaultSiteSettings.siteName.replace(' Portfolio', ''),
      url: defaultSiteSettings.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: defaultSiteSettings.siteName.replace(' Portfolio', ''),
      logo: {
        '@type': 'ImageObject',
        url: `${defaultSiteSettings.siteUrl}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${defaultSiteSettings.siteUrl}/blog/${post.slug}`,
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
