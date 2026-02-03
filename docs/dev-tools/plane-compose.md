---
title: Plane Compose
description: Define Plane projects, workflows, and work items in YAML files. Version control your project structure and sync bidirectionally with Plane using the command line.
---

# Plane Compose
Plane Compose is a command-line tool that lets you define and manage Plane projects using YAML configuration files instead of the web interface. Think of it as "infrastructure as code" for project management — you write your project structure in files, version control them with Git, and sync them with Plane.

## Features
- **Local-first workflow**  
Define everything in YAML and version control with Git. Your project structure, work item types, workflows, and tasks all live in your repository.
- **Bidirectional sync**  
Push local changes to Plane or pull remote changes down. Keep your local files and Plane in sync however you prefer to work.
**Auto-create projects**  
Projects are created automatically in Plane when you push a schema. No need to set things up manually first.
- **Rich schema management**  
Define work item types with custom fields, create workflow state machines, and organize labels into groups.
- **Two sync modes**  
Use collaborative mode (plane push) for team-friendly additive syncing, or declarative mode (plane apply) when YAML should be the single source of truth.
- **Intelligent change detection**  
Content-based diffing means only actual changes get pushed. Stable IDs (user-defined or content-hashed) prevent duplicate work items.
- **State tracking**  
Terraform-style .plane/state.json tracks what's been synced, so Plane Compose knows what changed since the last push.
- **Built-in rate limiting**  
Respects Plane API limits with configurable throttling (50 requests/minute by default). Monitor usage with plane rate stats.
-**Project cloning**  
Clone an existing Plane project by UUID to start working with it locally.
- **Debug mode**   
Comprehensive logging and error handling when you need to troubleshoot.

## Installation

Install Plane Compose globally using pipx:

```bash
pipx install plane-compose
```

To install from source:

```bash
git clone https://github.com/makeplane/compose.git
cd compose
pipx install -e .
```

To upgrade to the latest version:

```bash
pipx upgrade plane-compose
```

## Getting started

This tutorial walks you through creating your first Plane Compose project and syncing it with Plane.

### Initialize a project

Create a new project directory with the default structure:

```bash
plane init my-project
cd my-project
```

This creates:

```
my-project/
├── plane.yaml              # Project configuration
├── schema/
│   ├── types.yaml          # Work item types (task, bug, etc.)
│   ├── workflows.yaml      # State machines
│   └── labels.yaml         # Label definitions
├── work/
│   └── inbox.yaml          # Work items to create
└── .plane/
    └── state.json          # Sync state (auto-managed)
```

### Authenticate with Plane

Log in using your API key:

```bash
plane auth login
```

When prompted, enter your API key. You can generate one at `https://app.plane.so/<workspace-slug>/settings/account/api-tokens/`.

To verify your authentication:

```bash
plane auth whoami
```

### Configure your workspace

Open `plane.yaml` and set your workspace name:

```yaml
workspace: your-workspace-slug
project:
  key: PROJ
  name: My Project

defaults:
  type: task
  workflow: standard
```

### Push your schema

Create the project in Plane along with its work item types, states, and labels:

```bash
plane schema push
```

After this runs, `plane.yaml` is automatically updated with the project UUID.

### Add work items

Edit `work/inbox.yaml` to define your work items:

```yaml
- id: "auth-oauth"
  title: Implement user authentication
  type: task
  priority: high
  labels: [backend, feature]
  state: todo
  description: Add OAuth2 authentication
  assignee: dev@example.com

- id: "bug-login-css"
  title: Fix login button CSS
  type: bug
  priority: medium
  labels: [frontend, bug]
  state: backlog
```

### Push work items

Preview what will be pushed:

```bash
plane push --dry-run
```

When you're ready, push to Plane:

```bash
plane push
```

## Cloning an existing project

If you want to work with a project that already exists in Plane, clone it by UUID:

```bash
plane clone abc-123-def-456 --workspace my-workspace
cd <project-name>
```

The remote work items are pulled to `.plane/remote/items.yaml`. You can review them, make changes in `work/inbox.yaml`, and push updates back to Plane.

