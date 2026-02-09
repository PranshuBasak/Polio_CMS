/**
 * Barrel export for all Zustand stores
 * Single source of truth for portfolio data management
 */

// Re-export all stores
export { useAboutStore, type AboutData, type AboutJourneyItem, type AboutValue } from './about-store';
export {
  useAiChatConfigStore,
  type AiChatContextBlock,
  type AiChatSettings,
  type AiChatSkill,
} from './ai-chat-config-store';
export { useBlogStore, type BlogPost } from './blog-store';
export { useHeroStore, type HeroData } from './hero-store';
export { useProjectsStore, type Project } from './projects-store';
export { useResumeStore, type ResumeCertification, type ResumeData, type ResumeEducation, type ResumeExperience, type ResumeSkillCategory } from './resume-store';
export { useSiteSettingsStore, type SiteSettings } from './site-settings-store';
export { useSkillsStore, type Skill, type SkillCategory } from './skills-store';
export { useTestimonialsStore, type Testimonial } from './testimonials-store';
export { useUIStore } from './ui-store';
