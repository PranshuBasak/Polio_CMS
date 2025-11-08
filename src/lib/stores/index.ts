import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

// Hero Types
export type HeroData = {
  name: string;
  title: string;
  description: string;
  image: string;
};

// About Types
export type AboutJourneyItem = {
  id: string;
  title: string;
  company: string;
  date: string;
  description: string;
};

export type AboutValue = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type AboutData = {
  bio: string;
  focus: string;
  journey: AboutJourneyItem[];
  values: AboutValue[];
  mission: string;
};

// Project Types
export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  caseStudy?: {
    challenge: string;
    solution: string;
    results: string;
    process: string[];
    screenshots: string[];
  };
};

// Blog Types
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
};

export type ExternalBlogPost = {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  source: string;
};

// Skills Types
export type Skill = {
  id: string;
  name: string;
  level: number;
  category: string;
};

export type SkillCategory = {
  id: string;
  name: string;
  description?: string;
  order: number;
};

// Resume Types
export type ResumeExperience = {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
};

export type ResumeEducation = {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  courses: string[];
};

export type ResumeSkillCategory = {
  category: string;
  items: {
    name: string;
    level: number;
  }[];
};

export type ResumeCertification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
  url?: string;
};

export type ResumeData = {
  experiences: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillCategory[];
  certifications: ResumeCertification[];
  languages: {
    name: string;
    proficiency: string;
  }[];
  interests: string[];
  pdfUrl: string;
};

// Testimonial Types
export type Testimonial = {
  id: string;
  content: string;
  author: string;
  position: string;
  company: string;
  avatar?: string;
  rating?: number;
};

// ============================================================================
// DEFAULT DATA
// ============================================================================

const defaultHeroData: HeroData = {
  name: 'Tanzim',
  title: 'Software Architect & Backend Developer',
  description:
    'I build scalable backend systems and architect software solutions with a focus on performance, security, and maintainability.',
  image: '/avatar-placeholder.svg',
};

const defaultAboutData: AboutData = {
  bio: "I'm a software architect and backend developer with expertise in TypeScript, Java, Spring Boot, and Node.js. I specialize in designing and implementing scalable, maintainable, and secure backend systems.",
  focus:
    "My focus areas include system design, microservices architecture, and DevOps practices. I'm passionate about creating efficient solutions that solve complex problems while maintaining code quality and performance.",
  journey: [
    {
      id: '1',
      title: 'Senior Software Architect',
      company: 'TechInnovate',
      date: '2022 - Present',
      description:
        'Leading the architecture design for distributed systems and microservices. Implementing event-driven architecture and CQRS patterns for scalable and maintainable systems.',
    },
    {
      id: '2',
      title: 'Backend Team Lead',
      company: 'DataFlow Systems',
      date: '2019 - 2022',
      description:
        'Led a team of 6 backend developers. Designed and implemented scalable APIs and services using Spring Boot and Node.js. Mentored junior developers and established coding standards.',
    },
    {
      id: '3',
      title: 'Software Engineer',
      company: 'CloudScale',
      date: '2017 - 2019',
      description:
        'Developed and maintained backend services for high-traffic applications. Implemented CI/CD pipelines and DevOps practices to improve deployment efficiency and system reliability.',
    },
  ],
  values: [
    {
      id: '1',
      title: 'Passion',
      description:
        "I'm deeply passionate about creating elegant solutions to complex problems.",
      icon: 'Heart',
    },
    {
      id: '2',
      title: 'Excellence',
      description:
        'I strive for excellence in every line of code and system design decision.',
      icon: 'Target',
    },
    {
      id: '3',
      title: 'Innovation',
      description:
        'I believe in continuous learning and embracing innovative approaches.',
      icon: 'Lightbulb',
    },
  ],
  mission:
    'To create elegant, scalable, and maintainable software solutions that solve real-world problems and deliver exceptional value to users and businesses.',
};

// ============================================================================
// HERO STORE
// ============================================================================

type HeroStore = {
  heroData: HeroData;
  updateHeroData: (data: Partial<HeroData>) => void;
  resetHeroData: () => void;
};

export const useHeroStore = create<HeroStore>()(
  persist(
    (set) => ({
      heroData: defaultHeroData,
      updateHeroData: (data) =>
        set((state) => ({
          heroData: { ...state.heroData, ...data },
        })),
      resetHeroData: () => set({ heroData: defaultHeroData }),
    }),
    {
      name: 'hero-storage',
    }
  )
);

// ============================================================================
// ABOUT STORE
// ============================================================================

type AboutStore = {
  aboutData: AboutData;
  updateAboutData: (data: Partial<AboutData>) => void;
  updateAboutJourney: (journeys: AboutJourneyItem[]) => void;
  updateAboutValues: (values: AboutValue[]) => void;
  resetAboutData: () => void;
};

export const useAboutStore = create<AboutStore>()(
  persist(
    (set) => ({
      aboutData: defaultAboutData,
      updateAboutData: (data) =>
        set((state) => ({
          aboutData: { ...state.aboutData, ...data },
        })),
      updateAboutJourney: (journeys) =>
        set((state) => ({
          aboutData: { ...state.aboutData, journey: journeys },
        })),
      updateAboutValues: (values) =>
        set((state) => ({
          aboutData: { ...state.aboutData, values },
        })),
      resetAboutData: () => set({ aboutData: defaultAboutData }),
    }),
    {
      name: 'about-storage',
    }
  )
);

