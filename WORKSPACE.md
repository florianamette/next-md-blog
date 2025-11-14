# Workspace Development Guide

This repository uses npm workspaces to manage multiple packages in a monorepo structure.

## Workspace Structure

```
.
├── packages/
│   ├── core/         # Main library package (@next-md-blog/core)
│   └── cli/           # CLI tool package (@next-md-blog/cli)
└── examples/          # Example applications (not part of workspace)
```

## Getting Started

### Install Dependencies

From the root directory, run:

```bash
npm install
```

This will install all dependencies for all workspace packages and link them together.

### Development Scripts

All scripts can be run from the root directory:

#### Build

```bash
# Build all packages
npm run build

# Build specific package
npm run build:core
npm run build:cli
```

#### Development (Watch Mode)

```bash
# Watch all packages
npm run dev

# Watch specific package
npm run dev:core
npm run dev:cli
```

#### Testing

```bash
# Test all packages
npm run test

# Test specific package
npm run test:core
npm run test:cli

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

#### Clean

```bash
npm run clean
```

## Workspace Dependencies

The CLI package depends on the main package. This is configured using the `workspace:*` protocol in `packages/cli/package.json`:

```json
{
  "devDependencies": {
    "@next-md-blog/core": "workspace:*"
  }
}
```

This ensures that:
- The CLI always uses the local version of the package during development
- Changes to the package are immediately available to the CLI (after rebuilding)
- No need to manually link packages
- Uses npm's native workspace protocol for better dependency resolution
- Automatically resolves to the correct workspace package version

## Package Versions

Both packages are currently at version `1.0.0`:
- `@next-md-blog/core`: 1.0.0
- `@next-md-blog/cli`: 1.0.0

When publishing, ensure version numbers are updated appropriately in each package's `package.json`.

## Publishing

Each package can be published independently:

```bash
# From core package directory
cd packages/core
npm publish

# From cli package directory
cd packages/cli
npm publish
```

The workspace setup ensures that:
- Dependencies are properly resolved
- Each package maintains its own version
- Publishing works independently for each package

## Benefits of Workspace Setup

1. **Unified Development**: Work on multiple packages simultaneously
2. **Automatic Linking**: Changes in one package are immediately available to others
3. **Shared Dependencies**: Common dependencies are hoisted to the root
4. **Single Install**: One `npm install` installs everything
5. **Consistent Tooling**: Shared scripts and configurations

## Troubleshooting

### Workspace dependencies not resolving

If you encounter issues with workspace dependencies:

1. Delete all `node_modules` and `package-lock.json` files:
   ```bash
   npm run clean
   ```

2. Reinstall:
   ```bash
   npm install
   ```

### Changes not reflecting

If changes in one package aren't visible in another:

1. Ensure you've built the package: `npm run build:core`
2. Restart any watch processes
3. Check that workspace protocol is used: `workspace:*` in `packages/cli/package.json`
4. Verify the dependency is correctly linked: `npm ls @next-md-blog/core` from the root directory

