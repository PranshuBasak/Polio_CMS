/**
 * Real RSS feed fetcher implementation using our API route
 */

export type RssFeedItem = {
  id: string
  title: string
  excerpt: string
  url: string
  date: string
  source: string
}

export async function fetchMediumPosts(username: string = '0xTanzim', limit: number = 5): Promise<RssFeedItem[]> {
  try {
    const response = await fetch(`/api/blog/fetch-medium?username=${username}&limit=${limit}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch Medium posts: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch Medium posts')
    }

    return data.posts
  } catch (error) {
    console.error('Error fetching Medium posts:', error)
    // Return empty array on error - graceful fallback
    return []
  }
}

/**
 * Legacy function for backwards compatibility
 * @deprecated Use fetchMediumPosts instead
 */
export async function fetchRssFeed(url: string, source: string): Promise<RssFeedItem[]> {
  // For Medium RSS feeds, extract username and use new API
  if (url.includes('medium.com/feed/@')) {
    const username = url.split('@')[1]
    return fetchMediumPosts(username)
  }

  // For other RSS feeds, return empty (not implemented)
  console.warn('RSS feed fetching only supports Medium at this time')
  return []
}
