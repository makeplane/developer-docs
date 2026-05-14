---
title: Configure Plane AI
description: Configure Plane AI on your self-hosted Plane deployment. Set up LLM providers for AI chat and duplicate detection. Optionally configure embedding models and semantic search.
keywords: plane ai, Plane ai, self-hosted ai, llm configuration, embedding models, semantic search, openai, anthropic, cohere
---

# Configure Plane AI <Badge type="info" text="Commercial Edition" />

Plane AI brings AI-powered features to your workspace, including natural language chat, duplicate detection, and optionally semantic search across work items, pages, and projects. This guide walks you through configuring Plane AI on your self-hosted instance.

For an overview of what Plane AI can do, see the [Plane AI](https://docs.plane.so/ai/pi-chat).

## Before you begin

You'll need:

- A **separate database** for Plane AI. Plane AI requires its own database instance.
- At least one LLM provider API key or a custom OpenAI-compatible endpoint.

**Optional (for semantic search):**

- An OpenSearch instance running version 2.19 or later (self-hosted or AWS OpenSearch) configured for [advanced search](/self-hosting/govern/advanced-search).
- An embedding model configured in OpenSearch.

::: tip
Without OpenSearch and an embedding model, Plane AI chat, duplicate detection, and other LLM-powered features will work normally. Semantic search across work items, pages, and projects will not be available.
:::

## Supported models

### Large language models (LLMs)

#### OpenAI

Supported models:

- GPT-5
- GPT-4.1
- GPT-5.2

#### Anthropic

Supported models:

- Claude Sonnet 4.0
- Claude Sonnet 4.5
- Claude Sonnet 4.6

You can provide API keys for both OpenAI and Anthropic, making all models available to users. If you provide only one key, users will only have access to that provider's models.

:::tip
If you need to use an LLM that isn't from OpenAI or Anthropic — for example, an open-source model or a regional provider for compliance reasons — you can proxy it through [LiteLLM](https://docs.litellm.ai). LiteLLM exposes any LLM behind an OpenAI-compatible API, which Plane can then connect to using the `CUSTOM_LLM_*` variables with `CUSTOM_LLM_PROVIDER=openai`.
:::

#### Custom models (self-hosted or third-party)

Plane AI supports custom models through two backends:

- **OpenAI-compatible endpoint** — any model exposed via an OpenAI-compatible API, including models served by Ollama, Groq, Cerebras, and similar runtimes.
- **AWS Bedrock** — models accessed directly through Amazon Bedrock using your AWS credentials.

One custom model can be configured alongside your public provider keys.

::: warning
The custom model should have at least 1 trillion parameters for all Plane AI features to work reliably. Larger, more capable models yield better results.
:::

### Embedding models

Embedding models power semantic search and are **optional**. If you're not using OpenSearch, you can skip configuring an embedding model. Plane AI supports:

| Provider        | Supported models                       | Dimension |
| --------------- | -------------------------------------- | --------- |
| **Cohere**      | `cohere/embed-v4.0`                    | 1536      |
|                 | `cohere/embed-english-v3.0`            | 1024      |
|                 | `cohere/embed-english-v2.0`            | 4096      |
| **OpenAI**      | `openai/text-embedding-ada-002`        | 1536      |
|                 | `openai/text-embedding-3-small`        | 1536      |
|                 | `openai/text-embedding-3-large`        | 3072      |
| **AWS Bedrock** | `bedrock/amazon.titan-embed-text-v1`   | 1536      |
|                 | `bedrock/amazon.titan-embed-text-v2`   | 1024      |
|                 | `bedrock/cohere.embed-english-v3`      | 1024      |
|                 | `bedrock/cohere.embed-multilingual-v3` | 1024      |

## Enable Plane AI services

:::info Separate database required
Plane AI must use its own database — do not share the main Plane application database. A dedicated database keeps AI data (e.g. chat history) isolated and avoids schema conflicts. Set **PLANE_PI_DATABASE_URL** (or the equivalent for your deployment). See the [environment variables reference](/self-hosting/govern/environment-variables#plane-ai).
:::

:::tip
For other deployment methods such as Coolify, Portainer, Docker Swarm, and Podman Quadlets, use the same [environment variables](/self-hosting/govern/environment-variables#plane-ai) defined for Docker Compose Setup.
:::

:::tabs key:deployment-method

== Docker Compose {#docker-compose}

Open the `/opt/plane/plane.env` file in your preferred editor and set the replica count for Plane AI services to `1`:

```bash
PI_API_REPLICAS=1
PI_BEAT_REPLICAS=1
PI_WORKER_REPLICAS=1
PI_MIGRATOR_REPLICAS=1
```

== Kubernetes {#kubernetes}

Open your `values.yaml` file and enable the Plane AI service by setting `services.pi.enabled` to `true`:

```yaml
services:
  pi:
    enabled: true
```

This activates the Plane AI API, worker, beat-worker, and migrator workloads. Replica counts and resource limits for each workload can be configured through the [Plane AI values block](/self-hosting/methods/kubernetes#plane-ai-pi-deployment) in your `values.yaml`.

:::

:::tip Plane AI API startup checks
If you configure OpenSearch for semantic search, the Plane AI container runs an embedding-dimension check on start. **OpenSearch must be reachable** at `OPENSEARCH_URL`, and **`EMBEDDING_MODEL` must be set** when OpenSearch is configured, or the service will not start. If existing index mappings or the deployed ML model disagree with **`OPENSEARCH_EMBEDDING_DIMENSION`**, startup fails until you align the configuration or rebuild indices (see [Changing the embedding dimension](#changing-the-embedding-dimension) below).
:::

## Configure an LLM provider

Configure at least one LLM provider. Add the relevant variables to `/opt/plane/plane.env`.

### OpenAI

```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
```

### Anthropic

```bash
CLAUDE_API_KEY=xxxxxxxxxxxxxxxx
```

### Custom model

```bash
CUSTOM_LLM_ENABLED=true
CUSTOM_LLM_PROVIDER=openai  # or 'bedrock'
CUSTOM_LLM_MODEL_KEY=your-model-key
CUSTOM_LLM_API_KEY=your-api-key
CUSTOM_LLM_NAME=Your Model Name
CUSTOM_LLM_MAX_TOKENS=128000
```

**Additional required variables by provider:**

- **OpenAI-compatible** (`openai`): `CUSTOM_LLM_BASE_URL`
- **AWS Bedrock** (`bedrock`): `CUSTOM_LLM_AWS_REGION`

::: warning
For Bedrock, the IAM user must have `bedrock:InvokeModel` permission on the target model.
:::

### Speech-to-text (optional)

```bash
GROQ_API_KEY=your-groq-api-key
```

This enables voice input in Plane AI. It's not required for LLM or semantic search features.

## Configure OpenSearch and an embedding model (optional)

Plane AI uses OpenSearch for semantic indexing and retrieval, which powers semantic search across work items, pages, and projects. **This is optional** — Plane AI chat, duplicate detection, and other LLM-powered features work without OpenSearch or an embedding model.

If you want to enable semantic search, complete the [OpenSearch for advanced search](/self-hosting/govern/advanced-search) guide first, then return here to configure the embedding model.

### Configure OpenSearch connection

```bash
OPENSEARCH_URL=https://your-opensearch-instance:9200/
OPENSEARCH_USERNAME=admin
OPENSEARCH_PASSWORD=your-secure-password
OPENSEARCH_INDEX_PREFIX=plane
```

### Configure an embedding model

If you're using OpenSearch for semantic search, configure the `EMBEDDING_MODEL` so Plane AI knows which embedding model to construct queries for. Then configure exactly one embedding model deployment using one of these options.

::: info Skip if not using semantic search
If you're not configuring OpenSearch, skip this section. Plane AI will work without semantic search capabilities.
:::

#### Option A: Use an existing OpenSearch model ID

If you've already deployed an embedding model in OpenSearch, provide its model ID along with your chosen embedding model and dimension. This works with both self-hosted and AWS OpenSearch.

```bash
OPENSEARCH_ML_MODEL_ID=your-model-id
EMBEDDING_MODEL=openai/text-embedding-3-small
OPENSEARCH_EMBEDDING_DIMENSION=1536
```

For AWS OpenSearch, you must deploy the embedding model manually before setting this variable. See [Deploy an embedding model on AWS OpenSearch](/self-hosting/govern/aws-opensearch-embedding).

#### Option B: Automatic deployment (self-hosted OpenSearch only)

For self-hosted OpenSearch, Plane can automatically create and deploy the embedding model. Provide the model name and the corresponding provider credentials.

**Cohere:**

```bash
EMBEDDING_MODEL=cohere/embed-v4.0
COHERE_API_KEY=your-cohere-api-key
OPENSEARCH_EMBEDDING_DIMENSION=1536
```

**OpenAI:**

```bash
EMBEDDING_MODEL=openai/text-embedding-3-small
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
OPENSEARCH_EMBEDDING_DIMENSION=1536
```

**AWS Bedrock (Titan):**

```bash
EMBEDDING_MODEL=bedrock/amazon.titan-embed-text-v1
BR_AWS_ACCESS_KEY_ID=your-access-key
BR_AWS_SECRET_ACCESS_KEY=your-secret-key
BR_AWS_REGION=your-region
OPENSEARCH_EMBEDDING_DIMENSION=1536
```

:::warning Required IAM permission for Bedrock Titan
The IAM user for `BR_AWS_ACCESS_KEY_ID` and `BR_AWS_SECRET_ACCESS_KEY` needs `bedrock:InvokeModel` permission on the Titan foundation model. Without it, embedding requests fail with a 403 error.

Attach this policy to the IAM user:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "bedrock:InvokeModel",
      "Resource": "arn:aws:bedrock:<your-region>::foundation-model/amazon.titan-embed-text-v1"
    }
  ]
}
```

Replace `<your-region>` with your `BR_AWS_REGION` value.
:::

:::info
Automatic embedding model deployment only works with self-hosted OpenSearch. For AWS OpenSearch, deploy the model manually and set `OPENSEARCH_ML_MODEL_ID` to that model’s ID.
:::

## Restart Plane

After updating the environment file, restart Plane.

**Docker:**

```bash
prime-cli restart
```

Or if you're managing containers directly:

```bash
docker compose down
docker compose up -d
```

**Kubernetes:**

```bash
helm upgrade --install plane-app plane/plane-enterprise \
    --namespace plane \
    -f values.yaml \
    --wait
```

## Vectorize existing data

::: info Only needed for semantic search
Skip this section if you haven't configured OpenSearch and an embedding model. Vectorization is only required for semantic search functionality.
:::

If you configured OpenSearch and an embedding model, generate embeddings for your existing content by running this command in the API container.

**Docker:**

```bash
docker exec -it plane-api-1 sh
python manage.py manage_search_index --background --vectorize document index --force
```

**Kubernetes:**

```bash
API_POD=$(kubectl get pods -n plane --no-headers | grep api | head -1 | awk '{print $1}')
kubectl exec -n plane $API_POD -- python manage.py manage_search_index --background --vectorize document index --force
```

The `--background` flag processes vectorization through Celery workers. This is recommended for instances with large amounts of existing content.

### Changing the embedding dimension

If you update the model or manually override the dimension size by setting `OPENSEARCH_EMBEDDING_DIMENSION`, you must recreate your search indices so they adopt the new dimension size, then reindex and revectorize your workspace. Ensure that the model associated with your `OPENSEARCH_ML_MODEL_ID` and your `EMBEDDING_MODEL` configuration share this same dimension size.

Run these commands inside your API container or pod after updating the environment variables and restarting the Plane services:

```bash
# 1. Rebuild all search indices to apply the new dimension size
python manage.py manage_search_index index rebuild --force

# 2. Reindex and revectorize all existing documents
python manage.py manage_search_index --background --vectorize document index --force
```

## After setup

Once configured:

- Plane AI chat, duplicate detection, and LLM-powered features are available across your workspace.

**If you configured OpenSearch and an embedding model:**

- Semantic search is enabled across work items, pages, and projects.
- New content (work items, pages, comments) is automatically vectorized in the background.
- Semantic search stays synchronized without manual intervention.

## Environment variables reference

See the [environment variables reference](/self-hosting/govern/environment-variables#plane-ai) for a complete list of AI-related configuration options.
