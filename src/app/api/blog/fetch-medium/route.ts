import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'content'],
      ['dc:creator', 'creator'],
    ],
  },
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || '0xPranshu';
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    const feedUrl = `https://medium.com/feed/@${username}`;

    // Fetch and parse RSS feed
    const feed = await parser.parseURL(feedUrl);

    // Transform RSS items to our format
    const posts = feed.items.slice(0, limit).map((item) => {
      // Extract plain text excerpt from HTML content
      const excerpt = extractExcerpt(item.contentSnippet || item.content || '');

      return {
        id: `medium-${item.guid || item.link}`,
        title: item.title || 'Untitled',
        excerpt: excerpt,
        url: item.link || '#',
        date: item.isoDate || item.pubDate || new Date().toISOString(),
        source: 'Medium',
      };
    });

    return NextResponse.json({
      success: true,
      posts,
      feedTitle: feed.title,
      feedDescription: feed.description,
    });
  } catch (error) {
    console.error('Error fetching Medium RSS:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Medium posts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Extract plain text excerpt from HTML content
 */
function extractExcerpt(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Remove multiple spaces and trim
  text = text.replace(/\s+/g, ' ').trim();

  // Limit to 200 characters
  if (text.length > 200) {
    text = text.substring(0, 197) + '...';
  }

  return text;
}
