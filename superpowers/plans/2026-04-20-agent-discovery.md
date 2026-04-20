# Agent Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add RFC 8288 `Link` response headers, markdown content negotiation, and `Content-Signal` directives to the Plane developer docs to improve agent/AI-crawler discovery.

**Architecture:** Three orthogonal changes on a VitePress-on-Vercel static site: (1) a single line added to `robots.txt`, (2) a `headers` block in `vercel.json`, (3) a build-time hook that copies source `.md` into `dist/` plus a Vercel `rewrites` block that routes `Accept: text/markdown` requests to the `.md` counterpart. No runtime logic; all deployment config.

**Tech Stack:** VitePress 1.6, Vercel static hosting, Node 20 `fs`/`path` APIs (already available via VitePress).

**Spec:** `superpowers/specs/2026-04-20-agent-discovery-design.md`

**Branch:** `feat/agent-discovery` off `master`.

**TDD note:** This repo has no JS test runner — tests for this work are *shell-level verifications*. Each task uses a "verify-first" pattern: run a check that fails, make the change, run the check again and verify it passes.

---

## File Structure

| File                                     | Action   | Responsibility                                                    |
| ---------------------------------------- | -------- | ----------------------------------------------------------------- |
| `docs/public/robots.txt`                 | Modify   | Declare Content Signal policy                                     |
| `vercel.json`                            | Modify   | Apply `Link` headers and `Accept`-conditional `rewrites`          |
| `docs/.vitepress/config.mts`             | Modify   | `buildEnd` hook that copies `.md` sources into `dist/`            |
| `superpowers/`                           | Delete   | Cleanup (last task) — spec and plan are ephemeral                 |

---

### Task 1: Create feature branch

**Files:** (none)

- [ ] **Step 1: Verify clean tree on `master`**

Run: `git status`
Expected: `nothing to commit, working tree clean` on branch `master`.

- [ ] **Step 2: Create and switch to feature branch**

Run: `git checkout -b feat/agent-discovery`
Expected: `Switched to a new branch 'feat/agent-discovery'`

---

### Task 2: Content Signals in `robots.txt`

**Files:**
- Modify: `docs/public/robots.txt`

- [ ] **Step 1: Verify directive absent (baseline)**

Run: `grep "Content-Signal" docs/public/robots.txt; echo "exit=$?"`
Expected: no match, `exit=1`

- [ ] **Step 2: Add the directive**

Edit `docs/public/robots.txt`. Find the block:

```
# Allow all search engines to crawl all content
User-agent: *
Allow: /

# Disallow crawling of search results (if any)
Disallow: /search
```

Insert a new block immediately after `Disallow: /search` and before the next comment:

```
# Content Signals — AI content usage preferences
# https://contentsignals.org/
Content-Signal: search=yes, ai-train=yes, ai-input=yes
```

- [ ] **Step 3: Verify directive present**

Run: `grep "Content-Signal: search=yes, ai-train=yes, ai-input=yes" docs/public/robots.txt`
Expected: one matching line printed.

- [ ] **Step 4: Commit**

```bash
git add docs/public/robots.txt
git commit -m "feat(robots): declare Content-Signal AI usage preferences"
```

---

### Task 3: Link response headers in `vercel.json`

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Verify no `headers` key today (baseline)**

Run: `grep -c '"headers"' vercel.json; echo "exit=$?"`
Expected: `0`, `exit=1`

- [ ] **Step 2: Add `headers` block**

Edit `vercel.json`. It currently has this shape:

```json
{
  "cleanUrls": true,
  "redirects": [ ... ]
}
```

Add a new top-level `"headers"` key directly after `"cleanUrls": true,` (before `"redirects"`):

```json
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Link",
          "value": "</llms.txt>; rel=\"describedby\"; type=\"text/plain\", </api-reference/introduction>; rel=\"service-doc\"; type=\"text/html\", </sitemap.xml>; rel=\"sitemap\"; type=\"application/xml\""
        }
      ]
    }
  ],
```

The `Link` value is a **single string** with three link-value entries separated by `", "` (comma-space). Escaped quotes are required per JSON.

- [ ] **Step 3: Verify JSON is still valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))" && echo OK`
Expected: `OK`

- [ ] **Step 4: Verify shape**

Run: `node -e "const j=JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log(j.headers[0].headers[0].value)"`
Expected: the exact `Link` header value, one line starting with `</llms.txt>; rel="describedby"...`.

- [ ] **Step 5: Commit**

