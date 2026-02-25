---
title: Environment variables reference
description: Configure environment variables for Plane. Complete reference of all configuration options and settings.
keywords: plane environment variables, configuration reference, env settings, plane config, self-hosting settings, plane env
---

# Environment variables reference <Badge type="info" text="Commercial Edition" />

This guide provides a comprehensive overview of all environment variables used in the Commercial Edition. These variables allow you to customize your Plane instance to best fit your organization's needs.

## Where to find the .env file

The environment file for Plane Commercial Edition is located at:

```bash
/opt/plane/plane.env
```

This is where you'll make all configuration changes. Remember to restart the instance after making changes to ensure they take effect.

## Environment variables

### General settings

| Variable                 | Description                                                                                                                   | Default Value             |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **INSTALL_DIR**          | Directory where Plane is installed.                                                                                           | `/opt/plane`              |
| **DOMAIN_NAME**          | Primary domain name for your Plane instance. This determines how users will access your installation.                         | `localhost`               |
| **APP_RELEASE_VERSION**  | The version of Plane Commercial Edition you're running. This helps with troubleshooting and ensures compatibility.            | _Current release version_ |
| **WEB_URL**              | The complete base URL for the web application including protocol (e.g., `https://plane.example.com`).                         | `http://localhost`        |
| **CORS_ALLOWED_ORIGINS** | Comma-separated list of origins allowed to make cross-origin requests to your API. Usually, this should include your WEB_URL. | `http://localhost`        |
| **DEBUG**                | Toggles debug mode for more verbose logging and debugging information.                                                        | `0` (disabled)            |

### Scaling and performance

| Variable                 | Description                                                                                                      | Default Value |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------- |
| **WEB_REPLICAS**         | Number of web server replicas for load balancing.                                                                | `1`           |
| **SPACE_REPLICAS**       | Number of space service replicas for workspaces.                                                                 | `1`           |
| **ADMIN_REPLICAS**       | Number of admin service replicas.                                                                                | `1`           |
| **API_REPLICAS**         | Number of API service replicas.                                                                                  | `1`           |
| **WORKER_REPLICAS**      | Number of worker service replicas for background tasks.                                                          | `1`           |
| **BEAT_WORKER_REPLICAS** | Number of beat worker replicas for scheduled tasks.                                                              | `1`           |
| **LIVE_REPLICAS**        | Number of live service replicas for real-time updates.                                                           | `1`           |
| **GUNICORN_WORKERS**     | Number of Gunicorn workers for handling web requests. Increase for better performance on high-traffic instances. | `2`           |

### Networking and security

| Variable              | Description                                                                                                       | Default Value |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------- |
| **LISTEN_HTTP_PORT**  | Port for HTTP traffic.                                                                                            | `80`          |
| **LISTEN_HTTPS_PORT** | Port for HTTPS traffic.                                                                                           | `443`         |
| **APP_PROTOCOL**      | Protocol to be used, either `http` or `https`.                                                                    | `http`        |
| **TRUSTED_PROXIES**   | CIDR notation of trusted proxies for request forwarding. Important when behind load balancers or reverse proxies. | `0.0.0.0/0`   |
| **SSL_VERIFY**        | Whether to verify SSL certificates for outgoing connections. Set to `0` only in development environments.         | `1`           |

### SSL and certificates

| Variable          | Description                                                                                                                          | Default Value                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| **CERT_EMAIL**    | Email used for SSL certificate registration with Let's Encrypt or other ACME providers.                                              | `admin@example.com`                              |
| **CERT_ACME_CA**  | ACME Certificate Authority URL for SSL certificate issuance.                                                                         | `https://acme-v02.api.letsencrypt.org/directory` |
| **CERT_ACME_DNS** | DNS provider configuration for SSL certificate domain validation. Format varies by provider.                                         |                                                  |
| **SITE_ADDRES**   | The domain name and port required by Caddy for serving your Plane instance. This determines how Caddy will handle incoming requests. | `localhost:80`                                   |

### Database settings

