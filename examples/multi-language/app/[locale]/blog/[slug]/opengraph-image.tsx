import { ImageResponse } from 'next/og';
import { getBlogPost } from '@florianamette/next-md-blog';

// Image metadata
export const alt = 'Blog Post';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = await getBlogPost(slug, { locale });

  const title = post?.frontmatter.title || 'Blog Post';
  const description = post?.frontmatter.description || '';
  const siteName = 'Multi-Language Blog';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '1000px',
          }}
        >
          {siteName && (
            <div
              style={{
                fontSize: '24px',
                opacity: 0.8,
                marginBottom: '20px',
                fontWeight: 500,
              }}
            >
              {siteName}
            </div>
          )}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 700,
              margin: 0,
              marginBottom: description ? '24px' : 0,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: '32px',
                opacity: 0.9,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

