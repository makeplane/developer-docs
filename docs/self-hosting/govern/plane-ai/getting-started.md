---
title: Get started with Plane AI
description: Enable Plane AI on your self-hosted instance. Set up a dedicated database, configure OpenSearch, add an LLM API key, and connect PI to your Plane deployment.
keywords: plane ai setup, self-hosted ai, llm api key, openai, anthropic, opensearch, enable plane ai
---

# Get started with Plane AI <Badge type="info" text="Commercial Edition" />

Plane AI brings AI-powered features to your workspace, including natural language chat, duplicate detection, and search across work items, pages, and projects. This guide walks you through configuring Plane AI on your self-hosted instance.

For an overview of what Plane AI can do, see [Plane AI](https://docs.plane.so/ai/pi-chat).

Plane AI requires four things to work:

1. **An LLM API key** (OpenAI or Anthropic) — powers AI responses.
2. **OpenSearch** — Search over your workspace data (issues, pages, docs) runs through OpenSearch indices.
3. **A dedicated database** — Plane AI must not share the main Plane application database.
4. **Read access to the main Plane database** — PI reads workspace data directly from the main Plane DB.

For an overview of what Plane AI can do, see [Plane AI](https://docs.plane.so/ai/pi-chat).

## Supported LLM providers

### OpenAI (`OPENAI_API_KEY`)

- GPT-5.4
- GPT-5.2

### Anthropic (`CLAUDE_API_KEY`)

- Claude Sonnet 4.5
- Claude Sonnet 4.6

Set both keys to give users access to models from both providers. If only one is set, users only see that provider's models.

:::tip Custom or self-hosted models
To use Ollama, Groq, LiteLLM, AWS Bedrock, or any OpenAI-compatible endpoint, see [Custom LLM models](/self-hosting/govern/plane-ai/custom-llm).
:::

## Step 1 — Set up databases

Plane AI needs two database connections:

```bash
PLANE_PI_DATABASE_URL=postgresql://user:password@host:5432/plane-pi
FOLLOWER_POSTGRES_URI=postgresql://user:password@host:5432/plane
```

- **`PLANE_PI_DATABASE_URL`** — PI's own dedicated database. Must not be shared with the main Plane application database.
- **`FOLLOWER_POSTGRES_URI`** — Read connection to the main Plane database. PI reads workspace data (issues, pages, projects) directly from here. Can be a read replica.

Both are checked at startup — PI will not start if either is unreachable.

## Step 2 — Configure OpenSearch

Add to `/opt/plane/plane.env`:

```bash
OPENSEARCH_URL=https://your-opensearch-instance:9200/
OPENSEARCH_USERNAME=admin
OPENSEARCH_PASSWORD=your-secure-password
```

If you haven't set up OpenSearch yet, see [OpenSearch for advanced search](/self-hosting/govern/advanced-search) first.

## Step 3 — Add an LLM API key

Add at least one to `/opt/plane/plane.env`:

```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
CLAUDE_API_KEY=xxxxxxxxxxxxxxxx
```

## Step 4 — Connect Plane AI to your Plane deployment

Plane AI runs as a separate service and must be wired to your Plane deployment. Two things matter here:

**In the Plane API env** (`/opt/plane/plane.env`), tell Plane where PI is reachable:

```bash
PI_BASE_URL=https://plane.example.com
```

Plane builds the PI URL as `PI_BASE_URL + PI_BASE_PATH` — with the default `PI_BASE_PATH=/pi` this becomes `https://plane.example.com/pi`.

**In the PI env** (`/opt/plane/plane.env`), set the OAuth redirect URI to match:

```bash
PLANE_OAUTH_REDIRECT_URI=https://plane.example.com/pi/api/v1/oauth/callback/
```

## Step 5 — Enable Plane AI services

:::tip Other deployment methods
For Coolify, Portainer, Docker Swarm, and Podman Quadlets, use the same environment variables as Docker Compose — only the replica variables differ.
:::

:::tabs key:deployment-method

== Docker Compose {#docker-compose}

In `/opt/plane/plane.env`, set replica counts to `1`:

```bash
PI_API_REPLICAS=1
PI_BEAT_REPLICAS=1
PI_WORKER_REPLICAS=1
PI_MIGRATOR_REPLICAS=1
```

== Kubernetes {#kubernetes}

In `values.yaml`, enable the Plane AI service:

```yaml
services:
  pi:
    enabled: true
```

This activates the Plane AI API, worker, beat-worker, and migrator workloads. Configure replicas and resource limits through the [Plane AI values block](/self-hosting/methods/kubernetes#plane-ai-pi-deployment).

:::

## Step 6 — Restart Plane

:::tabs key:deployment-method

== Docker Compose {#docker-compose}

```bash
prime-cli restart
```

Or directly:

```bash
docker compose down
docker compose up -d
```

== Kubernetes {#kubernetes}

```bash
helm upgrade --install plane-app plane/plane-enterprise \
    --namespace plane \
    -f values.yaml \
    --wait
```

:::

---

## Optional

### Voice input

Enables speech-to-text in Plane AI chat. Get a key at [console.groq.com](https://console.groq.com).

```bash
GROQ_API_KEY=your-groq-api-key
```

### File uploads

Enables file attachments in Plane AI.

```bash
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

For MinIO or S3-compatible storage, also add:

```bash
AWS_S3_ENDPOINT_URL=http://your-minio-host:9000
USE_MINIO=1
```
