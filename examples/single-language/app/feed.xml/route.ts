import { getAllBlogPosts, getBlogPost, generateRSSFeed } from '@florianamette/next-md-blog';
import { NextResponse } from 'next/server';

export async function GET() {
  const postsMetadata = await getAllBlogPosts();
  
  // Get full posts for RSS feed (we need content for better descriptions)
  const posts = await Promise.all(
    postsMetadata.slice(0, 20).map(async (postMeta) => {
      const post = await getBlogPost(postMeta.slug);
      return post;
    })
  );

  // Filter out null posts
  const validPosts = posts.filter((post): post is NonNullable<typeof post> => post !== null);
  
  const rss = generateRSSFeed(validPosts);

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}

