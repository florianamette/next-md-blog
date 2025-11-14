import { getAllBlogPosts, generateBlogListMetadata } from '@next-md-blog/core';
import Link from 'next/link';
import type { Metadata } from 'next';
import blogConfig from '@/next-md-blog.config';
{{POSTS_DIR_OPTION}}

/**
 * Generate SEO metadata for the blogs listing page
 */
export async function generateMetadata({ params }: { params: Promise<{{PARAMS_TYPE}}> }): Promise<Metadata> {
  const resolvedParams = await params;
{{LOCALE_EXTRACT}}
  const posts = await getAllBlogPosts({{POSTS_DIR_PARAM}});
  return generateBlogListMetadata(posts);
}

export default async function BlogsPage({ params }: { params: Promise<{{PARAMS_TYPE}}> }) {
  const resolvedParams = await params;
{{LOCALE_EXTRACT}}
  const posts = await getAllBlogPosts({{POSTS_DIR_PARAM}});

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Blog Posts
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-neutral-400 dark:text-neutral-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-neutral-600 dark:text-neutral-400 mb-2 text-lg">No blog posts found.</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Add markdown files to the <code className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded text-sm font-mono">{{CONTENT_DIR}}/</code> folder
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8">
            {posts.map((post) => {
              const formattedDate = post.frontmatter?.date
                ? new Date(post.frontmatter.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : null;

              return (
                <Link
                  key={post.slug}
                  href={`{{BLOG_ROUTE_PATH}}/${post.slug}`}
                  className="group block"
                >
                  <article className="bg-white dark:bg-neutral-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-400">
                    <div className="p-6 sm:p-8">
                      {/* Title */}
                      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.frontmatter?.title || post.slug}
                      </h2>

                      {/* Description */}
                      {post.frontmatter?.description && (
                        <p className="text-neutral-600 dark:text-neutral-300 mb-4 text-lg leading-relaxed">
                          {post.frontmatter.description}
                        </p>
                      )}

                      {/* Meta Information */}
                      <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
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
                        <div className="flex flex-wrap gap-2 mb-4">
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

                      {/* Read More */}
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium mt-4 group-hover:gap-2 transition-all">
                        <span>Read more</span>
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

