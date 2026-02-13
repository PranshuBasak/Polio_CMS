'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n/translations-context';
import type { BlogPost } from '@/lib/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BlogGrid } from './blog-grid';

/**
 * Blog Client - Client Wrapper
 */
interface BlogClientProps {
  posts: BlogPost[];
  isExternal?: boolean;
}

export function BlogClient({ posts, isExternal = false }: BlogClientProps) {
  const { t } = useTranslations();

  return (
    <section id="blog" className="section-container px-20">
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

        <BlogGrid posts={posts} isExternal={isExternal} />

        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link href="/blog">Read All Blog Posts</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