| Variable              | Description                                                                                                                                                                | Default Value              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **PGHOST**            | Hostname or IP address of your PostgreSQL server.                                                                                                                          | `plane-db`                 |
| **PGDATABASE**        | Name of the PostgreSQL database Plane will use.                                                                                                                            | `plane`                    |
| **POSTGRES_USER**     | Username for PostgreSQL authentication.                                                                                                                                    | `plane`                    |
| **POSTGRES_PASSWORD** | Password for PostgreSQL authentication. **Critical:** Use a strong, unique password here.                                                                                  | `plane`                    |
| **POSTGRES_DB**       | Same as PGDATABASE - the name of the PostgreSQL database.                                                                                                                  | `plane`                    |
| **POSTGRES_PORT**     | TCP port your PostgreSQL server is listening on.                                                                                                                           | `5432`                     |
| **PGDATA**            | Directory path where PostgreSQL data is stored. Only relevant if you're managing PostgreSQL within the same container/system.                                              | `/var/lib/postgresql/data` |
| **DATABASE_URL**      | Full connection string for PostgreSQL. If provided, this takes precedence over individual connection parameters. Format: `postgresql://username:password@host:port/dbname` |                            |

### Redis settings

| Variable       | Description                                  | Default Value |
| -------------- | -------------------------------------------- | ------------- |
| **REDIS_HOST** | Hostname or IP address of your Redis server. | `plane-redis` |
| **REDIS_PORT** | TCP port your Redis server is listening on.  | `6379`        |
| **REDIS_URL**  | Full connection string for Redis.            |               |

### RabbitMQ settings

| Variable                   | Description                                                                             | Default Value |
| -------------------------- | --------------------------------------------------------------------------------------- | ------------- |
| **RABBITMQ_HOST**          | Hostname or IP address of your RabbitMQ server.                                         | `plane-mq`    |
| **RABBITMQ_PORT**          | TCP port your RabbitMQ server is listening on.                                          | `5672`        |
| **RABBITMQ_DEFAULT_USER**  | Username for RabbitMQ authentication.                                                   | `plane`       |
| **RABBITMQ_DEFAULT_PASS**  | Password for RabbitMQ authentication.                                                   | `plane`       |
| **RABBITMQ_DEFAULT_VHOST** | Virtual host for RabbitMQ, providing logical separation of resources.                   | `plane`       |
| **AMQP_URL**               | Full connection string for RabbitMQ. Format: `amqp://username:password@host:port/vhost` |               |

### Authentication and security

| Variable              | Description                                                                        | Default Value |
| --------------------- | ---------------------------------------------------------------------------------- | ------------- |
| **SECRET_KEY**        | Secret key used for various cryptographic operations, including JWT token signing. |               |
| **MACHINE_SIGNATURE** | Unique identifier for your instance, used for licensing and authentication.        |               |

### File Storage (MinIO / S3)

| Variable                  | Description                                                                                                                | Default Value             |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **USE_MINIO**             | Determines whether to use MinIO for object storage. Set to `1` to enable MinIO, `0` to use configured S3 or local storage. | `1`                       |
| **AWS_REGION**            | AWS region for S3 storage services.                                                                                        |                           |
| **AWS_ACCESS_KEY_ID**     | Access key for MinIO or AWS S3 authentication.                                                                             |                           |
| **AWS_SECRET_ACCESS_KEY** | Secret key for MinIO or AWS S3 authentication.                                                                             |                           |
| **AWS_S3_ENDPOINT_URL**   | Custom endpoint URL for MinIO or S3-compatible storage.                                                                    | `http://plane-minio:9000` |
| **AWS_S3_BUCKET_NAME**    | S3 bucket name for file storage.                                                                                           | `uploads`                 |
| **MINIO_ROOT_USER**       | Username for MinIO authentication. This is effectively your MinIO admin account.                                           | `access-key`              |
| **MINIO_ROOT_PASSWORD**   | Password for MinIO root user authentication. Keep this secure as it provides full access to your storage.                  | `secret-key`              |
| **BUCKET_NAME**           | S3 bucket name where all file uploads will be stored. This bucket will be automatically created if it doesn't exist.       | `uploads`                 |
| **FILE_SIZE_LIMIT**       | Maximum file upload size in bytes.                                                                                         | `5242880` (5MB)           |
| **MINIO_ENDPOINT_SSL**    | Force HTTPS for MinIO when dealing with SSL termination. Set to `1` to enable.                                             | `0`                       |

