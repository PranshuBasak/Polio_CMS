/**
 * Portfolio Data Service
 *
 * This service bridges Zustand client-side stores with Server Components.
 * It reads from localStorage storage keys to provide server-compatible data fetching.
 *
 * Note: This is a transition layer. In production, you'd fetch from a real API/database.
 */

import type {
    AboutData,
    BlogPost,
    ExternalBlogPost,
    HeroData,
    Project,
    ResumeData,
    Skill,
    SkillCategory,
    Testimonial,
} from '@/lib/types';

// Import default data
import {
    defaultBlogPosts,
    defaultExternalPosts,
    defaultProjects,
    defaultSkillCategories,
    defaultSkills,
    defaultTestimonials,
} from '@/lib/data/defaults';

// Storage keys match Zustand persist configuration
const STORAGE_KEYS = {
  HERO: 'hero-storage',
  ABOUT: 'about-storage',
  PROJECTS: 'projects-storage',
  SKILLS: 'skills-storage',
  BLOG: 'blog-storage',
  RESUME: 'resume-storage',
  TESTIMONIALS: 'testimonials-storage',
} as const;

/**
 * Type-safe localStorage reader
 * Returns null if running on server or data doesn't exist
 */
function getStorageData<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null; // Server-side: return null
  }

  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    return parsed.state || null;
  } catch (error) {
    console.error(`Failed to parse storage for key "${key}":`, error);
    return null;
  }
}

/**
 * Hero Data Service
 */
export async function getHeroData(): Promise<HeroData> {
  const data = getStorageData<{ heroData: HeroData }>(STORAGE_KEYS.HERO);

  // Return stored data or fallback defaults
  return (
    data?.heroData ?? {
      name: 'Tanzim',
      title: 'Software Architect & Backend Developer',
      description:
        'I build scalable backend systems and architect software solutions with a focus on performance, security, and maintainability.',
      image: '/avatar-placeholder.svg',
    }
  );
}

/**
 * About Data Service
 */
export async function getAboutData(): Promise<AboutData> {
  const data = getStorageData<{ aboutData: AboutData }>(STORAGE_KEYS.ABOUT);

  return (
    data?.aboutData ?? {
      bio: "I'm a software architect and backend developer with expertise in TypeScript, Java, Spring Boot, and Node.js. I specialize in designing and implementing scalable, maintainable, and secure backend systems.",
      focus:
        "My focus areas include system design, microservices architecture, and DevOps practices. I'm passionate about creating efficient solutions that solve complex problems while maintaining code quality and performance.",
      journey: [
        {
          id: "1",
          title: "Senior Software Architect",
          company: "TechInnovate",
          date: "2022 - Present",
          description:
            "Leading the architecture design for distributed systems and microservices. Implementing event-driven architecture and CQRS patterns for scalable and maintainable systems.",
        },
        {
          id: "2",
          title: "Backend Team Lead",
          company: "DataFlow Systems",
          date: "2019 - 2022",
          description:
            "Led a team of 6 backend developers. Designed and implemented scalable APIs and services using Spring Boot and Node.js. Mentored junior developers and established coding standards.",
        },
        {
          id: "3",
          title: "Software Engineer",
          company: "CloudScale",
          date: "2017 - 2019",
          description:
            "Developed and maintained backend services for high-traffic applications. Implemented CI/CD pipelines and DevOps practices to improve deployment efficiency and system reliability.",
        },
      ],
      values: [
        {
          id: "1",
          title: "Passion",
          description: "I'm deeply passionate about creating elegant solutions to complex problems.",
          icon: "Heart",
        },
        {
          id: "2",
          title: "Excellence",
          description: "I strive for excellence in every line of code and system design decision.",
          icon: "Target",
        },
        {
          id: "3",
          title: "Innovation",
          description: "I believe in continuous learning and embracing innovative approaches.",
          icon: "Lightbulb",
        },
      ],
      mission:
        "To create elegant, scalable, and maintainable software solutions that solve real-world problems and deliver exceptional value to users and businesses.",
    }
  );
}

/**
 * Projects Data Service
 */
export async function getProjects(): Promise<Project[]> {
  const data = getStorageData<{ projects: Project[] }>(STORAGE_KEYS.PROJECTS);
  return data?.projects ?? defaultProjects;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) ?? null;
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const projects = await getProjects();
  return projects.slice(0, limit);
}

/**
 * Skills Data Service
 */
export async function getSkills(): Promise<Skill[]> {
  const data = getStorageData<{ skills: Skill[] }>(STORAGE_KEYS.SKILLS);
  return data?.skills ?? defaultSkills;
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const data = getStorageData<{ categories: SkillCategory[] }>(
    STORAGE_KEYS.SKILLS
  );
  return data?.categories ?? defaultSkillCategories;
}

export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  const skills = await getSkills();
  return skills.filter((s) => s.category === category);
}

/**
 * Blog Data Service
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = getStorageData<{ internalPosts: BlogPost[] }>(STORAGE_KEYS.BLOG);
  return data?.internalPosts ?? defaultBlogPosts;
}

export async function getExternalBlogPosts(): Promise<ExternalBlogPost[]> {
  const data = getStorageData<{ externalPosts: ExternalBlogPost[] }>(
    STORAGE_KEYS.BLOG
  );
  return data?.externalPosts ?? defaultExternalPosts;
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const data = getStorageData<{ internalPosts: BlogPost[] }>(STORAGE_KEYS.BLOG);
  const posts = data?.internalPosts ?? defaultBlogPosts;
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getLatestBlogPosts(limit = 3): Promise<{
  internal: BlogPost[];
  external: ExternalBlogPost[];
}> {
  const internal = await getBlogPosts();
  const external = await getExternalBlogPosts();

  return {
    internal: internal.slice(0, limit),
    external: external.slice(0, limit),
  };
}

/**
 * Resume Data Service
 */
export async function getResumeData(): Promise<ResumeData> {
  const data = getStorageData<{ resumeData: ResumeData }>(STORAGE_KEYS.RESUME);

  return (
    data?.resumeData ?? {
      experiences: [],
      education: [],
      skills: [],
      certifications: [],
      languages: [],
      interests: [],
      pdfUrl: '',
    }
  );
}

/**
 * Testimonials Data Service
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const data = getStorageData<{ testimonials: Testimonial[] }>(
    STORAGE_KEYS.TESTIMONIALS
  );
  return data?.testimonials ?? defaultTestimonials;
}

export async function getFeaturedTestimonials(
  limit = 6
): Promise<Testimonial[]> {
  const testimonials = await getTestimonials();
  return testimonials.slice(0, limit);
}

/**
 * Combined Data Service (for homepage)
 */
export async function getHomePageData() {
  const [hero, projects, skills, blogPosts, testimonials] = await Promise.all([
    getHeroData(),
    getFeaturedProjects(6),
    getSkillCategories(),
    getLatestBlogPosts(3),
    getFeaturedTestimonials(6),
  ]);

  return {
    hero,
    projects,
    skills,
    blogPosts,
    testimonials,
  };
}
