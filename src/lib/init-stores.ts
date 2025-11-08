/**
 * Initialize Zustand stores with default data in localStorage
 * This ensures stores have data on first load before hydration completes
 */

import {
  defaultBlogPosts,
  defaultExternalPosts,
  defaultProjects,
  defaultSkillCategories,
  defaultSkills,
  defaultTestimonials,
} from './data/defaults';

// Resume default data (imported from resume-store since it's not exported from defaults.ts)
const defaultResumeData = {
  experiences: [
    {
      id: '1',
      title: 'Senior Software Architect',
      company: 'TechInnovate',
      location: 'Remote',
      startDate: '2022-01',
      endDate: 'Present',
      description:
        'Leading the architecture design for distributed systems and microservices. Implementing event-driven architecture and CQRS patterns for scalable and maintainable systems.',
      achievements: [
        'Designed and implemented a scalable microservice architecture that reduced system latency by 40%',
        'Led a team of 8 developers across multiple projects',
        'Introduced event sourcing pattern that improved data traceability and system resilience',
        'Established architecture review processes that improved code quality and reduced technical debt',
      ],
    },
    {
      id: '2',
      title: 'Backend Team Lead',
      company: 'DataFlow Systems',
      location: 'San Francisco, CA',
      startDate: '2019-03',
      endDate: '2021-12',
      description:
        'Led a team of 6 backend developers. Designed and implemented scalable APIs and services using Spring Boot and Node.js.',
      achievements: [
        'Redesigned the API layer resulting in 30% performance improvement',
        'Implemented CI/CD pipelines that reduced deployment time from days to hours',
        'Mentored junior developers and established coding standards',
        'Introduced automated testing that increased code coverage from 60% to 90%',
      ],
    },
    {
      id: '3',
      title: 'Software Engineer',
      company: 'CloudScale',
      location: 'Seattle, WA',
      startDate: '2017-06',
      endDate: '2019-02',
      description:
        'Developed and maintained backend services for high-traffic applications. Implemented CI/CD pipelines and DevOps practices.',
      achievements: [
        'Developed RESTful APIs serving over 1 million requests per day',
        'Optimized database queries that reduced response times by 50%',
        'Implemented caching strategies that improved system throughput',
        'Contributed to open-source projects related to backend development',
      ],
    },
  ],
  education: [
    {
      id: '1',
      degree: "Master's in Computer Science",
      institution: 'Tech University',
      location: 'Boston, MA',
      startDate: '2015-09',
      endDate: '2017-05',
      description:
        'Specialized in Distributed Systems and Cloud Computing. Thesis on Scalable Microservice Architectures.',
      courses: [
        'Advanced Algorithms',
        'Distributed Systems',
        'Cloud Computing',
        'Database Management Systems',
        'Software Engineering',
      ],
    },
    {
      id: '2',
      degree: "Bachelor's in Computer Engineering",
      institution: 'State University',
      location: 'Chicago, IL',
      startDate: '2011-09',
      endDate: '2015-05',
      description:
        'Graduated with honors. Focus on software development and computer architecture.',
      courses: [
        'Data Structures',
        'Algorithms',
        'Operating Systems',
        'Computer Networks',
        'Software Development',
      ],
    },
  ],
  skills: [
    {
      category: 'Programming Languages',
      items: [
        { name: 'TypeScript/JavaScript', level: 90 },
        { name: 'Java', level: 85 },
        { name: 'Python', level: 75 },
        { name: 'Go', level: 60 },
        { name: 'Rust', level: 50 },
      ],
    },
    {
      category: 'Frameworks & Libraries',
      items: [
        { name: 'Spring Boot', level: 85 },
        { name: 'Node.js', level: 90 },
        { name: 'Express', level: 85 },
        { name: 'React', level: 70 },
        { name: 'Next.js', level: 65 },
      ],
    },
    {
      category: 'DevOps & Cloud',
      items: [
        { name: 'Docker', level: 80 },
        { name: 'Kubernetes', level: 75 },
        { name: 'AWS', level: 70 },
        { name: 'GitHub Actions', level: 85 },
        { name: 'Terraform', level: 65 },
      ],
    },
    {
      category: 'Databases',
      items: [
        { name: 'PostgreSQL', level: 85 },
        { name: 'MongoDB', level: 80 },
        { name: 'Redis', level: 75 },
        { name: 'Elasticsearch', level: 70 },
      ],
    },
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023-05',
      description:
        'Professional certification validating expertise in designing distributed systems on AWS.',
      url: 'https://aws.amazon.com/certification/certified-solutions-architect-professional/',
    },
    {
      id: '2',
      name: 'Certified Kubernetes Administrator',
      issuer: 'Cloud Native Computing Foundation',
      date: '2022-08',
      description:
        'Certification demonstrating proficiency in Kubernetes administration and deployment.',
      url: 'https://www.cncf.io/certification/cka/',
    },
    {
      id: '3',
      name: 'Oracle Certified Professional, Java SE 11 Developer',
      issuer: 'Oracle',
      date: '2021-03',
      description:
        'Certification validating expertise in Java development and best practices.',
      url: 'https://education.oracle.com/java-se-11-developer/pexam_1Z0-819',
    },
  ],
  languages: [
    { name: 'English', proficiency: 'Native' },
    { name: 'Spanish', proficiency: 'Intermediate' },
  ],
  interests: [
    'Open Source Development',
    'System Architecture',
    'Cloud Computing',
    'Hiking',
    'Photography',
  ],
  pdfUrl: '/placeholder.pdf',
};

export function initializeStores() {
  if (typeof window === 'undefined') return;

  // Initialize projects store
  if (!localStorage.getItem('projects-storage')) {
    localStorage.setItem(
      'projects-storage',
      JSON.stringify({
        state: {
          projects: defaultProjects,
        },
        version: 0,
      })
    );
  }

  // Initialize skills store
  if (!localStorage.getItem('skills-storage')) {
    localStorage.setItem(
      'skills-storage',
      JSON.stringify({
        state: {
          skills: defaultSkills,
          categories: defaultSkillCategories,
        },
        version: 0,
      })
    );
  }

  // Initialize blog store
  if (!localStorage.getItem('blog-storage')) {
    localStorage.setItem(
      'blog-storage',
      JSON.stringify({
        state: {
          internalPosts: defaultBlogPosts,
          externalPosts: defaultExternalPosts,
        },
        version: 0,
      })
    );
  }

  // Initialize testimonials store
  if (!localStorage.getItem('testimonials-storage')) {
    localStorage.setItem(
      'testimonials-storage',
      JSON.stringify({
        state: {
          testimonials: defaultTestimonials,
        },
        version: 0,
      })
    );
  }

  // Initialize resume store
  if (!localStorage.getItem('resume-storage')) {
    localStorage.setItem(
      'resume-storage',
      JSON.stringify({
        state: {
          resumeData: defaultResumeData,
        },
        version: 0,
      })
    );
  }
}
