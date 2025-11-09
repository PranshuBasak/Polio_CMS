'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useHeroStore, useUIStore } from '@/lib/stores';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/shared/components/layout/mode-toggle';
import {
    BarChart3,
    FileAxis3d,
    FileText,
    FolderKanban,
    Home,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    User,
    X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AdminSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const heroData = useHeroStore((state) => state.heroData);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const closeSidebar = useUIStore((state) => state.closeSidebar);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Mounted check happens once
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    setMounted(true);
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      title: 'Resume',
      href: '/admin/resume',
      icon: FileAxis3d,
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

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="fixed top-3 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
          className="bg-background shadow-md border"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-card border-r border-border shadow-xl transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full',
          'md:translate-x-0 md:w-64 md:z-30'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-4 border-b border-border bg-muted/30 justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage
                  src={heroData.image || '/avatar-placeholder.svg'}
                  alt={heroData.name}
                />
                <AvatarFallback>
                  {heroData.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <span className="font-bold text-lg truncate">Admin Panel</span>
            </div>
            <div className="flex items-center gap-1">
              <ModeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => {
                    if (isMobile) {
                      closeSidebar();
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    pathname === route.href
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <route.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{route.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-border bg-muted/20">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Back to Site</span>
            </Link>

            <Separator className="my-4" />

            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => console.log('Logout clicked')}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}
