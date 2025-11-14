/**
 * SEO utilities and generators for next-md-blog
 * 
 * This module provides functions for generating metadata, schema.org structured data,
 * and RSS/sitemap feeds for blog posts.
 */

// Re-export all SEO functions from their respective modules
export {
  generateBlogPostMetadata,
  generateBlogListMetadata,
} from './seo-metadata.js';

export {
  generateBlogPostSchema,
  generateBreadcrumbsSchema,
} from './seo-schema.js';

export {
  generateSitemap,
  generateRSSFeed,
} from './seo-feeds.js';

// Re-export utility functions that might be useful
export {
  normalizeKeywords,
  getAuthorName,
  getAuthorNames,
  ensureAuthorsResolved,
  resolveDefaultAuthor,
  buildRobotsMeta,
  resolveCanonicalUrl,
  resolvePostUrl,
  escapeXml,
} from './seo-utils.js';
