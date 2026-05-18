---
title: MCP server
description: Setup MCP Server for Plane. Integrate Plane with Model Context Protocol for AI-powered project management.
keywords: plane, developer tools, integrations, extensions, mcp server, protocol, integration
---

# MCP server

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open standard that defines how AI applications discover and call external tools. Any client that speaks MCP can talk to any server that speaks MCP.

The Plane MCP Server is a bridge that lets AI models interact with Plane. It exposes Plane's full API surface as MCP tools, so your AI tool can create work items, manage sprints, track time, and organise work without you leaving your editor or chat interface.

## Transport modes

The server supports four transport modes. The right one depends on your deployment and usecase.

| Transport | For | Auth method | How to start |
|-----------|----------|-------------|--------------|
| HTTP with OAuth | Plane Cloud users, simplest setup | Browser-based OAuth flow | `plane-mcp-server http` |
| HTTP with PAT Token | Automated workflows, CI/CD | API key in request headers | `plane-mcp-server http` |
| Local Stdio | Local dev, self-hosted Plane | Environment variables | `plane-mcp-server stdio` |
| SSE (Legacy) | Existing integrations | Browser-based OAuth flow | `plane-mcp-server http` |

## Authentication model

The server has three authentication mechanisms, one per transport variant.

### OAuth auth (HTTP with OAuth, SSE)

For cloud deployments, the server acts as an **OAuth proxy** to Plane's OAuth system:

1. The MCP client redirects the user to the Plane OAuth authorization page
2. The user logs into Plane and grants access
3. Plane returns an OAuth token which the server validates by calling `/api/v1/users/me/`
4. Subsequent MCP requests carry this token, from which the server extracts the workspace slug

The server supports OAuth redirect URIs for all major MCP clients:
- `http://localhost:*` (dynamic ports from desktop clients)
- `cursor://`, `vscode://`, `vscode-insiders://`, `windsurf://`, `claude://`

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

Config file: `/claude_desktop_config.json`.

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

#### HTTP with OAuth

Connects to a remote MCP server. Claude Desktop opens a browser window for the Plane OAuth flow on first use.

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://your-mcp-server.com/http/mcp",
      "type": "http"
    }
  }
}
```

#### HTTP with PAT Token

Connects to the PAT endpoint using API key headers. No browser interaction required - suitable for shared team setups where users authenticate via their own API key.

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://your-mcp-server.com/http/api-key/mcp",
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
      "url": "https://your-mcp-server.com/sse",
      "type": "sse"
    }
  }
}
```

---

### Claude Code (CLI)

Claude Code manages MCP servers via `claude mcp add` or a settings file.

#### Stdio

```bash
claude mcp add plane \
  -e PLANE_API_KEY=your_api_key_here \
  -e PLANE_WORKSPACE_SLUG=your-workspace-slug \
  -e PLANE_BASE_URL=https://plane.yourcompany.com \
  -- uvx plane-mcp-server stdio
```

Settings file (`.claude/settings.json` for project scope, `~/.claude/settings.json` for user scope):

```json
{
  "mcpServers": {
    "plane": {
      "command": "uvx",
      "args": ["plane-mcp-server", "stdio"],
      "env": {
        "PLANE_API_KEY": "your_api_key_here",
        "PLANE_WORKSPACE_SLUG": "your-workspace-slug"
      }
    }
  }
}
```

#### HTTP with OAuth

```bash
claude mcp add plane \
  --transport http \
  --url https://your-mcp-server.com/http/mcp
```

Claude Code will open a browser for the Plane OAuth flow. Settings file equivalent:

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://your-mcp-server.com/http/mcp",
      "type": "http"
    }
  }
}
```

#### HTTP with PAT Token

```bash
claude mcp add plane \
  --transport http \
  --url https://your-mcp-server.com/http/api-key/mcp \
  --header "x-api-key: your_api_key_here" \
  --header "x-workspace-slug: your-workspace-slug"
```

Settings file equivalent:

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://your-mcp-server.com/http/api-key/mcp",
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

```bash
claude mcp add plane \
  --transport sse \
  --url https://your-mcp-server.com/sse
```

Settings file equivalent:

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://your-mcp-server.com/sse",
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

1. Go to **Settings → Integrations** in Claude.ai.
2. Click **Add Integration**.
3. Enter the server URL: `https://your-mcp-server.com/http/mcp`
4. Claude.ai redirects you through the Plane OAuth flow.

#### HTTP with PAT Token

