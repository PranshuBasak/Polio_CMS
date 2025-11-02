import type { BlogPost, ExternalBlogPost } from "../../lib/stores"

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable Microservices with Spring Boot",
    slug: "building-scalable-microservices-spring-boot",
    excerpt:
      "Learn how to design and implement scalable microservices architecture using Spring Boot, Docker, and Kubernetes.",
    content: `
# Building Scalable Microservices with Spring Boot

Microservices architecture has become the de facto standard for building modern, scalable applications...

## Key Concepts

1. Service Discovery
2. API Gateway
3. Circuit Breaker Pattern
4. Distributed Tracing

## Implementation

\`\`\`java
@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
\`\`\`
    `,
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "Event-Driven Architecture with Apache Kafka",
    slug: "event-driven-architecture-kafka",
    excerpt: "Explore the benefits of event-driven architecture and how to implement it using Apache Kafka.",
    content: `
# Event-Driven Architecture with Apache Kafka

Event-driven architecture enables loosely coupled, scalable systems...
    `,
    date: "2024-01-10",
  },
  {
    id: "3",
    title: "Implementing CQRS Pattern in Node.js",
    slug: "implementing-cqrs-nodejs",
    excerpt: "A practical guide to implementing Command Query Responsibility Segregation in Node.js applications.",
    content: `
# Implementing CQRS Pattern in Node.js

CQRS separates read and write operations for better scalability...
    `,
    date: "2024-01-05",
  },
]

export const mockExternalBlogPosts: ExternalBlogPost[] = [
  {
    id: "ext-1",
    title: "The Future of Backend Development",
    excerpt: "Exploring emerging trends and technologies shaping the future of backend development.",
    url: "https://example.com/future-backend-dev",
    date: "2024-01-20",
    source: "Medium",
  },
  {
    id: "ext-2",
    title: "Optimizing Database Performance at Scale",
    excerpt: "Best practices for optimizing database performance in high-traffic applications.",
    url: "https://example.com/database-optimization",
    date: "2024-01-18",
    source: "Dev.to",
  },
]