```bash
git add vercel.json
git commit -m "feat(vercel): add Link response headers for agent discovery"
```

---

### Task 4: `buildEnd` hook to copy `.md` sources into `dist/`

**Files:**
- Modify: `docs/.vitepress/config.mts`

**Context on the target file:** `docs/.vitepress/config.mts` is 972 lines. The root shape is `export default withMermaid(defineConfig({ ... }))`. We add one new top-level property to the config object.

- [ ] **Step 1: Verify no `.md` files reach `dist/` today (baseline)**

Run: `pnpm build 2>&1 | tail -5 && find docs/.vitepress/dist -name '*.md' | head -5`
Expected: build succeeds; the `find` prints **nothing** (no `.md` files in `dist`).

- [ ] **Step 2: Add Node imports to top of `config.mts`**

Edit `docs/.vitepress/config.mts`. Find the existing import block at the top:

```ts
import { defineConfig, type HeadConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import { withMermaid } from "vitepress-plugin-mermaid";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
```

Change the `node:fs` import line to add the functions we need, and add `node:path` helpers:

```ts
import { readFileSync, readdirSync, statSync, mkdirSync, copyFileSync } from "node:fs";
import { resolve, join, relative, dirname } from "node:path";
```

- [ ] **Step 3: Add the `buildEnd` hook inside the config object**

Still editing `docs/.vitepress/config.mts`. Find `vite:` block near lines 61-77:

```ts
    vite: {
      optimizeDeps: {
        include: [
          "lucide-vue-next",
          ...
        ],
      },
    },
    title: "Plane developer documentation",
```

Insert a new `buildEnd` function between `vite: { ... },` and `title: "..."`:

```ts
    buildEnd(siteConfig) {
      // Copy source .md files into dist/ for Accept: text/markdown negotiation.
      const srcDir = siteConfig.srcDir;
      const outDir = siteConfig.outDir;

      function walk(dir: string): void {
        for (const entry of readdirSync(dir)) {
          if (entry === ".vitepress" || entry === "public" || entry === "node_modules") continue;
          const abs = join(dir, entry);
          const stat = statSync(abs);
          if (stat.isDirectory()) {
            walk(abs);
          } else if (stat.isFile() && abs.endsWith(".md")) {
            const rel = relative(srcDir, abs);
            const dest = join(outDir, rel);
            mkdirSync(dirname(dest), { recursive: true });
            copyFileSync(abs, dest);
          }
        }
      }

      walk(srcDir);
    },
```

**Why the skip list:** `.vitepress/` contains theme and config; `public/` files are already copied verbatim to `dist/` root by VitePress (so `llms.txt`, etc., are already there); `node_modules/` is a safety skip in case srcDir ever resolves to the repo root.

- [ ] **Step 4: Run build and verify `.md` files appear in `dist/`**

Run: `pnpm build 2>&1 | tail -5`
Expected: build succeeds, no errors.

Run: `find docs/.vitepress/dist -name '*.md' | wc -l`
Expected: a number `> 100` (Plane docs has 180+ endpoint pages plus self-hosting/dev-tools).

- [ ] **Step 5: Spot-check a specific page copied correctly**

Run: `test -f docs/.vitepress/dist/api-reference/introduction.md && head -5 docs/.vitepress/dist/api-reference/introduction.md`
Expected: file exists; first lines show frontmatter (e.g., `---`, `title:`).

Run: `diff docs/api-reference/introduction.md docs/.vitepress/dist/api-reference/introduction.md && echo "byte-identical"`
Expected: `byte-identical`

- [ ] **Step 6: Commit**

```bash
git add docs/.vitepress/config.mts
git commit -m "feat(build): copy source .md files to dist for agent markdown negotiation"
```

---

### Task 5: Vercel rewrite for `Accept: text/markdown`

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Verify no `rewrites` key today (baseline)**

Run: `node -e "const j=JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log('rewrites' in j ? 'PRESENT' : 'ABSENT')"`
Expected: `ABSENT`

- [ ] **Step 2: Add `rewrites` block**

Edit `vercel.json`. Add a new top-level `"rewrites"` key directly after `"redirects": [ ... ]` (at the end of the object, before the closing `}`).

The shape:

```json
  "rewrites": [
    {
      "source": "/:path*",
      "has": [
        { "type": "header", "key": "accept", "value": ".*text/markdown.*" }
      ],
      "destination": "/:path*.md"
    }
  ]
```

Make sure the `"redirects"` array ends with a `,` before `"rewrites"`.

