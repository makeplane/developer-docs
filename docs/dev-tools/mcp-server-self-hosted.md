---
title: Self-host MCP Server
description: Deploy your own Plane MCP Server with Docker Compose or Helm. Create an OAuth app, configure credentials, and connect AI clients to your self-hosted instance.
keywords: plane mcp server, self-hosted mcp, plane mcp deployment, docker compose mcp, helm mcp, plane oauth mcp, plane ai integration, mcp server setup
---

# Self-host MCP Server

Run your own instance of the Plane MCP Server to connect AI clients to a self-hosted Plane installation or to maintain full control over your MCP infrastructure. This guide walks you through creating the required OAuth application in Plane, deploying the server, and connecting your AI tools.

::: info
The Plane MCP Server is currently in **Beta**. Please send any feedback to support@plane.so.
:::

## Prerequisites

Before you begin, make sure you have:

- A running **Plane instance** (self-hosted or cloud) with workspace admin access
- **Docker** and Docker Compose v2+ (for Docker deployment) _or_ **Kubernetes** v1.21+ with Helm v3+ (for Helm deployment)
- A **public URL** where your MCP server will be reachable (e.g., `https://mcp.yourdomain.com`)

## Step 1: Create an OAuth application in Plane

The MCP server authenticates with Plane using OAuth 2.0. You need to register an OAuth application in your Plane workspace to obtain the credentials.

1. Navigate to **Workspace Settings** → **Integrations**.

   ```text
   https://app.plane.so/<workspace>/settings/integrations/
   ```

2. Click **Build your own**.

3. Fill in the application details:

   | Field            | Value                                                             |
   | ---------------- | ----------------------------------------------------------------- |
   | **App Name**     | A name for your MCP server (e.g., `Plane MCP Server`)             |
   | **Setup URL**    | Your MCP server's public URL (e.g., `https://mcp.yourdomain.com`) |
   | **Redirect URI** | Add all three redirect URIs listed below                          |
   | **Webhook URL**  | Leave empty unless you need webhook events                        |

   ::: tip Redirect URIs
   Add **all three** of the following redirect URIs to your OAuth app to ensure compatibility across all transports and MCP clients:

   | Transport       | Redirect URI                          |
   | --------------- | ------------------------------------- |
   | OAuth Callback  | `<MCP_SERVER_URL>/callback`           |
   | HTTP with OAuth | `<MCP_SERVER_URL>/http/auth/callback` |
   | SSE (Legacy)    | `<MCP_SERVER_URL>/auth/callback`      |

   For example, if your MCP server is at `https://mcp.yourdomain.com`, add the following URIs **space-separated** in the Redirect URI field:

   ```text
   https://mcp.yourdomain.com/callback https://mcp.yourdomain.com/http/auth/callback https://mcp.yourdomain.com/auth/callback
   ```

   :::

4. Select the **read** and **write** scopes from the **Scopes & Permissions** section. The MCP server requires both to function correctly.

5. Save and securely store the generated **Client ID** and **Client Secret**.

::: warning
Never expose your Client Secret in client-side code or commit it to version control.
:::

For more details on creating OAuth applications, see [Create an OAuth Application](/dev-tools/build-plane-app/create-oauth-application).

## Step 2: Deploy the MCP server

### Option A: Docker Compose

1. Create a project directory and add the following `docker-compose.yaml`:

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

2. Create a `variables.env` file with the OAuth credentials from Step 1:

   ```env
   # Image tag (pin to a specific version for production)
   APP_RELEASE_VERSION=latest

   # Plane API URL (use your self-hosted Plane API URL if applicable)
   PLANE_BASE_URL=https://api.plane.so

   # Internal URL for server-to-server calls (optional, for same-network setups)
   # PLANE_INTERNAL_BASE_URL=

   # OAuth credentials from Step 1
   PLANE_OAUTH_PROVIDER_CLIENT_ID=your-client-id
   PLANE_OAUTH_PROVIDER_CLIENT_SECRET=your-client-secret

   # Public URL where MCP clients reach the server
   PLANE_OAUTH_PROVIDER_BASE_URL=https://mcp.yourdomain.com
   ```

3. Start the server:

   ```bash
   docker compose up -d
   ```

4. Verify the server is running:

   ```bash
   docker compose logs -f mcp
   ```

