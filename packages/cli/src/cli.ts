#!/usr/bin/env node

import { parseArgs } from './args.js';
import { collectInteractiveConfig, createNonInteractiveConfig, closeReadline } from './prompts.js';
import { createConfigFile, createContentDir, createNextJSRoutes, installNextMdBlog, installTailwindTypography, installVercelOg, updateGlobalsCss } from './file-operations.js';

/**
 * Main CLI entry point
 */
async function main() {
  try {
    const parsedArgs = parseArgs();
    const isNonInteractive = parsedArgs.nonInteractive || process.env.CI === 'true';
    
    // Debug: log parsed args (can be removed later)
    if (process.env.DEBUG) {
      console.log('Parsed args:', JSON.stringify(parsedArgs, null, 2));
      console.log('isNonInteractive:', isNonInteractive);
    }
    
    // Collect configuration
    const config = isNonInteractive
      ? createNonInteractiveConfig(parsedArgs)
      : await collectInteractiveConfig(parsedArgs);
    
    console.log('\n--- Creating Files ---\n');
    
    // Create all files
    createConfigFile(config);
    createContentDir(config);
    createNextJSRoutes(config);
    
    // Install dependencies and update globals.css
    installNextMdBlog();
    installTailwindTypography();
    if (config.createOgImage) {
      installVercelOg();
    }
    updateGlobalsCss();
    
    // Print success message and next steps
    console.log('\n✅ Setup complete!');
    console.log('\nNext steps:');
    if (config.createBlogPages) {
      console.log(`1. Review and customize SEO settings in next-md-blog.config.ts`);
      if (config.createOgImage) {
        console.log(`2. Customize the OG image component in app/${config.blogRoute}/[slug]/opengraph-image.tsx`);
        console.log(`3. Add your markdown files to the ${config.contentDir}/ folder`);
        console.log(`4. Visit /${config.blogRoute}/[slug] to see your posts`);
        console.log(`5. Visit /${config.blogsRoute} to see all posts`);
      } else {
        console.log(`2. Add your markdown files to the ${config.contentDir}/ folder`);
        console.log(`3. Visit /${config.blogRoute}/[slug] to see your posts`);
        console.log(`4. Visit /${config.blogsRoute} to see all posts`);
      }
    } else {
      console.log(`1. Review and customize SEO settings in next-md-blog.config.ts`);
      console.log(`2. Add your markdown files to the ${config.contentDir}/ folder`);
      console.log(`3. Use the library functions in your own components`);
    }
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  } finally {
    closeReadline();
  }
}

main();