- [ ] **Step 3: Verify JSON validity**

Run: `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))" && echo OK`
Expected: `OK`

- [ ] **Step 4: Verify final shape of `vercel.json`**

Run: `node -e "const j=JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log(JSON.stringify({cleanUrls:j.cleanUrls, headers:!!j.headers, redirects:j.redirects.length, rewrites:j.rewrites.length}))"`
Expected: `{"cleanUrls":true,"headers":true,"redirects":24,"rewrites":1}` (redirect count may vary — the key point is all four keys present).

- [ ] **Step 5: Commit**

```bash
git add vercel.json
git commit -m "feat(vercel): rewrite to .md when Accept: text/markdown"
```

---

### Task 6: Format check + full build verification

**Files:** (none)

- [ ] **Step 1: Run Prettier check**

Run: `pnpm check:format`
Expected: exits 0 with "All matched files use Prettier code style!" (or similar success message).

If it fails, run `pnpm fix:format` and re-run `pnpm check:format`. Then stage and commit any Prettier fixes as a separate commit: `style: format with prettier`.

- [ ] **Step 2: Full production build**

Run: `pnpm build`
Expected: build succeeds. Look for "build complete" / no error output in the tail.

- [ ] **Step 3: Confirm all three artifacts in `dist/`**

Run:
```bash
grep "Content-Signal" docs/.vitepress/dist/robots.txt && \
test -f docs/.vitepress/dist/api-reference/introduction.md && \
test -f docs/.vitepress/dist/api-reference/introduction.html && \
echo "ALL PRESENT"
```
Expected: `ALL PRESENT`

*Note on `Link` header: headers are a Vercel runtime behavior and cannot be validated locally — they require a preview deploy. The implementer should confirm on Vercel preview before merge, not here.*

---

### Task 7: Remove the ephemeral `superpowers/` folder

**Files:**
- Delete: `superpowers/` (entire directory — spec and plan)

- [ ] **Step 1: Verify folder exists**

Run: `ls superpowers/ && find superpowers -type f`
Expected: prints `specs/` and `plans/` subdirs plus two `.md` files.

- [ ] **Step 2: Remove the folder**

Run: `git rm -r superpowers/`
Expected: two files deleted from index.

- [ ] **Step 3: Verify removed**

Run: `test ! -d superpowers && echo "GONE"`
Expected: `GONE`

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove ephemeral agent-discovery spec and plan"
```

---

### Task 8: Push branch and open PR

**Files:** (none)

- [ ] **Step 1: Push branch**

Run: `git push -u origin feat/agent-discovery`
Expected: branch published, prints PR creation URL.

- [ ] **Step 2: Open PR against `preview`**

Per `CLAUDE.md`, PRs target `preview`, not `master`.

```bash
gh pr create --base preview --title "feat: agent discovery (Link headers, markdown negotiation, Content-Signal)" --body "$(cat <<'EOF'
## Summary

- Add `Content-Signal: search=yes, ai-train=yes, ai-input=yes` to `robots.txt`
- Add `Link` response headers on all paths advertising `llms.txt` (describedby), `/api-reference/introduction` (service-doc), and `/sitemap.xml` (sitemap)
- Serve source markdown when `Accept: text/markdown` is sent — static `.md` files copied into `dist` by a VitePress `buildEnd` hook, routed via a Vercel `rewrites` header matcher

## Test plan

Local:
- [ ] `pnpm check:format` passes
- [ ] `pnpm build` succeeds and produces `.md` files alongside `.html` in `dist/`
- [ ] `docs/.vitepress/dist/robots.txt` contains the `Content-Signal` line

Preview deploy:
- [ ] `curl -I https://<preview>.vercel.app/` shows a `Link:` header with all three relations
- [ ] `curl -H "Accept: text/markdown" https://<preview>.vercel.app/api-reference/introduction` returns markdown body and `Content-Type: text/markdown; charset=utf-8` (if plain text, add explicit header override — see spec contingency)
- [ ] Default `curl https://<preview>.vercel.app/` still returns HTML (regression check)
EOF
)"
```

Expected: PR URL printed.

---

## Post-Merge (out of scope for this plan)

After merge to `preview` and promotion to production:

1. Run the external audit (`isitagentready.com` or whichever tool flagged the original issues) against `https://developers.plane.so` to confirm all three findings are resolved.
2. If `Content-Type: text/markdown` is not returned (contingency in spec §Fix 3), add an explicit header override in a follow-up PR.
