---
title: Custom LLM models
description: Connect a self-hosted or third-party LLM to Plane AI using an OpenAI-compatible endpoint or AWS Bedrock.
keywords: custom llm, self-hosted llm, ollama, litellm, groq, aws bedrock, plane ai custom model
---

# Custom LLM models <Badge type="info" text="Commercial Edition" />

Plane AI supports one custom LLM alongside OpenAI and Anthropic. Pick the provider type that fits your setup:

| Provider type         | Use when                                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| **OpenAI-compatible** | Your model is served via an OpenAI Chat Completions API (Ollama, Groq, vLLM, LiteLLM, Cerebras, etc.) |
| **AWS Bedrock**       | You're accessing models through Amazon Bedrock                                                        |

:::warning
Use a model with at least 1 trillion parameters. Smaller models produce degraded output across Plane AI features.
:::

:::tip No OpenAI-compatible API?
Proxy any model through [LiteLLM](https://docs.litellm.ai) — it exposes any LLM behind the OpenAI API. Then use the OpenAI-compatible setup below.
:::

---

## OpenAI-compatible

Add to `/opt/plane/plane.env`:

```bash
CUSTOM_LLM_ENABLED=true
CUSTOM_LLM_PROVIDER=openai
CUSTOM_LLM_MODEL_KEY=your-model-id        # model ID as the endpoint expects it
CUSTOM_LLM_BASE_URL=https://your-endpoint/v1
CUSTOM_LLM_API_KEY=your-api-key           # use any non-empty string if no key is required
CUSTOM_LLM_NAME=Your Model Name           # display name shown to users
CUSTOM_LLM_MAX_TOKENS=128000              # optional, defaults to 128000
```

**Examples:**

```bash
# Groq
CUSTOM_LLM_MODEL_KEY=llama-3.3-70b-versatile
CUSTOM_LLM_BASE_URL=https://api.groq.com/openai/v1
CUSTOM_LLM_API_KEY=gsk_xxxxxxxxxxxx

# Ollama (local)
CUSTOM_LLM_MODEL_KEY=llama3
CUSTOM_LLM_BASE_URL=http://localhost:11434/v1
CUSTOM_LLM_API_KEY=ollama

# LiteLLM proxy
CUSTOM_LLM_MODEL_KEY=your-litellm-model
CUSTOM_LLM_BASE_URL=http://litellm:4000/v1
CUSTOM_LLM_API_KEY=your-litellm-master-key
```

---

## AWS Bedrock

### Standard credentials

Use for IAM user access with an explicit access key and secret.

```bash
CUSTOM_LLM_ENABLED=true
CUSTOM_LLM_PROVIDER=bedrock
CUSTOM_LLM_MODEL_KEY=anthropic.claude-3-5-sonnet-20241022-v2:0  # Bedrock model ID
CUSTOM_LLM_API_KEY=your-aws-secret-access-key
CUSTOM_LLM_AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id  # standard AWS env var, picked up by boto3
CUSTOM_LLM_NAME=Claude via Bedrock
```

:::warning IAM permission required
The IAM user must have `bedrock:InvokeModel` permission on the target model.
:::

### Inference profile (IRSA / EKS Pod Identity)

Use for Kubernetes deployments where the pod has an ambient IAM role. No static credentials needed.

```bash
CUSTOM_LLM_ENABLED=true
CUSTOM_LLM_PROVIDER=bedrock
CUSTOM_LLM_MODEL_KEY=claude-sonnet-4-6
CUSTOM_LLM_AWS_REGION=us-east-1
BEDROCK_INFERENCE_PROFILE_ARN=arn:aws:bedrock:us-east-1:123456789012:application-inference-profile/xxxx
# or use BEDROCK_INFERENCE_PROFILE_ID=global.anthropic.claude-sonnet-4-6
CUSTOM_LLM_NAME=Claude via Inference Profile
```

Plane AI activates inference profile mode automatically when a profile ARN or ID is set and ambient AWS credentials are present (`AWS_ROLE_ARN`, `AWS_WEB_IDENTITY_TOKEN_FILE`, `AWS_CONTAINER_CREDENTIALS_FULL_URI`, or `AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE`).

---

After updating `/opt/plane/plane.env`, restart Plane:

```bash
prime-cli restart
```