If your Claude.ai plan supports custom headers in integrations:

- URL: `https://your-mcp-server.com/http/api-key/mcp`
- Headers: `x-api-key: your_api_key_here`, `x-workspace-slug: your-workspace-slug`

#### SSE (Legacy)

- URL: `https://your-mcp-server.com/sse`

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
      "url": "https://your-mcp-server.com/http/mcp",
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
      "url": "https://your-mcp-server.com/http/api-key/mcp",
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
      "url": "https://your-mcp-server.com/sse",
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
      "url": "https://your-mcp-server.com/http/mcp",
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
      "url": "https://your-mcp-server.com/http/api-key/mcp",
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
      "url": "https://your-mcp-server.com/sse",
      "type": "sse"
    }
  }
}
```

---

### Windsurf

Config file: `~/.codeium/windsurf/mcp_config.json`

Restart Windsurf after saving, then open the Cascade panel. The `windsurf://` redirect URI is registered in the OAuth provider.

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
      "url": "https://your-mcp-server.com/http/mcp",
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
      "url": "https://your-mcp-server.com/http/api-key/mcp",
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
      "url": "https://your-mcp-server.com/sse",
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
      "url": "https://your-mcp-server.com/http/mcp",
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
      "url": "https://your-mcp-server.com/http/api-key/mcp",
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
      "url": "https://your-mcp-server.com/sse",
      "settings": {}
    }
  }
}
```

Open the AI panel (`Cmd + Shift + A`) to use Plane tools in conversation.

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

## Reference

### Transport modes

#### HTTP with OAuth

| Property | Value |
|----------|-------|
| Start command | `plane-mcp-server http` |
| MCP endpoint | `http://host:8211/http/mcp` |
| Auth | Browser OAuth flow via Plane |
| Token storage | Redis (recommended) or in-memory |
| OAuth redirect URIs | `cursor://`, `vscode://`, `windsurf://`, `claude://`, `http://localhost:*` |
| Required env vars | `PLANE_OAUTH_PROVIDER_CLIENT_ID`, `PLANE_OAUTH_PROVIDER_CLIENT_SECRET`, `PLANE_OAUTH_PROVIDER_BASE_URL`, `PLANE_BASE_URL` |

#### HTTP with PAT Token

| Property | Value |
|----------|-------|
| Start command | `plane-mcp-server http` (same process) |
| MCP endpoint | `http://host:8211/http/api-key/mcp` |
| Auth | `x-api-key` + `x-workspace-slug` HTTP headers |
| Token storage | None (stateless) |
| Required env vars | None (credentials come from request headers) |

The PAT endpoint validates the API key against Plane's `/api/v1/users/me/` on each request.

#### Local Stdio

| Property | Value |
|----------|-------|
| Start command | `plane-mcp-server stdio` |
| Transport | stdin/stdout (JSON-RPC 2.0) |
| Auth | `PLANE_API_KEY` + `PLANE_WORKSPACE_SLUG` env vars |
| Process lifecycle | One process per client session |
| Required env vars | `PLANE_API_KEY`, `PLANE_WORKSPACE_SLUG` |

#### SSE (Legacy)

| Property | Value |
|----------|-------|
| Start command | `plane-mcp-server http` (same process) |
| MCP endpoint | `http://host:8211/sse` |
| Auth | Browser OAuth flow via Plane |
| Token storage | Redis (recommended) or in-memory |
| Required env vars | Same as HTTP with OAuth |

Use SSE only for clients that require it. New integrations should prefer streamable HTTP.

---

### Tool reference

The server exposes 100+ tools across 20 modules. All tools are registered identically regardless of transport mode. The same tools are available via stdio, HTTP/OAuth, HTTP/PAT, and SSE.

#### Users

##### `get_me`
Returns the profile of the currently authenticated user. No parameters.

---

#### Workspaces

##### `get_workspace_members`
Returns all members of the workspace.

##### `get_workspace_features`
Returns enabled features for the workspace.

##### `update_workspace_features`
Updates workspace-level feature flags.

---

#### Projects

##### `list_projects`
Returns all projects the current user is a member of.

##### `create_project`
Creates a new project.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | **Yes** | Project display name |
| `identifier` | string | **Yes** | Short uppercase code, max 12 chars (e.g., `ENG`) |
| `description` | string | No | Project description |
| `network` | string | No | `0` (secret) or `2` (public) |

##### `retrieve_project`
Returns details of a single project.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |

##### `update_project`
Updates project fields. All fields are optional.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| other fields | partial | No |

