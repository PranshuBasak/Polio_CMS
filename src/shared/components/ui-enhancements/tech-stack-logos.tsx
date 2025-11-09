'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// Tech stack with icon URLs from CDN (Simple Icons)
const techStack = [
  {
    name: 'TypeScript',
    logo: 'https://cdn.simpleicons.org/typescript/3178C6',
  },
  {
    name: 'NestJS',
    logo: 'https://cdn.simpleicons.org/nestjs/E0234E',
  },
  {
    name: 'Spring Boot',
    logo: 'https://cdn.simpleicons.org/springboot/6DB33F',
  },
  {
    name: 'Docker',
    logo: 'https://cdn.simpleicons.org/docker/2496ED',
  },
  {
    name: 'Kubernetes',
    logo: 'https://cdn.simpleicons.org/kubernetes/326CE5',
  },
  {
    name: 'PostgreSQL',
    logo: 'https://cdn.simpleicons.org/postgresql/4169E1',
  },
  {
    name: 'MongoDB',
    logo: 'https://cdn.simpleicons.org/mongodb/47A248',
  },
];

export default function TechStackLogos() {
  return (
    <div className="py-12">
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {techStack.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0.6, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{
              scale: 1.15,
              y: -8,
              transition: { duration: 0.3 },
            }}
            className="flex flex-col items-center group"
          >
            <div className="relative w-16 h-16 mb-3 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative w-full h-full p-3 bg-card rounded-xl border border-border shadow-sm group-hover:shadow-lg group-hover:border-primary/50 transition-all duration-300">
                <Image
                  src={tech.logo}
                  alt={`${tech.name} logo`}
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {tech.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
