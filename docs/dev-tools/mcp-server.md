---
title: MCP server
description: Connect Cursor, VS Code, Claude, Windsurf, and Zed to your Plane workspace. Create work items, manage cycles, search across projects — all through natural language.
keywords: plane, developer tools, integrations, extensions, mcp server, protocol, integration
---

# MCP server

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open standard that defines how AI applications discover and call external tools. Any client that speaks MCP can talk to any server that speaks MCP.

The Plane MCP Server is a bridge that lets AI models interact with Plane. It exposes Plane's full API surface as MCP tools, so your AI tool can create work items, manage sprints, track time, and organise work without you leaving your editor or chat interface.

## Transport modes

The server supports four transport modes. The right one depends on your deployment and usecase.

| Transport           | For                               | Auth method                | How to start             |
| ------------------- | --------------------------------- | -------------------------- | ------------------------ |
| HTTP with OAuth     | Plane Cloud users, simplest setup | Browser-based OAuth flow   | `plane-mcp-server http`  |
| HTTP with PAT Token | Automated workflows, CI/CD        | API key in request headers | `plane-mcp-server http`  |
| Local Stdio         | Local dev, self-hosted Plane      | Environment variables      | `plane-mcp-server stdio` |
| SSE (Legacy)        | Existing integrations             | Browser-based OAuth flow   | `plane-mcp-server http`  |

## Authentication model

The server has three authentication mechanisms, one per transport variant.

### OAuth auth (HTTP with OAuth, SSE)

For cloud deployments, the server acts as an **OAuth proxy** to Plane's OAuth system:

1. The MCP client redirects the user to the Plane OAuth authorization page
2. The user logs into Plane and grants access
3. Plane returns an OAuth token which the server validates by calling `/api/v1/users/me/`
4. Subsequent MCP requests carry this token, from which the server extracts the workspace slug

The server supports OAuth redirect URIs for all major MCP clients:
`cursor://`, `vscode://`, `vscode-insiders://`, `windsurf://`, `claude://`

### Header auth (HTTP with PAT Token)

For automated workflows, the MCP client sends two headers with every request:

- `x-api-key` - a Plane API token
- `x-workspace-slug` - the workspace identifier

The server validates the API key against Plane's `/api/v1/users/me/` endpoint on each request. No browser interaction required.

### Environment variable auth (stdio)

For stdio mode, credentials are read from environment variables at startup:

- `PLANE_API_KEY` - your Plane API token
- `PLANE_WORKSPACE_SLUG` - your workspace identifier
- `PLANE_BASE_URL` - API URL for self-hosted instances (defaults to `https://api.plane.so`)

## Identifier system

Plane uses two kinds of identifiers for work items.

- **Readable identifier** - human-friendly, e.g., `ENG-42`
  - Composed of the project identifier (`ENG`) and a sequence number (`42`)
  - Used in URLs, UI, and team communication

- **UUID** - machine-friendly, e.g., `3fa85f64-5717-4562-b3fc-2c963f66afa6`
  - Used by all other tools for `project_id`, `work_item_id`, `cycle_id`, etc.
  - Returned by every API response

---

## How-to guides

Plane hosts the MCP server for you at **`https://mcp.plane.so`**. If you run your own instance of the MCP server, replace `https://mcp.plane.so` with your own server's public URL (e.g., `https://mcp.yourcompany.com`) in all client config examples below.

### Prerequisites

**For all modes:**

- A Plane account with access to at least one workspace

**For stdio mode (local and self-hosted deployments)**

- Python 3.10+ installed (`python --version`)
- `uv` package manager (recommended). See [Installing uv](https://docs.astral.sh/uv/getting-started/installation/)

#### Get your API key (required for stdio and PAT token modes)

1. Open Plane and go to your workspace.
2. Generate a token. You can use either:
   - **Personal Access Token** - go to **Profile Settings → API Tokens**.
   - **Workspace Access Token** - go to **Workspace Settings → Access Tokens**.
3. Click **Add access token**, name it (e.g., "MCP Server"), click **Generate token**.
4. Copy the token as it will not be shown again.

#### Get your workspace slug

The slug is the short identifier in your Plane URL. For:

```
https://app.plane.so/acme-corp/
```

the slug is `acme-corp`.

### Claude Desktop

Config file: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows).

Quit Claude Desktop before editing, then relaunch and click the hammer icon (🔨) to confirm Plane tools are listed.

