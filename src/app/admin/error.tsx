'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Panel Error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto border-destructive">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl">Admin Panel Error</CardTitle>
              <CardDescription>
                An error occurred in the admin panel. Please try again.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-mono text-muted-foreground">
              {error.message || 'An unexpected error occurred'}
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={reset} variant="default">
              Try Again
            </Button>
            <Button
              onClick={() => (window.location.href = '/admin')}
              variant="outline"
            >
              Admin Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
