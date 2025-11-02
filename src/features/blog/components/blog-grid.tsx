'use client';

import type { BlogPost } from '@/lib/types';
import { motion } from 'framer-motion';
import { BlogCard } from './blog-card';

/**
 * Blog Grid - Presentational
 */
interface BlogGridProps {
  posts: BlogPost[];
  isExternal?: boolean;
}

export function BlogGrid({ posts, isExternal = false }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <BlogCard post={post} isExternal={isExternal} />
        </motion.div>
      ))}
    </div>
  );
}
