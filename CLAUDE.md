# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 blog template with App Router, React Server Components, and Contentlayer2 for MDX content management. Uses Bun as runtime and package manager.

## Development Commands

```bash
bun dev              # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Lint and auto-fix code
```

## Content Frontmatter

### Blog Post Fields

| Field          | Type    | Required | Description                        |
| -------------- | ------- | -------- | ---------------------------------- |
| `title`        | string  | ✅       | Post title                         |
| `date`         | date    | ✅       | Publication date                   |
| `tags`         | list    | -        | Array of tags                      |
| `lastmod`      | date    | -        | Last modified date                 |
| `draft`        | boolean | -        | Draft status, hidden in production |
| `summary`      | string  | -        | Post summary                       |
| `images`       | json    | -        | Cover image array                  |
| `authors`      | list    | -        | Author list                        |
| `layout`       | string  | -        | Layout type                        |
| `bibliography` | string  | -        | Bibliography file path             |
| `canonicalUrl` | string  | -        | Canonical URL for SEO              |

### Example

```yaml
---
title: My Post Title
date: 2025-12-25
tags: [AI, Coding]
lastmod: 2025-12-26
draft: false
summary: This is a sample post
images: ['/static/images/cover.jpg']
authors: ['default']
layout: PostLayout
---
```

## Draft Feature

Set `draft: true` in frontmatter to mark a post as draft:

```yaml
---
title: Draft Article
date: 2025-12-25
draft: true
---
```

- **Development** (`bun dev`): Drafts are visible
- **Production** (`bun run build`): Drafts are automatically excluded

## Series Posts (Nested Routing)

Organize series posts using nested folders:

```
data/blog/
└── my-series/
    ├── part-1-intro.mdx      # /blog/my-series/part-1-intro
    ├── part-2-deep-dive.mdx  # /blog/my-series/part-2-deep-dive
    └── part-3-conclusion.mdx # /blog/my-series/part-3-conclusion
```

Posts in the same folder are sorted by date automatically.

## Architecture

### Content Management with Contentlayer2

Content managed through Contentlayer2 with schemas in `contentlayer.config.ts`. Posts stored as MDX files in `data/blog/` and processed into TypeScript types in `.contentlayer/generated/`.

**Content sources:**

- Blog posts: `data/blog/**/*.mdx` (organized by locale: `en/`, `zh/`)
- Author profiles: `data/authors/**/*.mdx`

**Processing pipeline:**

- Remark: frontmatter, GFM, code titles, math (KaTeX), image-to-JSX, GitHub alerts
- Rehype: heading slugs, autolink, KaTeX, citations, Prism syntax highlighting

### Next.js App Router Structure

All pages in `app/` directory:

- Dynamic routes: `app/blog/[...slug]/page.tsx` (catch-all for nested routes)
- Tag pages: `app/tags/[tag]/page/[page]/page.tsx`
- Static generation via `generateStaticParams()`
- Draft posts excluded in production when `draft: true`

### Layout System

Layouts defined by `layout` frontmatter field:

- `PostLayout`: Default 2-column layout with sidebar
- `PostSimple`: Single-column simplified layout
- `PostBanner`: Full-width with banner image

### Site Configuration

All site configuration in `data/siteMetadata.js`:

- Basic metadata (title, author, description)
- Social links (GitHub, Twitter/X, LinkedIn, etc.)
- Analytics (Umami, Plausible, PostHog, Google Analytics)
- Comments (Giscus, Utterances, Disqus)
- Newsletter (Mailchimp, Buttondown, ConvertKit, etc.)
- Search (Kbar or Algolia)

## Directory Structure

```
├── app/                    # Next.js App Router pages
├── components/            # React components
├── contentlayer.config.ts # Contentlayer configuration
├── css/tailwind.css       # Tailwind CSS v4 config
├── data/
│   ├── blog/             # Posts (en/, zh/)
│   ├── authors/          # Author configurations
│   ├── siteMetadata.js   # Site metadata
│   └── projectsData.ts   # Projects data
└── public/               # Static assets
```

## Important Notes

### i18n Content Structure

Blog posts organized by locale:

- English: `data/blog/en/**/*.mdx`
- Chinese: `data/blog/zh/**/*.mdx`

Locale extracted from path (second segment) as computed field.

### Turbopack Compatibility

**Next.js 16+ is NOT compatible with Contentlayer2.** Next.js 16 uses Turbopack by default, which does not support `next-contentlayer2`.

The project uses Next.js 15.x to maintain webpack support for Contentlayer2.
