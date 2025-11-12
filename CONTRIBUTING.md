# Contributing to next-md-blog

Thank you for your interest in contributing to next-md-blog! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/next-md-blog.git`
3. Install dependencies: `npm install`
4. Build the library: `npm run build`
5. Create a new branch: `git checkout -b feature/your-feature-name`

## Development

### Project Structure

```
next-md-blog/
├── package/          # Source code
│   ├── components/   # React components
│   ├── core/         # Core utilities
│   └── ...
├── examples/         # Example Next.js apps
│   ├── single-language/  # Single language example
│   └── multi-language/  # Multi-language example
├── dist/            # Compiled output
└── package.json
```

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

This runs TypeScript in watch mode, automatically rebuilding on changes.

### Testing

Test your changes using the example apps:

```bash
# Single language example
cd examples/single-language
npm install
npm run dev

# Multi-language example
cd examples/multi-language
npm install
npm run dev
```

## Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused (single responsibility)
- Add error handling where appropriate
- Write clean, maintainable code

## Pull Request Process

1. Ensure your code follows the project's code style
2. Update documentation if needed
3. Test your changes thoroughly
4. Submit a pull request with a clear description
5. Reference any related issues

## Areas for Contribution

- Bug fixes
- New features
- Documentation improvements
- Performance optimizations
- Test coverage
- Example improvements

Thank you for contributing! 🎉

