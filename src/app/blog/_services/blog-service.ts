import type { BlogPost } from "../../../lib/types"

/**
 * Service for blog-related business logic
 * Facade pattern for blog operations
 */
export const blogService = {
  /**
   * Format date for display
   */
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  },

  /**
   * Get reading time estimate
   */
  getReadingTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  },

  /**
   * Search posts by term
   */
  searchPosts(posts: BlogPost[], term: string): BlogPost[] {
    const searchTerm = term.toLowerCase()
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm),
    )
  },

  /**
   * Sort posts by date (newest first)
   */
  sortByDate(posts: BlogPost[]): BlogPost[] {
    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },

  /**
   * Get post excerpt with max length
   */
  truncateExcerpt(excerpt: string, maxLength = 150): string {
    if (excerpt.length <= maxLength) return excerpt
    return excerpt.slice(0, maxLength).trim() + "..."
  },
}
