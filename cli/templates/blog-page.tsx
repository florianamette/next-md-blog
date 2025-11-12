import { getBlogPost, getAllBlogPosts, generateBlogPostMetadata, BlogPostSEO } from '@florianamette/next-md-blog';
import { MarkdownContent } from '@florianamette/next-md-blog';
import { notFound } from 'next/navigation';
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

  return (
    <>
      {/* SEO: JSON-LD Structured Data */}
      <BlogPostSEO post={post} config={blogConfig} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article>
          {post.frontmatter?.title && (
            <h1 className="text-4xl font-bold mb-4">{post.frontmatter.title}</h1>
          )}
          {post.frontmatter?.date && (
            <p className="text-gray-600 mb-8">{post.frontmatter.date}</p>
          )}
          <div className="prose prose-lg max-w-none">
            <MarkdownContent content={post.content} />
          </div>
        </article>
      </div>
    </>
  );
}

