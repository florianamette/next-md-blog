import { getBlogPost, getAllBlogPosts, generateBlogPostMetadata, BlogPostSEO } from '@next-md-blog/core';
import { MarkdownContent } from '@next-md-blog/core';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import blogConfig from '@/next-md-blog.config';
{{POSTS_DIR_OPTION}}

export async function generateStaticParams() {
{{GENERATE_STATIC_PARAMS}}
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string{{LOCALE_PARAM}} }> }): Promise<Metadata> {
  const resolvedParams = await params;
{{LOCALE_EXTRACT}}
  const post = await getBlogPost(slug{{POSTS_DIR_PARAM_FUNC}}, { config: blogConfig });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return generateBlogPostMetadata(post, blogConfig);
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string{{LOCALE_PARAM}} }> }) {
  const resolvedParams = await params;
{{LOCALE_EXTRACT}}
  const post = await getBlogPost(slug{{POSTS_DIR_PARAM_FUNC}}, { config: blogConfig });

  if (!post) {
    notFound();
  }

  const formattedDate = post.frontmatter?.date
    ? new Date(post.frontmatter.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <>
      {/* SEO: JSON-LD Structured Data */}
      <BlogPostSEO post={post} config={blogConfig} />

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
          {/* Back button */}
          <Link
            href="{{BLOG_ROUTE_PATH}}"
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-8 group"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to all posts</span>
          </Link>

          {/* Article Card */}
          <article className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-neutral-200 dark:border-neutral-700">
              {post.frontmatter?.title && (
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
                  {post.frontmatter.title}
                </h1>
              )}

              {post.frontmatter?.description && (
                <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 mb-6 italic">
                  {post.frontmatter.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-neutral-600 dark:text-neutral-400">
                {formattedDate && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time dateTime={post.frontmatter.date}>{formattedDate}</time>
                  </div>
                )}

                {post.authors && post.authors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>
                      {post.authors.map((author, idx) => {
                        const name = typeof author === 'string' ? author : author.name;
                        return (
                          <span key={idx}>
                            {idx > 0 && ', '}
                            {name}
                          </span>
                        );
                      })}
                    </span>
                  </div>
                )}

                {post.readingTime > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{post.readingTime} min read</span>
                  </div>
                )}

                {post.wordCount > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{post.wordCount.toLocaleString()} words</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.frontmatter?.tags && Array.isArray(post.frontmatter.tags) && post.frontmatter.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {post.frontmatter.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="px-6 sm:px-8 py-8">
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-neutral-900 dark:prose-headings:text-white prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-900 dark:prose-strong:text-white prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-pre:bg-neutral-900 dark:prose-pre:bg-neutral-950 prose-blockquote:border-blue-500 prose-blockquote:text-neutral-700 dark:prose-blockquote:text-neutral-300">
                <MarkdownContent content={post.content} />
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

