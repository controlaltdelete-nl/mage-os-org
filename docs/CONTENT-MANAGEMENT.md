# Mage-OS Website Content Management Guide

This guide documents how to manage content on the Mage-OS Astro website. Written for both human editors and AI agents.

---

## Table of Contents

- [Directory Structure](#directory-structure)
- [Blog Posts](#blog-posts)
- [Events](#events)
- [Static Pages](#static-pages)
- [Available Widgets](#available-widgets)
- [Navigation](#navigation)
- [Common Content Updates](#common-content-updates)
- [Images and Assets](#images-and-assets)
- [Icons](#icons)
- [Build and Preview](#build-and-preview)

---

## Directory Structure

```
astro/src/
├── assets/images/          # Image assets
│   ├── blog/               # Blog post images
│   ├── events/             # Event images
│   ├── partners/           # Partner logos
│   └── team/               # Team member photos
├── components/widgets/     # Reusable page widgets
├── content/config.ts       # Content collection schemas
├── data/
│   ├── post/               # Blog posts (*.md, *.mdx)
│   └── events/             # Events (*.md, *.mdx)
├── layouts/                # Page layouts
├── navigation.ts           # Header and footer navigation
└── pages/                  # Static pages
    ├── about/              # About section
    ├── community/          # Community pages
    ├── documentation/      # Documentation pages
    ├── events/             # Events listing page
    ├── get-started/        # Getting started guides
    ├── product/            # Product pages
    └── [...blog]/          # Blog routing
```

---

## Blog Posts

### Location
`astro/src/data/post/`

### File Naming Convention
```
YYYY-MM-DD-slug-title.md
```

**Examples:**
- `2026-01-18-mage-os-1-3-0.md`
- `2026-02-01-mage-os-january-update.md`
- `2025-11-06-release-mage-os-distribution-1-2-0.md`

### Frontmatter Schema

```yaml
---
title: 'Post Title Here'
publishDate: 'YYYY-MM-DDTHH:MM:SS.000Z'
category: 'Category Name'
author: 'Author Name'
draft: false
excerpt: 'Brief summary for listings and SEO (1-2 sentences)'
tags:
  - 'Tag1'
  - 'Tag2'
image: '~/assets/images/blog/image-name.png'  # Optional
---
```

### Categories
Common categories used:
- `Releases` - Distribution release announcements
- `Updates` - Monthly/weekly recap posts
- `Community` - Community news and events
- `Technical` - Technical articles and tutorials
- `Announcements` - Official announcements

### Creating a New Blog Post

1. Create file: `astro/src/data/post/YYYY-MM-DD-slug.md`
2. Add frontmatter (see schema above)
3. Write content in Markdown
4. Add images to `astro/src/assets/images/blog/`
5. Reference images: `![Alt text](~/assets/images/blog/filename.png)`

### Release Post Template

For release posts, you can use dynamic version specs to keep version tables accurate:

```astro
---
// For .astro blog post files, import specs
import { getLatestSpecs } from '~/utils/systemSpecs';
const specs = await getLatestSpecs();
---

The latest recommended software versions are:

| Component     | Version                                                                |
| ------------- | ---------------------------------------------------------------------- |
| PHP           | {specs.php.recommended}/{specs.php.minimum}                            |
| Composer      | {specs.composer.recommended}                                           |
| OpenSearch    | {specs.opensearch.recommended}                                         |
| MariaDB       | {specs.mariadb.recommended}                                            |
| MySQL         | {specs.mysql.recommended}                                              |
| Redis         | Valkey {specs.valkey.recommended} (or Redis {specs.redis.recommended}+)|
```

**For Markdown release posts**, use static version values since Markdown doesn't support dynamic imports. The versions table can be manually updated, or converted to MDX for dynamic support.

```markdown
---
title: 'Mage-OS X.Y.Z is out now!'
publishDate: 'YYYY-MM-DDTHH:MM:SS.000Z'
category: 'Releases'
author: 'Mage-OS Team'
draft: false
excerpt: 'We are excited to announce the release of Mage-OS Distribution X.Y.Z...'
tags:
  - 'Releases'
  - 'Updates'
---

We are excited to announce the release of Mage-OS Distribution X.Y.Z!

## Our foundation

Mage-OS X.Y.Z is built on Magento Open Source 2.4.X-pY, and includes all platform updates and community fixes from the upstream release. See the full [Magento Open Source Release Notes](URL) for details.

The latest recommended software versions are:

| Component     | Version                   |
| ------------- | ------------------------- |
| PHP           | 8.4/8.3                   |
| Composer      | 2.9                       |
| OpenSearch    | 2.19                      |
| MariaDB       | 11.4                      |
| MySQL         | 8.4                       |
| Redis         | Valkey 8 (or Redis 7.2+)  |

## What's new

[Describe major changes]

## Thanks to everyone that helped with this release!

Mage-OS wouldn't exist without a great community. Among others, thank you to:

- Contributor Name
- Contributor Name
```

---

## Events

### Location
`astro/src/data/events/`

### File Naming Convention
```
YYYY-MM-DD-event-slug.md
```

**Examples:**
- `2026-08-26-meet-magento-poland-2026.md`
- `2026-04-14-meet-magento-new-york-2026.md`

### Frontmatter Schema

```yaml
---
title: 'Event Title'
date: 'YYYY-MM-DDTHH:MM:SS.000Z'
endDate: 'YYYY-MM-DDTHH:MM:SS.000Z'  # Optional
location: 'City, Country'
venue: 'Venue Name'                   # Optional
url: 'https://event-website.com'      # Optional
excerpt: 'Brief description'          # Optional
image: '~/assets/images/events/img.png'  # Optional
draft: false                          # Optional
---
```

### Creating a New Event

1. Create file: `astro/src/data/events/YYYY-MM-DD-event-slug.md`
2. Add frontmatter with at minimum: `title`, `date`, `location`
3. Optionally add body content (displayed on event detail page)

### Event Example

```yaml
---
title: 'Meet Magento Netherlands 2026'
date: '2026-04-14T00:00:00.000Z'
location: 'Amsterdam, Netherlands'
venue: 'RAI Amsterdam'
url: 'https://meetmagento.nl'
excerpt: 'The largest Magento conference in the Benelux region'
---

Join us for the premier Magento event in the Netherlands!
```

---

## Static Pages

### Page Types

| Extension | Layout | Use Case |
|-----------|--------|----------|
| `.astro` | Full control | Complex pages with widgets |
| `.md` | ContentPageLayout | Simple content pages |
| `.mdx` | ContentPageLayout | Content with components |

### Astro Pages (`.astro`)

**Location:** `astro/src/pages/`

**Structure:**
```astro
---
import Layout from '~/layouts/PageLayout.astro';
import Hero from '~/components/widgets/Hero.astro';
import Features from '~/components/widgets/Features.astro';
// ... more imports

const metadata = {
  title: 'Page Title',
  description: 'SEO description',
};
---

<Layout metadata={metadata}>
  <Hero
    tagline="Section Label"
    title="Main Heading"
    subtitle="Supporting text"
    actions={[
      { variant: 'primary', text: 'CTA Text', href: '/path', icon: 'tabler:icon-name' },
    ]}
  />

  <Features
    title="Section Title"
    items={[
      { title: 'Item 1', description: 'Description', icon: 'tabler:icon' },
    ]}
  />
</Layout>
```

### Markdown Pages (`.md`)

**Location:** `astro/src/pages/`

**Frontmatter:**
```yaml
---
title: 'Page Title'
description: 'SEO description'
tagline: 'Section Label'
layout: '~/layouts/ContentPageLayout.astro'
---

# Heading

Content in Markdown...
```

### MDX Pages (`.mdx`)

Same as Markdown but supports importing and using Astro components.

---

## Available Widgets

Import from `~/components/widgets/`:

### Hero Widgets

| Widget | Description | Key Props |
|--------|-------------|-----------|
| `Hero` | Full hero with image | `title`, `subtitle`, `tagline`, `actions`, `image` |
| `Hero2` | Alternative hero style | Same as Hero |
| `HeroText` | Text-only hero | `title`, `subtitle`, `tagline`, `actions` |

### Content Widgets

| Widget | Description | Key Props |
|--------|-------------|-----------|
| `Features` | 2-column feature grid | `title`, `subtitle`, `tagline`, `items`, `columns` |
| `Features2` | Icon-focused features | `title`, `subtitle`, `items` |
| `Features3` | Card-based features | `title`, `subtitle`, `items`, `columns` |
| `Content` | Text + image section | `title`, `items`, `image`, `isReversed` |
| `Steps` | Numbered process steps | `title`, `items`, `image` |
| `Stats` | Statistics display | `title`, `stats` (array of `{amount, title, icon}`) |

### Interactive Widgets

| Widget | Description | Key Props |
|--------|-------------|-----------|
| `FAQs` | Accordion FAQ section | `title`, `tagline`, `items` (array of `{title, description}`) |
| `Testimonials` | Quote carousel/grid | `title`, `testimonials` |
| `CallToAction` | CTA banner | `title`, `subtitle`, `actions` |

### Utility Widgets

| Widget | Description | Key Props |
|--------|-------------|-----------|
| `Note` | Highlighted note box | `icon`, `title`, `description` |
| `Brands` | Logo display | `title`, `images` |
| `PartnersBar` | Partner logo bar | `title`, `partners` |
| `Pricing` | Pricing table | `title`, `prices` |

### System Specs Components

Import from `~/components/ui/`:

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `SpecsQuickRef` | Quick reference grid of component versions | `version` (optional) |
| `SpecsTable` | Generic table for component min/recommended versions | `rows`, `title`, `showNotes` |
| `SpecsMatrix` | Compatibility matrix of Mage-OS versions | `limit` |

**SpecsQuickRef usage:**
```astro
import SpecsQuickRef from '~/components/ui/SpecsQuickRef.astro';

<SpecsQuickRef />
```

**SpecsTable usage:**
```astro
import SpecsTable from '~/components/ui/SpecsTable.astro';
import { getLatestSpecs } from '~/utils/systemSpecs';

const specs = await getLatestSpecs();

<SpecsTable
  rows={[
    { name: 'MySQL', minimum: specs.mysql.minimum, recommended: specs.mysql.recommended, notes: 'Oracle distribution' },
    { name: 'MariaDB', minimum: specs.mariadb.minimum, recommended: specs.mariadb.recommended, notes: 'MySQL alternative' },
  ]}
/>
```

**SpecsMatrix usage:**
```astro
import SpecsMatrix from '~/components/ui/SpecsMatrix.astro';

<SpecsMatrix limit={5} />
```

### Widget Item Structure

Most widgets accept `items` arrays with this structure:

```typescript
{
  title: string;
  description: string;
  icon?: string;           // Tabler icon name
  callToAction?: {
    text: string;
    href: string;
  };
  image?: {
    src: string;
    alt: string;
  };
}
```

### Background Colors

Alternate section backgrounds for visual variety:

```astro
<Features ...props>
  <Fragment slot="bg">
    <div class="absolute inset-0 bg-blue-50 dark:bg-transparent"></div>
  </Fragment>
</Features>
```

Common background classes:
- `bg-blue-50` - Light blue
- `bg-orange-50` - Light orange
- `bg-gray-50` - Light gray

---

## Navigation

### Location
`astro/src/navigation.ts`

### Header Navigation Structure

```typescript
export const headerData = {
  links: [
    {
      text: 'Dropdown Menu',
      links: [
        { text: 'Link 1', href: getPermalink('/path') },
        { text: 'Link 2', href: getPermalink('/path') },
      ],
    },
    {
      text: 'Direct Link',
      href: getPermalink('/path'),
    },
  ],
  actions: [], // Header CTA buttons
};
```

### Footer Navigation Structure

```typescript
export const footerData = {
  links: [
    {
      title: 'Column Title',
      links: [
        { text: 'Link Text', href: getPermalink('/path') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Privacy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/mage-os' },
  ],
};
```

### Adding a New Navigation Item

1. Open `astro/src/navigation.ts`
2. Add to appropriate section in `headerData.links` or `footerData.links`
3. Use `getPermalink('/path')` for internal links

---

## Common Content Updates

### New Mage-OS Release

**Files to update:**

1. **Create release blog post:**
   - `src/data/post/YYYY-MM-DD-mage-os-X-Y-Z-release.md`
   - Use release post template above
   - The releases page and the RSS feed pick it up automatically through the `Releases` category

2. **Record the security advisory (if the release contains security fixes):**
   - `src/data/security-advisories.json`
   - Add an entry keyed by version; see [Security Advisories](#security-advisories) below
   - This feeds the table and the "latest security release" block on `/product/security`

3. **Update system requirements (if changed):**
   - `src/pages/get-started/system-requirements.astro`
   - Update version tables

4. **Update get-started pages (if installation changes):**
   - `src/pages/get-started/quick-start.astro`
   - `src/pages/get-started/installation.astro`

5. **Update homepage stats (if applicable):**
   - `src/pages/index.astro`
   - Update any version numbers displayed

### Security Advisories

Every release that carries security fixes gets an entry in `src/data/security-advisories.json`. The file is a
content collection (`securityAdvisory` in `src/content/config.ts`), so the build fails on a bad entry: an unknown
severity, a malformed date, a CVE that does not look like a CVE, or a `post` that does not match an existing post.

```json
"3.5.0": {
  "date": "2026-09-08",
  "severity": "critical",
  "summary": "One or two sentences on what was fixed and who is affected.",
  "cves": ["CVE-2026-75650"],
  "bulletins": [
    { "label": "APSB26-146", "url": "https://helpx.adobe.com/security/products/magento/apsb26-146.html" }
  ],
  "post": "2026-09-08-mage-os-3-5-0-release"
}
```

- The key is the Mage-OS version.
- `severity` is one of `critical`, `high`, `moderate`, `low`. Use Adobe's rating for ported patches, or the GitHub
  Security Advisory rating for Mage-OS packages.
- `cves` may be empty when Adobe publishes a bulletin without CVE identifiers at release time.
- `bulletins` links to the Adobe bulletin, the GitHub Security Advisory, or the researcher write-up.
- `post` is the release post's file name without extension. The post must not be a draft.

### System Requirements Update

System requirements are now **automatically fetched** from the authoritative GitHub source at build time. The data source is:
- `https://raw.githubusercontent.com/mage-os/github-actions/main/supported-version/src/versions/mage-os/composite.json`

**Configuration file:** `src/data/system-specs-config.yaml`

To update minimum/recommended versions:

```yaml
# src/data/system-specs-config.yaml
components:
  php:
    minimum: "8.3"
    recommended: "8.4"
  mysql:
    minimum: "8.0"
    recommended: "8.4"
  # ... other components
```

### Adding a New Event

1. Create: `astro/src/data/events/YYYY-MM-DD-event-slug.md`
2. Add frontmatter with `title`, `date`, `location`
3. Optionally add `url`, `venue`, `excerpt`

### Updating Leadership/Contributors

**Files:**
- `astro/src/pages/about/leadership.astro`
- `astro/src/pages/about/contributors.astro`

Update the member arrays in the frontmatter/script section.

### Adding a Partner Logo

1. Add logo: `astro/src/assets/images/partners/partner-name.png`
2. Update PartnersBar usage in relevant pages

---

## Images and Assets

### Directory Structure

```
astro/src/assets/images/
├── blog/           # Blog post images
├── events/         # Event images
├── partners/       # Partner/sponsor logos
├── team/           # Team member photos
├── default.png     # Default fallback image
└── hero-image.png  # Homepage hero
```

### Image Best Practices

| Use Case | Recommended Size | Format |
|----------|------------------|--------|
| Blog featured | 1200x630px | PNG/WebP |
| Team photos | 400x400px | PNG/WebP |
| Partner logos | 200x100px | PNG/SVG |
| Hero images | 1920x1080px | PNG/WebP |

### Referencing Images

**In Astro files:**
```astro
import myImage from '~/assets/images/path/image.png';

<Image src={myImage} alt="Description" />
```

**In Markdown/MDX:**
```markdown
![Alt text](~/assets/images/path/image.png)
```

**External URLs:**
```astro
image={{
  src: 'https://images.unsplash.com/photo-xxx',
  alt: 'Description',
}}
```

---

## Icons

### Icon Library
Uses [Tabler Icons](https://tabler.io/icons) via `astro-icon`.

### Usage in Widgets

```astro
{
  title: 'Feature',
  icon: 'tabler:rocket',
}
```

### Common Icons

| Icon | Name | Use Case |
|------|------|----------|
| `tabler:rocket` | Rocket | Quick start, launch |
| `tabler:code` | Code | Development |
| `tabler:users` | Users | Community |
| `tabler:shield-check` | Shield | Security |
| `tabler:bolt` | Bolt | Performance |
| `tabler:refresh` | Refresh | Migration, updates |
| `tabler:brand-github` | GitHub | GitHub links |
| `tabler:brand-discord` | Discord | Discord links |
| `tabler:calendar` | Calendar | Events, dates |
| `tabler:map-pin` | Map Pin | Locations |

### Direct Icon Usage

```astro
import { Icon } from 'astro-icon/components';

<Icon name="tabler:rocket" class="w-6 h-6" />
```

---

## Build and Preview

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run check
```

---

## Content Checklist

Before publishing new content:

- [ ] Frontmatter is complete and valid
- [ ] Date format is correct (`YYYY-MM-DDTHH:MM:SS.000Z`)
- [ ] `draft: false` is set (or omitted)
- [ ] Images have alt text
- [ ] Internal links use `getPermalink()` or relative paths
- [ ] External links have `target="_blank"` and `rel="noopener noreferrer"`
- [ ] Content follows tone guidelines (professional, approachable)
- [ ] No broken links
- [ ] Build completes without errors

---

## AI Agent Instructions

When modifying content:

1. **Read before editing:** Always read the target file first to understand context
2. **Preserve structure:** Maintain existing frontmatter fields and formatting
3. **Use correct schemas:** Follow the frontmatter schemas documented above
4. **Check dependencies:** If updating version numbers, check all related files
5. **Validate changes:** Ensure edits don't break the build
6. **Follow naming conventions:** Use the documented file naming patterns
7. **Use widgets appropriately:** Match widget choice to content type
8. **Alternate backgrounds:** Use `bg-blue-50` and `bg-orange-50` for visual variety
9. **Include CTAs:** Every major section should have a clear call-to-action

### Quick Reference: File Locations by Task

| Task | Primary File(s) |
|------|-----------------|
| New blog post | `src/data/post/YYYY-MM-DD-slug.md` |
| New event | `src/data/events/YYYY-MM-DD-slug.md` |
| Update navigation | `src/navigation.ts` |
| Update system requirements | `src/data/system-specs-config.yaml` (for min/recommended overrides) |
| New release announcement | `src/data/post/` (releases page updates automatically) |
| Security release advisory | `src/data/security-advisories.json` (shown on `/product/security`) |
| Update leadership | `src/pages/about/leadership.astro` |
| Update FAQ | `src/pages/faq.astro` |
| Update homepage | `src/pages/index.astro` |

---

*Last updated: January 2026 (added system specs management)*
