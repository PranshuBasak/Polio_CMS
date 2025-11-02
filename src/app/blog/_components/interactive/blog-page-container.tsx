'use client';

import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import { motion } from 'framer-motion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../components/ui/tabs';
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

          <Tabs defaultValue="internal" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="internal">
                {t('blog.tab.internal')}
              </TabsTrigger>
              <TabsTrigger value="external">
                {t('blog.tab.external')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="internal">
              <ErrorBoundary>
                <BlogPostsGrid
                  posts={internalPagination.currentItems}
                  type="internal"
                  formatDate={blogService.formatDate}
                  emptyMessage={t('blog.noResults')}
                />

                <BlogPagination
                  currentPage={internalPagination.currentPage}
                  totalPages={internalPagination.totalPages}
                  onPageChange={internalPagination.goToPage}
                  onNext={internalPagination.nextPage}
                  onPrevious={internalPagination.previousPage}
                />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="external">
              <ErrorBoundary>
                <BlogPostsGrid
                  posts={externalPagination.currentItems}
                  type="external"
                  formatDate={blogService.formatDate}
                  emptyMessage={t('blog.noResults')}
                />

                <BlogPagination
                  currentPage={externalPagination.currentPage}
                  totalPages={externalPagination.totalPages}
                  onPageChange={externalPagination.goToPage}
                  onNext={externalPagination.nextPage}
                  onPrevious={externalPagination.previousPage}
                />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
