# @florianamette/next-md-blog

A powerful React library for parsing and displaying markdown and MDX blog posts in Next.js projects. Write your blog posts in markdown or MDX format and easily display them with dynamic routes, complete SEO optimization, and beautiful Open Graph images.

## ✨ Features

- 📝 **Markdown & MDX Support** - Full markdown and MDX support with GitHub Flavored Markdown (GFM) support
- 🎨 **Server Components** - Built for Next.js App Router with server-side rendering
- 🔍 **SEO Optimized** - Automatic metadata generation with Open Graph and Twitter Cards
- 🖼️ **OG Images** - Built-in OG image generation component
- ⚡ **Type Safe** - Full TypeScript support with comprehensive types
- 🎯 **Flexible** - Works with both App Router and Pages Router
- 🛡️ **Robust** - Input validation, error handling, and clean code principles

## 📦 Installation

```bash
npm install @florianamette/next-md-blog
```

## 🚀 Quick Start

### 1. Initialize with CLI (Recommended)

The easiest way to get started is using the CLI:

```bash
npx @florianamette/next-md-blog-cli
```

This will automatically:
- ✅ Create blog routes and pages
- ✅ Install required dependencies
- ✅ Configure Tailwind CSS typography
- ✅ Set up SEO configuration

### 2. Manual Setup

If you prefer manual setup:

1. **Install the package:**
```bash
npm install @florianamette/next-md-blog @tailwindcss/typography
```

2. **Create a config file:**
```tsx
// next-md-blog.config.ts
import { createConfig } from '@florianamette/next-md-blog';

export default createConfig({
  siteName: 'My Blog',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  defaultAuthor: 'Your Name',
  twitterHandle: '@yourhandle',
  defaultLang: 'en',
});
```

3. **Create blog routes:**
```tsx
// app/blog/[slug]/page.tsx
import { getBlogPost, getAllBlogPosts, generateBlogPostMetadata } from '@florianamette/next-md-blog';
import { MarkdownContent } from '@florianamette/next-md-blog';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import blogConfig from '@/next-md-blog.config';

export async function generateStaticParams() {
  const posts = await getAllBlogPosts({ config: blogConfig });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug, { config: blogConfig });

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return generateBlogPostMetadata(post, blogConfig);
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug, { config: blogConfig });

  if (!post) {
    notFound();
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <MarkdownContent content={post.content} />
    </div>
  );
}
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

#### `BlogPostSEO`

A component that generates JSON-LD structured data for SEO.

**Props:**
- `post` (BlogPost, required): The blog post object
- `config` (SEOConfig, required): SEO configuration

**Example:**
```tsx
<BlogPostSEO post={post} config={blogConfig} />
```

#### `OgImage`

A component for generating Open Graph images (used with `@vercel/og`).

**Props:**
- `title` (string, required): Title text
- `description` (string, optional): Description/subtitle text
- `siteName` (string, optional): Site name
- `backgroundColor` (string, optional): Background color (default: `#1a1a1a`)
- `textColor` (string, optional): Text color (default: `#ffffff`)

### Functions

#### `getBlogPost(slug: string, options?: GetBlogPostOptions): Promise<BlogPost | null>`

Retrieves a single blog post by its slug.

**Parameters:**
- `slug` (string): The slug of the blog post (filename without .md or .mdx extension)
- `options` (optional): Configuration object
  - `postsDir` (string, optional): Custom path to posts directory
  - `config` (Config, optional): Blog configuration

**Returns:**
- `Promise<BlogPost | null>`: The blog post object or null if not found

#### `getAllBlogPosts(options?: GetBlogPostOptions): Promise<BlogPostMetadata[]>`

Retrieves all blog posts from the posts folder.

**Parameters:**
- `options` (optional): Configuration object
  - `postsDir` (string, optional): Custom path to posts directory
  - `config` (Config, optional): Blog configuration

**Returns:**
- `Promise<BlogPostMetadata[]>`: Array of blog post metadata, sorted by date (newest first)

#### `generateBlogPostMetadata(post: BlogPost, config?: SEOConfig): Metadata`

Generates comprehensive SEO metadata for a blog post.

**Parameters:**
- `post` (BlogPost): The blog post object
- `config` (SEOConfig, optional): SEO configuration

**Returns:**
- `Metadata`: Next.js metadata object

#### `generateBlogListMetadata(posts: BlogPostMetadata[], config?: SEOConfig): Metadata`

Generates SEO metadata for the blog listing page.

### Types

#### `BlogPost`

```typescript
interface BlogPost {
  slug: string;
  content: string;
  frontmatter: BlogPostFrontmatter;
  authors: Author[];
  readingTime: number;
  wordCount: number;
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

The library is designed to work with Tailwind CSS v4 and the `@tailwindcss/typography` plugin. Use the `prose` classes for beautiful markdown styling:

```tsx
<div className="prose prose-lg dark:prose-invert max-w-none">
  <MarkdownContent content={post.content} />
</div>
```

## 📖 Documentation

For complete documentation, examples, and advanced usage, visit the [main repository](https://github.com/florianamette/next-mdx-blog).

## 📝 License

MIT

## 🔗 Links

- [GitHub Repository](https://github.com/florianamette/next-mdx-blog)
- [CLI Package](https://www.npmjs.com/package/@florianamette/next-md-blog-cli)
- [Issues](https://github.com/florianamette/next-mdx-blog/issues)

