'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '../../../../hooks/use-toast';
import type { Project } from '../../../../lib/stores';
import { useProjectsStore } from '../../../../lib/stores';

const projectFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  technologies: z.string().min(1, 'At least one technology is required'),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  image: z.string().url('Invalid URL').optional().or(z.literal('')),
  icon: z.string().url('Invalid URL').optional().or(z.literal('')),
  youtubeUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  screenshots: z.string().optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

export function useProjectForm(project?: Project) {
  const router = useRouter();
  const { toast } = useToast();
  const addProject = useProjectsStore((state) => state.addProject);
  const updateProject = useProjectsStore((state) => state.updateProject);
  const deleteProject = useProjectsStore((state) => state.deleteProject);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      technologies: project?.technologies?.join(', ') || '',
      githubUrl: project?.githubUrl || '',
      liveUrl: project?.liveUrl || '',
      image: project?.image || '',
      icon: project?.icon || '',
      youtubeUrl: project?.youtubeUrl || '',
      screenshots: project?.screenshots?.join('\n') || '',
      category: '',
      featured: false,
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const projectData: Project = {
        id: project?.id || crypto.randomUUID(),
        title: data.title,
        description: data.description,
        technologies: data.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        githubUrl: data.githubUrl || undefined,
        liveUrl: data.liveUrl || undefined,
        image: data.image || undefined,
        icon: data.icon || undefined,
        youtubeUrl: data.youtubeUrl || undefined,
        screenshots: data.screenshots
          ? data.screenshots.split('\n').map((s) => s.trim()).filter(Boolean)
          : [],
        caseStudy: project?.caseStudy,
      };

      if (project) {
        // Update existing project
        await updateProject(project.id, projectData);
        toast({
          title: 'Project updated!',
          description: 'Your project has been updated successfully.',
        });
      } else {
        // Add new project
        await addProject(projectData);
        toast({
          title: 'Project created!',
          description: 'Your project has been created successfully.',
        });
      }

      router.push('/admin/projects');
    } catch (error) {
      console.error('Failed to save project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save project. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  };
}
