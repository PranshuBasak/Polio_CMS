'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// Sample tech stack data
const techStack = [
  {
    name: 'TypeScript',
    logo: '/placeholder.svg?height=60&width=60',
  },
  {
    name: 'Java',
    logo: '/placeholder.svg?height=60&width=60',
  },
  {
    name: 'Spring Boot',
    logo: '/placeholder.svg?height=60&width=60',
  },
  {
    name: 'Node.js',
    logo: '/placeholder.svg?height=60&width=60',
  },
  {
    name: 'Docker',
    logo: '/placeholder.svg?height=60&width=60',
  },
  {
    name: 'Kubernetes',
    logo: '/placeholder.svg?height=60&width=60',
  },
  {
    name: 'PostgreSQL',
    logo: '/placeholder.svg?height=60&width=60',
  },
  {
    name: 'MongoDB',
    logo: '/placeholder.svg?height=60&width=60',
  },
];

export default function TechStackLogos() {
  return (
    <div className="py-12">
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {techStack.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0.6, filter: 'grayscale(100%)' }}
            whileHover={{
              opacity: 1,
              filter: 'grayscale(0%)',
              scale: 1.1,
              transition: { duration: 0.3 },
            }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-16 h-16 mb-2">
              <Image
                src={tech.logo || '/placeholder.svg'}
                alt={tech.name}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm text-muted-foreground">{tech.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
