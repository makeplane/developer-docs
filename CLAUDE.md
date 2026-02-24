# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Plane developer documentation site** built with **VitePress** (Vue 3-based static site generator). It covers REST API reference, self-hosting guides, and developer tools documentation for the Plane project management platform.

Live site: https://developers.plane.so

## Commands

```bash
pnpm install              # Install dependencies (use --frozen-lockfile in CI)
pnpm dev                  # Start dev server at http://localhost:5173
pnpm build                # Production build
pnpm preview              # Preview production build
pnpm check:format         # Check Prettier formatting
pnpm fix:format           # Auto-fix Prettier formatting
```

**CI checks on PRs** (to `preview` and `master`): Prettier formatting + VitePress build must pass.

## Architecture

- **`docs/`** — All documentation content and VitePress config
  - **`docs/.vitepress/config.mts`** — Main VitePress config: navigation, sidebar structure, SEO, Algolia search, analytics. This is a large file (~39KB) that defines the entire site structure.
  - **`docs/.vitepress/theme/`** — Custom theme with Vue components and global styles
  - **`docs/api-reference/`** — REST API endpoint docs (180+ endpoints across 25+ categories)
  - **`docs/self-hosting/`** — Deployment guides (Docker, Kubernetes, etc.)
  - **`docs/dev-tools/`** — Webhooks, OAuth apps, agents, MCP server docs

## Custom Vue Components

Used directly in markdown files — defined in `docs/.vitepress/theme/components/`:

| Component | Usage |
|-----------|-------|
| `<ApiParam>` | API parameter with name, type, required badge, expandable details |
| `<CodePanel>` | Multi-language code tabs (cURL, Python, JavaScript) |
| `<ResponsePanel>` | Syntax-highlighted API response JSON |
| `<Card>` | Feature card with icon, title, description |
| `<CardGroup cols="N">` | Responsive grid layout (2, 3, or 4 columns) |

## API Documentation Pattern

API endpoint pages follow a strict two-column layout pattern:

```markdown
<div class="api-two-column">
<div class="api-left">
  <!-- Parameters using <ApiParam> -->
</div>
<div class="api-right">
  <!-- Code examples using <CodePanel> + <ResponsePanel> -->
</div>
</div>
```

Each endpoint page: one file per endpoint, includes path/body params, OAuth scopes, and code examples in cURL/Python/JavaScript.

## Conventions

- **Frontmatter**: Every markdown page needs `title`, `description`, and `keywords` fields
- **Images**: Stored in `docs/.vitepress/public/images/`, referenced with absolute paths (`/images/...`)
- **Branch workflow**: Branch from `preview` (main branch), use `fix/`, `feat/`, `docs/`, `update/` prefixes
- **Formatting**: Prettier enforced — 120 char width, 2-space indent, semicolons, double quotes, ES5 trailing commas
- **Sidebar updates**: When adding new pages, update the sidebar config in `docs/.vitepress/config.mts`
