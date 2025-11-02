'use client';

import { useTranslations } from '@/lib/i18n/translations-context';
import type { BlogPost } from '@/lib/types';
import { motion } from 'framer-motion';
import { BlogGrid } from './blog-grid';

/**
 * Blog Client - Client Wrapper
 */
interface BlogClientProps {
  posts: BlogPost[];
}

export function BlogClient({ posts }: BlogClientProps) {
  const { t } = useTranslations();

  // All posts from service are combined - in real app, separate internal/external
  const allPosts = posts;

  return (
    <section id="blog" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h2 className="section-heading">{t('blog.title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('blog.description')}
          </p>
        </div>

        <BlogGrid posts={allPosts} />
      </motion.div>
    </section>
  );
}
