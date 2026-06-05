---
title: MCP Server
description: Connect Cursor, VS Code, Claude, Windsurf, and Zed to your Plane workspace. Create work items, manage cycles, search across projects — all through natural language.
keywords: plane, mcp server, ai, cursor, claude, vs code, windsurf, project management, mcp
---

# MCP Server

The Plane MCP Server lets AI tools interact with your Plane workspace through the [Model Context Protocol](https://modelcontextprotocol.io). Ask your AI tool to create work items, search across projects, plan sprints, or log time — it handles the API calls.

::: info Beta
The Plane MCP Server is in **Beta**. API surface may change. Send issues to support@plane.so.
:::

---

## Quick start (OAuth)

OAuth is the fastest path — browser login, no API key needed. Pick your client below.

### Cursor

Edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://mcp.plane.so/http/mcp",
      "type": "http"
    }
  }
}
```

Open **Settings → MCP** and restart Cursor to confirm Plane is listed.

### VS Code

Requires GitHub Copilot. Open Copilot chat (`Ctrl+Alt+I`) and switch to **Agent** mode.

Edit `.vscode/mcp.json` (workspace) or `settings.json` under `"mcp"` (user-level).

::: warning
VS Code uses `"servers"`, not `"mcpServers"`.
:::

```json
{
  "servers": {
    "plane": {
      "url": "https://mcp.plane.so/http/mcp",
      "type": "http"
    }
  }
}
```

### Windsurf

Edit `~/.codeium/windsurf/mcp_config.json`. Windsurf uses `serverUrl` (not `url`)
for remote HTTP servers.

```json
{
  "mcpServers": {
    "plane": {
      "serverUrl": "https://mcp.plane.so/http/mcp"
    }
  }
}
```

Restart Windsurf and open the Cascade panel.

### Zed

Edit `~/.config/zed/settings.json` under `"context_servers"`. With no `headers`, Zed prompts you for OAuth on first use.

```json
{
  "context_servers": {
    "plane-mcp-server": {
      "url": "https://mcp.plane.so/http/mcp"
    }
  }
}
```

Open the AI panel (`Cmd+Shift+A`) to use Plane tools.

### Claude Code

Run in your terminal:

```bash
claude mcp add --transport http plane https://mcp.plane.so/http/mcp
```

Start a session and run `/mcp` to authenticate via browser.

**Sharing with your team?** Add `--scope project` — writes to `.mcp.json` in your repo root so the whole team picks it up via git.

::: warning
MCP configs live in `~/.claude.json` or `.mcp.json` — **not** `.claude/settings.json`. Always use `claude mcp add` / `claude mcp add-json` so the CLI writes to the right file.
:::

### Claude Desktop

Claude Desktop doesn't support remote HTTP natively. Use `mcp-remote` — a local proxy
that bridges Claude Desktop to Plane's cloud server over Streamable HTTP.
**Requires Node.js 18+.**

Config file:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Quit Claude Desktop before editing, then relaunch and check the 🔨 icon.

```json
{
  "mcpServers": {
    "plane": {
      "command": "npx",
      "args": ["mcp-remote@latest", "https://mcp.plane.so/http/mcp"]
    }
  }
}
```

On first launch, `mcp-remote` opens a browser for the Plane OAuth flow.

::: tip No Node.js?
Use the SSE fallback instead: `"url": "https://mcp.plane.so/sse", "type": "sse"`.
:::

### Claude.ai

Available on eligible Claude.ai plans.

**Pro / Max:**

1. **Customize → Connectors → +** (add button)
2. **Add custom connector**
3. URL: `https://mcp.plane.so/http/mcp`
4. Complete the Plane OAuth flow in the browser.

**Team / Enterprise** (admins only): **Organization settings → Connectors → Add custom connector** with the same URL.

---

## PAT Token

Sends two headers with every request — no browser interaction. Use for CI/CD, shared team configs, automated scripts.

- `Authorization: Bearer <your_api_key>`
- `x-workspace-slug: <your_workspace_slug>`

**Prerequisites:**

