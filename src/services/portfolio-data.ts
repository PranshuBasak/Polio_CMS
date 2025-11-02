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
      image: '/placeholder.svg?height=400&width=400',
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
      bio: '',
      focus: '',
      journey: [],
      values: [],
      mission: '',
    }
  );
}

/**
 * Projects Data Service
 */
export async function getProjects(): Promise<Project[]> {
  const data = getStorageData<{ projects: Project[] }>(STORAGE_KEYS.PROJECTS);
  return data?.projects ?? [];
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
  return data?.skills ?? [];
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const data = getStorageData<{ categories: SkillCategory[] }>(
    STORAGE_KEYS.SKILLS
  );
  return data?.categories ?? [];
}

export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  const skills = await getSkills();
  return skills.filter((s) => s.category === category);
}

/**
 * Blog Data Service
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = getStorageData<{ blogPosts: BlogPost[] }>(STORAGE_KEYS.BLOG);
  return data?.blogPosts ?? [];
}

export async function getExternalBlogPosts(): Promise<ExternalBlogPost[]> {
  const data = getStorageData<{ externalBlogPosts: ExternalBlogPost[] }>(
    STORAGE_KEYS.BLOG
  );
  return data?.externalBlogPosts ?? [];
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
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
  return data?.testimonials ?? [];
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
