"use client";

import type React from "react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type IconComponentType = React.ElementType<{ className?: string }>;

export interface InteractiveMenuItem {
  key: string;
  label: string;
  icon: IconComponentType;
}

export interface InteractiveMenuProps {
  items: InteractiveMenuItem[];
  activeKey: string;
  onChange: (key: string) => void;
  accentColor?: string;
  className?: string;
}

export function InteractiveMenu({
  items,
  activeKey,
  onChange,
  accentColor = "var(--accent)",
  className,
}: InteractiveMenuProps) {
  const activeIndex = useMemo(
    () => Math.max(0, items.findIndex((item) => item.key === activeKey)),
    [activeKey, items]
  );

  return (
    <nav
      className={cn(
        "relative rounded-2xl border border-border/70 bg-card/80 p-1.5 shadow-sm backdrop-blur",
        className
      )}
      style={{ ["--menu-accent" as string]: accentColor }}
      aria-label="Resume sections"
    >
      <div className="relative flex gap-1 overflow-x-auto md:grid md:auto-cols-fr md:grid-flow-col">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={cn(
                "relative z-10 flex min-w-[132px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors overflow-hidden",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                isActive ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive ? (
                <motion.span
                  layoutId="interactive-menu-active-pill"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-[color:var(--menu-accent)]"
                />
              ) : null}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="truncate">{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
