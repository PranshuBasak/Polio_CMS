import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

const CATEGORY_FEEDS: Record<string, { label: string; url: string }> = {
  '1': {
    label: 'General',
    url: 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en',
  },
  '2': {
    label: 'World',
    url: 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en',
  },
  '3': {
    label: 'Business',
    url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en',
  },
  '4': {
    label: 'Technology',
    url: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en',
  },
  '5': {
    label: 'Entertainment',
    url: 'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-US&gl=US&ceid=US:en',
  },
  '6': {
    label: 'Sports',
    url: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-US&gl=US&ceid=US:en',
  },
  '7': {
    label: 'Science',
    url: 'https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-US&gl=US&ceid=US:en',
  },
  '8': {
    label: 'Health',
    url: 'https://news.google.com/rss/headlines/section/topic/HEALTH?hl=en-US&gl=US&ceid=US:en',
  },
  '9': {
    label: 'AI/Tech',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+technology&hl=en-US&gl=US&ceid=US:en',
  },
};

const extractSource = (title: string | undefined, creator?: string) => {
  if (creator && creator.trim().length > 0) {
    return creator.trim();
  }

  const safeTitle = title || '';
  const sourceMatch = safeTitle.match(/ - ([^-]+)$/);
  if (sourceMatch?.[1]) {
    return sourceMatch[1].trim();
  }

  return 'Unknown source';
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '1';
    const limitParam = Number.parseInt(searchParams.get('limit') || '5', 10);
    const limit = Number.isNaN(limitParam) ? 5 : Math.min(Math.max(limitParam, 1), 10);

    const selected = CATEGORY_FEEDS[category];
    if (!selected) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid category. Use a category between 1 and 9.',
        },
        { status: 400 }
      );
    }

    const feed = await parser.parseURL(selected.url);
    const articles = feed.items.slice(0, limit).map((item) => ({
      title: item.title || 'Untitled',
      link: item.link || '#',
      source: extractSource(item.title, typeof item.creator === 'string' ? item.creator : undefined),
      publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      category,
      categoryLabel: selected.label,
      total: articles.length,
      articles,
    });
  } catch (error) {
    console.error('Terminal news route failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news feed.',
      },
      { status: 500 }
    );
  }
}

