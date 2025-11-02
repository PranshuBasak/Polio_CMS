"use client"

import { motion } from "framer-motion"
import { BlogPostCard } from "./blog-post-card"
import { ExternalPostCard } from "./external-post-card"
import type { BlogPost, ExternalBlogPost } from "../../../../lib/types"

type BlogPostsGridProps = {
  posts: BlogPost[] | ExternalBlogPost[]
  type: "internal" | "external"
  formatDate?: (date: string) => string
  emptyMessage?: string
}

/**
 * Presentational component for blog posts grid
 * Handles layout and empty states
 */
export function BlogPostsGrid({
  posts,
  type,
  formatDate,
  emptyMessage = "No posts found matching your search.",
}: BlogPostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          {type === "internal" ? (
            <BlogPostCard post={post as BlogPost} formatDate={formatDate} />
          ) : (
            <ExternalPostCard post={post as ExternalBlogPost} formatDate={formatDate} />
          )}
        </motion.div>
      ))}
    </div>
  )
}
