import { getAllBlogPosts, generateBlogListMetadata } from '@florianamette/next-md-blog';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import blogConfig from '@/next-md-blog.config';

/**
 * Generate SEO metadata for the blogs listing page
 */
export async function generateMetadata(): Promise<Metadata> {
  const posts = await getAllBlogPosts({ config: blogConfig });
  return generateBlogListMetadata(posts);
}

/**
 * Blogs listing page
 */
export default async function BlogsPage() {
  const posts = await getAllBlogPosts({ config: blogConfig });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" asChild>
            <Link href="/">← Back to home</Link>
          </Button>
          <ThemeToggle />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Blog Posts</h1>
          <p className="text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
          </p>
        </div>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">No blog posts found.</p>
                <p className="text-sm text-muted-foreground">
                  Add markdown files to the <code className="bg-muted px-2 py-1 rounded">posts/</code> folder
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group" tabIndex={-1}>
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer group-hover:border-primary"
                  tabIndex={0}
                  aria-label={`Read blog post: ${post.frontmatter.title || post.slug}`}
                >
                  <CardHeader>
                    <CardTitle className="hover:text-primary transition-colors">
                      {post.frontmatter.title || post.slug}
                    </CardTitle>
                    {post.frontmatter.description && (
                      <CardDescription>
                        {post.frontmatter.description}
                      </CardDescription>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2">
                      {post.frontmatter.date && (
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className="h-3 w-3" />
                          <time dateTime={post.frontmatter.date}>
                            {new Date(post.frontmatter.date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                      )}
                      {post.authors && post.authors.length > 0 ? (
                        <div className="flex items-center gap-2 text-xs">
                          <User className="h-3 w-3" />
                          <span>
                            {post.authors.map((author, idx) => (
                              <span key={idx}>
                                {idx > 0 && ', '}
                                {typeof author === 'string' ? author : author.name}
                              </span>
                            ))}
                          </span>
                        </div>
                      ) : null}
                      {post.frontmatter.readingTime && (
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>{post.frontmatter.readingTime} min read</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {post.frontmatter.tags && Array.isArray(post.frontmatter.tags) && (
                      <div className="flex gap-2 flex-wrap mb-4">
                        {post.frontmatter.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 flex items-center text-primary">
                      Read more <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
