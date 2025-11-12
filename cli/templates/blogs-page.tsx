import { getAllBlogPosts, generateBlogListMetadata } from '@florianamette/next-md-blog';
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="border-b pb-6">
            <Link href={`{{BLOG_ROUTE_PATH}}/${post.slug}`}>
              <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600">
                {post.frontmatter?.title || post.slug}
              </h2>
            </Link>
            {post.frontmatter?.date && (
              <p className="text-gray-600 text-sm mb-2">{post.frontmatter.date}</p>
            )}
            {post.frontmatter?.description && (
              <p className="text-gray-700">{post.frontmatter.description}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

