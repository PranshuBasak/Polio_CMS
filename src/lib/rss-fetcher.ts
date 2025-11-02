// This is a mock implementation of an RSS fetcher
// In a real application, you would use a library like rss-parser

export type RssFeedItem = {
  id: string
  title: string
  excerpt: string
  url: string
  date: string
  source: string
}

export async function fetchRssFeed(url: string, source: string): Promise<RssFeedItem[]> {
  // In a real implementation, this would fetch and parse an actual RSS feed
  // For this demo, we'll return mock data

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Generate a random number of items (1-3)
  const itemCount = Math.floor(Math.random() * 3) + 1

  const items: RssFeedItem[] = []

  for (let i = 0; i < itemCount; i++) {
    items.push({
      id: `${source.toLowerCase()}-${Date.now()}-${i}`,
      title: `${source} Article ${i + 1}: ${getRandomTitle()}`,
      excerpt: getRandomExcerpt(),
      url: `https://${source.toLowerCase()}.com/article-${i + 1}`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      source,
    })
  }

  return items
}

function getRandomTitle(): string {
  const titles = [
    "Building Scalable Microservices",
    "Advanced TypeScript Patterns",
    "Optimizing Database Performance",
    "Containerization Best Practices",
    "Event-Driven Architecture",
    "API Design Principles",
    "Securing Backend Systems",
    "Implementing CQRS Pattern",
    "Distributed Systems Challenges",
    "Cloud-Native Development",
  ]

  return titles[Math.floor(Math.random() * titles.length)]
}

function getRandomExcerpt(): string {
  const excerpts = [
    "Learn how to design and implement scalable microservices architecture for your next project.",
    "Discover advanced TypeScript patterns that will improve your code quality and developer experience.",
    "Explore techniques to optimize database performance and handle high-traffic applications.",
    "Best practices for containerizing your applications with Docker and orchestrating with Kubernetes.",
    "Understanding event-driven architecture and its benefits for building loosely coupled systems.",
    "Principles and best practices for designing robust and developer-friendly APIs.",
    "Security considerations and implementation techniques for backend systems.",
    "A practical guide to implementing the Command Query Responsibility Segregation pattern.",
    "Addressing common challenges in distributed systems design and implementation.",
    "Developing applications that are designed to run and scale in cloud environments.",
  ]

  return excerpts[Math.floor(Math.random() * excerpts.length)]
}
