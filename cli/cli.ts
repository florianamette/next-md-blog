#!/usr/bin/env node

import { parseArgs } from './args.js';
import { collectInteractiveConfig, createNonInteractiveConfig, closeReadline } from './prompts.js';
import { createConfigFile, createContentDir, createNextJSRoutes } from './file-operations.js';

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
    
    // Print success message and next steps
    console.log('\n✅ Setup complete!');
    console.log('\nNext steps:');
    console.log(`1. Install the library: npm install @florianamette/next-md-blog`);
    if (config.createOgImage) {
      console.log(`2. Install OG image dependencies: npm install @vercel/og`);
    }
    if (config.createBlogPages) {
      console.log(`3. Review and customize SEO settings in next-md-blog.config.ts`);
      if (config.createOgImage) {
        console.log(`4. Customize the OG image component in app/${config.blogRoute}/[slug]/opengraph-image.tsx`);
      }
      console.log(`5. Add your markdown files to the ${config.contentDir}/ folder`);
      console.log(`6. Visit /${config.blogRoute}/[slug] to see your posts`);
      console.log(`7. Visit /${config.blogsRoute} to see all posts`);
    } else {
      console.log(`2. Review and customize SEO settings in next-md-blog.config.ts`);
      console.log(`3. Add your markdown files to the ${config.contentDir}/ folder`);
      console.log(`4. Use the library functions in your own components`);
    }
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  } finally {
    closeReadline();
  }
}

main();
