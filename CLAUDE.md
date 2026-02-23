# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Explainer is a documentation framework built on Astro 5 (static site generation) with React 19 for interactive components. It uses MDX for content authoring with custom directives, Tailwind CSS v4 with OKLCH colors, and shadcn/ui-style components built on Radix UI primitives.

## Commands

- `pnpm install` — install dependencies
- `pnpm dev` — start dev server (localhost:4321)
- `pnpm build` — production build to `./dist/`
- `pnpm preview` — preview production build

CI uses Node 20.14.0 and pnpm 9. Playwright is installed for E2E tests.

## Architecture

### Path Alias

`@/*` maps to `./src/lib/*` (configured in tsconfig.json).

### Content System

Content lives in `/content/` using Astro Content Collections (defined in `src/content.config.ts`):

- **docs** — documentation pages (`content/docs/`), schema has title, description, permalink, icon, visibility
- **docDefaults** — category metadata files named `_default.mdx` with label, description, icon, collection
- **deepDocDefaults** — nested category metadata files named `*_default.mdx`
- **blog** — blog posts (`content/blog/`), schema has title, description, permalink, thumbnail, authors, publishedAt
- **pages** — general pages including homepage (`content/index.mdx`)

Documentation collections are also dynamically generated from directories under `content/docs/`.

### Custom MDX Directives

MDX content uses `remark-directive` syntax processed by a custom `remarkBlockParser` plugin (`src/lib/plugins/parser/plugin.ts`) that converts directives to HTML elements mapped to components.

Syntax: `::component-name{attr="value"}` for blocks, `:::component-name` for containers.

Component mappings are defined in `explainer.config.ts` under `content.components`.

### Component Layers

1. **UI Components** (`src/lib/components/ui/`) — Radix + CVA primitives styled with Tailwind (shadcn new-york style)
2. **Content Components** (`src/lib/components/content/`) — MDX-specific: callout, codeblock, code-group, code-preview, step-group, card-group, heading
3. **Element Components** (`src/lib/components/elements/`) — page-level: navbar, footer, search-command (cmdk), sidebar, doc-switcher

Pattern: Astro wrappers delegate to React components with `client:load` for interactivity.

### Layouts

- `BaseLayout.astro` — HTML shell, theme (dark/light via localStorage), navbar, footer, client-side routing
- `DocsLayout.astro` — wraps BaseLayout, adds sidebar navigation, TOC, doc switcher

### Key Utilities

- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge), `defineExplainerConfig()`, `useDocumentation()` (builds doc tree, generates static paths, flattens docs)
- `explainer.config.ts` — central config for project metadata, social links, navbar items, content component mappings, 60+ language icon mappings

### Styling

- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Global CSS in `src/assets/css/global.css` — design tokens as CSS variables, OKLCH colors, dark mode via `.dark` class
- Markdown prose styling in `src/assets/css/markdown.css`
- Dark mode custom variant: `@custom-variant dark (&:is(.dark *))`

### Code Highlighting

Shiki with dual themes (github-light / catppuccin-frappe). Transformers: diff, highlight, focus, error level, line numbers. Custom `transformerMetaLabel` plugin adds label support to code blocks. The codeblock component maps 60+ languages to Iconify icons.

### Build Hooks

`src/hooks/build-doc.ts` — `buildDocIntegration` generates OG thumbnail images (Satori + Resvg) for all doc pages during `astro:build:done`.

### Deployment

- **Cloudflare Pages** via GitHub Actions (push/PR to main)
- **Docker** option: multi-stage build (Node 20 Alpine → Nginx 1.28.0 Alpine, port 8080)

## TypeScript

Extends `astro/tsconfigs/strict`. JSX configured for React (`react-jsx`). Strict null checks enabled.
