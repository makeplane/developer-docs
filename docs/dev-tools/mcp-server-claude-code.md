---
title: MCP Server for Claude Code
description: Install and use the Plane MCP Server with Claude Code CLI. Manage work items, projects, cycles, and modules from your terminal with AI.
keywords: plane, mcp server, claude code, cli, ai, project management, work items, developer tools
---

# MCP Server for Claude Code

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) is Anthropic's CLI tool for agentic
coding. By connecting the Plane MCP Server to Claude Code, you can manage your Plane workspace
directly from the terminal — create work items, plan cycles, search across projects, and more,
all through natural language.

<Note>
Beta
The Plane MCP Server is currently in **Beta**. Some aspects of the API may change. Please send any
issues to support@plane.so.
</Note>

## Prerequisites

- **Claude Code**: [Install Claude Code](https://docs.anthropic.com/en/docs/claude-code/getting-started) if you haven't already.
- **Node.js 22+**: Required for HTTP transports. Verify with `node --version`.
- **Python 3.10+** and **uvx**: Required only for the local Stdio transport. Verify with `python --version` and `uvx --version`.
- **Plane API Key**: For PAT or Stdio transports, generate one from **Workspace Settings > API Tokens** in Plane.

## Setup methods

Choose the transport method that fits your setup.

| Method                                | Best for                     | Auth                  |
| ------------------------------------- | ---------------------------- | --------------------- |
| [HTTP with OAuth](#http-with-oauth)   | Plane Cloud, interactive use | Browser-based OAuth   |
| [HTTP with PAT](#http-with-pat-token) | CI/CD, automated workflows   | API key in headers    |
| [Local Stdio](#local-stdio)           | Self-hosted Plane instances  | Environment variables |

## HTTP with OAuth

The simplest way to connect to Plane Cloud. Run this in your terminal:

```bash
claude mcp add --transport http plane https://mcp.plane.so/http/mcp
```

After adding the server, start Claude Code and run `/mcp` to authenticate via your browser.

## HTTP with PAT token

For automated workflows or when you prefer token-based auth:

```bash
claude mcp add-json plane '{
  "type": "http",
  "url": "https://mcp.plane.so/http/api-key/mcp",
  "headers": {
    "Authorization": "Bearer <YOUR_API_KEY>",
    "X-Workspace-slug": "<YOUR_WORKSPACE_SLUG>"
  }
}'
```

Replace `<YOUR_API_KEY>` and `<YOUR_WORKSPACE_SLUG>` with your actual values.

## Local Stdio

For self-hosted Plane instances, use the Stdio transport which runs locally:

```bash
claude mcp add-json plane '{
  "type": "stdio",
  "command": "uvx",
  "args": ["plane-mcp-server", "stdio"],
  "env": {
    "PLANE_API_KEY": "<YOUR_API_KEY>",
    "PLANE_WORKSPACE_SLUG": "<YOUR_WORKSPACE_SLUG>",
    "PLANE_BASE_URL": "https://your-plane-instance.com"
  }
}'
```

### Environment variables

| Variable               | Required | Description                                                           |
| ---------------------- | -------- | --------------------------------------------------------------------- |
| `PLANE_API_KEY`        | Yes      | API key from your workspace settings                                  |
| `PLANE_WORKSPACE_SLUG` | Yes      | Your workspace slug (found in your Plane URL)                         |
| `PLANE_BASE_URL`       | No       | API URL for self-hosted instances. Defaults to `https://api.plane.so` |

## Scope options

Control where the MCP server configuration is stored by adding a `--scope` flag:

```bash
# Available only to you in the current project (default)
claude mcp add --scope local --transport http plane https://mcp.plane.so/http/mcp

# Shared via .mcp.json, committed to version control
claude mcp add --scope project --transport http plane https://mcp.plane.so/http/mcp

# Available across all your projects
claude mcp add --scope user --transport http plane https://mcp.plane.so/http/mcp
```

## Verify the connection

After setup, verify the Plane MCP Server is connected:

```bash
# List all configured MCP servers
claude mcp list

# Get details for the Plane server
claude mcp get plane
```

Inside Claude Code, run `/mcp` to check the server status and see the available tools.

## Available tools

The Plane MCP Server exposes 55+ tools across these categories:

| Category                 | Tools | Examples                                                        |
| ------------------------ | ----- | --------------------------------------------------------------- |
| **Projects**             | 9     | List, create, update, delete projects; get members and features |
| **Work Items**           | 7     | Create, list, search, update, delete work items                 |
| **Cycles**               | 12    | Manage cycles, add/remove work items, transfer, archive         |
| **Modules**              | 11    | Manage modules, add/remove work items, archive                  |
| **Initiatives**          | 5     | Create and manage workspace-level initiatives                   |
| **Intake**               | 5     | Manage intake work items for triage                             |
| **Work Item Properties** | 5     | Manage custom properties on work items                          |
| **Users**                | 1     | Get current authenticated user info                             |

## Examples

Here are common tasks you can perform by chatting with Claude Code after connecting the Plane MCP Server.

### List projects in your workspace

**Prompt:**

```
List all projects in my workspace.
```

Claude Code calls `list_projects` and returns a summary of all projects including their identifiers, lead, and status.

### Create a work item

**Prompt:**

```
Create a bug in project WEB titled "Fix login redirect loop" and assign it to me.
```

Claude Code calls `get_me` to find your user ID, then `create_work_item` with the project ID, name, and assignee.

### Search across work items

**Prompt:**

```
Search for work items related to "authentication" across the workspace.
```

Claude Code calls `search_work_items` with the query string and returns matching results from all projects.

### Plan a cycle

**Prompt:**

```
Create a new cycle called "Sprint 24" in project WEB starting today and
ending in 2 weeks. Add work items WEB-102, WEB-115, and WEB-118 to it.
```

Claude Code calls `create_cycle` with the name and dates, then `add_work_items_to_cycle` to attach the specified items.

### Triage intake items

**Prompt:**

```
Show me all intake items in project MOBILE and accept the ones related to
crash reports.
```

Claude Code calls `list_intake_work_items` to retrieve pending items, then `update_intake_work_item` to accept the relevant ones.

### Get a project overview

**Prompt:**

```
Give me a summary of project BACKEND — what cycles are active, how many
open work items are there, and who are the members?
```

Claude Code calls `retrieve_project`, `list_cycles`, `list_work_items`, and `get_project_members` to assemble a full overview.

### Manage modules

**Prompt:**

```
Create a module called "Auth Revamp" in project WEB and add all work items
tagged with the "auth" label to it.
```

Claude Code calls `create_module`, then `list_work_items` with label filtering, and finally `add_work_items_to_module` to associate the items.

### Move work items between cycles

**Prompt:**

```
Transfer all incomplete work items from "Sprint 23" to "Sprint 24" in
project WEB.
```

Claude Code calls `list_cycles` to find both cycle IDs, then `transfer_cycle_work_items` to move unfinished items.

## Managing the server

```bash
# Remove the Plane MCP server
claude mcp remove plane

# Re-add with a different transport
claude mcp add --transport http plane https://mcp.plane.so/http/mcp
```

## Troubleshooting

### MCP server not connecting

If the server fails to start, launch Claude Code with the debug flag:

```bash
claude --mcp-debug
```

This shows detailed logs during MCP server initialization.

### Authentication errors (OAuth)

Clear saved OAuth tokens and re-authenticate:

```bash
rm -rf ~/.mcp-auth
```

Then restart Claude Code and run `/mcp` to authenticate again.

### Server timeout on startup

If the MCP server times out during initialization, increase the timeout:

```bash
MCP_TIMEOUT=10000 claude
```

This sets a 10-second startup timeout (default is lower).

### Python or Node.js not found

Ensure the required runtime is installed and available on your `PATH`:

```bash
# For HTTP transports
node --version   # Should be 22+

# For Stdio transport
python --version # Should be 3.10+
uvx --version
```

### Getting help

If issues persist:

1. Check your credentials and workspace slug
2. Run `claude mcp list` to verify the configuration
3. Contact support at support@plane.so for Plane-specific issues
4. Visit the [Plane MCP Server repository](https://github.com/makeplane/plane-mcp-server) for known issues
