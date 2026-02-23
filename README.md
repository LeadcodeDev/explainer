# Explainer

A documentation framework built on Astro 5 and React 19. Write your docs in MDX, get a fast static site with built-in search, blog, SEO, and dark mode.

## Features

| Category      | Feature               | Description                                               |
| ------------- | --------------------- | --------------------------------------------------------- |
| Documentation | Multi-section docs    | Nested sidebar with collapsible sections and doc switcher |
| Documentation | Custom MDX directives | `::component{attr="value"}` syntax for rich content       |
| Documentation | 8+ MDX components     | Callout, Card, Code Group, Code Preview, Step, and more   |
| Documentation | Mermaid diagrams      | Rendered at build time via rehype-mermaid                 |
| Blog          | Full blog system      | Tags, drafts, author profiles, publication dates          |
| Blog          | RSS feed              | Auto-generated at `/rss.xml`                              |
| Navigation    | Integrated search     | Command palette (Cmd+K) with fuzzy filtering              |
| Navigation    | Instant transitions   | Astro View Transitions with persistent sidebar            |
| Navigation    | Breadcrumbs           | Auto-generated page hierarchy                             |
| Code          | Syntax highlighting   | Shiki dual-theme (light/dark) with 60+ language icons     |
| Code          | Code transformers     | Diff, line highlight, focus, word highlight, error levels |
| Theming       | Dark mode             | Light, dark, and system preference with localStorage      |
| Theming       | Tailwind CSS v4       | OKLCH color system with shadcn/ui components              |
| SEO           | Meta tags             | Open Graph, Twitter Cards, canonical URLs                 |
| SEO           | Sitemap               | Auto-generated via @astrojs/sitemap                       |
| SEO           | OG images             | Auto-generated at build time (Satori + Resvg)             |
| Accessibility | Standards             | Skip link, prefers-reduced-motion, keyboard navigation    |
| Accessibility | Custom 404            | Branded error page with navigation links                  |
| DX            | Linting & formatting  | Biome with strict TypeScript                              |
| DX            | CI/CD                 | GitHub Actions — lint, build, deploy to Cloudflare Pages  |
| DX            | Docker                | Multi-stage build with Nginx                              |

## Tech Stack

Astro 5 / React 19 / MDX / TypeScript / Tailwind CSS v4 / shadcn/ui + Radix UI / Shiki / Biome / Cloudflare Pages

## Getting Started

```sh
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321).

| Command         | Action                           |
| --------------- | -------------------------------- |
| `pnpm dev`      | Start dev server                 |
| `pnpm build`    | Build for production (`./dist/`) |
| `pnpm preview`  | Preview production build         |
| `pnpm lint`     | Check code with Biome            |
| `pnpm lint:fix` | Fix linting issues               |
| `pnpm format`   | Format code with Biome           |

## Configuration

All settings are centralized in `explainer.config.ts` via `defineExplainerConfig()`:

- **Project** — name, repository URL
- **SEO** — title, description, default thumbnail
- **Socials** — GitHub, Twitter, LinkedIn links
- **Blog** — default thumbnail, author profiles
- **Navbar** — custom navigation links
- **Content** — MDX component mappings, 60+ language icon mappings

## Deployment

**Cloudflare Pages** — Automatic via GitHub Actions on push to `main` (lint + build + deploy).

**Docker** — `docker build -t explainer . && docker run -p 8080:8080 explainer` (Node 20 Alpine + Nginx 1.28 Alpine).

## License

See [LICENSE](LICENSE) for details.
