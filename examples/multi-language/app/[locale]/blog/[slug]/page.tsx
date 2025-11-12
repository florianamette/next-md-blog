import {
  getBlogPost,
  getAllBlogPosts,
  generateBlogPostMetadata,
  BlogPostSEO,
  type Author,
} from '@florianamette/next-md-blog';
import { MarkdownContent } from '@florianamette/next-md-blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Calendar, User, Tag, Clock, FileText } from 'lucide-react';
import { LocaleSwitcher } from '@/components/locale-switcher';
import blogConfig from '@/next-md-blog.config';

// Supported locales
const locales = ['en', 'fr'];

/**
 * Generate static params for all blog posts
 */
export async function generateStaticParams() {
  const allParams: Array<{ slug: string; locale: string }> = [];
  for (const locale of locales) {
    const posts = await getAllBlogPosts({ locale });
    for (const post of posts) {
      allParams.push({ slug: post.slug, locale });
    }
  }
  return allParams;
}

/**
 * Generate comprehensive SEO metadata for the blog post page
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;
  const post = await getBlogPost(slug, { locale, config: blogConfig });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return generateBlogPostMetadata(post, blogConfig) as Metadata;
}

/**
 * Blog post page component
 */
export default async function BlogPost({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;
  const post = await getBlogPost(slug, { locale, config: blogConfig });

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* SEO: JSON-LD Structured Data */}
      <BlogPostSEO post={post} config={blogConfig} />

    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" asChild>
            <Link href={`/${locale}/blogs`}>← Back to all posts</Link>
          </Button>
          <div className="flex gap-2">
            <ThemeToggle />
            <LocaleSwitcher currentLocale={locale} />
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            {post.frontmatter.title && (
              <h1 className="text-4xl font-bold">{post.frontmatter.title}</h1>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {post.frontmatter.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.frontmatter.date}>
                    {new Date(post.frontmatter.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              )}
                {post.authors.length > 0 && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
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
                    <Clock className="h-4 w-4" />
                    <span>{post.readingTime} min read</span>
                  </div>
                )}
                {post.wordCount > 0 && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{post.wordCount.toLocaleString()} words</span>
                </div>
              )}
              {post.frontmatter.tags && Array.isArray(post.frontmatter.tags) && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4" />
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
            </div>

            {post.frontmatter.description && (
              <p className="text-xl text-muted-foreground italic pt-2">
                {post.frontmatter.description}
              </p>
            )}
          </CardHeader>

          <CardContent>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownContent content={post.content} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}

