"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface BentoMonoCardProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoMonoCard({ children, className }: BentoMonoCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/70 bg-card/85 p-5 shadow-sm backdrop-blur-sm",
        "transition-all duration-300 hover:border-primary/35 hover:shadow-[0_18px_50px_-24px_hsl(var(--primary)/0.45)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,hsl(var(--primary)/0.18),transparent_45%)]" />
      </div>
      <div className="relative z-10">{children}</div>
    </article>
  );
}

export function BentoMonoHeader({ children, className }: BentoMonoCardProps) {
  return <header className={cn("mb-4 space-y-1", className)}>{children}</header>;
}

export function BentoMonoBody({ children, className }: BentoMonoCardProps) {
  return <div className={cn("space-y-3", className)}>{children}</div>;
}

export function BentoMonoFooter({ children, className }: BentoMonoCardProps) {
  return (
    <footer className={cn("mt-5 border-t border-dashed border-border/60 pt-4", className)}>
      {children}
    </footer>
  );
}

export function BentoMonoStat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-background/65 px-3 py-2", className)}>
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default function BentoMonochromeOne() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10">
      <BentoMonoCard>
        <BentoMonoHeader>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Bento Monochrome</p>
          <h3 className="text-2xl font-semibold text-foreground">Reusable Experience Card Surface</h3>
        </BentoMonoHeader>
        <BentoMonoBody>
          <p className="text-sm text-muted-foreground">
            This base component is used by resume cards to keep spacing, borders, and motion consistent with the
            monochrome bento style.
          </p>
        </BentoMonoBody>
      </BentoMonoCard>
    </section>
  );
}

