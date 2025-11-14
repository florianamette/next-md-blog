import { getAllBlogPosts } from '@next-md-blog/core';
import Link from 'next/link';
import blogConfig from '@/next-md-blog.config';
{{POSTS_DIR_OPTION}}
export async function getStaticProps() {
  const posts = await getAllBlogPosts({{POSTS_DIR_PARAM}});
  return {
    props: { posts },
  };
}

export default function BlogsPage({ posts }: { posts: any[] }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="border-b pb-6">
            <Link href={`/{{BLOG_ROUTE}}/${post.slug}`}>
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

