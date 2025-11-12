import fs from 'fs';
import path from 'path';
import type { CLIConfig } from './types.js';
import { generateExamplePost } from './templates.js';
import {
  generateBlogPage,
  generateBlogsPage,
  generateOgImage,
  generatePagesRouterBlogPage,
  generatePagesRouterBlogsPage,
  generateConfigFile,
} from './generators.js';

/**
 * Create the next-md-blog config file
 * @param config - CLI configuration
 */
export function createConfigFile(config: CLIConfig): void {
  const configPath = path.join(process.cwd(), 'next-md-blog.config.ts');
  
  if (!fs.existsSync(configPath)) {
    try {
      fs.writeFileSync(configPath, generateConfigFile(config));
      console.log(`✓ Created next-md-blog.config.ts`);
    } catch (error) {
      console.error(`✗ Failed to create next-md-blog.config.ts:`, error);
      throw error;
    }
  } else {
    console.log(`⚠ next-md-blog.config.ts already exists, skipping`);
  }
}

/**
 * Create content directory and example posts
 * @param config - CLI configuration
 */
export function createContentDir(config: CLIConfig): void {
  const { contentDir, createExamplePost, i18n } = config;
  const contentPath = path.join(process.cwd(), contentDir);
  
  if (!fs.existsSync(contentPath)) {
    fs.mkdirSync(contentPath, { recursive: true });
    console.log(`✓ Created ${contentDir} directory`);
  } else {
    console.log(`✓ ${contentDir} directory already exists`);
  }
  
  if (i18n.enabled && i18n.locales.length > 0) {
    // Create locale folders and example posts for each locale
    for (const locale of i18n.locales) {
      const localePath = path.join(contentPath, locale);
      if (!fs.existsSync(localePath)) {
        fs.mkdirSync(localePath, { recursive: true });
        console.log(`✓ Created ${contentDir}/${locale} directory`);
      } else {
        console.log(`✓ ${contentDir}/${locale} directory already exists`);
      }
      
      if (createExamplePost) {
        const examplePath = path.join(localePath, 'welcome.md');
        if (!fs.existsSync(examplePath)) {
          fs.writeFileSync(examplePath, generateExamplePost(contentDir, locale));
          console.log(`✓ Created example blog post: ${contentDir}/${locale}/welcome.md`);
        } else {
          console.log(`⚠ ${contentDir}/${locale}/welcome.md already exists, skipping`);
        }
      }
    }
  } else {
    // Single language: create example post in root content directory
    if (createExamplePost) {
      const examplePath = path.join(contentPath, 'welcome.md');
      if (!fs.existsSync(examplePath)) {
        fs.writeFileSync(examplePath, generateExamplePost(contentDir));
        console.log(`✓ Created example blog post: ${contentDir}/welcome.md`);
      } else {
        console.log(`⚠ ${contentDir}/welcome.md already exists, skipping`);
      }
    }
  }
}

/**
 * Create Next.js route files (App Router or Pages Router)
 * @param config - CLI configuration
 */
export function createNextJSRoutes(config: CLIConfig): void {
  if (!config.createBlogPages) {
    console.log('⚠ Skipping blog page creation (disabled in configuration)');
    return;
  }

  const { blogRoute, blogsRoute, createOgImage, i18n } = config;
  const appDir = path.join(process.cwd(), 'app');
  const pagesDir = path.join(process.cwd(), 'pages');
  
  // Check if using App Router (Next.js 13+)
  if (fs.existsSync(appDir)) {
    // Determine base directory - if i18n is enabled, use [locale] folder
    const baseDir = i18n.enabled 
      ? path.join(appDir, i18n.localeFolder)
      : appDir;
    
    const blogDir = path.join(baseDir, blogRoute);
    const blogSlugDir = path.join(blogDir, '[slug]');
    
    // Create blog/[slug]/page.tsx
    if (!fs.existsSync(blogSlugDir)) {
      fs.mkdirSync(blogSlugDir, { recursive: true });
    }
    
    const blogPagePath = path.join(blogSlugDir, 'page.tsx');
    if (!fs.existsSync(blogPagePath)) {
      fs.writeFileSync(blogPagePath, generateBlogPage(config));
      console.log(`✓ Created ${blogPagePath}`);
    } else {
      console.log(`⚠ ${blogPagePath} already exists, skipping`);
    }
    
    // Create blogs/page.tsx
    const blogsDir = path.join(baseDir, blogsRoute);
    if (!fs.existsSync(blogsDir)) {
      fs.mkdirSync(blogsDir, { recursive: true });
    }
    
    const blogsPagePath = path.join(blogsDir, 'page.tsx');
    if (!fs.existsSync(blogsPagePath)) {
      fs.writeFileSync(blogsPagePath, generateBlogsPage(config));
      console.log(`✓ Created ${blogsPagePath}`);
    } else {
      console.log(`⚠ ${blogsPagePath} already exists, skipping`);
    }
    
    // Create OG image using Next.js file convention
    if (createOgImage) {
      const ogImagePath = path.join(blogSlugDir, 'opengraph-image.tsx');
      if (!fs.existsSync(ogImagePath)) {
        fs.writeFileSync(ogImagePath, generateOgImage(config));
        console.log(`✓ Created ${ogImagePath}`);
      } else {
        console.log(`⚠ ${ogImagePath} already exists, skipping`);
      }
    }
  }
  // Check if using Pages Router
  else if (fs.existsSync(pagesDir)) {
    const blogDir = path.join(pagesDir, blogRoute);
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }
    
    const blogSlugPath = path.join(blogDir, '[slug].tsx');
    if (!fs.existsSync(blogSlugPath)) {
      fs.writeFileSync(blogSlugPath, generatePagesRouterBlogPage(config));
      console.log(`✓ Created ${blogSlugPath}`);
    } else {
      console.log(`⚠ ${blogSlugPath} already exists, skipping`);
    }
    
    const blogsPath = path.join(pagesDir, `${blogsRoute}.tsx`);
    if (!fs.existsSync(blogsPath)) {
      fs.writeFileSync(blogsPath, generatePagesRouterBlogsPage(config));
      console.log(`✓ Created ${blogsPath}`);
    } else {
      console.log(`⚠ ${blogsPath} already exists, skipping`);
    }
  } else {
    console.log('⚠ Could not find app/ or pages/ directory. Make sure you are in a Next.js project root.');
  }
}