##### `delete_project`
Deletes a project.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |

##### `get_project_worklog_summary`
Returns time-tracking summary for a project.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |

##### `get_project_members`
Returns all members of a project.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |

##### `get_project_features`
Returns the feature configuration for a project (modules, cycles, pages, etc.).

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |

##### `update_project_features`
Updates which features are enabled on a project.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| feature fields | partial | No |

---

#### Work Items

##### `list_work_items`
Lists work items in a project, or searches across the workspace when filters are provided.

When any filter parameter is set, the tool uses Plane's advanced search endpoint (supports workspace-wide search). Without filters it uses the standard paginated list endpoint.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | UUID string | Conditional | Required when no filters are provided |
| `query` | string | No | Free-text search across name and description |
| `assignee_ids` | UUID[] | No | Filter by assignee |
| `state_ids` | UUID[] | No | Filter by state |
| `state_groups` | string[] | No | `backlog` · `unstarted` · `started` · `completed` · `cancelled` |
| `priorities` | string[] | No | `urgent` · `high` · `medium` · `low` · `none` |
| `label_ids` | UUID[] | No | Filter by label |
| `type_ids` | UUID[] | No | Filter by work item type |
| `cycle_ids` | UUID[] | No | Filter by cycle |
| `module_ids` | UUID[] | No | Filter by module |
| `is_archived` | boolean | No | Filter by archived status |
| `created_by_ids` | UUID[] | No | Filter by creator |
| `workspace_search` | boolean | No | Search across all projects (requires filters) |
| `limit` | integer | No | Max results when using filters |
| `cursor` | string | No | Pagination cursor (list mode) |
| `per_page` | integer | No | Results per page, 1–100 (list mode) |
| `expand` | string | No | Comma-separated fields to expand |
| `fields` | string | No | Comma-separated fields to include |
| `order_by` | string | No | Sort field |

##### `create_work_item`
Creates a new work item in a project.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | UUID string | **Yes** | Target project |
| `name` | string | **Yes** | Work item title |
| `description_html` | string | No | HTML body |
| `state_id` | UUID string | No | Initial state |
| `priority` | string | No | `urgent` · `high` · `medium` · `low` · `none` |
| `assignee_ids` | UUID[] | No | Assigned members |
| `label_ids` | UUID[] | No | Labels |
| `type_id` | UUID string | No | Work item type |
| `parent_id` | UUID string | No | Parent work item (sub-item) |
| `start_date` | string | No | `YYYY-MM-DD` |
| `due_date` | string | No | `YYYY-MM-DD` |

##### `retrieve_work_item`
Returns a single work item by UUID.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |

