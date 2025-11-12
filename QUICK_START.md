# Quick Start - Testing Locally

## 🚀 Quick Test (3 Steps)

### 1. Build the Library
```bash
# From the root directory
npm run build
```

### 2. Install Example Dependencies
```bash
# Navigate to single-language example
cd examples/single-language
npm install
```

### 3. Run the Example App
```bash
# Still in the example directory
npm run dev
```

Then open **http://localhost:3000** in your browser! 🎉

## 📝 What You'll See

- **Home page** (`/`) - Overview and quick start guide
- **All posts** (`/blogs`) - List of all blog posts
- **Individual posts** (`/blog/welcome`, `/blog/getting-started`, etc.)

## 🌍 Multi-Language Example

To test the multi-language example:

```bash
# From root directory
cd examples/multi-language
npm install
npm run dev
```

Then visit:
- **English**: http://localhost:3000/en/blog/welcome
- **French**: http://localhost:3000/fr/blog/welcome
- **Blog listing**: http://localhost:3000/en/blogs or http://localhost:3000/fr/blogs

## 🔄 Development Workflow

When you make changes to the library:

1. **Rebuild the library:**
   ```bash
   # From root directory
   npm run build
   ```

2. **Restart the example dev server** (if it's running, stop and restart)

## 🎨 Styling Notes

The examples use:
- **Tailwind CSS v4** with OKLCH colors
- **@tailwindcss/typography** plugin for markdown styling
- **Light & dark mode** support with `next-themes`
- **shadcn/ui** components for UI elements

See the main [README.md](./README.md) for detailed styling setup instructions.

## 🧪 Testing the CLI

You can also test the CLI initialization tool:

```bash
# From root directory (after building)
cd /path/to/a/test/nextjs-project
npx ../next-md-blog/dist/cli.js
```

## 📚 More Info

See [TESTING.md](./TESTING.md) for detailed testing instructions and troubleshooting.