#### Stdio

Spawns the server as a local subprocess. Credentials come from environment variables.

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

#### HTTP with OAuth (via mcp-remote)

Claude Desktop doesn't support remote HTTP natively. Use `mcp-remote` — a local proxy that bridges Claude Desktop to Plane's cloud server. **Requires Node.js 18+.**

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

#### HTTP with PAT Token

Connects to the PAT endpoint using API key headers. No browser interaction required - suitable for shared team setups where users authenticate via their own API key.

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://mcp.plane.so/http/api-key/mcp",
      "type": "http",
      "headers": {
        "x-api-key": "your_api_key_here",
        "x-workspace-slug": "your-workspace-slug"
      }
    }
  }
}
```

#### SSE (Legacy)

For existing integrations already using the SSE transport.

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://mcp.plane.so/sse",
      "type": "sse"
    }
  }
}
```

---

### Claude Code (CLI)

Claude Code manages MCP servers via `claude mcp add` or `claude mcp add-json`. MCP configs are stored in `~/.claude.json` (user scope) or `.mcp.json` in your repo root (project scope) — **not** `.claude/settings.json`.

#### Stdio

```bash
claude mcp add plane \
  -e PLANE_API_KEY=your_api_key_here \
  -e PLANE_WORKSPACE_SLUG=your-workspace-slug \
  -e PLANE_BASE_URL=https://plane.yourcompany.com \
  -- uvx plane-mcp-server stdio
```

Add `--scope project` to write to `.mcp.json` (shared via git with your team) instead of `~/.claude.json` (your local copy).

#### HTTP with OAuth

```bash
claude mcp add --transport http plane https://mcp.plane.so/http/mcp
```

Claude Code will open a browser for the Plane OAuth flow. Run `/mcp` inside a session to re-authenticate if needed.

#### HTTP with PAT Token

```bash
claude mcp add-json plane '{
  "type": "http",
  "url": "https://mcp.plane.so/http/api-key/mcp",
  "headers": {
    "x-api-key": "your_api_key_here",
    "x-workspace-slug": "your-workspace-slug"
  }
}'
```

#### SSE (Legacy)

```bash
claude mcp add plane \
  --transport sse \
  --url https://mcp.plane.so/sse
```

Settings file equivalent:

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://mcp.plane.so/sse",
      "type": "sse"
    }
  }
}
```

Verify any configuration with:

```bash
claude mcp list
```

#### Using Plane in Claude Code sessions

```bash
claude

> Look up work item ENG-42 and implement what it describes.

> After fixing the bug, mark ENG-42 as done and log 90 minutes of work.

> Create work items for each TODO in src/auth.ts and add them to the current sprint.
```

---

### Claude.ai / Claude Chat (Web)

Claude.ai supports remote MCP servers for eligible plans. Because it runs in a browser it cannot spawn local processes, stdio is not available here.

#### HTTP with OAuth

**Pro / Max:**

1. Go to **Customize → Connectors** in Claude.ai.
2. Click **Add custom connector**.
3. Enter the server URL: `https://mcp.plane.so/http/mcp`
4. Claude.ai redirects you through the Plane OAuth flow.

**Team / Enterprise** (admins only): Go to **Organization settings → Connectors → Add custom connector** and use the same URL.

#### HTTP with PAT Token

If your Claude.ai plan supports custom headers in integrations:

- URL: `https://mcp.plane.so/http/api-key/mcp`
- Headers: `x-api-key: your_api_key_here`, `x-workspace-slug: your-workspace-slug`

#### SSE (Legacy)

- URL: `https://mcp.plane.so/sse`

---

### Cursor

Config file: `~/.cursor/mcp.json`

Open Cursor → **Settings** → search **MCP** → open the config file. Restart Cursor (`Cmd/Ctrl + Shift + P → Reload Window`) after saving.

#### Stdio

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

#### HTTP with OAuth

The `cursor://` redirect URI is registered natively in the OAuth provider.

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

#### HTTP with PAT Token

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://mcp.plane.so/http/api-key/mcp",
      "type": "http",
      "headers": {
        "x-api-key": "your_api_key_here",
        "x-workspace-slug": "your-workspace-slug"
      }
    }
  }
}
```

#### SSE (Legacy)

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://mcp.plane.so/sse",
      "type": "sse"
    }
  }
}
```

---

### VS Code

