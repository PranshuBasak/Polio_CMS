'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '../../../../hooks/use-toast';
import type { BlogPost } from '../../../../lib/stores';
import { useBlogStore } from '../../../../lib/stores';

const blogFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  author: z.string().optional(),
  tags: z.string().optional(),
});

export type BlogFormData = z.infer<typeof blogFormSchema>;

export function useBlogForm(post?: BlogPost) {
  const router = useRouter();
  const { toast } = useToast();
  const addBlogPost = useBlogStore((state) => state.addBlogPost);
  const updateBlogPost = useBlogStore((state) => state.updateBlogPost);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      author: '',
      tags: '',
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    try {
      const postData = {
        ...data,
        tags: data.tags
          ? data.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        date: post?.date || new Date().toISOString(),
      };

      if (post) {
        updateBlogPost(post.id, postData);
        toast({
          title: 'Post updated!',
          description: 'Your blog post has been updated successfully.',
        });
      } else {
        addBlogPost({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          date: new Date().toISOString().split('T')[0],
        });
        toast({
          title: 'Post created!',
          description: 'Your blog post has been created successfully.',
        });
      }

      router.push('/admin/blog');
    } catch (error) {
      console.error('Failed to save post:', error);
      toast({
        title: 'Error',
        description: 'Failed to save post. Please try again.',
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
