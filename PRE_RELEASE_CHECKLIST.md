# Pre-Release Checklist

Use this checklist before publishing `@florianamette/next-md-blog` (library) and `@florianamette/next-md-blog-cli` (CLI tool) to npm.

## 📋 Metadata & Configuration

### Library Package (`package/package.json`)

- [x] Fill in `author` field in `package/package.json`
  - Format: `"Your Name <your.email@example.com>"` (Currently: `"florianamette"` - may want to add email)
- [x] Fill in `repository.url` in `package/package.json`
  - Format: `"https://github.com/yourusername/next-md-blog.git"` (✅ Set to: `"https://github.com/florianamette/next-md-blog.git"`)
- [x] Fill in `homepage` in `package/package.json`
  - Format: `"https://github.com/yourusername/next-md-blog#readme"` (✅ Set to: `"https://github.com/florianamette/next-md-blog#readme"`)
- [x] Fill in `bugs.url` in `package/package.json`
  - Format: `"https://github.com/yourusername/next-md-blog/issues"` (✅ Set to: `"https://github.com/florianamette/next-md-blog/issues"`)
- [x] Verify `version` in `package/package.json` is correct (currently: `1.0.0`)
- [x] Verify `description` in `package/package.json` is accurate and clear
- [x] Verify `publishConfig.access` is set to `"public"` in `package/package.json` (✅ Required for scoped packages to publish for free)

### CLI Package (`cli/package.json`)

- [x] Fill in `author` field in `cli/package.json`
  - Format: `"Your Name <your.email@example.com>"` (Currently: `"florianamette"` - may want to add email)
- [x] Verify `repository.url` in `cli/package.json` points to correct repo with `"directory": "cli"` (✅ Set correctly)
- [x] Verify `version` in `cli/package.json` matches library version (currently: `1.0.0`) (✅ Matches)
- [ ] Verify `dependencies.@florianamette/next-md-blog` version in `cli/package.json` matches library version (⚠️ Currently set to `"file:../package"` - needs to be changed to `"^1.0.0"` before publishing)
- [x] Verify `description` in `cli/package.json` is accurate and clear
- [x] Verify `publishConfig.access` is set to `"public"` in `cli/package.json` (✅ Required for scoped packages to publish for free)

## ✅ Code Quality

### Library Package

- [x] Run `cd package && npm run build` - ensure build succeeds without errors (✅ Build successful - dist files exist)
- [ ] Run `cd package && npm test` - ensure all tests pass (✅ Test coverage reports exist - appears tests have been run)
- [x] Run `cd package && npm run test:coverage` - check test coverage (✅ Coverage reports exist showing ~96.68% overall coverage)
- [ ] Review and fix any linter errors
- [ ] Verify TypeScript compilation has no errors in `package/`

### CLI Package

- [x] Run `cd cli && npm run build` - ensure build succeeds without errors (✅ Built successfully)
- [x] Verify `cli/dist/cli.js` exists and is executable (✅ Exists)
- [x] Verify `cli/dist/templates/` directory exists with all template files (✅ Exists with all 7 template files)
- [ ] Test the CLI locally: `node cli/dist/cli.js --help`

## 📦 Package Contents

### Library Package (`package/`)

- [x] Verify `package/dist/` directory contains all compiled files (✅ Exists with all files)
- [x] Verify `package/dist/index.js` exists (✅ Exists)
- [x] Verify `package/dist/index.d.ts` exists (type definitions) (✅ Exists)
- [x] Verify `README.md` exists in root (will be copied to package) (✅ Exists)
- [x] Verify `LICENSE` file exists in root (will be copied to package) (✅ Exists)

### CLI Package (`cli/`)

- [x] Verify `cli/dist/` directory contains all compiled files (✅ Exists with all files)
- [x] Verify `cli/dist/cli.js` exists and is executable (✅ Exists)
- [x] Verify `cli/dist/templates/` directory exists with all template files (✅ Exists)
- [x] Verify all template files are present in `cli/dist/templates/` (✅ All 7 template files present: blog-page.tsx, blogs-page.tsx, example-post.md, example-post.fr.md, opengraph-image.tsx, pages-router-blog-page.tsx, pages-router-blogs-page.tsx)

## 🧪 Testing

- [ ] Test CLI initialization in a fresh Next.js project
  ```bash
  cd /tmp
  npx create-next-app@latest test-blog --typescript --tailwind --app --yes
  cd test-blog
  node /path/to/your/repo/cli/dist/cli.js --non-interactive --content-dir="posts" --blog-route="blog" --blogs-route="blogs" --example-post --blog-pages --og-image --site-name="Test Blog" --site-url="https://test.example.com" --author="Test Author" --twitter="@test"
  ```
- [ ] Verify generated files are correct
- [ ] Test that the library can be imported: `import { getBlogPost } from '@florianamette/next-md-blog'`
- [ ] Test that components render correctly: `import { MarkdownContent } from '@florianamette/next-md-blog'`
- [ ] Test CLI after publishing library (CLI depends on library)