### GitHub integration

| Variable                 | Description                                      | Default Value |
| ------------------------ | ------------------------------------------------ | ------------- |
| **GITHUB_CLIENT_ID**     | OAuth client ID for GitHub integration.          |               |
| **GITHUB_CLIENT_SECRET** | OAuth client secret for GitHub integration.      |               |
| **GITHUB_APP_NAME**      | GitHub App name for enhanced GitHub integration. |               |
| **GITHUB_APP_ID**        | GitHub App ID for enhanced GitHub integration.   |               |
| **GITHUB_PRIVATE_KEY**   | Private key for GitHub App authentication.       |               |

### Slack integration

| Variable                | Description                                | Default Value |
| ----------------------- | ------------------------------------------ | ------------- |
| **SLACK_CLIENT_ID**     | OAuth client ID for Slack integration.     |               |
| **SLACK_CLIENT_SECRET** | OAuth client secret for Slack integration. |               |

### GitLab integration

| Variable                 | Description                                 | Default Value |
| ------------------------ | ------------------------------------------- | ------------- |
| **GITLAB_CLIENT_ID**     | OAuth client ID for GitLab integration.     |               |
| **GITLAB_CLIENT_SECRET** | OAuth client secret for GitLab integration. |               |

### OpenSearch

| Variable                  | Description                                                 | Default Value                          |
| ------------------------- | ----------------------------------------------------------- | -------------------------------------- |
| `OPENSEARCH_ENABLED`      | Enable OpenSearch integration                               | `1`                                    |
| `OPENSEARCH_URL`          | OpenSearch endpoint URL                                     | `https://opensearch.example.com:9200/` |
| `OPENSEARCH_USERNAME`     | Authentication username                                     | `admin`                                |
| `OPENSEARCH_PASSWORD`     | Authentication password                                     | `your-secure-password`                 |
| `OPENSEARCH_INDEX_PREFIX` | Prefix for all index names (useful for multi-tenant setups) | (empty)                                |


### Plane AI

#### Plane AI replicas

To start Plane AI services, set each replica count to `1`:

| Variable | Description | Required |
|----------|-------------|----------|
| `PI_API_REPLICAS` | Plane AI API replica count | Yes |
| `PI_BEAT_REPLICAS` | Plane AI Beat Worker replica count | Yes |
| `PI_WORKER_REPLICAS` | Plane AI Worker replica count | Yes |
| `PI_MIGRATOR_REPLICAS` | Plane AI Migrator replica count | Yes |

#### LLM provider API keys

Plane AI supports multiple LLM providers. Configure one or more by adding their API keys.

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | API key for OpenAI models | Optional |
| `CLAUDE_API_KEY` | API key for Anthropic models | Optional |
| `GROQ_API_KEY` | API key for speech-to-text features | Optional |
| `CUSTOM_LLM_ENABLED` | Set to `true` to use a custom LLM with an OpenAI-compatible API | Optional |
| `CUSTOM_LLM_MODEL_KEY` | Identifier key for the custom model | Optional |
| `CUSTOM_LLM_BASE_URL` | Base URL of the custom model's OpenAI-compatible endpoint | Optional |
| `CUSTOM_LLM_API_KEY` | API key for the custom endpoint | Optional |
| `CUSTOM_LLM_NAME` | Display name for the custom model | Optional |
| `CUSTOM_LLM_DESCRIPTION` | Description of the custom model | Optional |
| `CUSTOM_LLM_MAX_TOKENS` | Maximum token limit for the custom model | Optional |

#### Provider base URLs