VS Code supports MCP through GitHub Copilot (requires a Copilot subscription). Open the Copilot chat panel (`Ctrl+Alt+I`), switch to **Agent** mode. The `vscode://` and `vscode-insiders://` redirect URIs are registered in the OAuth provider.

Config can be set at workspace level (`.vscode/mcp.json`) or user level (VS Code `settings.json` under the `"mcp"` key). Examples below use `.vscode/mcp.json`.

#### Stdio

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

#### HTTP with OAuth

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

#### HTTP with PAT Token

```json
{
  "servers": {
    "plane": {
      "url": "https://mcp.plane.so/http/api-key/mcp",
      "type": "http",
      "headers": {
        "x-api-key": "your_api_key_here",
        "x-workspace-slug": "your-workspace-slug"
      }
    }
  }
}
```

#### SSE (Legacy)

```json
{
  "servers": {
    "plane": {
      "url": "https://mcp.plane.so/sse",
      "type": "sse"
    }
  }
}
```

---

### Windsurf

Config file: `~/.codeium/windsurf/mcp_config.json`

Restart Windsurf after saving, then open the Cascade panel. The `windsurf://` redirect URI is registered in the OAuth provider.

::: warning
Windsurf uses `"serverUrl"` (not `"url"`) for remote HTTP servers.
:::

#### Stdio

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

#### HTTP with OAuth

```json
{
  "mcpServers": {
    "plane": {
      "serverUrl": "https://mcp.plane.so/http/mcp"
    }
  }
}
```

#### HTTP with PAT Token

```json
{
  "mcpServers": {
    "plane": {
      "serverUrl": "https://mcp.plane.so/http/api-key/mcp",
      "headers": {
        "x-api-key": "your_api_key_here",
        "x-workspace-slug": "your-workspace-slug"
      }
    }
  }
}
```

#### SSE (Legacy)

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://mcp.plane.so/sse",
      "type": "sse"
    }
  }
}
```

---

### Zed

Config file: `~/.config/zed/settings.json` under `"context_servers"`. Zed uses a different schema from other clients - the stdio command goes inside a `"command"` object with `"path"` instead of `"command"`.

#### Stdio

```json
{
  "context_servers": {
    "plane-mcp-server": {
      "command": {
        "path": "uvx",
        "args": ["plane-mcp-server", "stdio"],
        "env": {
          "PLANE_API_KEY": "your_api_key_here",
          "PLANE_WORKSPACE_SLUG": "your-workspace-slug",
          "PLANE_BASE_URL": "https://plane.yourcompany.com"
        }
      },
      "settings": {}
    }
  }
}
```

#### HTTP with OAuth

```json
{
  "context_servers": {
    "plane-mcp-server": {
      "url": "https://mcp.plane.so/http/mcp",
      "settings": {}
    }
  }
}
```

#### HTTP with PAT Token

```json
{
  "context_servers": {
    "plane-mcp-server": {
      "url": "https://mcp.plane.so/http/api-key/mcp",
      "headers": {
        "x-api-key": "your_api_key_here",
        "x-workspace-slug": "your-workspace-slug"
      },
      "settings": {}
    }
  }
}
```

#### SSE (Legacy)

```json
{
  "context_servers": {
    "plane-mcp-server": {
      "url": "https://mcp.plane.so/sse",
      "settings": {}
    }
  }
}
```

Open the AI panel (`Cmd + Shift + A`) to use Plane tools in conversation.

---

### Other clients (mcp-remote bridge)

Any MCP client that supports stdio but not remote HTTP can use `mcp-remote` as a proxy. It runs locally as a subprocess and forwards requests to `https://mcp.plane.so/http/mcp`, handling the OAuth flow on first run. **Requires Node.js 18+.**

```json
{
  "command": "npx",
  "args": ["mcp-remote@latest", "https://mcp.plane.so/http/mcp"]
}
```

## Self-hosted Plane deployments

