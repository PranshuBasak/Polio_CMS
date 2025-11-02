'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  FileText,
  FolderKanban,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Hero',
      href: '/admin/hero',
      icon: User,
    },
    {
      title: 'About',
      href: '/admin/about',
      icon: User,
    },
    {
      title: 'Projects',
      href: '/admin/projects',
      icon: FolderKanban,
    },
    {
      title: 'Skills',
      href: '/admin/skills',
      icon: BarChart3,
    },
    {
      title: 'Blog',
      href: '/admin/blog',
      icon: FileText,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transition-transform duration-300 ease-in-out md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 mt-2">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              <span className="font-bold text-lg">0xTanzim</span>
            </Link>
          </div>

          <nav className="space-y-1 flex-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  pathname === route.href
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                <route.icon className="h-4 w-4" />
                <span>{route.title}</span>
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>Back to Site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen">{children}</div>;
}
