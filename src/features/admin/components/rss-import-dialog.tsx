'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Rss } from 'lucide-react';
import { fetchRssFeed, RssItem } from '../actions/rss-actions';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';

export function RssImportDialog({ onImportSuccess }: { onImportSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<RssItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const handleFetch = async () => {
    if (!url) return;
    setIsLoading(true);
    setItems([]);
    setSelectedItems(new Set());

    const result = await fetchRssFeed(url);

    if (result.success && result.items) {
      setItems(result.items);
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to fetch RSS feed',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const toggleSelection = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const handleImport = async () => {
    if (selectedItems.size === 0) return;
    setIsImporting(true);

    try {
      const itemsToImport = items.filter((_, index) => selectedItems.has(index));
      
      const { error } = await supabase.from('blog_posts').insert(
        itemsToImport.map((item) => ({
          title: item.title || 'Untitled',
          slug: (item.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now(),
          excerpt: item.contentSnippet || item.content?.substring(0, 150) || '',
          content: null, // External posts don't have local content
          external_url: item.link,
          published: true,
          published_at: item.isoDate || new Date().toISOString(),
          reading_time: 1, // Default
        }))
      );

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Successfully imported ${itemsToImport.length} posts.`,
      });
      
      setOpen(false);
      setUrl('');
      setItems([]);
      setSelectedItems(new Set());
      onImportSuccess();
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to import posts',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Rss className="mr-2 h-4 w-4" />
          Import from RSS
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Blog Posts from RSS</DialogTitle>
          <DialogDescription>
            Enter an RSS feed URL to fetch and import blog posts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="rss-url">RSS Feed URL</Label>
              <Input
                id="rss-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://medium.com/feed/@username"
              />
            </div>
            <Button 
              className="mt-auto" 
              onClick={handleFetch} 
              disabled={isLoading || !url}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch'}
            </Button>
          </div>

          {items.length > 0 && (
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <Label>Select posts to import ({selectedItems.size})</Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    if (selectedItems.size === items.length) {
                      setSelectedItems(new Set());
                    } else {
                      setSelectedItems(new Set(items.map((_, i) => i)));
                    }
                  }}
                >
                  {selectedItems.size === items.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                      <Checkbox
                        id={`post-${index}`}
                        checked={selectedItems.has(index)}
                        onCheckedChange={() => toggleSelection(index)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`post-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {item.title}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.pubDate || '').toLocaleDateString()}
                        </p>
                        {item.contentSnippet && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.contentSnippet}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleImport} disabled={isImporting || selectedItems.size === 0}>
            {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Import Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
