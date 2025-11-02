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

export function BlogCard({ post, isExternal = false }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-balance">{post.title}</CardTitle>
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
          <Link href={`/blog/${post.slug}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
