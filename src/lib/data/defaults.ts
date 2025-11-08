/**
 * Default Data for Portfolio
 * Used by both Zustand stores and Server Components service
 */

import type { BlogPost, ExternalBlogPost, Project, Skill, SkillCategory, Testimonial } from '../types';

export const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Microservice Architecture',
    description: 'A scalable microservice architecture using Spring Boot and Docker',
    technologies: ['Java', 'Spring Boot', 'Docker', 'Kubernetes', 'RabbitMQ'],
    githubUrl: 'https://github.com/0xTanzim/microservice-architecture',
    image: '/project-placeholder.svg',
    caseStudy: {
      challenge:
        'The client needed a scalable microservice architecture that could handle high traffic loads while maintaining data consistency across services.',
      solution:
        'Implemented a robust microservice architecture using Spring Boot for core services and Node.js for lightweight services. Used Kafka for event-driven communication between services.',
      results:
        'The new architecture resulted in a 40% improvement in response times and enabled the system to handle 3x the previous traffic load without performance degradation.',
      process: [
        'Analyzed the existing monolithic architecture and identified service boundaries',
        'Designed the new microservice architecture with clear domain boundaries',
        'Implemented core services using Spring Boot with domain-driven design principles',
        'Set up Kafka for event-driven communication between services',
        'Deployed the solution using Docker and Kubernetes for scalability',
      ],
      screenshots: [
        '/project-placeholder.svg',
        '/project-placeholder.svg',
        '/project-placeholder.svg',
      ],
    },
  },
  {
    id: '2',
    title: 'API Gateway',
    description: 'A high-performance API gateway with rate limiting and authentication',
    technologies: ['TypeScript', 'Node.js', 'Express', 'Redis'],
    githubUrl: 'https://github.com/0xTanzim/api-gateway',
    liveUrl: 'https://api-gateway-demo.vercel.app',
    image: '/project-placeholder.svg',
    caseStudy: {
      challenge:
        'The client needed a centralized API gateway to manage authentication, rate limiting, and request routing for multiple microservices.',
      solution:
        'Built a custom API gateway using Node.js and Express with Redis for caching and rate limiting. Implemented JWT authentication and role-based access control.',
      results:
        'The API gateway reduced unauthorized access attempts by 95% and improved overall API performance by 30% through effective caching and load balancing.',
      process: [
        'Designed the gateway architecture with security and performance in mind',
        'Implemented JWT authentication and role-based access control',
        'Set up Redis for caching and rate limiting',
        'Created a flexible routing system for microservice endpoints',
        'Implemented comprehensive logging and monitoring',
      ],
      screenshots: [
        '/project-placeholder.svg',
        '/project-placeholder.svg',
        '/project-placeholder.svg',
      ],
    },
  },
  {
    id: '3',
    title: 'Event Sourcing System',
    description: 'An event sourcing implementation with CQRS pattern',
    technologies: ['Java', 'Spring Boot', 'Kafka', 'MongoDB', 'PostgreSQL'],
    githubUrl: 'https://github.com/0xTanzim/event-sourcing',
    image: '/project-placeholder.svg',
    caseStudy: {
      challenge:
        'The client needed a system that could maintain a complete audit trail of all data changes while providing high-performance read operations.',
      solution:
        'Implemented an event sourcing architecture with CQRS pattern using Spring Boot, Kafka for event streaming, MongoDB for the event store, and PostgreSQL for read models.',
      results:
        'The system provided 100% data traceability with the ability to reconstruct the state at any point in time, while maintaining sub-100ms query response times.',
      process: [
        'Designed the event sourcing and CQRS architecture',
        'Implemented the event store using MongoDB',
        'Set up Kafka for event streaming and processing',
        'Created optimized read models in PostgreSQL',
        'Developed a mechanism to rebuild read models from the event store',
      ],
      screenshots: [
        '/project-placeholder.svg',
        '/project-placeholder.svg',
        '/project-placeholder.svg',
      ],
    },
  },
];

