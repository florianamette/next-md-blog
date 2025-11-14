import type { BlogPost, BlogPostMetadata, Config } from './types.js';
import { getConfig } from './config.js';
import { resolveFrontmatterField } from './type-guards.js';
import { DEFAULT_SITE_NAME, RSS_POST_LIMIT } from './constants.js';
import { resolvePostUrl, escapeXml, getAuthorName } from './seo-utils.js';

/**
 * Generates sitemap XML for blog posts
 * @param posts - Array of blog post metadata
 * @param config - SEO configuration
 * @returns Sitemap XML string
 */
export function generateSitemap(
  posts: BlogPostMetadata[],
  config?: Config
): string {
  const blogConfig = config || getConfig();
  const { siteUrl = '' } = blogConfig;

  const urls = posts
    .map((post) => {
      const lastmod = resolveFrontmatterField<string>(
        ['modifiedDate', 'date'],
        post.frontmatter
      ) || new Date().toISOString().split('T')[0];
      const url = `${siteUrl}/blog/${post.slug}`;
      return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Generates RSS feed XML for blog posts
 * @param posts - Array of blog posts
 * @param config - SEO configuration
 * @returns RSS XML string
 */
export function generateRSSFeed(
  posts: BlogPost[],
  config?: Config
): string {
  const blogConfig = config || getConfig();
  const {
    siteName = DEFAULT_SITE_NAME,
    siteUrl = '',
    defaultAuthor,
  } = blogConfig;

  const items = posts
    .slice(0, RSS_POST_LIMIT) // Limit to most recent posts
    .map((post) => {
      const title = resolveFrontmatterField<string>(['title'], post.frontmatter, post.slug) || post.slug;
      const description = resolveFrontmatterField<string>(
        ['description', 'excerpt'],
        post.frontmatter,
        ''
      ) || '';
      const authorObj = post.authors[0];
      const author = authorObj ? getAuthorName(authorObj) : (defaultAuthor || '');
      const pubDate = resolveFrontmatterField<string>(
        ['publishedDate', 'date'],
        post.frontmatter
      ) || new Date().toISOString();
      const url = resolvePostUrl(
        resolveFrontmatterField<string>(['canonicalUrl'], post.frontmatter),
        post.slug,
        siteUrl
      );
      
      // Format date for RSS (RFC 822)
      const rssDate = new Date(pubDate).toUTCString();

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(description)}</description>
      <author>${escapeXml(author)}</author>
      <pubDate>${rssDate}</pubDate>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Latest blog posts from ${escapeXml(siteName)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

