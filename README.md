# next-md-blog

A powerful React library for parsing and displaying markdown and MDX blog posts in Next.js projects. Write your blog posts in markdown or MDX format and easily display them with dynamic routes, complete SEO optimization, and beautiful Open Graph images.

## ✨ Features

- 📝 **Markdown & MDX Support** - Full markdown and MDX support with GitHub Flavored Markdown (GFM) support
- 🎨 **Server Components** - Built for Next.js App Router with server-side rendering
- 🔍 **SEO Optimized** - Automatic metadata generation with Open Graph and Twitter Cards
- 🖼️ **OG Images** - Built-in OG image generation component
- ⚡ **Type Safe** - Full TypeScript support with comprehensive types
- 🚀 **Easy Setup** - One-command initialization with `npx @next-md-blog/cli`
- 🎯 **Flexible** - Works with both App Router and Pages Router
- 🛡️ **Robust** - Input validation, error handling, and clean code principles

## 📦 Installation

```bash
npm install @next-md-blog/core
```

## 🚀 Quick Start

### 1. Initialize the library

Run the initialization command in your Next.js project root:

```bash
npx @next-md-blog/cli
```

This will:
- ✅ Create a `posts/` folder at the root of your project
- ✅ Add an example blog post (`welcome.md`)
- ✅ Create Next.js routes for `/blog/[slug]` and `/blogs`
- ✅ Set up OG image using Next.js file convention (`opengraph-image.tsx`)
- ✅ Configure SEO metadata generation
- ✅ Automatically install required packages (`@next-md-blog/core`, `@tailwindcss/typography`, `@vercel/og`)
- ✅ Automatically update `globals.css` with typography plugin and dark mode variant

### 2. Add your blog posts

Create markdown (`.md`) or MDX (`.mdx`) files in the `posts/` folder. Each file should be named with the slug you want to use (e.g., `my-post.md` or `my-post.mdx` for `/blog/my-post`).

Example `posts/my-post.md` (or `posts/my-post.mdx`):

```markdown
---
title: "My First Blog Post"
date: "2024-01-15"
description: "This is a description of my blog post"
author: "John Doe"
tags: ["tutorial", "nextjs"]
ogImage: "https://example.com/custom-image.jpg"  # Optional: custom OG image
---

# My First Blog Post

This is the content of my blog post written in **markdown**.

## Features

- Easy to write
- Markdown support
- Frontmatter support
```

### 3. Configure SEO Settings

The CLI creates a `next-md-blog.config.ts` file in your project root. Update it with your SEO settings:

```tsx
// next-md-blog.config.ts
import { createConfig } from '@next-md-blog/core';

export default createConfig({
  siteName: 'My Blog',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  defaultAuthor: 'Your Name',
  twitterHandle: '@yourhandle',
  defaultLang: 'en',
  // OG images are automatically generated via opengraph-image.tsx file convention
});
```

## 📖 Complete Example

### Next.js App Router

**app/blog/[slug]/page.tsx:**

```tsx
import { getBlogPost, getAllBlogPosts, generateBlogPostMetadata } from '@next-md-blog/core';
import { MarkdownContent } from '@next-md-blog/core';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import blogConfig from '@/next-md-blog.config';

export async function generateStaticParams() {
  const posts = await getAllBlogPosts({ config: blogConfig });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug, { config: blogConfig });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return generateBlogPostMetadata(post, blogConfig);
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug, { config: blogConfig });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <article className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-neutral-200 dark:border-neutral-700">
        {post.frontmatter.title && (
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
                {post.frontmatter.title}
              </h1>
        )}
        {post.frontmatter.date && (
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                {new Date(post.frontmatter.date).toLocaleDateString()}
              </p>
        )}
          </div>
          <div className="px-6 sm:px-8 py-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
          <MarkdownContent content={post.content} />
            </div>
        </div>
      </article>
      </div>
    </div>
  );
}
```

**app/blogs/page.tsx:**