export const defaultSkills: Skill[] = [
  { id: '1', name: 'TypeScript', level: 90, category: 'core' },
  { id: '2', name: 'Java', level: 85, category: 'core' },
  { id: '3', name: 'Spring Boot', level: 80, category: 'core' },
  { id: '4', name: 'Node.js', level: 85, category: 'core' },
  { id: '5', name: 'System Design', level: 80, category: 'core' },

  { id: '6', name: 'Docker', level: 75, category: 'devops' },
  { id: '7', name: 'Kubernetes', level: 70, category: 'devops' },
  { id: '8', name: 'CI/CD', level: 80, category: 'devops' },
  { id: '9', name: 'GitHub Actions', level: 85, category: 'devops' },
  { id: '10', name: 'Terraform', level: 65, category: 'devops' },

  { id: '11', name: 'PostgreSQL', level: 85, category: 'databases' },
  { id: '12', name: 'MongoDB', level: 80, category: 'databases' },
  { id: '13', name: 'Redis', level: 75, category: 'databases' },
  { id: '14', name: 'Elasticsearch', level: 70, category: 'databases' },

  { id: '15', name: 'Rust', level: 50, category: 'learning' },
  { id: '16', name: 'Go', level: 60, category: 'learning' },
  { id: '17', name: 'Machine Learning', level: 40, category: 'learning' },
];

export const defaultSkillCategories: SkillCategory[] = [
  { id: 'core', name: 'Core', description: 'Primary programming languages and frameworks', order: 1 },
  { id: 'devops', name: 'DevOps', description: 'Containerization, orchestration, and CI/CD', order: 2 },
  { id: 'databases', name: 'Databases', description: 'Database systems and data storage', order: 3 },
  { id: 'learning', name: 'Learning', description: "Technologies I'm currently learning", order: 4 },
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    content:
      "Tanzim's expertise in backend architecture transformed our system. His solutions are not only efficient but also highly scalable and maintainable.",
    author: 'Sarah Johnson',
    position: 'CTO',
    company: 'TechInnovate',
    avatar: '/avatar-placeholder.svg',
    rating: 5,
  },
  {
    id: '2',
    content:
      "Working with Tanzim was a game-changer for our startup. His deep knowledge of microservices and system design helped us build a robust foundation for growth.",
    author: 'Michael Chen',
    position: 'Founder',
    company: 'DataFlow Systems',
    avatar: '/avatar-placeholder.svg',
    rating: 5,
  },
  {
    id: '3',
    content:
      "Tanzim delivered exceptional results on our API gateway project. His attention to detail and commitment to best practices resulted in a secure and high-performance solution.",
    author: 'Priya Patel',
    position: 'Lead Developer',
    company: 'CloudScale',
    avatar: '/avatar-placeholder.svg',
    rating: 5,
  },
];

export const defaultBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Microservices vs Monoliths: Making the Right Choice',
    slug: 'microservices-vs-monoliths',
    content:
      '# Microservices vs Monoliths\n\nWhen designing a new system, one of the first architectural decisions you\'ll face is whether to build a monolith or microservices...',
    excerpt:
      'Exploring the trade-offs between microservices and monolithic architectures to help you make the right choice for your next project.',
    date: '2023-10-15',
  },
  {
    id: '2',
    title: 'Event Sourcing: A Practical Introduction',
    slug: 'event-sourcing-introduction',
    content:
      '# Event Sourcing: A Practical Introduction\n\nEvent sourcing is a powerful pattern that changes how we think about state in our applications...',
    excerpt:
      'Learn how event sourcing can improve auditability, scalability, and flexibility in your applications with practical examples.',
    date: '2023-11-20',
  },
  {
    id: '3',
    title: 'Optimizing Spring Boot Applications for Production',
    slug: 'optimizing-spring-boot',
    content:
      '# Optimizing Spring Boot Applications\n\nSpring Boot makes it easy to create stand-alone, production-grade applications, but there\'s more to consider when preparing for production...',
    excerpt:
      'Discover essential techniques to optimize your Spring Boot applications for production environments, focusing on performance and reliability.',
    date: '2024-01-05',
  },
];

export const defaultExternalPosts: ExternalBlogPost[] = [
  {
    id: 'e1',
    title: 'Building Resilient Microservices with Circuit Breakers',
    excerpt:
      'Learn how to implement circuit breakers in your microservices architecture to prevent cascading failures and improve system resilience.',
    url: 'https://medium.com/@0xTanzim/building-resilient-microservices',
    date: '2023-09-10',
    source: 'Medium',
  },
  {
    id: 'e2',
    title: 'TypeScript Best Practices for Large-Scale Applications',
    excerpt:
      'Discover proven TypeScript patterns and practices that help maintain code quality and developer productivity in large-scale applications.',
    url: 'https://dev.to/@0xTanzim/typescript-best-practices',
    date: '2023-12-05',
    source: 'Dev.to',
  },
  {
    id: 'e3',
    title: 'Implementing CQRS in Modern Applications',
    excerpt:
      'A deep dive into Command Query Responsibility Segregation (CQRS) and how it can be implemented in modern application architectures.',
    url: 'https://hashnode.com/@0xTanzim/implementing-cqrs',
    date: '2024-02-15',
    source: 'Hashnode',
  },
];