##### `retrieve_work_item_by_identifier`
Returns a work item using its human-readable identifier (e.g., `ENG-42`).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_identifier` | string | **Yes** | Project prefix, e.g., `ENG` |
| `work_item_identifier` | string | **Yes** | Issue number, e.g., `42` |

##### `update_work_item`
Updates one or more fields on a work item. Only supplied fields are changed.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |
| other fields | partial | No |

##### `delete_work_item`
Permanently deletes a work item.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |

##### `search_work_items`
Searches work items by text query within a project.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | UUID string | **Yes** | |
| `query` | string | **Yes** | Search text |

---

#### Work Item Activities

##### `list_work_item_activities`
Returns the activity log (history of changes) for a work item.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |

##### `retrieve_work_item_activity`
Returns a single activity entry.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |
| `activity_id` | UUID string | **Yes** |

---

#### Work Item Comments

##### `list_work_item_comments`
Returns all comments on a work item.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |

##### `retrieve_work_item_comment`
Returns a single comment.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |
| `comment_id` | UUID string | **Yes** |

##### `create_work_item_comment`
Adds a comment to a work item. Comments are stored as HTML.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | UUID string | **Yes** | |
| `work_item_id` | UUID string | **Yes** | |
| `comment_html` | string | **Yes** | HTML content, e.g., `<p>Fixed in commit abc123</p>` |

##### `update_work_item_comment`
Updates a comment's content.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |
| `comment_id` | UUID string | **Yes** |
| `comment_html` | string | **Yes** |

##### `delete_work_item_comment`
Deletes a comment.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |
| `comment_id` | UUID string | **Yes** |

---

#### Work Item Links

External URLs attached to a work item (e.g., Figma designs, PRs, docs).

##### `list_work_item_links`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |

##### `retrieve_work_item_link`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |
| `link_id` | UUID string | **Yes** |

##### `create_work_item_link`
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | UUID string | **Yes** | |
| `work_item_id` | UUID string | **Yes** | |
| `url` | string | **Yes** | External URL |
| `title` | string | No | Display title for the link |

##### `update_work_item_link`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |
| `link_id` | UUID string | **Yes** |
| `url` / `title` | string | No |

##### `delete_work_item_link`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |
| `link_id` | UUID string | **Yes** |

---

#### Work Item Relations

Relations between work items (e.g., "blocks", "is blocked by", "duplicate of").

##### `list_work_item_relations`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |

##### `create_work_item_relation`
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | UUID string | **Yes** | |
| `work_item_id` | UUID string | **Yes** | Source work item |
| `related_work_item_id` | UUID string | **Yes** | Target work item |
| `relation_type` | string | **Yes** | `blocking` · `blocked_by` · `duplicate_of` · `duplicate` · `relates_to` |

##### `remove_work_item_relation`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |
| `relation_id` | UUID string | **Yes** |

---

#### Work Item Properties

Custom fields defined per project.

##### `list_work_item_properties`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |

##### `create_work_item_property`
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | UUID string | **Yes** | |
| `name` | string | **Yes** | Property name |
| `property_type` | string | **Yes** | Type of the custom field |

##### `retrieve_work_item_property`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `property_id` | UUID string | **Yes** |

##### `update_work_item_property`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `property_id` | UUID string | **Yes** |

##### `delete_work_item_property`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `property_id` | UUID string | **Yes** |

---

#### Work Item Types

Custom work item type definitions (e.g., Bug, Feature, Task, Epic).

##### `list_work_item_types`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |

##### `create_work_item_type`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `name` | string | **Yes** |
| `description` | string | No |
| `is_active` | boolean | No |

##### `retrieve_work_item_type`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `type_id` | UUID string | **Yes** |

##### `update_work_item_type`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `type_id` | UUID string | **Yes** |

##### `delete_work_item_type`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `type_id` | UUID string | **Yes** |

---

#### Worklogs

Time tracking for work items. All durations are in **minutes**.

##### `list_work_logs`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |

##### `create_work_log`
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | UUID string | **Yes** | |
| `work_item_id` | UUID string | **Yes** | |
| `duration` | integer | **Yes** | Minutes logged (≥ 0) |
| `description` | string | No | What was done |

##### `update_work_log`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |
| `work_log_id` | UUID string | **Yes** |
| `duration` / `description` | - | No |

##### `delete_work_log`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |
| `work_log_id` | UUID string | **Yes** |

---

#### States

Workflow states for a project's work items.

##### `list_states` / `create_state` / `retrieve_state` / `update_state` / `delete_state`

All state tools accept `project_id`. Create and update accept:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **Yes** (create) | Display name |
| `color` | string | **Yes** (create) | Hex color code, e.g., `#FF5733` |
| `group` | string | **Yes** (create) | `backlog` · `unstarted` · `started` · `completed` · `cancelled` |
| `description` | string | No | |

---

#### Labels

Tags for work items.

##### `list_labels` / `create_label` / `retrieve_label` / `update_label` / `delete_label`

All label tools accept `project_id`. Create and update accept:

| Field | Type | Required |
|-------|------|----------|
| `name` | string | **Yes** (create) |
| `color` | string | **Yes** (create) |
| `parent` | UUID string | No |

---

#### Cycles

Time-boxed iterations (sprints).

##### `list_cycles`
Returns all cycles in a project including upcoming, active, and completed.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |

##### `list_archived_cycles`
Returns archived cycles only.

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |

##### `create_cycle`
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | UUID string | **Yes** | |
| `name` | string | **Yes** | Cycle name |
| `start_date` | string | No | `YYYY-MM-DD` |
| `end_date` | string | No | `YYYY-MM-DD` |
| `description` | string | No | |

##### `retrieve_cycle`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `cycle_id` | UUID string | **Yes** |

##### `update_cycle` / `delete_cycle`
Accept `project_id` and `cycle_id`.

##### `add_work_items_to_cycle`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `cycle_id` | UUID string | **Yes** |
| `work_item_ids` | UUID[] | **Yes** |

##### `remove_work_item_from_cycle`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `cycle_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |

##### `list_cycle_work_items`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `cycle_id` | UUID string | **Yes** |

