import { Button } from '@/components/ui/button';
import { RandomizedTextEffect } from '@/components/ui/text-randomized';
import { ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative isolate overflow-hidden min-h-[82vh] md:min-h-[88vh]">
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-[url('https://www.ui-layouts.com/noise.gif')] opacity-[0.06]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[34px_34px]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 z-0 bg-linear-to-b from-background via-background/85 to-background"
        aria-hidden="true"
      />

      <section className="relative z-20 container mx-auto px-4 py-24 md:py-32 flex min-h-[82vh] md:min-h-[88vh] items-center justify-center">
        <div className="max-w-4xl text-center space-y-7">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">CONNECTION BREACH :: ERROR 404</p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-foreground">
            <RandomizedTextEffect text="SIGNAL CORRUPTED: Route Not Found" />
          </h1>

          <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
            Neural pathway compromised. The coordinates you accessed don&apos;t exist in this sector of the Net—might&apos;ve been wiped, relocated, or never uploaded to the matrix.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                Jack Out to Main Terminal
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/projects">
                Browse Database Archives
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
