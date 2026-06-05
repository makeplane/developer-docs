---
title: Self-host MCP Server
description: Deploy your own Plane MCP Server with Docker Compose or Helm. Create an OAuth app, configure credentials, and connect AI clients to your self-hosted instance.
keywords: plane mcp server, self-hosted mcp, plane mcp deployment, docker compose mcp, helm mcp, plane oauth mcp, plane ai integration, mcp server setup
---

# Self-host MCP Server

Run your own instance of the Plane MCP Server. Required if you want OAuth auth against a self-hosted Plane instance, or if you want full control over your MCP infrastructure. Plane Cloud users who just want OAuth/PAT/Stdio against `mcp.plane.so` should use the [setup guide](/dev-tools/mcp-server) instead.

::: info Beta
The Plane MCP Server is in **Beta**. Send feedback to support@plane.so.
:::

---

## Prerequisites

- A running **Plane instance** (self-hosted or cloud) with workspace admin access.
- **Docker** + Docker Compose v2+, _or_ **Kubernetes** v1.21+ with Helm v3+.
- A public URL for the MCP server (e.g. `https://mcp.yourdomain.com`). OAuth callbacks need to reach it.

---

## Step 1: Create an OAuth application in Plane

The MCP server authenticates with Plane via OAuth 2.0. Register an app to get the credentials.

1. Go to **Workspace Settings → Integrations**:

   ```text
   https://<your-plane-domain>/<workspace>/settings/integrations/
   ```

2. Click **Build your own**.

3. Fill in the application details:

   | Field            | Value                                                   |
   | ---------------- | ------------------------------------------------------- |
   | **App Name**     | Anything (e.g. `Plane MCP Server`)                      |
   | **Setup URL**    | Your MCP server URL (e.g. `https://mcp.yourdomain.com`) |
   | **Redirect URI** | All three URIs listed below, space-separated            |
   | **Webhook URL**  | Leave empty unless you need webhook events              |

   ::: tip Redirect URIs — add all three
   The server exposes callbacks on three paths to support all transports and MCP clients:

   | Transport       | Redirect URI                          |
   | --------------- | ------------------------------------- |
   | OAuth callback  | `<MCP_SERVER_URL>/callback`           |
   | HTTP with OAuth | `<MCP_SERVER_URL>/http/auth/callback` |
   | SSE (legacy)    | `<MCP_SERVER_URL>/auth/callback`      |

   Example with `https://mcp.yourdomain.com`, paste into the Redirect URI field **space-separated**:

   ```text
   https://mcp.yourdomain.com/callback https://mcp.yourdomain.com/http/auth/callback https://mcp.yourdomain.com/auth/callback
   ```

   :::

4. Select the **read** and **write** scopes under **Scopes & Permissions**. Both are required.

5. Save. Store the generated **Client ID** and **Client Secret** securely.

::: warning
Never expose the Client Secret in client-side code or commit it to version control.
:::

More on creating OAuth apps: [Create an OAuth Application](/dev-tools/build-plane-app/create-oauth-application).

---

## Step 2: Deploy the MCP server

### Option A: Docker Compose

1. Create a project directory with this `docker-compose.yaml`:

   ```yaml
   name: plane-mcp

   services:
     mcp:
       image: makeplane/plane-mcp-server:${APP_RELEASE_VERSION:-latest}
       restart: always
       ports:
         - "8211:8211"
       env_file:
         - variables.env
       environment:
         REDIS_HOST: valkey
         REDIS_PORT: "6379"
       depends_on:
         valkey:
           condition: service_healthy

     valkey:
       image: valkey/valkey:8-alpine
       restart: always
       volumes:
         - valkey-data:/data
       healthcheck:
         test: ["CMD", "valkey-cli", "ping"]
         interval: 5s
         timeout: 3s
         retries: 5

   volumes:
     valkey-data:
   ```

2. Create `variables.env` with the OAuth credentials from Step 1:

   ```env
   # Image tag (pin to a specific version in production)
   APP_RELEASE_VERSION=latest

   # Plane API URL — Cloud or your self-hosted instance
   PLANE_BASE_URL=https://api.plane.so

   # Internal URL for server-to-server calls (optional, same-network setups)
   # PLANE_INTERNAL_BASE_URL=

   # OAuth credentials from Step 1
   PLANE_OAUTH_PROVIDER_CLIENT_ID=your-client-id
   PLANE_OAUTH_PROVIDER_CLIENT_SECRET=your-client-secret

   # Public URL where MCP clients reach this server
   PLANE_OAUTH_PROVIDER_BASE_URL=https://mcp.yourdomain.com
   ```

