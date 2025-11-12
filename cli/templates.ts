import fs from 'fs';
import path from 'path';

/**
 * Get the path to the templates directory
 * Works both in development and when installed as a package
 * Templates are copied to dist/cli/templates during build
 * @returns Path to templates directory
 */
export function getTemplatesDir(): string {
  // __dirname points to dist/cli when compiled, so templates are at dist/cli/templates
  return path.join(__dirname, 'templates');
}

/**
 * Load a template file and replace placeholders with actual values
 * @param templateName - Name of the template file
 * @param replacements - Object mapping placeholder names to values
 * @returns Template content with placeholders replaced
 * @throws {Error} If template file is not found
 */
export function loadTemplate(templateName: string, replacements: Record<string, string>): string {
  const templatesDir = getTemplatesDir();
  const templatePath = path.join(templatesDir, templateName);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }
  
  let content = fs.readFileSync(templatePath, 'utf-8');
  
  // Replace all placeholders
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value);
  }
  
  return content;
}

/**
 * Generate example blog post content
 * @param contentDir - Content directory name
 * @param locale - Optional locale code for locale-specific templates
 * @returns Example post markdown content
 */
export function generateExamplePost(contentDir: string, locale?: string): string {
  // Use locale-specific template if available, otherwise fall back to default
  const templateName = locale && locale !== 'en' 
    ? `example-post.${locale}.md`
    : 'example-post.md';
  
  // Check if locale-specific template exists, otherwise use default
  const templatesDir = getTemplatesDir();
  const localeTemplatePath = path.join(templatesDir, templateName);
  
  const finalTemplateName = fs.existsSync(localeTemplatePath) 
    ? templateName 
    : 'example-post.md';
  
  return loadTemplate(finalTemplateName, {
    CONTENT_DIR: contentDir,
  });
}

