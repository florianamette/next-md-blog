import { getBlogPost, getAllBlogPosts } from '@next-md-blog/core';
import { MarkdownContent } from '@next-md-blog/core';
import { GetStaticPaths, GetStaticProps } from 'next';
import blogConfig from '@/next-md-blog.config';
{{POSTS_DIR_OPTION}}
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllBlogPosts({{POSTS_DIR_PARAM}});
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getBlogPost(params?.slug as string{{POSTS_DIR_PARAM_FUNC}}, { config: blogConfig });

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
  };
};

export default function BlogPost({ post }: { post: any }) {
  return (
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
  );
}

