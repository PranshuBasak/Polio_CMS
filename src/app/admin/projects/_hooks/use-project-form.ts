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
  category: z.string().optional(),
  featured: z.boolean().optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

export function useProjectForm(project?: Project) {
  const router = useRouter();
  const { toast } = useToast();
  const addProject = useProjectsStore((state) => state.addProject);
  const deleteProject = useProjectsStore((state) => state.deleteProject);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      technologies: project?.technologies?.join(', ') || '',
      githubUrl: project?.githubUrl || '',
      liveUrl: project?.liveUrl || '',
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
        image: project?.image,
        caseStudy: project?.caseStudy,
      };

      if (project) {
        // Remove old project and add updated one
        deleteProject(project.id);
        addProject(projectData);
        toast({
          title: 'Project updated!',
          description: 'Your project has been updated successfully.',
        });
      } else {
        addProject(projectData);
        toast({
          title: 'Project created!',
          description: 'Your project has been created successfully.',
        });
      }

      router.push('/admin/projects');
    } catch (error) {
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