## Understanding sync modes

Plane Compose offers two sync modes for different workflows.

### Collaborative mode (plane push)

Use `plane push` when working with a team. This mode is additive-only — it creates and updates work items but never deletes them. Team members can safely push their changes without accidentally removing someone else's work.

```bash
plane push              # Push new and updated items
plane push --dry-run    # Preview changes first
plane push --force      # Skip confirmation prompt
```

### Declarative mode (plane apply)

Use `plane apply` when you want your YAML files to be the single source of truth. This mode creates, updates, and deletes work items to match exactly what's in your files.

To prevent accidental deletions, declarative mode only affects work items within a defined scope. Configure the scope in `plane.yaml`:

```yaml
apply_scope:
  labels: ["automated"]
  assignee: "bot@example.com"
  id_prefix: "AUTO-"
```

With this configuration, `plane apply` only manages work items that match this scope—everything else is left untouched.

```bash
plane apply              # Sync with create/update/delete
plane apply --dry-run    # Preview all changes including deletions
plane apply --force      # Skip confirmation prompt
```

## Working with schemas

Schemas define the structure of your project: work item types, workflows, and labels.

### Work item types

Define types in `schema/types.yaml`:

```yaml
task:
  description: A single unit of work
  workflow: standard
  fields:
    - name: title
      type: string
      required: true
    - name: priority
      type: enum
      options: [none, low, medium, high, urgent]

bug:
  description: A defect to fix
  workflow: bug-workflow
  fields:
    - name: title
      type: string
      required: true
    - name: severity
      type: enum
      options: [minor, major, critical]
```

### Workflows

Define state machines in `schema/workflows.yaml`:

```yaml
standard:
  states:
    - name: backlog
      group: unstarted
      color: "#858585"
    - name: in_progress
      group: started
      color: "#f59e0b"
    - name: done
      group: completed
      color: "#22c55e"
  initial: backlog
  terminal: [done]

bug-workflow:
  states:
    - name: reported
      group: unstarted
      color: "#ef4444"
    - name: investigating
      group: started
      color: "#f59e0b"
    - name: fixed
      group: completed
      color: "#22c55e"
  initial: reported
  terminal: [fixed]
```

### Labels

Organize labels into groups in `schema/labels.yaml`:

```yaml
groups:
  area:
    color: "#3b82f6"
    labels:
      - name: frontend
      - name: backend
      - name: infrastructure
  
  priority:
    color: "#ef4444"
    labels:
      - name: urgent
      - name: high
      - name: low
```

### Validating and pushing schemas

Before pushing, validate your schema files:

```bash
plane schema validate
```

Push the schema to Plane:

```bash
plane schema push
plane schema push --dry-run  # Preview first
```

## Working with work items

### Work item fields

Each work item in your YAML files can include these fields:

| Field | Description |
|-------|-------------|
| `id` | Stable identifier for tracking (recommended) |
| `title` | Work item title (required) |
| `type` | Work item type (defaults to value in `plane.yaml`) |
| `priority` | `none`, `low`, `medium`, `high`, or `urgent` |
| `state` | Current state from the workflow |
| `labels` | List of label names |
| `description` | Detailed description |
| `assignee` | Email of the assignee |
| `watchers` | List of watcher emails |

### Using stable IDs

Always use stable IDs to prevent duplicate work items:

```yaml
- id: "feature-user-auth"
  title: Implement user authentication
  type: task
```

The ID can be any string that uniquely identifies the work item. Without an ID, Plane Compose uses content hashing, which can create duplicates if you change the title or description.

### Pulling remote changes

To see what's currently in Plane:

```bash
plane pull
```

This downloads work items to `.plane/remote/items.yaml`. You can compare this with your local files to see what's different.

### Combined sync

Run schema push and work item push together:

```bash
plane sync
```

## Monitoring and rate limits

### Check sync status

View the current state of your local project:

```bash
plane status
```

### Rate limit management

Plane Compose includes built-in rate limiting (50 requests per minute by default). To check your current rate limit stats:

```bash
plane rate stats
```

To reset the statistics:

```bash
plane rate reset
```

If you hit rate limits, you can reduce the request rate:

```bash
export PLANE_RATE_LIMIT_PER_MINUTE=30
plane push
```

## Configuration reference

### plane.yaml

```yaml
workspace: my-workspace
project:
  key: PROJ           # User-defined short key
  uuid: abc-123       # Auto-added after schema push
  name: My Project

defaults:
  type: task
  workflow: standard

# Optional: Scope for declarative mode
apply_scope:
  labels: ["automated"]
  assignee: "bot@example.com"
  id_prefix: "AUTO-"
```

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PLANE_API_URL` | `https://api.plane.so` | API endpoint |
| `PLANE_API_TIMEOUT` | `30` | Request timeout in seconds |
| `PLANE_RATE_LIMIT_PER_MINUTE` | `50` | Maximum requests per minute |
| `PLANE_DEBUG` | `false` | Enable debug mode |
| `PLANE_VERBOSE` | `false` | Enable verbose output |
| `PLANE_LOG_TO_FILE` | `false` | Write logs to file |

### Credentials storage

API keys are stored securely at `~/.config/plane-compose/credentials`.

Logs are written to `~/.config/plane-compose/plane.log` when debug mode is enabled.

## Command reference

### Project management

| Command | Description |
|---------|-------------|
| `plane init [path]` | Initialize a new project |
| `plane status` | Show sync status |
| `plane clone <uuid>` | Clone an existing project by UUID |

### Authentication

| Command | Description |
|---------|-------------|
| `plane auth login` | Authenticate with API key |
| `plane auth whoami` | Show current user |
| `plane auth logout` | Remove stored credentials |

### Schema management

| Command | Description |
|---------|-------------|
| `plane schema validate` | Validate local schema files |
| `plane schema push` | Push schema to Plane |
| `plane schema push --dry-run` | Preview schema changes |

### Work items (collaborative mode)

| Command | Description |
|---------|-------------|
| `plane push` | Push new/updated work items |
| `plane push --dry-run` | Preview changes |
| `plane push --force` | Push without confirmation |
| `plane pull` | Pull work items from Plane |
| `plane sync` | Run schema push + push together |

### Work items (declarative mode)

| Command | Description |
|---------|-------------|
| `plane apply` | Declarative sync with delete support |
| `plane apply --dry-run` | Preview creates/updates/deletes |
| `plane apply --force` | Apply without confirmation |

### Monitoring

| Command | Description |
|---------|-------------|
| `plane rate stats` | Show rate limit statistics |
| `plane rate reset` | Reset rate limit statistics |

### Global options

| Option | Description |
|--------|-------------|
| `--verbose`, `-v` | Enable verbose output |
| `--debug` | Enable debug logging |

## Troubleshooting

### Authentication failed (401)

Your API key may be invalid or expired. Log out and log in again:

```bash
plane auth logout
plane auth login
```

### Permission denied (403)

You may not have access to the workspace. Verify your membership:

```bash
plane auth whoami
```

Contact your workspace administrator if you need access.

### Project not found (404)

The project UUID in `plane.yaml` may be stale. Remove it and recreate:

```bash
# Edit plane.yaml and delete the uuid line
plane schema push
```

### Rate limit exceeded (429)

Check your rate limit status:

```bash
plane rate stats
```

Wait for the limit to reset, or reduce your request rate:

```bash
export PLANE_RATE_LIMIT_PER_MINUTE=30
plane push
```

### Duplicate work items

Always use stable IDs in your work items:

```yaml
- id: "unique-identifier"
  title: "My task"
```

Without IDs, content changes can create duplicates instead of updates.

### State corruption

If your local state gets corrupted, back it up and reset:

```bash
cp .plane/state.json .plane/state.json.backup
rm .plane/state.json
plane pull
```

### Debug mode

Enable debug logging to troubleshoot issues:

```bash
plane --debug push
```

View the logs:

```bash
tail -f ~/.config/plane-compose/plane.log
```