3. Start:

   ```bash
   docker compose up -d
   ```

4. Verify the container is running and the MCP endpoint responds:

   ```bash
   docker compose logs -f mcp           # follow startup logs
   curl http://localhost:8211/http/mcp  # expect: 401 (auth required) or MCP protocol response
   ```

::: warning Production: terminate TLS in front
The container speaks plain HTTP on `:8211`. Put it behind a reverse proxy (nginx, Caddy, Traefik, Cloudflare) with TLS — OAuth callbacks fail without HTTPS, and `PLANE_OAUTH_PROVIDER_BASE_URL` must be the public `https://` URL of that proxy.
:::

#### Configuration reference

| Variable                             | Required | Description                                                                      |
| ------------------------------------ | -------- | -------------------------------------------------------------------------------- |
| `APP_RELEASE_VERSION`                | No       | Image tag to deploy (default: `latest`). Pin in production.                      |
| `PLANE_BASE_URL`                     | No       | Plane API URL. Defaults to `https://api.plane.so`.                               |
| `PLANE_INTERNAL_BASE_URL`            | No       | Internal Plane URL for server-to-server calls. Falls back to `PLANE_BASE_URL`.   |
| `PLANE_OAUTH_PROVIDER_CLIENT_ID`     | Yes      | OAuth Client ID from Step 1.                                                     |
| `PLANE_OAUTH_PROVIDER_CLIENT_SECRET` | Yes      | OAuth Client Secret from Step 1.                                                 |
| `PLANE_OAUTH_PROVIDER_BASE_URL`      | Yes      | Public URL of **this MCP server** (not Plane).                                   |
| `MCP_PATH_PREFIX`                    | No       | Prefix prepended to all routes — use when reverse-proxying alongside other apps. |

#### Upgrading

```bash
docker compose pull
docker compose up -d
```

---

### Option B: Helm chart

1. Add the Plane Helm repo:

   ```bash
   helm repo add plane https://helm.plane.so
   helm repo update
   ```

2. Create `values.yaml`:

   ```yaml
   ingress:
     enabled: true
     host: mcp.yourdomain.com
     ingressClass: nginx
     ssl:
       enabled: true
       issuer: cloudflare # cloudflare | digitalocean | http
       email: you@yourdomain.com

   services:
     api:
       plane_base_url: "https://api.plane.so"
       plane_oauth:
         enabled: true
         client_id: "<your-oauth-client-id>"
         client_secret: "<your-oauth-client-secret>"
         provider_base_url: "https://mcp.yourdomain.com"
   ```

3. Install:

   ```bash
   helm install plane-mcp plane/plane-mcp-server \
     --namespace plane-mcp \
     --create-namespace \
     -f values.yaml
   ```

#### Helm values reference

| Value                                        | Default           | Description                                         |
| -------------------------------------------- | ----------------- | --------------------------------------------------- |
| `dockerRegistry.default_tag`                 | `latest`          | Image tag to deploy                                 |
| `ingress.enabled`                            | `true`            | Enable ingress                                      |
| `ingress.host`                               | `mcp.example.com` | Public hostname                                     |
| `ingress.ingressClass`                       | `nginx`           | Ingress class name                                  |
| `ingress.ssl.enabled`                        | `false`           | Enable TLS via cert-manager                         |
| `ingress.ssl.issuer`                         | `cloudflare`      | ACME issuer (`cloudflare`, `digitalocean`, `http`)  |
| `services.api.replicas`                      | `1`               | Number of MCP server replicas                       |
| `services.api.plane_base_url`                | `""`              | Plane API URL                                       |
| `services.api.plane_oauth.enabled`           | `false`           | Enable OAuth endpoints                              |
| `services.api.plane_oauth.client_id`         | `""`              | OAuth Client ID                                     |
| `services.api.plane_oauth.client_secret`     | `""`              | OAuth Client Secret                                 |
| `services.api.plane_oauth.provider_base_url` | `""`              | Public URL this server is reachable on              |
| `services.redis.local_setup`                 | `true`            | Deploy Valkey in-cluster                            |
| `services.redis.external_redis_url`          | `""`              | External Valkey/Redis URL (if not using in-cluster) |

#### Upgrading

