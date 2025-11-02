/**
 * Centralized storage keys for localStorage
 * Prevents typos and makes refactoring easier
 */
export const STORAGE_KEYS = {
  HERO: "hero-storage",
  ABOUT: "about-storage",
  PROJECTS: "projects-storage",
  SKILLS: "skills-storage",
  BLOG: "blog-storage",
  RESUME: "resume-storage",
  TESTIMONIALS: "testimonials-storage",
  LANGUAGE: "preferred-language",
  THEME: "theme",
} as const
