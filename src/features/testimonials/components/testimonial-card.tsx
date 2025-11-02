'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import type { Testimonial } from '@/lib/types';
import { Quote } from 'lucide-react';

/**
 * Testimonial Card - Client Component
 */
interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  // Generate initials from author name
  const initials = testimonial.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <Quote className="h-10 w-10 text-primary/20 mb-4" />
        <p className="text-foreground mb-6 grow">{testimonial.content}</p>
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-4 border-2 border-primary/20">
            <AvatarImage
              src={testimonial.avatar || '/placeholder.svg'}
              alt={testimonial.author}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{testimonial.author}</h4>
            <p className="text-sm text-muted-foreground">
              {testimonial.position}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
