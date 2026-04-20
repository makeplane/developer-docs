# Agent Discovery Improvements — Design

**Date:** 2026-04-20
**Status:** Draft — pending user review
**Site:** developers.plane.so (VitePress static site on Vercel)

## Goal

Improve agent/AI-crawler discovery on the Plane developer docs by addressing three gaps flagged by an external audit:

1. No `Link` response headers advertising useful resources (RFC 8288).
2. No `Content-Type: text/markdown` negotiation for agents that prefer markdown.
3. No `Content-Signal` directives in `robots.txt` declaring AI usage preferences.

## Non-Goals

- Creating an OpenAPI spec or `/.well-known/api-catalog` (none exists today).
- Flattening or cleaning VitePress custom components (`<ApiParam>`, `<CodePanel>`, etc.) in the markdown output. Agents receive source markdown with those tags present.
- Changes to sidebar, navigation, or published content.
- Edge-runtime logic. The design stays fully static.

## Current State

- VitePress static site with source in `docs/`, build output in `docs/.vitepress/dist/`.
- Deployed on Vercel; config in `vercel.json` (already has `cleanUrls: true` and a `redirects` block).
- `docs/public/robots.txt` exists and declares a sitemap and a (non-standard) `LLMs-txt:` line.
- `docs/public/llms.txt` and `docs/public/llms-full.txt` already exist.
- No `/.well-known/` directory. No OpenAPI file.

## Design

### Fix 1 — Content Signals in `robots.txt`

Append a single directive to `docs/public/robots.txt`:

```
Content-Signal: search=yes, ai-train=yes, ai-input=yes
```

**Policy rationale:** Plane's existing posture (publishing `llms.txt` and `llms-full.txt`) is maximally open. The Content Signal matches that — search indexing, model training, and AI-answer grounding are all permitted.

Placement: directly below the `User-agent: *` / `Allow:` block, before the `Sitemap:` line. One line, no other changes.

### Fix 2 — `Link` response headers (RFC 8288)

Add a `headers` block to `vercel.json` applied to all paths. A single `Link` header carries three relations, comma-separated per RFC 8288 §3.5:

```
Link: </llms.txt>; rel="describedby"; type="text/plain",
      </api-reference/introduction>; rel="service-doc"; type="text/html",
      </sitemap.xml>; rel="sitemap"; type="application/xml"
```

**Why each relation:**
- `describedby` → `/llms.txt` — points agents to the LLM-friendly site map (canonical discovery).
- `service-doc` → `/api-reference/introduction` — registered IANA relation for human-readable API docs.
- `sitemap` → `/sitemap.xml` — widely supported, de facto standard.

Applied to `source: "/(.*)"` so the headers land on every page, not just the homepage. This lets any deep-link entry point still expose discovery metadata.

### Fix 3 — Markdown content negotiation (static approach)

Two pieces, both in files already owned by this repo:

**3a. Build hook in `docs/.vitepress/config.mts`**

Add a `buildEnd(siteConfig)` function that copies every source `.md` file from `siteConfig.srcDir` to the corresponding path under `siteConfig.outDir`, preserving directory structure. The hook:

- Walks `srcDir` recursively.
- Skips anything under `.vitepress/` (config/theme/cache/dist).
- For each `.md` file, computes the relative path and writes it into `outDir` at the same relative location, creating intermediate directories as needed.
- Preserves file contents byte-for-byte. Frontmatter and VitePress custom components (`<ApiParam>`, `<CodePanel>`, etc.) are included verbatim — acknowledged limitation.

Result: after `pnpm build`, `dist/api-reference/introduction.md` exists alongside `dist/api-reference/introduction.html`.

**3b. Vercel rewrite in `vercel.json`**

Add a `rewrites` block that matches on the `Accept` header:

```json
{
  "rewrites": [
    {
      "source": "/:path*",
      "has": [{ "type": "header", "key": "accept", "value": ".*text/markdown.*" }],
      "destination": "/:path*.md"
    }
  ]
}
```

Vercel's default MIME mapping serves `.md` files as `text/markdown; charset=utf-8`. If preview-deployment testing shows a different `Content-Type` (e.g., `text/plain`), add an explicit header override to `vercel.json` for `source: "/(.*).md"` setting `Content-Type: text/markdown; charset=utf-8`. This is the only identified contingency.

Interaction with existing `cleanUrls: true`: `cleanUrls` strips `.html` from URLs; the `.md` rewrite only fires when the `Accept` header matches, so browsers still get HTML via the default behavior. The two directives don't conflict — `rewrites` run before `cleanUrls` resolution.

### Known Limitations (accepted)

- **Raw frontmatter in markdown responses.** Agents will see the YAML frontmatter block at the top of each page. Most agent parsers tolerate this.
- **VitePress components in markdown responses.** Pages using `<ApiParam>`, `<CodePanel>`, `<ResponsePanel>`, `<Card>`, `<CardGroup>` will return those tags literally. Prose content is still machine-readable; component-rendered detail (e.g., parameter type badges) is not flattened.
- **No content-type validation at build time.** If a page has no source `.md` (unlikely in VitePress), the rewrite returns a 404; the HTML version remains available for normal requests.

## File Changes (summary)

| File                                     | Change                                                             |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `docs/public/robots.txt`                 | Add one `Content-Signal:` line                                     |
| `vercel.json`                            | Add `headers` block (Fix 2) and `rewrites` block (Fix 3b)          |
| `docs/.vitepress/config.mts`             | Add `buildEnd` hook that copies `.md` files into `dist` (Fix 3a)   |

No new dependencies. No new directories.

## Testing

**Local (before merge):**

- `pnpm build` — verify no errors, then check that `docs/.vitepress/dist/` contains `.md` copies (spot-check `dist/api-reference/introduction.md`).
- `pnpm check:format` — Prettier must pass.

**On Vercel preview deployment:**

- `curl -I https://<preview>.vercel.app/` — verify the `Link:` response header is present and contains all three relations.
- `curl -H "Accept: text/markdown" https://<preview>.vercel.app/api-reference/introduction` — verify the body is markdown and `Content-Type: text/markdown; charset=utf-8`.
- `curl https://<preview>.vercel.app/` (no custom Accept) — verify HTML is still returned (regression check).
- `curl https://<preview>.vercel.app/robots.txt | grep Content-Signal` — verify the directive is present.

**Rationale for preview-only testing:** `pnpm preview` serves VitePress's built output directly and does not run Vercel's `rewrites` / `headers` engine. The header negotiation can only be validated on a Vercel deployment.

## Rollout

1. Implement all three fixes in a single PR branch (`feat/agent-discovery`).
2. Push, let Vercel preview build, run the `curl` checks above against the preview URL.
3. Merge to `master`; Vercel promotes to production.
4. Re-run `isitagentready.com` (or the source audit) against production to confirm the three issues are resolved.

## Post-Implementation

Once the implementation PR is merged and verified in production, **delete the `superpowers/` directory** from the repo — the spec is ephemeral and does not belong in the long-lived tree.
