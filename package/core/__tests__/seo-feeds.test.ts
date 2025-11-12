import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateSitemap, generateRSSFeed } from '../seo-feeds';
import type { BlogPost, BlogPostMetadata, Config } from '../types';
import { createMockBlogPost, createMockBlogPostMetadata, createMockConfig } from './fixtures';

describe('generateSitemap', () => {
  it('should generate basic sitemap XML', () => {
    const posts: BlogPostMetadata[] = [
      createMockBlogPostMetadata({
        slug: 'test-post',
        frontmatter: {
          title: 'Test Post',
          date: '2024-01-01',
        },
      }),
    ];
    const config: Config = {
      siteUrl: 'https://example.com',
    };

    const sitemap = generateSitemap(posts, config);

    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(sitemap).toContain('https://example.com/blog/test-post');
    expect(sitemap).toContain('<lastmod>2024-01-01</lastmod>');
    expect(sitemap).toContain('<changefreq>monthly</changefreq>');
    expect(sitemap).toContain('<priority>0.8</priority>');
  });

  it('should handle multiple posts', () => {
    const posts: BlogPostMetadata[] = [
      createMockBlogPostMetadata({ slug: 'post-1', frontmatter: { date: '2024-01-01' } }),
      createMockBlogPostMetadata({ slug: 'post-2', frontmatter: { date: '2024-01-02' } }),
    ];
    const config: Config = { siteUrl: 'https://example.com' };

    const sitemap = generateSitemap(posts, config);

    expect(sitemap).toContain('https://example.com/blog/post-1');
    expect(sitemap).toContain('https://example.com/blog/post-2');
  });

  it('should use modifiedDate if available', () => {
    const posts: BlogPostMetadata[] = [
      createMockBlogPostMetadata({
        slug: 'test-post',
        frontmatter: {
          date: '2024-01-01',
          modifiedDate: '2024-01-15',
        },
      }),
    ];
    const config: Config = { siteUrl: 'https://example.com' };

    const sitemap = generateSitemap(posts, config);

    expect(sitemap).toContain('<lastmod>2024-01-15</lastmod>');
  });

  it('should fallback to date if modifiedDate not available', () => {
    const posts: BlogPostMetadata[] = [
      createMockBlogPostMetadata({
        slug: 'test-post',
        frontmatter: {
          date: '2024-01-01',
        },
      }),
    ];
    const config: Config = { siteUrl: 'https://example.com' };

    const sitemap = generateSitemap(posts, config);

    expect(sitemap).toContain('<lastmod>2024-01-01</lastmod>');
  });

  it('should use current date if no date fields available', () => {
    const posts: BlogPostMetadata[] = [
      createMockBlogPostMetadata({
        slug: 'test-post',
        frontmatter: {},
      }),
    ];
    const config: Config = { siteUrl: 'https://example.com' };

    const sitemap = generateSitemap(posts, config);
    const today = new Date().toISOString().split('T')[0];

    expect(sitemap).toContain(`<lastmod>${today}</lastmod>`);
  });

  it('should escape XML special characters in URLs', () => {
    const posts: BlogPostMetadata[] = [
      createMockBlogPostMetadata({
        slug: 'test&post',
        frontmatter: { date: '2024-01-01' },
      }),
    ];
    const config: Config = { siteUrl: 'https://example.com' };

    const sitemap = generateSitemap(posts, config);

    expect(sitemap).toContain('https://example.com/blog/test&amp;post');
  });

  it('should use getConfig when config not provided', () => {
    const posts: BlogPostMetadata[] = [
      createMockBlogPostMetadata({
        slug: 'test-post',
        frontmatter: { date: '2024-01-01' },
      }),
    ];

    const sitemap = generateSitemap(posts);

    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('<urlset');
  });

  it('should handle empty posts array', () => {
    const sitemap = generateSitemap([], { siteUrl: 'https://example.com' });

    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('<urlset');
    expect(sitemap).not.toContain('<url>');
  });

  it('should handle empty siteUrl', () => {
    const posts: BlogPostMetadata[] = [
      createMockBlogPostMetadata({
        slug: 'test-post',
        frontmatter: { date: '2024-01-01' },
      }),
    ];
    const config: Config = { siteUrl: '' };

    const sitemap = generateSitemap(posts, config);

    expect(sitemap).toContain('/blog/test-post');
  });
});

