# AI Development Guide for Mage-OS Website

This guide documents development patterns, components, and conventions for AI tools working with the Mage-OS Astro website. It supplements the README and CONTENT-MANAGEMENT guides with technical implementation details.

---

## Table of Contents

- [Quick Reference](#quick-reference)
- [NPM Commands](#npm-commands)
- [Project Structure](#project-structure)
- [UI Components](#ui-components)
- [Widget Components](#widget-components)
- [Page Patterns](#page-patterns)
- [Styling Patterns](#styling-patterns)
- [Background Patterns](#background-patterns)
- [Content Patterns](#content-patterns)
- [Common Conventions](#common-conventions)
- [Accessibility Requirements](#accessibility-requirements)

---

## Quick Reference

### When to Use What

| Need | Component/Approach |
|------|-------------------|
| Alert/notice box | `Callout` with type: info, tip, warning, danger |
| Code snippet | `CodeBlock` with lang prop |
| Tabbed interface | `TabbedContent` with data-tab divs |
| Feature checklist | `ChecklistItem` components |
| FAQ section | `AccordionFAQ` with items array |
| Version badges | `VersionBadge` with status: recommended, supported, minimum, deprecated |
| Timeline/steps | `Timeline` with items array |
| Page hero | `PageHero` widget (variants: default, split, gradient) |
| Full-screen hero | `Hero2` widget |
| Feature grid | `Features` or `Features2` widgets |
| Content + image | `Content` widget with isReversed option |
| Statistics | `Stats` widget |
| Call-to-action | `CallToAction` widget or `Button` component |
| Latest blog posts | `BlogLatestPosts` widget |
| Release posts grid | `ReleasePostsGrid` widget |
| Newsletter signup | `Newsletter` widget |
| Partner logos | `PartnersMarquee` widget (auto-scrolling) |
| Announcement bar | `Announcement` widget (header bar with latest release) |

### Import Aliases

```astro
import ComponentName from '~/components/ui/ComponentName.astro';
import WidgetName from '~/components/widgets/WidgetName.astro';
import { Icon } from 'astro-icon/components';
import { twMerge } from 'tailwind-merge';
```

The `~` alias maps to `/src`.

---

## NPM Commands

```bash
# Development
npm run dev          # Start dev server (or npm start)
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run check        # Run all checks (astro + eslint + prettier)
npm run check:astro  # TypeScript/Astro type checking
npm run check:eslint # Linting
npm run check:prettier # Formatting check

# Fixes
npm run fix          # Auto-fix all (eslint + prettier)
npm run fix:eslint   # Auto-fix linting issues
npm run fix:prettier # Auto-format code
```

**Always run `npm run check` before committing changes.**

---

## Project Structure

```
src/
├── assets/
│   ├── images/           # Organized by type (blog/, events/, partners/, team/)
│   └── styles/tailwind.css  # Global styles and utilities
├── components/
│   ├── ui/               # Reusable UI components
│   ├── widgets/          # Page section components
│   ├── common/           # Shared components (Header, Footer, etc.)
│   └── blog/             # Blog-specific components
├── content/              # Astro Content Collections
├── data/
│   ├── post/             # Blog posts (*.md)
│   └── events/           # Event definitions (*.md)
├── layouts/
│   ├── Layout.astro      # Root HTML wrapper
│   ├── PageLayout.astro  # Standard page template
│   └── ContentPageLayout.astro  # Content-focused pages
├── pages/                # File-based routing
├── utils/                # Helper functions
├── navigation.ts         # Header/footer nav config
└── config.yaml           # Site configuration
```

---

## UI Components

### Callout

**Purpose**: Alert/notice boxes with semantic styling and icons.

**Location**: `src/components/ui/Callout.astro`

**Props**:
- `type`: `'info'` | `'tip'` | `'warning'` | `'danger'` (default: `'info'`)
- `title`: Optional heading text
- `class`: Additional CSS classes

**Usage**:
```astro
import Callout from '~/components/ui/Callout.astro';

<Callout type="warning" title="Important">
  Run in developer mode on staging only.
</Callout>

<Callout type="tip" title="Pro Tip">
  Use the automated migration script for fastest results.
</Callout>

<Callout type="info">
  Content without a title works too.
</Callout>

<Callout type="danger" title="Breaking Change">
  This will affect existing installations.
</Callout>
```

**Type Styling**:
| Type | Icon | Colors |
|------|------|--------|
| info | info-circle | Blue |
| tip | bulb | Green |
| warning | alert-triangle | Yellow |
| danger | alert-circle | Red |

**When to Use**:
- `info`: General information, notes
- `tip`: Best practices, recommendations, "why" explanations
- `warning`: Cautions, prerequisites, environment requirements
- `danger`: Breaking changes, destructive operations, security warnings

---

### CodeBlock

**Purpose**: Syntax-highlighted code with automatic dark/light theme switching.

**Location**: `src/components/ui/CodeBlock.astro`

**Props**: Inherits from Astro's Code component
- `code`: The code string
- `lang`: Language for syntax highlighting (bash, javascript, php, etc.)

**Usage**:
```astro
import CodeBlock from '~/components/ui/CodeBlock.astro';

<CodeBlock
  code="composer create-project mage-os/project-community-edition ."
  lang="bash"
/>

<CodeBlock
  code={`bin/magento setup:upgrade
bin/magento cache:flush`}
  lang="bash"
/>
```

**Themes**: Uses `one-light` for light mode, `dracula` for dark mode.

---

### TabbedContent

**Purpose**: Accessible tabbed interface with keyboard navigation.

**Location**: `src/components/ui/TabbedContent.astro`

**Props**:
- `tabs`: Array of `{ id: string, label: string, icon?: string }`
- `defaultTab`: ID of initially active tab
- `class`: Additional CSS classes

**Usage**:
```astro
import TabbedContent from '~/components/ui/TabbedContent.astro';

<TabbedContent
  tabs={[
    { id: 'linux', label: 'Linux', icon: 'tabler:brand-ubuntu' },
    { id: 'macos', label: 'macOS', icon: 'tabler:brand-apple' },
    { id: 'windows', label: 'Windows', icon: 'tabler:brand-windows' },
  ]}
  defaultTab="linux"
>
  <div data-tab="linux">
    Linux-specific content here
  </div>
  <div data-tab="macos">
    macOS-specific content here
  </div>
  <div data-tab="windows">
    Windows-specific content here
  </div>
</TabbedContent>
```

**Important**: Tab content divs must use `data-tab="id"` attribute matching the tab ID.

**Accessibility**: Supports arrow keys (Left/Right), Home, End for keyboard navigation.

---

### ChecklistItem

**Purpose**: Checkbox-style list items for requirements or feature lists.

**Location**: `src/components/ui/ChecklistItem.astro`

**Props**:
- `checked`: Boolean (default: false)
- `class`: Additional CSS classes

**Usage**:
```astro
import ChecklistItem from '~/components/ui/ChecklistItem.astro';

<ul class="space-y-2">
  <ChecklistItem checked>PHP 8.2 or higher</ChecklistItem>
  <ChecklistItem checked>MySQL 8.0 or MariaDB 10.6</ChecklistItem>
  <ChecklistItem>Redis (optional but recommended)</ChecklistItem>
</ul>
```

---

### AccordionFAQ

**Purpose**: Expandable FAQ sections using native HTML details/summary.

**Location**: `src/components/ui/AccordionFAQ.astro`

**Props**:
- `items`: Array of `{ question: string, answer: string }`
- `defaultOpen`: Boolean to open first item
- `class`: Additional CSS classes

**Usage**:
```astro
import AccordionFAQ from '~/components/ui/AccordionFAQ.astro';

<AccordionFAQ
  items={[
    {
      question: 'How do I migrate from Magento?',
      answer: '<p>Use our automated migration script...</p>',
    },
    {
      question: 'Is Mage-OS compatible with my extensions?',
      answer: '<p>Yes, Mage-OS maintains full compatibility...</p>',
    },
  ]}
  defaultOpen={true}
/>
```

**Note**: The `answer` field accepts HTML strings.

---

### Button

**Purpose**: Unified button/link component with variants.

**Location**: `src/components/ui/Button.astro`

**Props**:
- `variant`: `'primary'` | `'secondary'` | `'tertiary'` | `'link'`
- `text`: Button label
- `href`: URL (renders as link)
- `icon`: Tabler icon name
- `target`: Link target (`_blank` for external)

**Usage**:
```astro
import Button from '~/components/ui/Button.astro';

<Button variant="primary" text="Get Started" href="/get-started" />
<Button variant="secondary" text="Learn More" icon="tabler:arrow-right" />
<Button variant="link" text="View Documentation" href="/docs" />
```

---

### ItemGrid

**Purpose**: Responsive grid of items with icons.

**Location**: `src/components/ui/ItemGrid.astro`

**Props**:
- `items`: Array of `{ title, description, icon, callToAction }`
- `columns`: 2, 3, or 4
- `defaultIcon`: Fallback icon name

**Usage**: Typically used within widget components, not directly in pages.

---

### VersionBadge

**Purpose**: Status badges for version/software compatibility display.

**Location**: `src/components/ui/VersionBadge.astro`

**Props**:
- `status`: `'recommended'` | `'supported'` | `'minimum'` | `'deprecated'` (required)
- `text`: Optional override text (defaults to status label)
- `class`: Additional CSS classes

**Usage**:
```astro
import VersionBadge from '~/components/ui/VersionBadge.astro';

<VersionBadge status="recommended" />
<VersionBadge status="supported" text="8.3" />
<VersionBadge status="minimum" />
<VersionBadge status="deprecated" text="PHP 8.1" />
```

**Status Styling**:
| Status | Color | Use Case |
|--------|-------|----------|
| recommended | Green | Latest/preferred versions |
| supported | Blue | Fully supported versions |
| minimum | Gray | Minimum required versions |
| deprecated | Red (strikethrough) | Versions being phased out |

---

### Timeline

**Purpose**: Vertical timeline for displaying process steps or historical events.

**Location**: `src/components/ui/Timeline.astro`

**Props**:
- `items`: Array of `{ title, description, icon, classes }`
- `defaultIcon`: Fallback icon for items without icons
- `classes`: Object with container, panel, title, description, icon class overrides

**Usage**:
```astro
import Timeline from '~/components/ui/Timeline.astro';

<Timeline
  items={[
    { title: 'Step 1', description: 'First step details', icon: 'tabler:circle-1' },
    { title: 'Step 2', description: 'Second step details', icon: 'tabler:circle-2' },
    { title: 'Step 3', description: 'Final step details', icon: 'tabler:circle-3' },
  ]}
  defaultIcon="tabler:point"
/>
```

---

## Widget Components

Widgets are full-width page sections. Use them to compose pages.

### PageHero

**Purpose**: Interior page headers.

**Location**: `src/components/widgets/PageHero.astro`

**Variants**:
- `default`: Centered text
- `split`: Two-column with image
- `gradient`: Centered with gradient background

**Usage**:
```astro
import PageHero from '~/components/widgets/PageHero.astro';

<PageHero tagline="Get Started" variant="default">
  <Fragment slot="title">Installation Guide</Fragment>
  <Fragment slot="subtitle">
    Get Mage-OS running in minutes with our step-by-step guide.
  </Fragment>
</PageHero>
```

---

### Hero2

**Purpose**: Full-screen homepage hero.

**Props**: title, subtitle, tagline, content, actions (buttons), image

---

### Features / Features2

**Purpose**: Feature grids with icons.

**Props**:
- `title`, `subtitle`, `tagline`
- `items`: Array with title, description, icon, callToAction
- `columns`: Number of columns
- `isDark`: Dark background variant

---

### Content

**Purpose**: Two-column content + image sections.

**Props**:
- `isReversed`: Flip image/content sides
- `isAfterContent`: Reduce top padding
- `items`: Checklist items with icons
- `image`: Image object or path
- `callToAction`: CTA button

---

### CallToAction

**Purpose**: Large centered CTA section.

**Props**:
- `title`, `subtitle`
- `actions`: Array of button configs

---

### UpcomingEvents

**Purpose**: Display filtered upcoming events.

**Props**:
- `title`: Section heading
- `daysAhead`: How far ahead to look
- `count`: Maximum events to show

---

### Stats

**Purpose**: Statistics display.

**Props**:
- `stats`: Array of `{ amount, title, icon }`

---

### Announcement

**Purpose**: Header announcement bar displaying latest release with GitHub stars.

**Location**: `src/components/widgets/Announcement.astro`

**Props**: None (automatically fetches latest release post)

**Usage**:
```astro
import Announcement from '~/components/widgets/Announcement.astro';

<Announcement />
```

**Note**: Displays only on medium screens and up (hidden on mobile).

---

### BlogLatestPosts

**Purpose**: Grid of latest blog posts with optional "View all" link.

**Location**: `src/components/widgets/BlogLatestPosts.astro`

**Props**:
- `title`: Section heading
- `linkText`: Link text (default: "View all posts")
- `linkUrl`: Link URL (default: blog permalink)
- `information`: Additional description text
- `count`: Number of posts to display (default: 4)

**Usage**:
```astro
import BlogLatestPosts from '~/components/widgets/BlogLatestPosts.astro';

<BlogLatestPosts
  title="Latest News"
  count={3}
  linkText="Read more posts"
/>
```

---

### ReleasePostsGrid

**Purpose**: Grid specifically for release-category blog posts.

**Location**: `src/components/widgets/ReleasePostsGrid.astro`

**Props**:
- `posts`: Array of Post objects (required)
- `title`: Section heading (default: "Recent Releases")
- `count`: Number of posts to display (default: 3)
- `linkText`: Link text (default: "View all releases")
- `linkUrl`: Link URL (default: "/category/releases")

**Usage**:
```astro
import ReleasePostsGrid from '~/components/widgets/ReleasePostsGrid.astro';

<ReleasePostsGrid
  posts={releasePosts}
  title="Distribution Releases"
  count={4}
/>
```

---

### Newsletter

**Purpose**: MailerLite newsletter signup form.

**Location**: `src/components/widgets/Newsletter.astro`

**Props**:
- `title`: Section heading
- `subtitle`: Supporting text
- `tagline`: Small label above title
- `form`: MailerLite form ID (`<form id>:<token>`), defaults to the general newsletter form. Pass a different ID to embed another form from the same account, such as the security announcements form.
- Standard widget props (id, isDark, classes, bg)

**Usage**:
```astro
import Newsletter from '~/components/widgets/Newsletter.astro';

<Newsletter
  tagline="Stay Updated"
  title="Subscribe to Our Newsletter"
  subtitle="Get the latest Mage-OS news delivered to your inbox."
/>
```

---

### PartnersMarquee

**Purpose**: Auto-scrolling marquee of partner logos from Open Collective.

**Location**: `src/components/widgets/PartnersMarquee.astro`

**Props**:
- `speed`: Animation duration in seconds (default: 40)
- `pauseOnHover`: Pause animation on hover (default: true)

**Usage**:
```astro
import PartnersMarquee from '~/components/widgets/PartnersMarquee.astro';

<PartnersMarquee speed={30} pauseOnHover={true} />
```

**Accessibility**: Respects `prefers-reduced-motion` by displaying as a static wrapped grid.

---

## Page Patterns

### Standard Page Structure

```astro
---
import Layout from '~/layouts/PageLayout.astro';
import PageHero from '~/components/widgets/PageHero.astro';
import Callout from '~/components/ui/Callout.astro';
import CodeBlock from '~/components/ui/CodeBlock.astro';

const metadata = {
  title: 'Page Title',
  description: 'Page description for SEO.',
};
---

<Layout metadata={metadata}>
  <PageHero tagline="Section" variant="default">
    <Fragment slot="title">Page Title</Fragment>
    <Fragment slot="subtitle">Brief description.</Fragment>
  </PageHero>

  <section class="px-4 py-8 sm:px-6 mx-auto lg:px-8 max-w-4xl">
    <div class="prose dark:prose-invert prose-headings:font-heading prose-headings:font-bold max-w-none">
      <h2>Section Heading</h2>
      <p>Content here...</p>

      <CodeBlock code="example command" lang="bash" />

      <Callout type="tip" title="Pro Tip">
        Helpful information here.
      </Callout>
    </div>
  </section>
</Layout>
```

### Prose Sections

For markdown-like content within Astro pages, wrap in prose classes:

```html
<div class="prose dark:prose-invert prose-headings:font-heading prose-headings:font-bold max-w-none">
  <!-- h2, h3, p, ul, ol, blockquote, tables, etc. -->
</div>
```

**Important**: UI components like `Callout` and `CodeBlock` use `not-prose` internally to escape prose styling.

### Section Container Pattern

```html
<section class="px-4 py-8 sm:px-6 mx-auto lg:px-8 max-w-4xl">
  <!-- Content -->
</section>
```

For wider content: `max-w-6xl` or `max-w-7xl`

---

## Styling Patterns

### Dark Mode

All styles must include dark mode variants:

```html
<!-- Colors -->
<div class="bg-white dark:bg-gray-900">
<div class="text-gray-900 dark:text-white">
<div class="border-gray-200 dark:border-gray-700">

<!-- Backgrounds -->
<div class="bg-blue-50 dark:bg-blue-950/50">
<div class="bg-indigo-50 dark:bg-slate-800/50">
```

### Theme Colors (CSS Variables)

```css
text-primary      /* var(--aw-color-primary) */
text-muted        /* var(--aw-color-text-muted) */
bg-page           /* var(--aw-color-bg-page) */
```

### Common Color Patterns

| Use Case | Light | Dark |
|----------|-------|------|
| Page background | `bg-white` | `dark:bg-gray-900` |
| Card background | `bg-gray-50` | `dark:bg-gray-800` |
| Subtle highlight | `bg-indigo-50` | `dark:bg-slate-800/50` |
| Warning background | `bg-yellow-50` | `dark:bg-yellow-900/30` |
| Success background | `bg-green-50` | `dark:bg-green-950/50` |
| Border | `border-gray-200` | `dark:border-gray-700` |

### Responsive Breakpoints

```html
<!-- Mobile-first approach -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

| Prefix | Min Width |
|--------|-----------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

---

## Background Patterns

Backgrounds use absolute positioning with negative z-index.

### In Widgets (using WidgetWrapper)

```astro
<WidgetWrapper>
  <Fragment slot="bg">
    <div class="absolute inset-0 bg-indigo-50 dark:bg-slate-800/50"></div>
  </Fragment>
  <!-- Widget content -->
</WidgetWrapper>
```

### Common Background Styles

```html
<!-- Solid colors -->
<div class="absolute inset-0 bg-white dark:bg-gray-900"></div>
<div class="absolute inset-0 bg-gray-50 dark:bg-gray-800"></div>
<div class="absolute inset-0 bg-indigo-50 dark:bg-slate-800/50"></div>

<!-- Gradients -->
<div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-indigo-50
  dark:from-primary/20 dark:via-gray-900 dark:to-gray-800"></div>

<!-- Overlay for images -->
<div class="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent
  dark:from-slate-900/95 dark:via-slate-900/80 dark:to-transparent"></div>
```

### Background Requirements

- Always use `absolute inset-0`
- Add `pointer-events-none` to prevent blocking clicks
- Include both light and dark variants
- Use `aria-hidden="true"` for decorative backgrounds

---

## Content Patterns

### Blog Posts

Location: `src/data/post/YYYY-MM-DD-slug.md`

```yaml
---
title: 'Post Title'
publishDate: 2025-01-15
excerpt: 'Brief summary for listings.'
image: ~/assets/images/blog/2025/image.jpg
category: 'Releases'
tags:
  - release
  - security
author: 'Author Name'
draft: false
---

Post content in Markdown...
```

### Events

Location: `src/data/events/event-name.md`

```yaml
---
title: 'Event Name'
eventDate: '2025-03-15T09:00:00.000Z'
endDate: '2025-03-17T17:00:00.000Z'
location: 'Amsterdam, Netherlands'
url: 'https://event-website.com'
image: 'event-image.jpg'
draft: false
---
```

---

## Common Conventions

### Slot Pattern

```astro
<Component>
  <Fragment slot="title">Title Here</Fragment>
  <Fragment slot="subtitle">Subtitle here</Fragment>
  <Fragment slot="bg">Background element</Fragment>
</Component>
```

### Conditional Classes

```astro
<div
  class:list={[
    'base-class always-applied',
    { 'conditional-class': someCondition },
    { 'dark-variant': isDark },
  ]}
>
```

### Icon Usage

```astro
import { Icon } from 'astro-icon/components';

<Icon name="tabler:icon-name" class="w-5 h-5" aria-hidden="true" />
```

Icons come from Tabler Icons. Browse at: https://tabler.io/icons

### HTML in Strings

When component props accept HTML strings, use Fragment:

```astro
<Fragment set:html={htmlContent} />
```

---

## Accessibility Requirements

### Focus Indicators

All interactive elements have visible focus states (WCAG 2.1 AA compliant).

### Icon-Only Buttons

Always include `aria-label`:

```astro
<Button icon="tabler:menu" aria-label="Open menu" />
```

### Semantic HTML

- Use `<aside role="note">` for callouts
- Use `<details>/<summary>` for accordions
- Use proper heading hierarchy (h1 > h2 > h3)
- Use `aria-hidden="true"` on decorative elements

### Dark Mode

All color combinations must maintain sufficient contrast in both modes.

---

## Checklist for New Pages

1. [ ] Import Layout and PageHero
2. [ ] Define metadata (title, description)
3. [ ] Use PageHero for page header
4. [ ] Wrap content sections in prose classes
5. [ ] Use Callout instead of blockquote for notices
6. [ ] Use CodeBlock for code snippets
7. [ ] Include dark mode variants for all custom styles
8. [ ] Run `npm run check` before committing
9. [ ] Test in both light and dark modes

---

## Checklist for Component Updates

1. [ ] Read the existing component file first
2. [ ] Check for existing patterns in similar components
3. [ ] Include dark mode variants
4. [ ] Maintain accessibility features
5. [ ] Use twMerge for class merging
6. [ ] Run build to verify no type errors
7. [ ] Run prettier to fix formatting
