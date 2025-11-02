import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function AdminNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <ShieldAlert className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Admin Page Not Found</CardTitle>
          <CardDescription className="text-lg">
            The admin page you are looking for does not exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This page may have been removed or you may not have permission to
            access it.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
