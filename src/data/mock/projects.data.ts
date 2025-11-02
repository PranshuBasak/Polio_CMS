import type { Project } from "../../lib/stores"

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A scalable e-commerce platform built with microservices architecture",
    technologies: ["Spring Boot", "React", "PostgreSQL", "Redis", "Kafka"],
    githubUrl: "https://github.com/example/ecommerce",
    liveUrl: "https://ecommerce-demo.example.com",
    image: "/ecommerce-platform-concept.png",
    caseStudy: {
      challenge: "Build a scalable platform handling 10k+ concurrent users",
      solution: "Implemented microservices with event-driven architecture",
      results: "99.9% uptime, 50% reduction in response time",
      process: ["Requirements Analysis", "Architecture Design", "Implementation", "Testing", "Deployment"],
      screenshots: ["/general-data-dashboard.png", "/product-page.jpg"],
    },
  },
  {
    id: "2",
    title: "Real-Time Analytics Dashboard",
    description: "Real-time data processing and visualization platform",
    technologies: ["Node.js", "TypeScript", "MongoDB", "Socket.io", "D3.js"],
    githubUrl: "https://github.com/example/analytics",
    image: "/analytics-dashboard.png",
  },
]