- **API key** — In Plane: **Profile Settings → API Tokens** (personal) or **Workspace Settings → Access Tokens** (workspace-level). Click **Add token**, name it, **Generate**. Copy it now — it won't be shown again.
- **Workspace slug** — Found in your Plane URL. For `https://app.plane.so/acme-corp/`, the slug is `acme-corp`.

::: info Clients that don't support custom headers
**Claude Desktop** — use [Stdio](#stdio) instead.<br>
**Claude.ai** — use [OAuth](#claude-ai) instead (UI doesn't expose arbitrary headers).
:::

### Cursor

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://mcp.plane.so/http/api-key/mcp",
      "type": "http",
      "headers": {
        "Authorization": "Bearer your_api_key_here",
        "x-workspace-slug": "your-workspace-slug"
      }
    }
  }
}
```

### Windsurf

Windsurf uses `serverUrl` (not `url`) for remote HTTP servers.

```json
{
  "mcpServers": {
    "plane": {
      "serverUrl": "https://mcp.plane.so/http/api-key/mcp",
      "headers": {
        "Authorization": "Bearer your_api_key_here",
        "x-workspace-slug": "your-workspace-slug"
      }
    }
  }
}
```

### VS Code

```json
{
  "servers": {
    "plane": {
      "url": "https://mcp.plane.so/http/api-key/mcp",
      "type": "http",
      "headers": {
        "Authorization": "Bearer your_api_key_here",
        "x-workspace-slug": "your-workspace-slug"
      }
    }
  }
}
```

### Zed

```json
{
  "context_servers": {
    "plane-mcp-server": {
      "url": "https://mcp.plane.so/http/api-key/mcp",
      "headers": {
        "Authorization": "Bearer your_api_key_here",
        "x-workspace-slug": "your-workspace-slug"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add-json plane '{
  "type": "http",
  "url": "https://mcp.plane.so/http/api-key/mcp",
  "headers": {
    "Authorization": "Bearer your_api_key_here",
    "x-workspace-slug": "your-workspace-slug"
  }
}'
```

---

## Stdio

Runs `plane-mcp-server` locally per-client as a subprocess. Use when remote HTTP isn't an option —
air-gapped envs, local dev, or self-hosted Plane without a deployed MCP server.
Uses the same API key + workspace slug as [PAT](#pat-token).

**Prerequisites:** Python 3.10+ and `uvx` installed and available on your `PATH`.

| Variable               | Required | Description                                                           |
| ---------------------- | -------- | --------------------------------------------------------------------- |
| `PLANE_API_KEY`        | Yes      | API key from your workspace settings                                  |
| `PLANE_WORKSPACE_SLUG` | Yes      | Your workspace slug                                                   |
| `PLANE_BASE_URL`       | No       | API URL for self-hosted instances. Defaults to `https://api.plane.so` |

### Cursor / Windsurf

```json
{
  "mcpServers": {
    "plane": {
      "command": "uvx",
      "args": ["plane-mcp-server", "stdio"],
      "env": {
        "PLANE_API_KEY": "your_api_key_here",
        "PLANE_WORKSPACE_SLUG": "your-workspace-slug",
        "PLANE_BASE_URL": "https://plane.yourcompany.com"
      }
    }
  }
}
```

### VS Code

```json
{
  "servers": {
    "plane": {
      "command": "uvx",
      "args": ["plane-mcp-server", "stdio"],
      "env": {
        "PLANE_API_KEY": "your_api_key_here",
        "PLANE_WORKSPACE_SLUG": "your-workspace-slug",
        "PLANE_BASE_URL": "https://plane.yourcompany.com"
      }
    }
  }
}
```

### Zed

```json
{
  "context_servers": {
    "plane-mcp-server": {
      "command": "uvx",
      "args": ["plane-mcp-server", "stdio"],
      "env": {
        "PLANE_API_KEY": "your_api_key_here",
        "PLANE_WORKSPACE_SLUG": "your-workspace-slug",
        "PLANE_BASE_URL": "https://plane.yourcompany.com"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add plane \
  -e PLANE_API_KEY=your_api_key_here \
  -e PLANE_WORKSPACE_SLUG=your-workspace-slug \
  -e PLANE_BASE_URL=https://plane.yourcompany.com \
  -- uvx plane-mcp-server stdio
```

Add `--scope project` to write to `.mcp.json` (team-shared via git) instead of `~/.claude.json` (your local copy).

### Claude Desktop

```json
{
  "mcpServers": {
    "plane": {
      "command": "uvx",
      "args": ["plane-mcp-server", "stdio"],
      "env": {
        "PLANE_API_KEY": "your_api_key_here",
        "PLANE_WORKSPACE_SLUG": "your-workspace-slug",
        "PLANE_BASE_URL": "https://plane.yourcompany.com"
      }
    }
  }
}
```

---

## Other clients (mcp-remote bridge)

Any MCP client that supports stdio but not remote HTTP can use `mcp-remote` as a proxy bridge. It runs locally as a subprocess and forwards requests to `https://mcp.plane.so/http/mcp` over Streamable HTTP, handling the OAuth flow on first run.

**Requires Node.js 18+.**

| Setting   | Value                                             |
| --------- | ------------------------------------------------- |
| Command   | `npx`                                             |
| Arguments | `mcp-remote@latest https://mcp.plane.so/http/mcp` |

For clients with JSON config:

```json
{
  "command": "npx",
  "args": ["mcp-remote@latest", "https://mcp.plane.so/http/mcp"]
}
```

---

## Self-hosted Plane

If your Plane lives at something like `plane.yourcompany.com` instead of `app.plane.so`, point your client at it with `PLANE_BASE_URL` — drop it into any [Stdio](#stdio) config's `env` block.

Sanity-check before wiring up a client:

```bash
curl -H "x-api-key: YOUR_API_KEY" \
  "https://plane.yourcompany.com/api/v1/users/me/"
```

`200` = key + URL good.

::: tip Running your own MCP server too?
Whether your Plane is Cloud or self-hosted, you can skip `mcp.plane.so` and deploy `plane-mcp-server` yourself — Docker Compose, Helm, OAuth app setup: [Self-host MCP Server](/dev-tools/mcp-server-self-host).
:::

---

## Troubleshooting

| Symptom                             | Likely cause             | Fix                                                                                  |
| ----------------------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| `401 Unauthorized`                  | Wrong or revoked API key | Regenerate token in Plane settings                                                   |
| `401 Unauthorized`                  | Expired OAuth token      | Re-authenticate via OAuth flow                                                       |
| `403 Forbidden`                     | Insufficient role        | Check your role in the workspace or project                                          |
| `404 Not Found`                     | Wrong workspace slug     | Verify slug in your Plane URL                                                        |
| `404 Not Found`                     | UUID doesn't exist       | Check if the resource was deleted                                                    |
| `400 Validation error`              | Missing required field   | Check required params and value types                                                |
| Server not listed in Claude Desktop | Wrong transport type     | Use `npx mcp-remote@latest` or SSE — Claude Desktop doesn't support `"type": "http"` |
| Server config skipped               | JSON syntax error        | Validate JSON — check for trailing commas                                            |
| Connection timeout                  | Can't reach Plane API    | Verify `PLANE_BASE_URL` and network                                                  |

### Test Plane API connectivity

```bash
curl -H "x-api-key: YOUR_API_KEY" "https://api.plane.so/api/v1/users/me/"
```

### Debug Stdio startup

```bash
PLANE_API_KEY=your_key PLANE_WORKSPACE_SLUG=your-slug plane-mcp-server stdio
```

### Test local HTTP server

```bash
curl http://localhost:8211/http/mcp
# Expect: MCP protocol response or 401
```

### Claude Code: enable debug logging

```bash
claude --mcp-debug
```

### Claude Code: re-authenticate OAuth

```bash
rm -rf ~/.mcp-auth
```

Restart Claude Code and run `/mcp` to authenticate again.

---

**Related:**

- [MCP Server Tool Reference](/dev-tools/mcp-server-tools) — all 136 tools, parameters, example workflows
- [Self-host MCP Server](/dev-tools/mcp-server-self-host) — Docker, Helm, OAuth app setup

---

_Open source, MIT licensed. Source at [github.com/makeplane/plane-mcp-server](https://github.com/makeplane/plane-mcp-server)._
