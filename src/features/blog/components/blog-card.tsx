'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { BlogPost } from '@/lib/types';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

/**
 * Blog Card - Client Component
 */
interface BlogCardProps {
  post: BlogPost;
  isExternal?: boolean;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isExternal = !!post.externalUrl;

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-balance">{post.title}</CardTitle>
          {isExternal && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs whitespace-nowrap">
              External
            </span>
          )}
        </div>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>{formattedDate}</time>
        </CardDescription>
      </CardHeader>

      <CardContent className="grow">
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          {isExternal ? (
            <a href={post.externalUrl || '#'} target="_blank" rel="noopener noreferrer">
              Read on Blog Site
            </a>
          ) : (
            <Link href={`/blog/${post.slug}`}>Read More</Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
