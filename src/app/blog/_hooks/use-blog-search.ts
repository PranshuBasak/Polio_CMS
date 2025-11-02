"use client"

import { useState, useMemo, useCallback } from "react"
import type { BlogPost, ExternalBlogPost } from "../../../lib/types"

/**
 * Custom hook for blog search functionality
 * Handles search logic for both internal and external posts
 */
export function useBlogSearch(internalPosts: BlogPost[], externalPosts: ExternalBlogPost[]) {
  const [searchTerm, setSearchTerm] = useState("")

  // Memoized filtered internal posts
  const filteredInternalPosts = useMemo(() => {
    if (!searchTerm) return internalPosts

    const term = searchTerm.toLowerCase()
    return internalPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term),
    )
  }, [internalPosts, searchTerm])

  // Memoized filtered external posts
  const filteredExternalPosts = useMemo(() => {
    if (!searchTerm) return externalPosts

    const term = searchTerm.toLowerCase()
    return externalPosts.filter(
      (post) => post.title.toLowerCase().includes(term) || post.excerpt.toLowerCase().includes(term),
    )
  }, [externalPosts, searchTerm])

  const clearSearch = useCallback(() => {
    setSearchTerm("")
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    filteredInternalPosts,
    filteredExternalPosts,
    clearSearch,
    hasActiveSearch: searchTerm !== "",
  }
}
