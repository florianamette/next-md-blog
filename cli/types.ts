/**
 * CLI configuration interface
 */
export interface CLIConfig {
  contentDir: string;
  blogRoute: string;
  blogsRoute: string;
  createExamplePost: boolean;
  createBlogPages: boolean;
  createOgImage: boolean;
  i18n: {
    enabled: boolean;
    localeFolder: string;
    locales: string[];
  };
  seoConfig: {
    siteName: string;
    siteUrl: string;
    defaultAuthor: string;
    twitterHandle: string;
  };
}

