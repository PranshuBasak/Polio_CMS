'use server';

import Parser from 'rss-parser';

export type RssItem = {
  title?: string;
  link?: string;
  content?: string;
  contentSnippet?: string;
  pubDate?: string;
  isoDate?: string;
};

export async function fetchRssFeed(url: string): Promise<{ success: boolean; items?: RssItem[]; error?: string }> {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(url);
    
    return {
      success: true,
      items: feed.items.map(item => ({
        title: item.title,
        link: item.link,
        content: item.content,
        contentSnippet: item.contentSnippet,
        pubDate: item.pubDate,
        isoDate: item.isoDate,
      })),
    };
  } catch (error: any) {
    console.error('Error fetching RSS feed:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch RSS feed',
    };
  }
}