```tsx
import { getAllBlogPosts, generateBlogListMetadata } from '@next-md-blog/core';
import Link from 'next/link';
import type { Metadata } from 'next';
import blogConfig from '@/next-md-blog.config';

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getAllBlogPosts({ config: blogConfig });
  return generateBlogListMetadata(posts, blogConfig);
}

export default async function BlogsPage() {
  const posts = await getAllBlogPosts({ config: blogConfig });

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Blog Posts
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
          </p>
        </div>
        <div className="grid gap-6 sm:gap-8">
        {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="bg-white dark:bg-neutral-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-400">
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.frontmatter?.title || post.slug}
              </h2>
                  {post.frontmatter?.description && (
                    <p className="text-neutral-600 dark:text-neutral-300 mb-4 text-lg leading-relaxed">
                      {post.frontmatter.description}
                    </p>
                  )}
                  {post.frontmatter?.date && (
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                      {new Date(post.frontmatter.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 🎨 Frontmatter Reference

The library supports the following frontmatter fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | `string` | Blog post title | `"My First Post"` |
| `date` | `string` | Publication date | `"2024-01-15"` |
| `description` | `string` | Post description (used for SEO) | `"A great post"` |
| `author` | `string` | Author name | `"John Doe"` |
| `tags` | `string[]` | Array of tags | `["tutorial", "nextjs"]` |
| `ogImage` | `string` | Custom OG image URL | `"https://example.com/image.jpg"` |
| `image` | `string` | Featured image (fallback for OG) | `"/images/featured.jpg"` |

You can also add any custom fields - they'll be available in `post.frontmatter`.

## 🔍 SEO Features

### Automatic Metadata Generation

The library automatically generates comprehensive SEO metadata including:

- **Page Title** - Formatted as `{title} | {siteName}`
- **Meta Description** - From frontmatter or content
- **Open Graph Tags** - Title, description, type, URL, images, published time, authors, tags
- **Twitter Cards** - Summary large image with title, description, and images
- **Keywords** - Automatically extracted from tags
- **Author Information** - From frontmatter

### OG Image Generation

The CLI creates an OG image file using Next.js file convention at `app/blog/[slug]/opengraph-image.tsx`. You can customize it to match your brand:

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { getBlogPost } from '@next-md-blog/core';

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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  const title = post?.frontmatter.title || 'Blog Post';
  const description = post?.frontmatter.description || '';
  const siteName = 'My Blog'; // Update this with your site name

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
```

Or use the provided `OgImage` component:

```tsx
import { OgImage } from '@next-md-blog/core';

<OgImage
  title="My Blog Post"
  description="A great post"
  siteName="My Blog"
  backgroundColor="#1a1a1a"
  textColor="#ffffff"
/>
```

## 📚 API Reference

### Components

#### `MarkdownContent`

A React Server Component that renders markdown content as HTML.

**Props:**
- `content` (string, required): The markdown content to render
- `className` (string, optional): CSS class name for the container
- `components` (MarkdownComponents, optional): Custom components to override default markdown rendering
- `remarkPlugins` (any[], optional): Custom remark plugins to extend markdown parsing
- `rehypePlugins` (any[], optional): Custom rehype plugins to extend HTML processing

**Example:**
```tsx
<MarkdownContent content="# Hello World" className="prose prose-lg" />
```

**Custom Plugins:**
```tsx
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

<MarkdownContent 
  content="# Math Content"
  remarkPlugins={[remarkMath]}
  rehypePlugins={[rehypeKatex]}
/>
```

**⚠️ Security Warning:**
When using custom `remarkPlugins` or `rehypePlugins`, ensure you:
- Only use plugins from trusted sources
- Review plugin code for security vulnerabilities
- Be aware that plugins can bypass default sanitization
- Test plugins thoroughly before using in production
- Keep plugins updated to the latest secure versions

The default `react-markdown` configuration provides built-in HTML sanitization. Custom plugins may modify or bypass this protection, potentially introducing XSS vulnerabilities if not properly configured.

#### `OgImage`

A component for generating Open Graph images (used with `@vercel/og`).

**Props:**
- `title` (string, required): Title text
- `description` (string, optional): Description/subtitle text
- `siteName` (string, optional): Site name
- `backgroundColor` (string, optional): Background color (default: `#1a1a1a`)
- `textColor` (string, optional): Text color (default: `#ffffff`)
- `width` (number, optional): Image width (default: `1200`)
- `height` (number, optional): Image height (default: `630`)

### Functions

#### `getBlogPost(slug: string, options?: GetBlogPostOptions): Promise<BlogPost | null>`

Retrieves a single blog post by its slug.

**Parameters:**
- `slug` (string): The slug of the blog post (filename without .md or .mdx extension)
- `options` (optional): Configuration object
  - `postsDir` (string, optional): Custom path to posts directory

**Returns:**
- `Promise<BlogPost | null>`: The blog post object or null if not found

**Example:**
```tsx
const post = await getBlogPost('my-post');
// Returns: { slug: 'my-post', content: '...', frontmatter: {...} }
```

#### `getAllBlogPosts(options?: GetBlogPostOptions): Promise<BlogPostMetadata[]>`

Retrieves all blog posts from the posts folder.

**Parameters:**
- `options` (optional): Configuration object
  - `postsDir` (string, optional): Custom path to posts directory

**Returns:**
- `Promise<BlogPostMetadata[]>`: Array of blog post metadata, sorted by date (newest first)

**Example:**
```tsx
const posts = await getAllBlogPosts();
// Returns: [{ slug: 'post-1', frontmatter: {...} }, ...]
```

#### `getAllBlogPostSlugs(options?: GetBlogPostOptions): Promise<string[]>`

Retrieves all blog post slugs.

**Returns:**
- `Promise<string[]>`: Array of slug strings

**Example:**
```tsx
const slugs = await getAllBlogPostSlugs();
// Returns: ['post-1', 'post-2', 'post-3']
```

### SEO Functions

#### `generateBlogPostMetadata(post: BlogPost, config?: SEOConfig): Metadata`

Generates comprehensive SEO metadata for a blog post.

**Parameters:**
- `post` (BlogPost): The blog post object
- `config` (SEOConfig, optional): SEO configuration
  - `siteName` (string, optional): Site name
  - `siteUrl` (string, optional): Site URL
  - `defaultAuthor` (string, optional): Default author name
  - `twitterHandle` (string, optional): Twitter handle
  - `defaultOgImage` (string, optional): Default OG image URL