Use these when routing requests through self-hosted gateways, proxies, or compatible third-party endpoints.

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_BASE_URL` | Custom base URL for OpenAI-compatible APIs | OpenAI |
| `CLAUDE_BASE_URL` | Custom base URL for Claude-compatible APIs | Anthropic |
| `COHERE_BASE_URL` | Custom base URL for Cohere APIs | Cohere |
| `GROQ_BASE_URL` | Custom base URL for Groq APIs | Groq |

#### Embedding model configuration

These settings are required for semantic search and Plane AI Chat. Configure one of the following options.

| Variable | Description | Required |
|----------|-------------|----------|
| `EMBEDDING_MODEL_ID` | ID of an existing embedding model deployed in OpenSearch (works with both self-hosted and AWS OpenSearch) | Conditional |
| `EMBEDDING_MODEL` | Embedding model to automatically deploy (e.g., `cohere/embed-v4.0`, `openai/text-embedding-3-small`, `bedrock/amazon.titan-embed-text-v1`). Self-hosted OpenSearch only. | Conditional |
| `COHERE_API_KEY` | API key for Cohere embedding models | Conditional |
| `BR_AWS_ACCESS_KEY_ID` | AWS access key ID for Bedrock Titan embedding | Conditional |
| `BR_AWS_SECRET_ACCESS_KEY` | AWS secret access key for Bedrock Titan embedding | Conditional |
| `BR_AWS_REGION` | AWS region for Bedrock Titan embedding | Conditional |

For setup instructions, supported models, and IAM permissions, see [Enable Plane AI](/self-hosting/govern/plane-ai).

### API settings

| Variable               | Description                                                             | Default Value |
| ---------------------- | ----------------------------------------------------------------------- | ------------- |
| **API_KEY_RATE_LIMIT** | Rate limit for API requests to prevent abuse. Format: `number/timeunit` | `60/minute`   |

::: details Community Edition

This guide provides a comprehensive overview of all environment variables available for configuring your self-hosted Plane Community Edition. Use these variables to customize your instance to fit your deployment needs.

## Where to find the environment file

The environment configuration file is located at:

```bash
plane-selfhost/plane-app/plane.env
```

## Environment Variables

### General settings

| Variable                 | Description                                                                                                                                         | Default Value          |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **APP_DOMAIN**           | Domain name for your Plane instance. This determines how users will access your installation.                                                       | `localhost`            |
| **APP_RELEASE**          | Release version of Plane. Helps with compatibility and troubleshooting.                                                                             | `stable`               |
| **WEB_URL**              | The complete base URL for the web application including protocol. Essential for email links and integrations.                                       | `http://${APP_DOMAIN}` |
| **CORS_ALLOWED_ORIGINS** | Comma-separated list of origins allowed to make cross-origin requests to your API.                                                                  | `http://${APP_DOMAIN}` |
| **DEBUG**                | Toggles debug mode for verbose logging. Set to `1` to enable, `0` to disable. Not recommended in production as it may expose sensitive information. | `0`                    |
| **LISTEN_HTTP_PORT**     | Port for HTTP traffic. The primary port your users will connect to.                                                                                 | `80`                   |
| **LISTEN_HTTPS_PORT**    | Port for HTTPS traffic. The primary port your users will connect to.                                                                                | `443`                  |

### Scaling and performance

| Variable                 | Description                                                                                       | Default Value |
| ------------------------ | ------------------------------------------------------------------------------------------------- | ------------- |
| **WEB_REPLICAS**         | Number of web server replicas for serving the frontend UI. Increase for better load distribution. | `1`           |
| **SPACE_REPLICAS**       | Number of space service replicas handling workspace-related operations.                           | `1`           |
| **ADMIN_REPLICAS**       | Number of admin service replicas for administrative functions.                                    | `1`           |
| **API_REPLICAS**         | Number of API service replicas processing API requests.                                           | `1`           |
| **WORKER_REPLICAS**      | Number of worker service replicas handling background tasks.                                      | `1`           |
| **BEAT_WORKER_REPLICAS** | Number of beat worker replicas for scheduled/periodic tasks.                                      | `1`           |
| **LIVE_REPLICAS**        | Number of live service replicas for real-time updates and WebSocket connections.                  | `1`           |
| **GUNICORN_WORKERS**     | Number of Gunicorn workers per API instance. Increase for better request handling capacity.       | `1`           |

### API settings