```bash
helm upgrade plane-mcp plane/plane-mcp-server \
  --namespace plane-mcp \
  -f values.yaml
```

#### Uninstalling

```bash
helm uninstall plane-mcp --namespace plane-mcp
```

---

## Step 3: Connect your AI tools

Replace `https://mcp.yourdomain.com` with your actual MCP server URL.

### Available endpoints

| Endpoint                                      | Auth       | Description                            |
| --------------------------------------------- | ---------- | -------------------------------------- |
| `https://mcp.yourdomain.com/http/mcp`         | OAuth      | OAuth-based MCP endpoint (recommended) |
| `https://mcp.yourdomain.com/http/api-key/mcp` | PAT header | Personal Access Token endpoint         |
| `https://mcp.yourdomain.com/sse`              | OAuth      | Legacy SSE endpoint (deprecated)       |

### Cursor (native HTTP)

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://mcp.yourdomain.com/http/mcp",
      "type": "http"
    }
  }
}
```

### Windsurf (native HTTP)

Windsurf uses `serverUrl` (not `url`) for remote HTTP servers.

```json
{
  "mcpServers": {
    "plane": {
      "serverUrl": "https://mcp.yourdomain.com/http/mcp"
    }
  }
}
```

### Zed (native HTTP)

```json
{
  "context_servers": {
    "plane-mcp-server": {
      "url": "https://mcp.yourdomain.com/http/mcp"
    }
  }
}
```

### VS Code (native HTTP)

`.vscode/mcp.json`:

```json
{
  "servers": {
    "plane": {
      "url": "https://mcp.yourdomain.com/http/mcp",
      "type": "http"
    }
  }
}
```

### Claude Code

```bash
claude mcp add --transport http plane https://mcp.yourdomain.com/http/mcp
```

### Claude Desktop (via mcp-remote bridge)

Claude Desktop doesn't speak remote HTTP. Bridge it with `mcp-remote`. Requires Node.js 18+.

```json
{
  "mcpServers": {
    "plane": {
      "command": "npx",
      "args": ["mcp-remote@latest", "https://mcp.yourdomain.com/http/mcp"]
    }
  }
}
```

### PAT auth (CI, scripts, headless)

Swap the endpoint to `/http/api-key/mcp` and add auth headers. Cursor shape:

```json
{
  "mcpServers": {
    "plane": {
      "url": "https://mcp.yourdomain.com/http/api-key/mcp",
      "type": "http",
      "headers": {
        "Authorization": "Bearer your_api_key_here",
        "x-workspace-slug": "your-workspace-slug"
      }
    }
  }
}
```

→ For per-client PAT shapes (Windsurf uses `serverUrl`, VS Code uses `servers`, Zed uses `context_servers`, Claude Code uses `claude mcp add-json`), see the [setup guide PAT section](/dev-tools/mcp-server#pat-token) — same configs, just swap the URL to your domain.

---

## Troubleshooting

**Server not starting?**

```bash
docker compose logs mcp
```

**Valkey connection issues?**

```bash
docker compose exec valkey valkey-cli ping
# Expect: PONG
```

**OAuth authentication errors?**

- Verify all three **redirect URIs** are added to your Plane OAuth app: `/callback`, `/http/auth/callback`, `/auth/callback`.
- Confirm `PLANE_OAUTH_PROVIDER_CLIENT_ID` / `_CLIENT_SECRET` in env match values from Plane.
- Confirm `PLANE_OAUTH_PROVIDER_BASE_URL` is the publicly accessible URL of **this MCP server** (not Plane).
- Clear cached auth tokens on the client side:

  ```bash
  rm -rf ~/.mcp-auth
  ```

**Token loss on restart** — tokens are in-memory if Redis/Valkey isn't reachable. Verify the `REDIS_HOST` / `REDIS_PORT` env vars are correct and the Valkey container is healthy.

**Reset Docker Compose** (deletes Valkey data):

```bash
docker compose down -v
docker compose up -d
```

**Still stuck?**

1. Verify OAuth credentials and workspace settings.
2. Check the [plane-mcp-server repo](https://github.com/makeplane/plane-mcp-server) for known issues.
3. Contact `support@plane.so`.

---

→ For the tool list, see [MCP Server Tool Reference](/dev-tools/mcp-server-tools). For client connection details against `mcp.plane.so`, see the [MCP Server setup guide](/dev-tools/mcp-server).
