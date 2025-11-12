# @florianamette/next-md-blog-cli

CLI tool for quickly initializing `@florianamette/next-md-blog` in your Next.js project. Automatically sets up blog routes, installs dependencies, and configures everything you need to start blogging.

## ✨ Features

- 🚀 **One-Command Setup** - Initialize your blog in seconds
- 📦 **Auto-Install** - Automatically installs required packages
- 🎨 **Auto-Configure** - Sets up Tailwind CSS typography and dark mode
- 📝 **Template Generation** - Creates beautiful, modern blog templates
- 🌍 **i18n Support** - Optional multi-language setup
- 🖼️ **OG Images** - Optional Open Graph image generation
- ⚙️ **Flexible** - Interactive or non-interactive modes

## 📦 Installation

Use directly with npx (recommended):

```bash
npx @florianamette/next-md-blog-cli
```

Or install globally:

```bash
npm install -g @florianamette/next-md-blog-cli
next-md-blog-init
```

## 🚀 Quick Start

Run the CLI in your Next.js project root:

```bash
npx @florianamette/next-md-blog-cli
```

The CLI will:

1. ✅ Create a `posts/` folder (or custom directory)
2. ✅ Add an example blog post (`welcome.md`)
3. ✅ Create Next.js routes for `/blog/[slug]` and `/blogs`
4. ✅ Set up OG image using Next.js file convention (`opengraph-image.tsx`)
5. ✅ Create `next-md-blog.config.ts` with SEO configuration
6. ✅ **Automatically install** `@florianamette/next-md-blog`
7. ✅ **Automatically install** `@tailwindcss/typography`
8. ✅ **Automatically install** `@vercel/og` (if OG images enabled)
9. ✅ **Automatically update** `globals.css` with typography plugin
10. ✅ **Automatically add** `@custom-variant dark` for dark mode support

## 📋 Options

### Interactive Mode (Default)

The CLI will prompt you for configuration:

- Content directory name (default: `posts`)
- Blog route (default: `blog`)
- Blogs listing route (default: `blogs`)
- Create example post? (default: yes)
- Create blog pages? (default: yes)
- Create OG images? (default: yes)
- Enable i18n? (default: no)
- SEO settings (site name, URL, author, Twitter handle)

### Non-Interactive Mode

Use flags for automated setup:

```bash
npx @florianamette/next-md-blog-cli --non-interactive \
  --content-dir=posts \
  --blog-route=blog \
  --blogs-route=blogs \
  --example-post \
  --blog-pages \
  --og-image \
  --site-name="My Blog" \
  --site-url="https://example.com" \
  --author="John Doe" \
  --twitter="@johndoe"
```

### i18n Support

Enable multi-language support:

```bash
npx @florianamette/next-md-blog-cli \
  --i18n-enabled \
  --locales=en,fr,es \
  --locale-folder=[locale]
```

This will:
- Create locale-based routes: `/[locale]/blog/[slug]`
- Organize posts by locale: `posts/en/`, `posts/fr/`, etc.
- Generate locale-aware pages

## 🎨 Generated Templates

The CLI generates modern, beautiful blog templates with:

- ✨ Modern Tailwind CSS styling
- 🎨 Neutral color palette
- 🌙 Black background in dark mode
- 📱 Fully responsive design
- ♿ Accessible semantic HTML
- 🎯 SEO-optimized structure
- 📊 Rich metadata display (date, author, reading time, word count, tags)

## 📁 Generated Structure

After running the CLI, your project will have:

```
your-project/
├── posts/
│   └── welcome.md
├── app/
│   ├── blog/
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── opengraph-image.tsx (optional)
│   └── blogs/
│       └── page.tsx
├── next-md-blog.config.ts
└── app/globals.css (updated)
```

## ⚙️ Configuration

The CLI creates `next-md-blog.config.ts`:

```tsx
import { createConfig } from '@florianamette/next-md-blog';

export default createConfig({
  siteName: 'My Blog',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  defaultAuthor: 'Your Name',
  twitterHandle: '@yourhandle',
  defaultLang: 'en',
});
```

## 🎨 Styling Setup

The CLI automatically:

1. **Installs** `@tailwindcss/typography`
2. **Adds** to `globals.css`:
   ```css
   @import "tailwindcss";
   @plugin "@tailwindcss/typography";
   
   @custom-variant dark (&:is(.dark *));
   ```

## 📝 Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `--non-interactive`, `-y` | Run without prompts | `false` |
| `--content-dir` | Posts directory name | `posts` |
| `--blog-route` | Blog post route | `blog` |
| `--blogs-route` | Blog listing route | `blogs` |
| `--example-post` | Create example post | `true` |
| `--no-example-post` | Skip example post | - |
| `--blog-pages` | Create blog pages | `true` |
| `--no-blog-pages` | Skip blog pages | - |
| `--og-image` | Create OG image | `true` |
| `--no-og-image` | Skip OG image | - |
| `--i18n-enabled` | Enable i18n | `false` |
| `--locales` | Comma-separated locales | `en,fr` |
| `--locale-folder` | Locale folder name | `[locale]` |
| `--site-name` | Site name | - |
| `--site-url` | Site URL | - |
| `--author` | Default author | - |
| `--twitter` | Twitter handle | - |

## 🔧 Requirements

- Next.js 13+ (App Router) or Next.js 12+ (Pages Router)
- Node.js 18+
- TypeScript (recommended)

## 📖 Documentation

For complete documentation and examples, visit the [main repository](https://github.com/florianamette/next-mdx-blog).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT

## 🔗 Links

- [Main Package](https://www.npmjs.com/package/@florianamette/next-md-blog)
- [GitHub Repository](https://github.com/florianamette/next-mdx-blog)
- [Issues](https://github.com/florianamette/next-mdx-blog/issues)