| Variable               | Description                                                             | Default Value |
| ---------------------- | ----------------------------------------------------------------------- | ------------- |
| **API_KEY_RATE_LIMIT** | Rate limit for API requests to prevent abuse. Format: `number/timeunit` | `60/minute`   |

### Database settings

| Variable              | Description                                                                                                                                  | Default Value              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **PGHOST**            | Hostname or IP address of your PostgreSQL server.                                                                                            | `plane-db`                 |
| **PGDATABASE**        | Name of the PostgreSQL database Plane will use.                                                                                              | `plane`                    |
| **POSTGRES_USER**     | Username for PostgreSQL authentication.                                                                                                      | `plane`                    |
| **POSTGRES_PASSWORD** | Password for PostgreSQL authentication. Use a strong, unique password.                                                                       | `plane`                    |
| **POSTGRES_DB**       | Same as PGDATABASE - the name of the PostgreSQL database.                                                                                    | `plane`                    |
| **POSTGRES_PORT**     | TCP port your PostgreSQL server is listening on.                                                                                             | `5432`                     |
| **PGDATA**            | Directory path where PostgreSQL data is stored. Only relevant if you're managing PostgreSQL directly.                                        | `/var/lib/postgresql/data` |
| **DATABASE_URL**      | Full connection string for PostgreSQL. If provided, overrides individual settings. Format: `postgresql://username:password@host:port/dbname` |                            |

### Redis settings

| Variable       | Description                                                                     | Default Value |
| -------------- | ------------------------------------------------------------------------------- | ------------- |
| **REDIS_HOST** | Hostname or IP address of your Redis server.                                    | `plane-redis` |
| **REDIS_PORT** | TCP port your Redis server is listening on.                                     | `6379`        |
| **REDIS_URL**  | Full connection string for Redis. Format: `redis://username:password@host:port` |               |

### RabbitMQ settings

| Variable              | Description                                                                                      | Default Value                            |
| --------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| **RABBITMQ_HOST**     | Hostname or IP address of your RabbitMQ server.                                                  | `plane-mq`                               |
| **RABBITMQ_PORT**     | TCP port your RabbitMQ server is listening on.                                                   | `5672`                                   |
| **RABBITMQ_USER**     | Username for RabbitMQ authentication.                                                            | `plane`                                  |
| **RABBITMQ_PASSWORD** | Password for RabbitMQ authentication. Use a strong, unique password.                             | `plane`                                  |
| **RABBITMQ_VHOST**    | Virtual host for RabbitMQ, providing logical separation of resources.                            | `plane`                                  |
| **AMQP_URL**          | Full connection string for RabbitMQ. If not provided, it's constructed from individual settings. | `amqp://plane:plane@plane-mq:5672/plane` |

### File Storage (MinIO / S3)

| Variable                  | Description                                                                                         | Default Value   |
| ------------------------- | --------------------------------------------------------------------------------------------------- | --------------- |
| **USE_MINIO**             | Whether to use MinIO for object storage. Set to `1` to enable, `0` to use other configured storage. | `1`             |
| **MINIO_ENDPOINT_SSL**    | Force HTTPS for MinIO when handling SSL termination. Set to `1` to enable.                          | `0`             |
| **AWS_REGION**            | AWS region for S3 storage services. Applies when using S3 or MinIO.                                 |                 |
| **AWS_ACCESS_KEY_ID**     | Access key for MinIO or AWS S3 authentication.                                                      | `access-key`    |
| **AWS_SECRET_ACCESS_KEY** | Secret key for MinIO or AWS S3 authentication.                                                      | `secret-key`    |
| **AWS_S3_ENDPOINT_URL**   | Endpoint URL for MinIO or S3-compatible storage.                                                    |                 |
| **AWS_S3_BUCKET_NAME**    | S3 bucket name for file storage. All uploads will be stored in this bucket.                         | `uploads`       |
| **FILE_SIZE_LIMIT**       | Maximum file upload size in bytes.                                                                  | `5242880` (5MB) |

### Security settings

| Variable       | Description                                                                                                               | Default Value |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------- |
| **SECRET_KEY** | Secret key used for cryptographic operations like session handling and token generation. Should be a long, random string. |               |

:::
