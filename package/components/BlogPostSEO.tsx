import React from 'react';
import type { BlogPost, Config } from '../core/types';
import { generateBlogPostSchema, generateBreadcrumbsSchema } from '../core/seo';
import { getConfig } from '../core/config';

/**
 * Props for the BlogPostSEO component
 */
export interface BlogPostSEOProps {
  /** The blog post */
  post: BlogPost;
  /** Configuration (optional - will load from next-mdx-blog.config.ts if not provided) */
  config?: Config;
  /** Custom breadcrumb items (optional) */
  breadcrumbs?: Array<{ name: string; url: string }>;
  /** Whether to include breadcrumbs schema (default: true) */
  includeBreadcrumbs?: boolean;
}

/**
 * Component that generates and injects JSON-LD structured data for a blog post
 * Handles both article schema and breadcrumbs schema automatically
 * 
 * @example
 * ```tsx
 * <BlogPostSEO post={post} />
 * ```
 */
export function BlogPostSEO({
  post,
  config,
  breadcrumbs,
  includeBreadcrumbs = true,
}: BlogPostSEOProps) {
  const blogConfig = config || getConfig();
  
  // Generate article schema
  const articleSchema = generateBlogPostSchema(post, blogConfig);

  // Generate breadcrumbs schema if enabled
  const breadcrumbsSchema = includeBreadcrumbs
    ? generateBreadcrumbsSchema(post, blogConfig, breadcrumbs)
    : null;

  return (
    <>
      {/* Article JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Breadcrumbs JSON-LD Schema */}
      {breadcrumbsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
        />
      )}
    </>
  );
}

