---
title: Configure Plane AI
description: Configure Plane AI on your self-hosted Plane deployment. Set up LLM providers, embedding models, and semantic search for Plane's AI features.
keywords: plane ai, Plane ai, self-hosted ai, llm configuration, embedding models, semantic search, openai, anthropic, cohere
---

# Configure Plane AI <Badge type="info" text="Commercial Edition" />

Plane AI brings AI-powered features to your workspace, including natural language chat, duplicate detection, and semantic search across work items, pages, and projects. This guide walks you through configuring Plane AI on your self-hosted instance.

For an overview of what Plane AI can do, see the [Plane AI](https://docs.plane.so/ai/pi-chat).

## Before you begin

You'll need:

- An OpenSearch 2.x instance (self-hosted or AWS OpenSearch) configured for [advanced search](/self-hosting/govern/advanced-search).
- At least one LLM provider API key or a custom OpenAI-compatible endpoint.
- At least one embedding model configured in OpenSearch.

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

#### Custom models (self-hosted or third-party)

Plane AI works with any model exposed through an OpenAI-compatible API, including models served by Ollama, Groq, Cerebras, and similar runtimes. You can configure one custom model alongside your public provider keys.

:::warning
For reliable performance across all Plane AI features, use a custom model with at least 100 billion parameters. Larger models produce better results.
:::

### Embedding models

Embedding models power semantic search. Plane AI supports:

| Provider | Supported models |
|----------|-----------------|
| **Cohere** | `cohere/embed-v4.0` |
| **OpenAI** | `openai/text-embedding-ada-002`, `openai/text-embedding-3-small` |
| **AWS Bedrock (Titan)** | `bedrock/amazon.titan-embed-text-v1` |

## Enable Plane AI services

Open the `/opt/plane/plane.env` file in your preferred editor and set the replica count for Plane AI services to `1`:

```bash
PI_API_REPLICAS=1
PI_BEAT_REPLICAS=1
PI_WORKER_REPLICAS=1
PI_MIGRATOR_REPLICAS=1
```

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

Use this for self-hosted models or third-party OpenAI-compatible endpoints.

```bash
CUSTOM_LLM_ENABLED=true
CUSTOM_LLM_MODEL_KEY=your-model-key
CUSTOM_LLM_BASE_URL=http://your-endpoint/v1
CUSTOM_LLM_API_KEY=your-api-key
CUSTOM_LLM_NAME=Your Model Name
CUSTOM_LLM_DESCRIPTION="Optional description"
CUSTOM_LLM_MAX_TOKENS=128000
```

:::info
The custom endpoint must expose an OpenAI-compatible API matching OpenAI's request and response format.
:::

### Speech-to-text (optional)

```bash
GROQ_API_KEY=your-groq-api-key
```

This enables voice input in Plane AI. It's not required for LLM or semantic search features.

## Configure OpenSearch and an embedding model

Plane AI uses OpenSearch for semantic indexing and retrieval. If you haven't set up OpenSearch yet, complete the [OpenSearch for advanced search](/self-hosting/govern/advanced-search) guide first, then return here.

### Configure OpenSearch connection

```bash
OPENSEARCH_URL=https://your-opensearch-instance:9200/
OPENSEARCH_USERNAME=admin
OPENSEARCH_PASSWORD=your-secure-password
OPENSEARCH_INDEX_PREFIX=plane
```

### Configure an embedding model

Configure exactly one embedding model using one of these options.

#### Option A: Use an existing OpenSearch model ID

If you've already deployed an embedding model in OpenSearch, provide its model ID. This works with both self-hosted and AWS OpenSearch.

```bash
EMBEDDING_MODEL_ID=your-model-id
```

For AWS OpenSearch, you must deploy the embedding model manually before setting this variable. See [Deploy an embedding model on AWS OpenSearch](/self-hosting/govern/aws-opensearch-embedding).

#### Option B: Automatic deployment (self-hosted OpenSearch only)

For self-hosted OpenSearch, Plane can automatically create and deploy the embedding model. Provide the model name and the corresponding provider credentials.

**Cohere:**

```bash
EMBEDDING_MODEL=cohere/embed-v4.0
COHERE_API_KEY=your-cohere-api-key
```

**OpenAI:**

```bash
EMBEDDING_MODEL=openai/text-embedding-3-small
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
```

**AWS Bedrock (Titan):**

```bash
EMBEDDING_MODEL=bedrock/amazon.titan-embed-text-v1
BR_AWS_ACCESS_KEY_ID=your-access-key
BR_AWS_SECRET_ACCESS_KEY=your-secret-key
BR_AWS_REGION=your-region
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
Automatic embedding model deployment only works with self-hosted OpenSearch. For AWS OpenSearch, deploy the model manually and use `EMBEDDING_MODEL_ID`.
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

Generate embeddings for your existing content by running this command in the API container.

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

## After setup

Once configured:

- Plane AI is available across your workspace.
- New content (work items, pages, comments) is automatically vectorized in the background.
- Semantic search stays synchronized without manual intervention.

## Environment variables reference

See the [environment variables reference](/self-hosting/govern/environment-variables#plane-ai) for a complete list of AI-related configuration options.
