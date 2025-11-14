import type { CLIConfig } from './types.js';
import { loadTemplate } from './templates.js';

/**
 * Build options parameter string for function calls
 * @param contentDir - Content directory name
 * @param i18nEnabled - Whether i18n is enabled
 * @returns Options parameter string
 */
function buildOptionsParam(contentDir: string, i18nEnabled: boolean): string {
  const parts: string[] = [];
  if (contentDir !== 'posts') {
    parts.push('postsDir: POSTS_DIR');
  }
  if (i18nEnabled) {
    parts.push('locale');
  }
  parts.push('config: blogConfig');
  return `{ ${parts.join(', ')} }`;
}

/**
 * Build posts directory option constant
 * @param contentDir - Content directory name
 * @returns Posts directory option string or empty string
 */
function buildPostsDirOption(contentDir: string): string {
  return contentDir !== 'posts' ? `\nconst POSTS_DIR = '${contentDir}';` : '';
}

/**
 * Generate blog page component code
 * @param config - CLI configuration
 * @returns Generated blog page code
 */
export function generateBlogPage(config: CLIConfig): string {
  const { contentDir, i18n, blogsRoute } = config;
  const postsDirOption = buildPostsDirOption(contentDir);
  const postsDirParam = buildOptionsParam(contentDir, i18n.enabled);
  const postsDirParamFunc = `, ${postsDirParam}`;
  
  const localeParam = i18n.enabled ? ', locale: string' : '';
  const localeExtract = i18n.enabled ? '  const { slug, locale } = resolvedParams;' : '  const { slug } = resolvedParams;';
  
  // Generate generateStaticParams code based on i18n
  const localesArray = i18n.enabled && i18n.locales.length > 0 
    ? i18n.locales.map(locale => `'${locale}'`).join(', ')
    : "'en'";
  
  const generateStaticParamsPostsDirParam = buildOptionsParam(contentDir, i18n.enabled);
  
  const generateStaticParamsCode = i18n.enabled
    ? `  // Supported locales
    const locales = [${localesArray}];
    
    const allParams: Array<{ slug: string; locale: string }> = [];
    for (const locale of locales) {
      const posts = await getAllBlogPosts(${generateStaticParamsPostsDirParam});
      for (const post of posts) {
        allParams.push({ slug: post.slug, locale });
      }
    }
    return allParams;`
    : `  const posts = await getAllBlogPosts(${postsDirParam});
  return posts.map((post) => ({
    slug: post.slug,
  }));`;

  const blogsRoutePath = i18n.enabled ? `/\${locale}/${blogsRoute}` : `/${blogsRoute}`;

  return loadTemplate('blog-page.tsx', {
    POSTS_DIR_OPTION: postsDirOption,
    POSTS_DIR_PARAM: postsDirParam,
    POSTS_DIR_PARAM_FUNC: postsDirParamFunc,
    LOCALE_PARAM: localeParam,
    LOCALE_EXTRACT: localeExtract,
    GENERATE_STATIC_PARAMS: generateStaticParamsCode,
    BLOG_ROUTE_PATH: blogsRoutePath,
  });
}

/**
 * Generate blogs listing page component code
 * @param config - CLI configuration
 * @returns Generated blogs page code
 */
export function generateBlogsPage(config: CLIConfig): string {
  const { blogRoute, contentDir, i18n } = config;
  const postsDirOption = buildPostsDirOption(contentDir);
  const postsDirParam = buildOptionsParam(contentDir, i18n.enabled);
  
  const localeParam = i18n.enabled ? 'locale: string' : '';
  const localeExtract = i18n.enabled ? '  const { locale } = resolvedParams;' : '';
  const blogRoutePath = i18n.enabled ? `/\${locale}/${blogRoute}` : `/${blogRoute}`;
  const paramsType = i18n.enabled ? '{ locale: string }' : 'Record<string, never>';

  return loadTemplate('blogs-page.tsx', {
    POSTS_DIR_OPTION: postsDirOption,
    POSTS_DIR_PARAM: postsDirParam,
    LOCALE_PARAM: localeParam,
    LOCALE_EXTRACT: localeExtract,
    PARAMS_TYPE: paramsType,
    BLOG_ROUTE: blogRoute,
    BLOG_ROUTE_PATH: blogRoutePath,
    CONTENT_DIR: contentDir,
  });
}

