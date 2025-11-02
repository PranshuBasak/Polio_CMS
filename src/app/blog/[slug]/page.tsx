'use client';

import { ArrowLeft, Calendar, Edit } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { type BlogPost, useBlogStore } from '../../../lib/stores';
import { blogService } from '../_services/blog-service';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const getBlogPostBySlug = useBlogStore((state) => state.getBlogPostBySlug);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      const foundPost = getBlogPostBySlug(params.slug as string);

      if (foundPost) {
        const frame = requestAnimationFrame(() => {
          setPost(foundPost);
          setIsLoading(false);
        });
        return () => cancelAnimationFrame(frame);
      } else {
        const frame = requestAnimationFrame(() => {
          setIsLoading(false);
          router.push('/blog');
        });
        return () => cancelAnimationFrame(frame);
      }
    }
  }, [params.slug, getBlogPostBySlug, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-4" />
          <div className="h-4 bg-muted rounded w-1/4 mb-8" />
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back</span>
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            {post.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <time dateTime={post.date}>
                {blogService.formatDate(post.date)}
              </time>
            </div>

            <Button asChild variant="outline" size="sm">
              <a href={`/admin/blog/edit/${post.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                <span>Edit Post</span>
              </a>
            </Button>
          </div>
        </div>

        <Card className="p-6 md:p-8">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </Card>
      </div>
    </div>
  );
}