##### `transfer_cycle_work_items`
Moves all incomplete work items from one cycle to another.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | UUID string | **Yes** | |
| `cycle_id` | UUID string | **Yes** | Source cycle |
| `new_cycle_id` | UUID string | **Yes** | Target cycle |

---

#### Modules

Feature groupings within a project.

##### `list_modules` / `list_archived_modules`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |

##### `create_module`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `name` | string | **Yes** |
| `description` | string | No |
| `start_date` | string | No |
| `target_date` | string | No |
| `lead` | UUID string | No |
| `members` | UUID[] | No |

##### `retrieve_module` / `update_module` / `delete_module` / `archive_module`
Accept `project_id` and `module_id`.

##### `add_work_items_to_module`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `module_id` | UUID string | **Yes** |
| `work_item_ids` | UUID[] | **Yes** |

##### `remove_work_item_from_module`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `module_id` | UUID string | **Yes** |
| `work_item_id` | UUID string | **Yes** |

##### `list_module_work_items`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `module_id` | UUID string | **Yes** |

---

#### Epics

Large work items that group related items. The server resolves the Epic work item type automatically.

##### `list_epics` / `create_epic` / `retrieve_epic` / `update_epic` / `delete_epic`

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `epic_id` | UUID string | Varies by operation |
| name, description, etc. | - | Varies |

---

#### Milestones

Point-in-time goals within a project.

##### `list_milestones` / `create_milestone` / `retrieve_milestone` / `update_milestone` / `delete_milestone`

| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `milestone_id` | UUID string | Varies |
| `name` | string | **Yes** (create) |

##### `add_work_items_to_milestone`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `milestone_id` | UUID string | **Yes** |
| `work_item_ids` | UUID[] | **Yes** |

##### `remove_work_items_from_milestone`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `milestone_id` | UUID string | **Yes** |
| `work_item_ids` | UUID[] | **Yes** |

##### `list_milestone_work_items`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `milestone_id` | UUID string | **Yes** |

---

#### Initiatives

Workspace-scoped strategic goals that span multiple projects.

##### `list_initiatives` / `create_initiative` / `retrieve_initiative` / `update_initiative` / `delete_initiative`

Initiatives are workspace-scoped - no `project_id` required. `retrieve_initiative`, `update_initiative`, and `delete_initiative` accept an `initiative_id` UUID.

---

#### Intake

Triage queue for incoming work items before they enter a project.

##### `list_intake_work_items`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |

##### `create_intake_work_item`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `name` | string | **Yes** |
| `description_html` | string | No |

##### `retrieve_intake_work_item` / `update_intake_work_item` / `delete_intake_work_item`
Accept `project_id` and `work_item_id`.

---

#### Pages

Wiki-style documents. Pages can be workspace-scoped or project-scoped.

##### `retrieve_workspace_page`
| Parameter | Type | Required |
|-----------|------|----------|
| `page_id` | UUID string | **Yes** |

##### `retrieve_project_page`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `page_id` | UUID string | **Yes** |

##### `create_workspace_page`
| Parameter | Type | Required |
|-----------|------|----------|
| `name` | string | **Yes** |
| `description_html` | string | No |

##### `create_project_page`
| Parameter | Type | Required |
|-----------|------|----------|
| `project_id` | UUID string | **Yes** |
| `name` | string | **Yes** |
| `description_html` | string | No |

---

## Common Workflows

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

| Scenario | HTTP Status | Cause | Resolution |
|----------|-------------|-------|------------|
| Invalid API key | 401 | `PLANE_API_KEY` is wrong or revoked | Regenerate the token in Plane settings |
| Invalid OAuth token | 401 | Token expired or revoked | Re-authorise through OAuth flow |
| Missing `x-workspace-slug` header | - | Header auth missing workspace | Include `x-workspace-slug` header |
| Wrong workspace slug | 404 | Slug doesn't exist | Check the exact slug in your Plane URL |
| Insufficient permissions | 403 | User role too low | Check your role in the workspace/project |
| Resource not found | 404 | UUID or identifier doesn't exist | Verify the ID; check if resource was deleted |
| Validation error | 400 | Required field missing or invalid value | Check required fields and value constraints |
| Redis unavailable | - | Token storage down | Set `REDIS_HOST`/`REDIS_PORT` or omit for in-memory |
| Network error | - | Cannot reach Plane API | Verify `PLANE_BASE_URL` and connectivity |

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
---

*Plane MCP Server is open source and licensed under MIT. Source at [github.com/makeplane/plane-mcp-server](https://github.com/makeplane/plane-mcp-server).*
