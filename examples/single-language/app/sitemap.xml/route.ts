import { getAllBlogPosts, generateSitemap } from '@florianamette/next-md-blog';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await getAllBlogPosts();
  const sitemap = generateSitemap(posts);

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}

