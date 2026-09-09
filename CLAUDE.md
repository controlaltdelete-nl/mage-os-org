# Claude Code Instructions for Mage-OS Website

This is the Mage-OS marketing website built with Astro 5.x and Tailwind CSS.

## Essential Documentation

Reference these guides when appropriate:

- **[docs/CONTENT-MANAGEMENT.md](docs/CONTENT-MANAGEMENT.md)** - How to manage blog posts, events, and page content
- **[docs/DEVELOPMENT-GUIDE.md](docs/DEVELOPMENT-GUIDE.md)** - Component patterns, styling conventions, and implementation details
- **[docs/PERSONAS.md](docs/PERSONAS.md)** - User personas and their goals for use of the site
- **[docs/WEBSITE-STRATEGY.md](docs/WEBSITE-STRATEGY.md)** - High-level strategy for website messaging and structure
- **[README.md](README.md)** - Project overview, setup, and commands

## Quick Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run check    # Run all checks (always run before committing)
npm run fix      # Auto-fix linting and formatting
```

## Key Patterns

### Use Callout Instead of Blockquote

```astro
import Callout from '~/components/ui/Callout.astro';

<!-- Types: info, tip, warning, danger -->
<Callout type="warning" title="Important">
  Warning message here.
</Callout>
```

### Use CodeBlock for Code

```astro
import CodeBlock from '~/components/ui/CodeBlock.astro';

<CodeBlock code="npm install" lang="bash" />
```

### Dark Mode Required

All styles must include dark mode variants:

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### Prose Wrapper for Content

Wrap markdown-like content in prose classes:

```html
<div class="prose dark:prose-invert prose-headings:font-heading prose-headings:font-bold max-w-none">
  <h2>Heading</h2>
  <p>Content...</p>
</div>
```

## Project Structure

```
src/
├── components/ui/       # Callout, CodeBlock, TabbedContent, etc.
├── components/widgets/  # PageHero, Features, Content, etc.
├── pages/               # File-based routing
├── data/post/           # Blog posts (*.md)
├── data/events/         # Event definitions (*.md)
├── data/security-advisories.json  # Security releases shown on /product/security (update with every security release)
└── layouts/             # Page templates
```