/**
 * Generate OG image component code
 * @param config - CLI configuration
 * @returns Generated OG image code
 */
export function generateOgImage(config: CLIConfig): string {
  const { seoConfig, contentDir, i18n } = config;
  const postsDirOption = buildPostsDirOption(contentDir);
  const postsDirParam = `, ${buildOptionsParam(contentDir, i18n.enabled)}`;
  
  const localeParam = i18n.enabled ? ', locale: string' : '';
  const localeExtract = i18n.enabled ? '  const { slug, locale } = resolvedParams;' : '  const { slug } = resolvedParams;';

  return loadTemplate('opengraph-image.tsx', {
    POSTS_DIR_OPTION: postsDirOption,
    POSTS_DIR_PARAM: postsDirParam,
    LOCALE_PARAM: localeParam,
    LOCALE_EXTRACT: localeExtract,
    SITE_NAME: seoConfig.siteName,
  });
}

/**
 * Generate Pages Router blog page component code
 * @param config - CLI configuration
 * @returns Generated Pages Router blog page code
 */
export function generatePagesRouterBlogPage(config: CLIConfig): string {
  const { contentDir } = config;
  const postsDirOption = buildPostsDirOption(contentDir);
  const postsDirParam = contentDir !== 'posts' 
    ? '{ postsDir: POSTS_DIR, config: blogConfig }'
    : '{ config: blogConfig }';
  const postsDirParamFunc = contentDir !== 'posts' 
    ? ', { postsDir: POSTS_DIR, config: blogConfig }'
    : ', { config: blogConfig }';

  return loadTemplate('pages-router-blog-page.tsx', {
    POSTS_DIR_OPTION: postsDirOption,
    POSTS_DIR_PARAM: postsDirParam,
    POSTS_DIR_PARAM_FUNC: postsDirParamFunc,
  });
}

/**
 * Generate Pages Router blogs listing page component code
 * @param config - CLI configuration
 * @returns Generated Pages Router blogs page code
 */
export function generatePagesRouterBlogsPage(config: CLIConfig): string {
  const { blogRoute, contentDir } = config;
  const postsDirOption = buildPostsDirOption(contentDir);
  const postsDirParam = contentDir !== 'posts' 
    ? '{ postsDir: POSTS_DIR, config: blogConfig }'
    : '{ config: blogConfig }';

  return loadTemplate('pages-router-blogs-page.tsx', {
    POSTS_DIR_OPTION: postsDirOption,
    POSTS_DIR_PARAM: postsDirParam,
    BLOG_ROUTE: blogRoute,
  });
}

/**
 * Generate next-md-blog config file content
 * @param config - CLI configuration
 * @returns Config file content
 */
export function generateConfigFile(config: CLIConfig): string {
  const { seoConfig, i18n } = config;
  const defaultLang = i18n.enabled && i18n.locales.length > 0 ? i18n.locales[0] : 'en';
  
  return `import { createConfig } from '@next-md-blog/core';

export default createConfig({
  siteName: '${seoConfig.siteName}',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '${seoConfig.siteUrl}',
  defaultAuthor: '${seoConfig.defaultAuthor}',
${seoConfig.twitterHandle ? `  twitterHandle: '${seoConfig.twitterHandle}',` : '  // twitterHandle: undefined,'}
  defaultLang: '${defaultLang}',
  // OG images are automatically generated via opengraph-image.tsx file convention
  // defaultOgImage: 'https://example.com/default-og.jpg',
});
`;
}

