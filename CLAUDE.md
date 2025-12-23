# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 blog template using App Router, React Server Components, and Contentlayer2 for MDX-based content management. It uses Bun as the runtime and package manager.

## Development Commands

```bash
bun dev               # Start development server
bun run build         # Build for production (includes RSS generation)
bun run start         # Start production server
bun run lint          # Lint and auto-fix code
bun run analyze       # Build with bundle analysis
```

## Architecture

### Content Management with Contentlayer2

Content is managed through Contentlayer2 with schemas defined in `contentlayer.config.ts`. Blog posts are stored as MDX files in `data/blog/` and automatically processed into TypeScript types in `.contentlayer/generated/`.

**Key content sources:**

- Blog posts: `data/blog/**/*.mdx`
- Author profiles: `data/authors/**/*.mdx`

**Contentlayer processing pipeline:**

- Remark plugins: frontmatter extraction, GFM, code titles, math (KaTeX), image-to-JSX, GitHub alerts
- Rehype plugins: heading slugs, autolink, KaTeX rendering, citations, Prism syntax highlighting

The post-build script (`scripts/postbuild.mjs`) generates RSS feeds and tag data after Next.js build completes.

### Next.js App Router Structure

All pages use the App Router in the `app/` directory:

- Dynamic blog routes: `app/blog/[...slug]/page.tsx` (catch-all for nested routes)
- Tag pages with pagination: `app/tags/[tag]/page/[page]/page.tsx`
- Static generation: `generateStaticParams()` pre-renders all content at build time
- Draft posts are excluded from production builds when `draft: true` in frontmatter

### Layout System

Blog posts use different layouts based on the `layout` frontmatter field (defaults to `PostLayout`):

- `PostLayout`: Default 2-column layout with sidebar (metadata, author info, TOC)
- `PostSimple`: Single-column simplified layout
- `PostBanner`: Full-width with banner image

Listing pages:

- `ListLayoutWithTags`: Blog listing with tag sidebar (v2 default)
- `ListLayout`: Blog listing with search functionality (v1)

Layout selection happens in `app/blog/[...slug]/page.tsx`.

### MDX Component System

Custom components can be used directly in MDX files. Component mappings are in `components/MDXComponents.tsx`. The system integrates with Pliny's `MDXLayoutRenderer` for rendering.

Available MDX components include: Image, CustomLink, TableWrapper, TOCInline, Pre, BlogNewsletterForm.

### Site Configuration

All site-wide configuration is centralized in `data/siteMetadata.js`, including:

- Basic metadata (title, author, description, language)
- Social links (GitHub, Twitter/X, LinkedIn, etc.)
- Analytics providers (Umami, Plausible, PostHog, Google Analytics)
- Comment systems (Giscus, Utterances, Disqus)
- Newsletter providers (Mailchimp, Buttondown, ConvertKit, etc.)
- Search options (Kbar command palette or Algolia)

Environment variables for sensitive data (API keys) are defined in `.env.example` and loaded at runtime.

### Pliny Integration

The `pliny` package (v0.4.1) provides cross-cutting functionality:

- Analytics with multi-provider support
- Search (Kbar or Algolia)
- Comments with multiple backends
- Newsletter forms
- Utilities: `sortPosts`, `coreContent`, `allCoreContent`, date formatting
- Contentlayer helpers and MDX components

### Styling System

Uses Tailwind CSS v4 with the new `@import` and `@theme` syntax (configured in `css/tailwind.css`):

- Color system: OKLCH-based with primary (red/pink) and gray palettes
- Dark mode: `next-themes` provider with class-based targeting via `@custom-variant dark`
- Font: Space Grotesk via `next/font/google`
- Custom components are styled using Tailwind utilities
- Prettier plugin sorts Tailwind classes automatically

## Content Frontmatter

### Blog Post Frontmatter

```yaml
title (required)
date (required)
tags (optional, array)
lastmod (optional)
draft (optional, boolean)
summary (optional)
images (optional, array or string)
authors (optional, array - defaults to 'default')
layout (optional - defaults to 'PostLayout')
canonicalUrl (optional)
bibliography (optional, for citations)
```

### Author Frontmatter

```yaml
name (required)
avatar (optional)
occupation (optional)
company (optional)
email (optional)
twitter (optional)
linkedin (optional)
github (optional)
bluesky (optional)
```

## Configuration Files

- `contentlayer.config.ts`: Content schema and MDX processing pipeline
- `next.config.js`: Next.js configuration with security headers, image domains
- `tsconfig.json`: TypeScript configuration with path aliases (`@/components`, `@/data`, etc.)
- `eslint.config.mjs`: ESLint flat config with TypeScript, a11y, and Next.js rules
- `css/tailwind.css`: Tailwind v4 theme configuration
- `data/headerNavLinks.ts`: Site navigation links
- `data/projectsData.ts`: Projects page data

## Deployment

The project supports multiple deployment options:

- **Vercel** (recommended): Zero-config deployment
- **Netlify**: Next.js runtime support
- **GitHub Pages**: Via `.github/workflows/pages.yml`
- **Static export**: Set `EXPORT=1 UNOPTIMIZED=1` environment variables
- **Docker**: See FAQ documentation

## Git Hooks

Uses Husky for pre-commit hooks with lint-staged:

- JS/TS/TSX files: ESLint with auto-fix
- JSON/CSS/MD/MDX files: Prettier formatting