Set `PLANE_BASE_URL` to the public URL of your Plane instance (e.g., https://plane.yourcompany.com). This is used for user-facing OAuth redirects and API calls in stdio mode.

In HTTP/SSE mode, the server also makes internal server-to-server calls to Plane for token validation. If your infrastructure routes internal traffic differently from public traffic (e.g., via a private network, service mesh, or internal load balancer), set `PLANE_INTERNAL_BASE_URL` to the internal address. When set, all server-to-server calls use this URL and only OAuth redirects use `PLANE_BASE_URL`.

If `PLANE_INTERNAL_BASE_URL` is not set, it falls back to PLANE_BASE_URL for all calls.

Before connecting a client, verify your credentials reach the instance:

```bash
curl -H "x-api-key: YOUR_API_KEY" \
  "https://plane.yourcompany.com/api/v1/users/me/"
```

A `200` response confirms the API key and URL are correct.

---

## Tool reference

See the [MCP Server Tool Reference](/dev-tools/mcp-server-tools) for a complete list of all 100+ tools — work items, projects, cycles, modules, worklogs, and more.

## Common workflows

### Look up a work item by ID

```
What is work item ENG-42 about?
```

Model calls `retrieve_work_item_by_identifier` with `project_identifier="ENG"` and `work_item_identifier="42"`.

### Create a work item

```
Create a high-priority bug in the ENG project called "Login times out on Safari".
Description: The OAuth callback redirects to a blank page on Safari 17+.
Assign it to me.
```

Model calls `list_projects` → `retrieve_work_item_by_identifier` (or `get_me` to resolve "me") → `create_work_item`.

### Update work item state

```
Mark ENG-88 as done and add a comment: "Fixed in commit abc1234, needs QA."
```

Model resolves the UUID, calls `list_states` to find the Done state UUID, calls `update_work_item` and `create_work_item_comment`.

### Sprint planning

```
Create a cycle called "Sprint 15" in ENG starting 2025-06-02, ending 2025-06-15.
Then move all incomplete issues from Sprint 14 into it.
```

Model calls `create_cycle` then `list_cycles` to find Sprint 14's UUID, then `transfer_cycle_work_items`.

### Log time

```
Log 90 minutes on ENG-42: "Implemented retry logic for the upload endpoint."
```

### Search across the workspace

```
Show me all high-priority bugs assigned to me that are still in progress.
```

Model calls `list_work_items` with filters `priorities=["high"]`, `state_groups=["started"]`, and the current user's UUID as `assignee_ids`.

### Manage a module

```
Add ENG-55, ENG-56, and ENG-57 to the "Checkout Redesign" module.
```

Model calls `list_modules` to find the UUID, then `add_work_items_to_module` with the resolved work item UUIDs.

---

## Troubleshooting

The server propagates errors from the Plane SDK as MCP tool errors.

| Scenario                          | HTTP Status | Cause                                   | Resolution                                          |
| --------------------------------- | ----------- | --------------------------------------- | --------------------------------------------------- |
| Invalid API key                   | 401         | `PLANE_API_KEY` is wrong or revoked     | Regenerate the token in Plane settings              |
| Invalid OAuth token               | 401         | Token expired or revoked                | Re-authorise through OAuth flow                     |
| Missing `x-workspace-slug` header | -           | Header auth missing workspace           | Include `x-workspace-slug` header                   |
| Wrong workspace slug              | 404         | Slug doesn't exist                      | Check the exact slug in your Plane URL              |
| Insufficient permissions          | 403         | User role too low                       | Check your role in the workspace/project            |
| Resource not found                | 404         | UUID or identifier doesn't exist        | Verify the ID; check if resource was deleted        |
| Validation error                  | 400         | Required field missing or invalid value | Check required fields and value constraints         |
| Redis unavailable                 | -           | Token storage down                      | Set `REDIS_HOST`/`REDIS_PORT` or omit for in-memory |
| Network error                     | -           | Cannot reach Plane API                  | Verify `PLANE_BASE_URL` and connectivity            |

**Verify connectivity (stdio/PAT):**

```bash
curl -H "x-api-key: YOUR_KEY" \
     "https://api.plane.so/api/v1/users/me/"
```

**Run stdio mode manually to debug startup:**

```bash
PLANE_API_KEY=your_key PLANE_WORKSPACE_SLUG=your-slug plane-mcp-server stdio
```

**Test the HTTP server is running:**

```bash
curl http://localhost:8211/http/mcp
# Should return MCP protocol response or 401
```

**Claude Code: enable debug logging:**

```bash
claude --mcp-debug
```

**Claude Code: re-authenticate OAuth:**

```bash
rm -rf ~/.mcp-auth
```

Restart Claude Code and run `/mcp` to authenticate again.

---

_Plane MCP Server is open source and licensed under MIT. Source at [github.com/makeplane/plane-mcp-server](https://github.com/makeplane/plane-mcp-server)._