#### Configuration reference

| Variable                             | Required | Description                                     |
| ------------------------------------ | -------- | ----------------------------------------------- |
| `APP_RELEASE_VERSION`                | No       | Image tag to deploy (default: `latest`)         |
| `PLANE_BASE_URL`                     | No       | Plane API URL (default: `https://api.plane.so`) |
| `PLANE_INTERNAL_BASE_URL`            | No       | Internal API URL for server-to-server calls     |
| `PLANE_OAUTH_PROVIDER_CLIENT_ID`     | Yes      | OAuth Client ID from your Plane app             |
| `PLANE_OAUTH_PROVIDER_CLIENT_SECRET` | Yes      | OAuth Client Secret from your Plane app         |
| `PLANE_OAUTH_PROVIDER_BASE_URL`      | Yes      | Public URL where MCP clients reach the server   |

#### Upgrading

```bash
docker compose pull
docker compose up -d
```

### Option B: Helm chart

1. Add the Plane Helm repository:

   ```bash
   helm repo add plane https://helm.plane.so
   helm repo update
   ```

2. Create a `values.yaml` with your configuration:

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

3. Install the chart:

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
| `services.api.plane_oauth.provider_base_url` | `""`              | Public URL the server is reachable on               |
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

## Step 3: Connect your AI tools

Once the server is running, configure your AI tools to connect to it. Replace `https://mcp.yourdomain.com` with your actual MCP server URL.

### Available endpoints

| Endpoint                                      | Auth       | Description                      |
| --------------------------------------------- | ---------- | -------------------------------- |
| `https://mcp.yourdomain.com/http/mcp`         | OAuth      | OAuth-based MCP endpoint         |
| `https://mcp.yourdomain.com/http/api-key/mcp` | PAT header | Personal Access Token endpoint   |
| `https://mcp.yourdomain.com/sse`              | OAuth      | Legacy SSE endpoint (deprecated) |

### Claude Desktop / Cursor / Windsurf

Use `mcp-remote` to connect via the HTTP OAuth endpoint:

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

### Claude Code

```bash
claude mcp add --transport http plane https://mcp.yourdomain.com/http/mcp
```

### VSCode

Add to your `.vscode/mcp.json`:

```json
{
  "servers": {
    "plane": {
      "command": "npx",
      "args": ["mcp-remote@latest", "https://mcp.yourdomain.com/http/mcp"]
    }
  }
}
```

### HTTP with PAT token

For automated workflows or CI/CD pipelines, use the PAT endpoint with a [Plane API key](/api-reference/introduction#creating-an-api-key):

```json
{
  "mcpServers": {
    "plane": {
      "command": "npx",
      "args": ["mcp-remote@latest", "https://mcp.yourdomain.com/http/api-key/mcp"],
      "headers": {
        "Authorization": "Bearer <YOUR_API_KEY>",
        "X-Workspace-slug": "<YOUR_WORKSPACE_SLUG>"
      }
    }
  }
}
```

## Troubleshooting

**Server not starting?**

Check the MCP server logs for errors:

```bash
docker compose logs mcp
```

**Valkey connection issues?**

Verify Valkey is healthy:

```bash
docker compose exec valkey valkey-cli ping
```

**OAuth authentication errors?**

- Verify all three **Redirect URIs** are added to your Plane OAuth app: `<MCP_SERVER_URL>/callback`, `<MCP_SERVER_URL>/http/auth/callback`, and `<MCP_SERVER_URL>/auth/callback`.
- Confirm `PLANE_OAUTH_PROVIDER_CLIENT_ID` and `PLANE_OAUTH_PROVIDER_CLIENT_SECRET` in your environment match the values from Plane.
- Ensure `PLANE_OAUTH_PROVIDER_BASE_URL` is the publicly accessible URL of your MCP server.
- Clear cached auth tokens on the client side:

  ```bash
  rm -rf ~/.mcp-auth
  ```

**Reset and start fresh (Docker Compose):**

```bash
docker compose down -v
docker compose up -d
```

**Getting help**

If issues persist:

1. Verify your OAuth credentials and workspace settings
2. Check the [Plane MCP Server repository](https://github.com/makeplane/plane-mcp-server) for known issues
3. Contact support at support@plane.so
