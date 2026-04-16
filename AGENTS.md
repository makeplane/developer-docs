# Developer Docs Agent Context

## Purpose

Internal developer documentation for Plane EE.

## Structure

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
  self-hosting/         # Deployment and configuration guides
    methods/            # Docker, Kubernetes, Podman, Coolify, Portainer, one-click, airgapped
      install-methods-commercial/  # Commercial Docker Compose and Kubernetes
    govern/             # Auth, integrations, settings, SSL, DNS, env vars
      integrations/     # GitHub, GitLab, Slack, Sentry
    manage/             # Backup/restore, Prime CLI, update Plane, logs, user management
    troubleshoot/       # CLI errors, installation, license, storage errors
```

## Key Documentation Paths

- `self-hosting/methods/kubernetes.md` - K8s deployment guide
- `self-hosting/methods/install-methods-commercial/` - Commercial Docker Compose and Kubernetes
- `self-hosting/govern/integrations/` - GitHub, GitLab, Slack, Sentry
- `self-hosting/govern/plane-ai.md` - AI features configuration
- `self-hosting/govern/environment-variables.md` - All env var reference
- `self-hosting/govern/authentication.md` - Auth setup (LDAP, OIDC, SAML, OAuth)
- `self-hosting/govern/reverse-proxy.md` - Reverse proxy setup
- `self-hosting/manage/` - Instance management, backup/restore, Prime CLI
- `dev-tools/agents/` - Agent development docs
- `dev-tools/mcp-server.md` and `mcp-server-claude-code.md` - MCP server docs

## Important Notes

- Not all features are documented immediately after release
- Check both public docs (docs.plane.so) and internal docs
- `self-hosting/govern/plane-ai.md` is the correct path for AI config (not `self-hosting/plane-ai.md`)
- API reference covers 30+ resource categories — check `docs/api-reference/` for the full list
