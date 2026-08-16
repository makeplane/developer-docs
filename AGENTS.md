# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Cursor, etc.) working in this repository. `CLAUDE.md` is a symlink to this file, so both resolve to the same content.

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
pnpm check:types          # Type-check the VitePress config and theme
pnpm check:anchors        # Verify every internal #anchor link resolves (VitePress only checks page links)
```

**CI checks on PRs** (to `master`): Prettier formatting, type-check, anchor check, and VitePress build must pass.

## Architecture

- **`docs/`** — All documentation content and VitePress config
  - **`docs/.vitepress/config.mts`** — Main VitePress config: navigation, sidebar structure, SEO, Algolia search, analytics. This is a large file that defines the entire site structure.
  - **`docs/.vitepress/theme/`** — Custom theme (extends `@voidzero-dev/vitepress-theme` via `extendConfig`) with Vue components and global styles
  - **`docs/api-reference/`** — REST API endpoint docs (180+ endpoints across 30+ resource categories)
  - **`docs/self-hosting/`** — Deployment and configuration guides
  - **`docs/dev-tools/`** — Webhooks, OAuth apps, agents, MCP server docs

### Directory structure

```text
docs/
  api-reference/        # REST API docs — 30+ resource categories (issues, cycles, modules, pages, etc.)
  dev-tools/            # Developer tooling guides
    agents/             # Agent development (overview, building, signals, best practices)
    build-plane-app/    # App development guide
    mcp-server.md       # MCP server setup
    mcp-server-claude-code.md  # MCP server with Claude Code
    plane-compose.md    # Plane Compose reference
    openapi-specification.md
    intro-webhooks.md
  self-hosting/         # Deployment and configuration guides (Commercial + Airgapped Editions are the hero paths)
    methods/            # Choose your install, prerequisites, Docker Compose, Kubernetes (+ values ref), AIO, Swarm,
                        # Podman, Coolify, Portainer, download-config, airgapped-*, FIPS, after-install
    community/          # Community Edition (open source): overview, docker-compose (setup.sh), kubernetes (plane-ce), manage
    govern/             # Auth, integrations, settings, SSL, DNS, env vars
      integrations/     # GitHub, GitLab, Slack, Sentry
      plane-ai/         # AI features configuration (configure-plane-ai, embedding models)
    manage/             # Backup/restore, Prime CLI, update Plane, logs, user management
    troubleshoot/       # CLI errors, installation, license, storage errors
```

## Key Documentation Paths

- `self-hosting/methods/overview.md` — "Choose your install" hub (Commercial + Airgapped hero, method matrix)
- `self-hosting/methods/prerequisites.md` / `after-install.md` — canonical before/after checklists every install page links to
- `self-hosting/methods/docker-compose.md` — Commercial Docker Compose (Prime CLI) guide
- `self-hosting/methods/kubernetes.md` + `kubernetes-values.md` — Commercial K8s guide and Helm values reference
- `self-hosting/methods/airgapped-*.md` — Airgapped Edition (overview, Docker, Kubernetes)
- `self-hosting/community/` — Community Edition guides (`setup.sh`, `plane-ce` chart, manage)
- `self-hosting/versions.md` + `docs/.vitepress/versions.ts` — versions per edition and the single source for version tokens
- `self-hosting/govern/integrations/` — GitHub, GitLab, Slack, Sentry
- `self-hosting/govern/plane-ai/` — AI features configuration (`configure-plane-ai.md`, `configure-embedding-model.md`, `aws-opensearch-embedding.md`)
- `self-hosting/govern/environment-variables.md` — All env var reference
- `self-hosting/govern/authentication.md` — Auth setup (LDAP, OIDC, SAML, OAuth)
- `self-hosting/govern/reverse-proxy.md` — Reverse proxy setup
- `self-hosting/manage/` — Instance management, backup/restore, Prime CLI
- `dev-tools/agents/` — Agent development docs
- `dev-tools/mcp-server.md` and `mcp-server-claude-code.md` — MCP server docs

## Custom Vue Components

Used directly in markdown files — defined in `docs/.vitepress/theme/components/`:

| Component              | Usage                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `<ApiParam>`           | API parameter with name, type, required badge, expandable details                                     |
| `<CodePanel>`          | Multi-language code tabs (cURL, Python, JavaScript)                                                   |
| `<ResponsePanel>`      | Syntax-highlighted API response JSON                                                                  |
| `<Card>`               | Feature card with icon, title, description                                                            |
| `<CardGroup cols="N">` | Responsive grid layout (2, 3, or 4 columns)                                                           |
| `<EditionBadge>`       | Edition/plan badges: `edition="commercial\|airgapped\|community"`, `plan="pro\|business\|enterprise"` |

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
- **Images**: Stored in `docs/public/images/`, referenced with absolute paths (`/images/...`)
- **Branch workflow**: Branch from `master`, use `fix/`, `feat/`, `docs/`, `update/` prefixes
- **Formatting**: Prettier enforced — 120 char width, 2-space indent, semicolons, double quotes, ES5 trailing commas
- **Sidebar updates**: When adding new pages, update the sidebar config in `docs/.vitepress/config.mts`
- **Redirects**: When moving or deleting a page, add a redirect in `vercel.json`

## Self-hosting docs conventions

- **Versions come from one place.** `docs/.vitepress/versions.ts` holds the current release numbers. In markdown, use the placeholders `%%COMMERCIAL_VERSION%%` (Commercial and Airgapped), `%%CE_VERSION%%` (Community), `%%HELM_EE_VERSION%%`, and `%%HELM_CE_VERSION%%`. They work in prose, inline code, code fences, and link targets, and are replaced at build time in the HTML, the `.md` mirror, and `llms*.txt`. Never hard-code a Plane version in a self-hosting page. When a release ships, bump `versions.ts` only.
- **Editions.** Commercial and Airgapped are the primary paths. Every install and config page starts with an "Edition availability" `::: info` callout and an `<EditionBadge>` in the H1. Community Edition content lives only under `docs/self-hosting/community/`, never as a `::: details Community Edition` fold inside a Commercial page. Commercial pages get a one-line pointer instead. Where a shared page differs by edition (for example, license activation), use `:::tabs key:edition` with `== Commercial {#commercial}` and `== Airgapped {#airgapped}`.
- **Install-page template.** Edition callout, then a one-paragraph intro (when to pick this method, how long it takes; no service lists, link to Plane architecture instead), then _Before you begin_ (link `/self-hosting/methods/prerequisites` plus the page's own additions), _Install_ (exact prompts and commands from the shipped installer), _Verify_, _After you install_ (link `/self-hosting/methods/after-install`, then the `::: tip` license activation callout so customers who bought a plan see how to activate it), _Manage_, and _Troubleshoot_.
- **Facts come from the installers.** Community steps must match the released `setup.sh` (`makeplane/plane`, `deployments/cli/community/install.sh`). Commercial steps must match the Prime installer (`prime.plane.so/install/`, `deployments/cli/commercial/*` in `plane-ee`) and the `plane-enterprise` chart. When `deployments/**` changes in those repos, update the matching page here.
- **Writing style.** Plain developer voice: short sentences, imperative steps, one idea per sentence. No em-dashes. State the command, what it does, and what to expect. Explain the reason only where it prevents a mistake.

## Important Notes

- Not all features are documented immediately after release
- API reference covers 30+ resource categories — check `docs/api-reference/` for the full list
- `self-hosting/govern/plane-ai/` is the correct location for AI configuration (the former `self-hosting/govern/plane-ai.md` was split into a directory)