describe('generateRSSFeed', () => {
  it('should generate basic RSS feed XML', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent here.',
        frontmatter: {
          title: 'Test Post',
          description: 'A test post',
          date: '2024-01-01',
        },
        authors: ['John Doe'],
      }),
    ];
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
      defaultAuthor: 'Default Author',
    };

    const feed = generateRSSFeed(posts, config);

    expect(feed).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(feed).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
    expect(feed).toContain('<channel>');
    expect(feed).toContain('<title>Test Blog</title>');
    expect(feed).toContain('<link>https://example.com</link>');
    expect(feed).toContain('<description>Latest blog posts from Test Blog</description>');
    expect(feed).toContain('<language>en</language>');
  });

  it('should include post items in RSS feed', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent.',
        frontmatter: {
          title: 'Test Post',
          description: 'A test post',
          date: '2024-01-01',
        },
        authors: ['John Doe'],
      }),
    ];
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
    };

    const feed = generateRSSFeed(posts, config);

    expect(feed).toContain('<item>');
    expect(feed).toContain('<title>Test Post</title>');
    expect(feed).toContain('<link>https://example.com/blog/test-post</link>');
    expect(feed).toContain('<description>A test post</description>');
    expect(feed).toContain('<author>John Doe</author>');
    expect(feed).toContain('<pubDate>');
  });

  it('should use excerpt as description if description not available', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent.',
        frontmatter: {
          title: 'Test Post',
          excerpt: 'An excerpt',
          date: '2024-01-01',
        },
        authors: ['John Doe'],
      }),
    ];
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
    };

    const feed = generateRSSFeed(posts, config);

    expect(feed).toContain('<description>An excerpt</description>');
  });

  it('should use slug as title fallback', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent.',
        frontmatter: {
          date: '2024-01-01',
        },
        authors: ['John Doe'],
      }),
    ];
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
    };

    const feed = generateRSSFeed(posts, config);

    expect(feed).toContain('<title>test-post</title>');
  });

  it('should use defaultAuthor when post has no authors', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent.',
        frontmatter: {
          title: 'Test Post',
          date: '2024-01-01',
        },
        authors: [],
      }),
    ];
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
      defaultAuthor: 'Default Author',
    };

    const feed = generateRSSFeed(posts, config);

    expect(feed).toContain('<author>Default Author</author>');
  });

  it('should use publishedDate if available', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent.',
        frontmatter: {
          title: 'Test Post',
          publishedDate: '2024-01-15T10:00:00Z',
          date: '2024-01-01',
        },
        authors: ['John Doe'],
      }),
    ];
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
    };

    const feed = generateRSSFeed(posts, config);

    // RSS dates are formatted as RFC 822 (UTC string)
    expect(feed).toContain('<pubDate>');
    expect(feed).toContain('Mon, 15 Jan 2024');
  });

  it('should fallback to date if publishedDate not available', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent.',
        frontmatter: {
          title: 'Test Post',
          date: '2024-01-01',
        },
        authors: ['John Doe'],
      }),
    ];
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
    };

    const feed = generateRSSFeed(posts, config);

    // RSS dates are formatted as RFC 822 (UTC string)
    expect(feed).toContain('<pubDate>');
    expect(feed).toContain('Mon, 01 Jan 2024');
  });

  it('should use current date if no date fields available', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent.',
        frontmatter: {
          title: 'Test Post',
        },
        authors: ['John Doe'],
      }),
    ];
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
    };

    const feed = generateRSSFeed(posts, config);

    expect(feed).toContain('<pubDate>');
  });

  it('should use canonicalUrl if available', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent.',
        frontmatter: {
          title: 'Test Post',
          date: '2024-01-01',
          canonicalUrl: 'https://custom.com/post',
        },
        authors: ['John Doe'],
      }),
    ];
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
    };

    const feed = generateRSSFeed(posts, config);

    expect(feed).toContain('<link>https://custom.com/post</link>');
    expect(feed).toContain('<guid isPermaLink="true">https://custom.com/post</guid>');
  });

  it('should escape XML special characters', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent.',
        frontmatter: {
          title: 'Test & Post',
          description: 'A test <post> with "quotes"',
          date: '2024-01-01',
        },
        authors: ['John & Doe'],
      }),
    ];
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
    };

    const feed = generateRSSFeed(posts, config);

    expect(feed).toContain('<title>Test &amp; Post</title>');
    expect(feed).toContain('<description>A test &lt;post&gt; with &quot;quotes&quot;</description>');
    expect(feed).toContain('<author>John &amp; Doe</author>');
  });

  it('should limit posts to RSS_POST_LIMIT', () => {
    const posts: BlogPost[] = Array.from({ length: 25 }, (_, i) =>
      createMockBlogPost({
        slug: `post-${i}`,
        content: '# Post\n\nContent.',
        frontmatter: {
          title: `Post ${i}`,
          date: '2024-01-01',
        },
        authors: ['John Doe'],
      })
    );
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
    };

    const feed = generateRSSFeed(posts, config);

    // Should only include first 20 posts (RSS_POST_LIMIT)
    const itemMatches = feed.match(/<item>/g);
    expect(itemMatches).toHaveLength(20);
  });

  it('should use getConfig when config not provided', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent.',
        frontmatter: {
          title: 'Test Post',
          date: '2024-01-01',
        },
        authors: ['John Doe'],
      }),
    ];

    const feed = generateRSSFeed(posts);

    expect(feed).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(feed).toContain('<rss version="2.0"');
  });

  it('should handle empty posts array', () => {
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
    };

    const feed = generateRSSFeed([], config);

    expect(feed).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(feed).toContain('<channel>');
    expect(feed).not.toContain('<item>');
  });

  it('should include atom:link in feed', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent.',
        frontmatter: {
          title: 'Test Post',
          date: '2024-01-01',
        },
        authors: ['John Doe'],
      }),
    ];
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
    };

    const feed = generateRSSFeed(posts, config);

    expect(feed).toContain('<atom:link href="https://example.com/feed.xml" rel="self" type="application/rss+xml"/>');
  });

  it('should format pubDate as RFC 822', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent.',
        frontmatter: {
          title: 'Test Post',
          date: '2024-01-01T12:00:00Z',
        },
        authors: ['John Doe'],
      }),
    ];
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
    };

    const feed = generateRSSFeed(posts, config);

    // Should contain UTC formatted date
    expect(feed).toContain('<pubDate>');
    const pubDateMatch = feed.match(/<pubDate>(.*?)<\/pubDate>/);
    expect(pubDateMatch).toBeTruthy();
  });

  it('should handle Author objects in authors array', () => {
    const posts: BlogPost[] = [
      createMockBlogPost({
        slug: 'test-post',
        content: '# Test Post\n\nContent.',
        frontmatter: {
          title: 'Test Post',
          date: '2024-01-01',
        },
        authors: [{ name: 'John Doe', email: 'john@example.com' }],
      }),
    ];
    const config: Config = {
      siteName: 'Test Blog',
      siteUrl: 'https://example.com',
    };

    const feed = generateRSSFeed(posts, config);

    expect(feed).toContain('<author>John Doe</author>');
  });
});

