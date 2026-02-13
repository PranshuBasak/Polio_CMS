'use client';

import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, PenSquare } from 'lucide-react';
import { useState } from 'react';
import { InteractiveMenu, type InteractiveMenuItem } from '@/components/ui/modern-mobile-menu';
import { useHydration } from '../../../../lib/hooks/use-hydration';
import { useTranslations } from '../../../../lib/i18n/translations-context';
import { useBlogData } from '../../_hooks/use-blog-data';
import { useBlogSearch } from '../../_hooks/use-blog-search';
import { usePagination } from '../../_hooks/use-pagination';
import { blogService } from '../../_services/blog-service';
import { BlogPagination } from '../ui/blog-pagination';
import { BlogPostsGrid } from '../ui/blog-posts-grid';
import { BlogSearch } from '../ui/blog-search';

/**
 * Container component for Blog Page
 * Handles search, pagination, and tab state
 */
export function BlogPageContainer() {
  const { internalPosts, externalPosts } = useBlogData();
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState<'external' | 'internal'>('external');
  const {
    searchTerm,
    setSearchTerm,
    filteredInternalPosts,
    filteredExternalPosts,
  } = useBlogSearch(internalPosts, externalPosts);

  const internalPagination = usePagination(filteredInternalPosts, 6);
  const externalPagination = usePagination(filteredExternalPosts, 6);

  const isHydrated = useHydration();

  if (!isHydrated) return null;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    internalPagination.resetPage();
    externalPagination.resetPage();
  };

  const menuItems: InteractiveMenuItem[] = [
    { key: 'external', label: t('blog.tab.external'), icon: Globe },
    { key: 'internal', label: t('blog.tab.internal'), icon: PenSquare },
  ];

  const showExternal = activeTab === 'external';

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center text-balance">
            {t('blog.title')}
          </h1>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            {t('blog.description')}
          </p>

          <div className="mb-8">
            <BlogSearch
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t('blog.search')}
            />
          </div>

          <div className="mb-8">
            <InteractiveMenu
              items={menuItems}
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as 'external' | 'internal')}
              className="mx-auto max-w-lg"
            />
          </div>

          <ErrorBoundary>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <BlogPostsGrid
                  posts={showExternal ? externalPagination.currentItems : internalPagination.currentItems}
                  type={showExternal ? 'external' : 'internal'}
                  formatDate={blogService.formatDate}
                  emptyMessage={t('blog.noResults')}
                />

                <BlogPagination
                  currentPage={showExternal ? externalPagination.currentPage : internalPagination.currentPage}
                  totalPages={showExternal ? externalPagination.totalPages : internalPagination.totalPages}
                  onPageChange={showExternal ? externalPagination.goToPage : internalPagination.goToPage}
                  onNext={showExternal ? externalPagination.nextPage : internalPagination.nextPage}
                  onPrevious={showExternal ? externalPagination.previousPage : internalPagination.previousPage}
                />
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </motion.div>
      </div>
    </div>
  );
}