// ============================================================================
// PROJECTS STORE
// ============================================================================

type ProjectsStore = {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  removeProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  resetProjects: () => void;
};

export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      projects: [],
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),
      updateProject: (id, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updatedProject } : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),
      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),
      getProjectById: (id) => get().projects.find((p) => p.id === id),
      resetProjects: () => set({ projects: [] }),
    }),
    {
      name: 'projects-storage',
    }
  )
);

// ============================================================================
// SKILLS STORE
// ============================================================================

type SkillsStore = {
  skills: Skill[];
  categories: SkillCategory[];
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  deleteSkill: (id: string) => void;
  addCategory: (category: Omit<SkillCategory, 'id'>) => void;
  updateCategory: (id: string, category: Partial<SkillCategory>) => void;
  deleteCategory: (id: string) => void;
  resetSkills: () => void;
};

export const useSkillsStore = create<SkillsStore>()(
  persist(
    (set, get) => ({
      skills: [],
      categories: [],
      addSkill: (skill) =>
        set((state) => ({
          skills: [...state.skills, skill],
        })),
      updateSkill: (id, updatedSkill) =>
        set((state) => ({
          skills: state.skills.map((s) =>
            s.id === id ? { ...s, ...updatedSkill } : s
          ),
        })),
      removeSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((skill) => skill.id !== id),
        })),
      deleteSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((skill) => skill.id !== id),
        })),
      addCategory: (category) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { ...category, id: crypto.randomUUID?.() ?? Date.now().toString() },
          ],
        })),
      updateCategory: (id, updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updatedCategory } : c
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
      resetSkills: () => set({ skills: [], categories: [] }),
    }),
    {
      name: 'skills-storage',
    }
  )
);

// ============================================================================
// BLOG STORE
// ============================================================================

type BlogStore = {
  internalPosts: BlogPost[];
  externalPosts: ExternalBlogPost[];
  addBlogPost: (post: BlogPost) => void;
  removeBlogPost: (id: string) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  addExternalBlogPost: (post: ExternalBlogPost) => void;
  removeExternalBlogPost: (id: string) => void;
  setExternalPosts: (posts: ExternalBlogPost[]) => void;
  deletePost: (id: string) => void;
  getBlogPostBySlug: (slug: string) => BlogPost | undefined;
  resetBlogPosts: () => void;
};

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      internalPosts: [],
      externalPosts: [],
      addBlogPost: (post) =>
        set((state) => ({
          internalPosts: [...state.internalPosts, post],
        })),
      removeBlogPost: (id) =>
        set((state) => ({
          internalPosts: state.internalPosts.filter((post) => post.id !== id),
        })),
      updateBlogPost: (id, updatedPost) =>
        set((state) => ({
          internalPosts: state.internalPosts.map((post) =>
            post.id === id ? { ...post, ...updatedPost } : post
          ),
        })),
      addExternalBlogPost: (post) =>
        set((state) => ({
          externalPosts: [...state.externalPosts, post],
        })),
      removeExternalBlogPost: (id) =>
        set((state) => ({
          externalPosts: state.externalPosts.filter(
            (post) => post.id !== id
          ),
        })),
      setExternalPosts: (posts) =>
        set({
          externalPosts: posts,
        }),
      deletePost: (id) => get().removeBlogPost(id),
      getBlogPostBySlug: (slug) => get().internalPosts.find((p) => p.slug === slug),
      resetBlogPosts: () => set({ internalPosts: [], externalPosts: [] }),
    }),
    {
      name: 'blog-storage',
    }
  )
);

// ============================================================================
// RESUME STORE
// ============================================================================

type ResumeStore = {
  resumeData: ResumeData;
  updateResumeData: (data: Partial<ResumeData>) => void;
  resetResumeData: () => void;
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: {
        experiences: [],
        education: [],
        skills: [],
        certifications: [],
        languages: [],
        interests: [],
        pdfUrl: '',
      },
      updateResumeData: (data) =>
        set((state) => ({
          resumeData: { ...state.resumeData, ...data },
        })),
      resetResumeData: () =>
        set({
          resumeData: {
            experiences: [],
            education: [],
            skills: [],
            certifications: [],
            languages: [],
            interests: [],
            pdfUrl: '',
          },
        }),
    }),
    {
      name: 'resume-storage',
    }
  )
);

// ============================================================================
// TESTIMONIALS STORE
// ============================================================================

type TestimonialsStore = {
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Testimonial) => void;
  removeTestimonial: (id: string) => void;
  resetTestimonials: () => void;
};

export const useTestimonialsStore = create<TestimonialsStore>()(
  persist(
    (set) => ({
      testimonials: [],
      addTestimonial: (testimonial) =>
        set((state) => ({
          testimonials: [...state.testimonials, testimonial],
        })),
      removeTestimonial: (id) =>
        set((state) => ({
          testimonials: state.testimonials.filter(
            (testimonial) => testimonial.id !== id
          ),
        })),
      resetTestimonials: () => set({ testimonials: [] }),
    }),
    {
      name: 'testimonials-storage',
    }
  )
);

// ============================================================================
// UI STORE
// ============================================================================

// Re-export from ui-store.ts to avoid duplication
export { useUIStore } from './ui-store';