**Returns:**
- `Metadata`: Next.js metadata object

**Example:**
```tsx
const metadata = generateBlogPostMetadata(post, {
  siteName: 'My Blog',
  siteUrl: 'https://example.com',
  defaultAuthor: 'John Doe',
});
```

#### `generateBlogListMetadata(posts: BlogPostMetadata[], config?: SEOConfig): Metadata`

Generates SEO metadata for the blog listing page.

**Parameters:**
- `posts` (BlogPostMetadata[]): Array of blog post metadata
- `config` (SEOConfig, optional): SEO configuration

**Returns:**
- `Metadata`: Next.js metadata object

### Types

#### `BlogPost`

```typescript
interface BlogPost {
  slug: string;
  content: string;
  frontmatter: BlogPostFrontmatter;
}
```

#### `BlogPostMetadata`

```typescript
interface BlogPostMetadata {
  slug: string;
  frontmatter: BlogPostFrontmatter;
}
```

#### `BlogPostFrontmatter`

```typescript
interface BlogPostFrontmatter {
  title?: string;
  date?: string;
  description?: string;
  author?: string;
  tags?: string[];
  ogImage?: string;
  image?: string;
  [key: string]: unknown;
}
```

## 🎨 Styling

The `MarkdownContent` component renders raw HTML. The library is designed to work with Tailwind CSS v4 and the `@tailwindcss/typography` plugin for beautiful markdown styling.

### Tailwind CSS v4 Setup

The CLI automatically sets up Tailwind CSS v4 with the typography plugin. The examples use Tailwind CSS v4 with OKLCH colors. Here's what the CLI configures:

**The CLI automatically:**
- ✅ Installs `@tailwindcss/typography` package
- ✅ Adds `@plugin "@tailwindcss/typography";` to your `globals.css`
- ✅ Adds `@custom-variant dark (&:is(.dark *));` to your `globals.css`

**Your globals.css will include:**
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: hsl(142 76% 36%);
  /* ... more color variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: hsl(142 76% 36%);
  /* ... more color variables */
}

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* ... map CSS variables to Tailwind colors */
}

@layer base {
  * {
    border-color: var(--border);
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
  }
}
```

### Using MarkdownContent with Typography

Use the `prose` classes from `@tailwindcss/typography`:

```tsx
<div className="prose prose-lg dark:prose-invert max-w-none">
  <MarkdownContent content={post.content} />
</div>
```

### Light & Dark Mode Support

The library works seamlessly with light and dark modes. The examples use `next-themes` for theme management:

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

The `prose` classes automatically adapt to dark mode when using `dark:prose-invert`.

## 📁 File Structure

After initialization, your project should look like this:

```
your-nextjs-project/
├── posts/
│   ├── welcome.md
│   └── my-post.md
├── app/ (or pages/)
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── blogs/
│   │   └── page.tsx
│   └── api/
│       └── og/
│           └── route.tsx
└── package.json
```

## 🛠️ Advanced Usage

### Custom Posts Directory

You can specify a custom posts directory:

```tsx
const post = await getBlogPost('my-post', {
  postsDir: 'content/blog-posts'
});
```

### Error Handling

The library provides custom error classes:

```tsx
import { BlogPostNotFoundError, FileReadError } from '@next-md-blog/core';

try {
  const post = await getBlogPost('my-post');
} catch (error) {
  if (error instanceof BlogPostNotFoundError) {
    // Handle not found
  } else if (error instanceof FileReadError) {
    // Handle file read error
  }
}
```

## 📖 Example Apps

Check out the example Next.js apps for complete working implementations:

### Single Language Example

The [single-language example](./examples/single-language) demonstrates:

- ✅ Beautiful UI with modern Tailwind CSS styling
- ✅ Tailwind CSS v4 with OKLCH colors and neutral color palette
- ✅ Light & dark mode support with black background in dark mode
- ✅ SEO optimization with structured data
- ✅ OG image generation
- ✅ Complete TypeScript examples
- ✅ Responsive design
- ✅ Enhanced typography with @tailwindcss/typography

To run the single-language example:

```bash
cd examples/single-language
npm install
npm run dev
```

### Multi-Language Example

The [multi-language example](./examples/multi-language) demonstrates:

- ✅ Multi-language support (EN, FR)
- ✅ Language switcher component with locale dropdown
- ✅ Locale-based routing (`/[locale]/blog/[slug]`)
- ✅ Locale-aware content organization
- ✅ All features from the single-language example
- ✅ Tailwind CSS v4 with OKLCH colors and neutral color palette
- ✅ Light & dark mode support with black background in dark mode

To run the multi-language example:

```bash
cd examples/multi-language
npm install
npm run dev
```

The example includes a locale switcher that allows users to switch between languages while preserving the current route.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT

## 🔗 Links

- [Single Language Example](./examples/single-language)
- [Multi-Language Example](./examples/multi-language)
- [Testing Guide](./TESTING.md)
- [Quick Start Guide](./QUICK_START.md)