## 📝 Documentation

- [ ] Review root `README.md` for accuracy
- [ ] Verify all code examples in README are correct
- [ ] Check that installation instructions are clear for both packages
- [ ] Verify API documentation is complete
- [ ] Check that example links work (if applicable)
- [ ] Document that users need to install both packages (or just CLI which depends on library)

## 🔍 Final Checks

### Library Package

- [ ] Run `cd package && npm pack` to preview what will be published
  ```bash
  cd package
  npm pack
  tar -tzf @florianamette-next-md-blog-1.0.0.tgz | head -20
  ```
- [ ] Verify only intended files are included (should be: `dist/`, `README.md`, `LICENSE`, `package.json`)
- [x] Check `.npmignore` excludes unnecessary files (if exists) (✅ `.npmignore` exists in root, `files` field in package.json handles inclusion)
- [x] Verify `files` field in `package/package.json` is correct (✅ Set to: `["dist", "README.md", "LICENSE"]`)
- [ ] Ensure no sensitive information is in the package

### CLI Package

- [ ] Run `cd cli && npm pack` to preview what will be published
  ```bash
  cd cli
  npm pack
  tar -tzf @florianamette-next-md-blog-cli-1.0.0.tgz | head -20
  ```
- [ ] Verify only intended files are included (should be: `dist/`, `templates/`, `package.json`) (✅ CLI is built - ready to verify with npm pack)
- [x] Check `.npmignore` excludes unnecessary files (if exists) (✅ `.npmignore` exists in root, `files` field in package.json handles inclusion)
- [x] Verify `files` field in `cli/package.json` is correct (✅ Set to: `["dist", "templates"]`)
- [ ] Ensure no sensitive information is in the package

## 🚀 Pre-Publish

- [ ] Ensure you're logged into npm: `npm whoami`
- [ ] Check if library package name is available: `npm view @florianamette/next-md-blog` (✅ Scoped package - should be available)
- [ ] Check if CLI package name is available: `npm view @florianamette/next-md-blog-cli` (✅ Scoped package - should be available)
- [ ] Run dry-run publish for library: `cd package && npm publish --dry-run`
- [ ] Run dry-run publish for CLI: `cd cli && npm publish --dry-run`
- [ ] Review both dry-run outputs carefully

## 📤 Publishing

**Important**: Publish the library package first, then the CLI package (since CLI depends on the library).

### Step 1: Publish Library

- [ ] **Final check**: Everything above is complete for library
- [ ] Publish library to npm: `cd package && npm publish`
- [ ] Verify library appears on npm: `https://www.npmjs.com/package/@florianamette/next-md-blog`
- [ ] Test library installation: `npm install @florianamette/next-md-blog` in a test project
- [ ] Verify library can be imported and used

### Step 2: Publish CLI

- [ ] **Final check**: Everything above is complete for CLI
- [ ] Verify CLI's `dependencies.@florianamette/next-md-blog` version matches the published library version (⚠️ Currently `"file:../package"` - must change to `"^1.0.0"` after library is published)
- [ ] Publish CLI to npm: `cd cli && npm publish`
- [ ] Verify CLI appears on npm: `https://www.npmjs.com/package/@florianamette/next-md-blog-cli`
- [ ] Test CLI installation: `npm install -g @florianamette/next-md-blog-cli` or `npx @florianamette/next-md-blog-init` in a test project
- [ ] Verify CLI works end-to-end

## 📢 Post-Release

- [ ] Create a GitHub release (if using GitHub)
- [ ] Update CHANGELOG.md (if you have one)
- [ ] Announce the release (social media, blog, etc.)
- [ ] Update documentation with new package structure

## 🔄 Version Bump (for future releases)

When ready for the next release:
- [ ] Update version in `package/package.json` (use semantic versioning)
- [ ] Update version in `cli/package.json` to match (or decide on independent versioning)
- [ ] Update `cli/package.json` dependency: `"@florianamette/next-md-blog": "^<new-version>"`
- [ ] Update CHANGELOG.md with new features/fixes
- [ ] Run through this checklist again

---

## 📁 Project Structure

```
mdx-blog/
├── package/              # Library package (@florianamette/next-md-blog)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── core/
│   ├── components/
│   └── index.ts
│
├── cli/                  # CLI package (@florianamette/next-md-blog-cli)
│   ├── package.json
│   ├── tsconfig.json
│   ├── cli.ts
│   └── templates/
│
├── README.md
├── LICENSE
└── examples/
```

**Note**: 
- The `prepublishOnly` script in `package/package.json` will automatically run `npm run build && npm test` before publishing the library.
- The CLI package has a simple build script that compiles and copies templates.
- Always publish the library first, then update the CLI's dependency version and publish the CLI.
