---
title: Deploy Plane airgapped on Kubernetes
description: Deploy Plane Commercial in an airgapped Kubernetes cluster with Helm. Mirror images to an internal registry, configure offline values, install, and activate a license without internet access.
keywords: plane airgapped kubernetes, offline k8s deployment, air-gapped helm, kubernetes offline, plane helm airgapped, self-hosting
---

# Deploy Plane airgapped on Kubernetes <Badge type="warning" text="Enterprise Grid" />

::: info
Airgapped deployments are available exclusively for Enterprise Grid customers with a minimum commitment of 100 seats. Contact our [Sales team](mailto:sales@plane.so) for trials, exceptions to the seat cut-off, tailored pricing, and licensing info.
:::

This guide walks you through deploying Plane Commercial in an airgapped Kubernetes cluster using the `plane-enterprise` Helm chart and images mirrored to your internal registry.

Read [Airgapped deployment architecture](/self-hosting/methods/airgapped-requirements) first. It covers the registry, ingress, storage, certificate, and secret-management requirements that this guide assumes are already in place.

## What you'll need

You will work across two machines:

| Machine            | Connectivity       | Used for                                                                     |
| ------------------ | ------------------ | ---------------------------------------------------------------------------- |
| **Staging host**   | Internet access    | Downloading the Helm chart and mirroring images into your internal registry. |
| **Airgapped host** | No internet access | Running `helm` and `kubectl` against the target cluster.                     |

Every command below is labeled with the host it runs on.

On the cluster side, make sure you have:

- Kubernetes cluster (v1.31 - v1.33)
- Helm 3.x and `kubectl` configured to reach the cluster **from the airgapped host**
- An internal OCI/container registry reachable from every node, holding the mirrored images
- A `StorageClass` you can name explicitly — airgapped clusters often have no default, and PVCs will sit in `Pending` without one
- A working ingress controller (`ingress-nginx`, Traefik, or OpenShift Routes)
- A TLS certificate issued by your internal CA, loaded into the cluster as a Secret
- `cert-manager` **only if** you issue certificates in-cluster. Its images must be mirrored too, and it must be configured with an internal CA issuer — public ACME and DNS-01 issuers are unreachable from an air gap
- Required ports opened to access the application (80, 443)
- SMTP ports opened if using email intake (25, 465, 587)

::: warning
While Kubernetes can run stateful services with persistent volumes, and Plane's Helm chart supports deploying PostgreSQL, MinIO, RabbitMQ, OpenSearch, and Redis, we strongly recommend using external managed services for better reliability in backup/restore operations and disaster recovery.

Consider these alternatives:

- **MinIO**: Replace with AWS S3, Google Cloud Storage, or any S3-compatible service
- **Redis**: Replace with Valkey or a managed Redis service
- **PostgreSQL**: Use a managed PostgreSQL service
- **RabbitMQ**: Use a managed message queue service
- **OpenSearch**: Use a managed OpenSearch service
  :::

## Step 1: Download the Helm chart

**On the staging host.**

Set the versions and registry once, and reuse them throughout:

```bash
# Chart version - check Artifact Hub for the latest
export CHART_VERSION=3.5.7

# Plane version - copy this from prime.plane.so. It must match the version
# your license was issued for.
export PLANE_VERSION=v3.1.4

# Where you will mirror the images
export DESTINATION_REGISTRY=registry.internal.example.com/plane
```

::: tip
Check the latest chart version on [Artifact Hub](https://artifacthub.io/packages/helm/makeplane/plane-enterprise). Each chart ships a default `planeVersion` (chart `3.5.7` ships `v3.1.4`), but you should set `planeVersion` explicitly to the version your license covers rather than relying on the chart default.
:::

Pull the chart archive:

```bash
helm repo add plane https://helm.plane.so/
helm repo update
helm pull plane/plane-enterprise --version "${CHART_VERSION}"
```

Or download the release artifact directly:

```bash
curl -L -O "https://github.com/makeplane/helm-charts/releases/download/plane-enterprise-${CHART_VERSION}/plane-enterprise-${CHART_VERSION}.tgz"
```

## Step 2: Mirror the images

**On the staging host.**

Follow [Clone Docker images to your private registry](/self-hosting/methods/clone-docker-images) to copy images from the Plane artifact registry into your internal registry.

The Kubernetes chart does not use every image in that list, and it needs a few that are not in it. Mirror the following:

**Plane services — always required**

```text
makeplane/backend-commercial:${PLANE_VERSION}   # api, workers, consumers, migrator
makeplane/web-commercial:${PLANE_VERSION}
makeplane/space-commercial:${PLANE_VERSION}
makeplane/admin-commercial:${PLANE_VERSION}
makeplane/live-commercial:${PLANE_VERSION}
makeplane/monitor-commercial:${PLANE_VERSION}
makeplane/silo-commercial:${PLANE_VERSION}
```

**Plane services — only if you enable them**

```text
makeplane/email-commercial:${PLANE_VERSION}       # services.email_service (email intake)
makeplane/iframely:v1.2.0                         # services.iframely (link previews)
makeplane/plane-pi-commercial:${PLANE_VERSION}    # services.pi (Plane AI)
makeplane/node-runner-commercial:${PLANE_VERSION} # services.runner (Plane AI)
```

::: warning
**`busybox` is required and is not in the clone list.** The chart runs BusyBox init containers for:

- `silo` — a `wait-for-rabbitmq` init container that runs on **every** install
- `silo` and `live` — a `prepare-ca-bundle` init container, rendered when `airgapped.enabled` is set together with an S3 CA secret
- `minio` — an init container on the MinIO client job, when `services.minio.local_setup` is `true`

The chart defaults these to `busybox` (implicitly `busybox:latest`). Mirror a pinned tag and point the `init_image` keys at it, as shown in [Init container images](#init-container-images).
:::

**Infrastructure images — only for services you run in-cluster (`local_setup: true`)**

```text
valkey/valkey:7.2.11-alpine
postgres:15.7-alpine
rabbitmq:3.13.6-management-alpine
minio/minio:latest
minio/mc:latest
opensearchproject/opensearch:3.3.2
busybox:1.36
```

::: info
The Plane artifact registry does not host these infrastructure images. Pull them from their public registries on the staging host and mirror them yourself. If you point the chart at managed PostgreSQL, Redis/Valkey, RabbitMQ, OpenSearch, and S3, you only need `busybox` from this list.
:::

`proxy-commercial` is used by the Docker Compose deployment only — the Kubernetes chart routes traffic through your ingress controller instead, so you do not need to mirror it for this install.

## Step 3: Transfer artifacts into the air gap

Move the following across the gap by whatever method your security policy allows:

- `plane-enterprise-${CHART_VERSION}.tgz`
- The license file for `${PLANE_VERSION}`, downloaded from the [Prime portal](https://prime.plane.so/licenses) (see [Activate your license](#step-6-activate-your-license))
- Your internal CA certificate, if the API and `live` services need to trust a private S3 endpoint

The mirrored images do not need transferring separately if your internal registry is already reachable from the cluster.

## Step 4: Configure your values file

**On the airgapped host.**

Extract the chart defaults into a file you can edit and keep under version control:

```bash
helm show values "plane-enterprise-${CHART_VERSION}.tgz" > custom-values.yaml
```

The sections below cover the values that matter for an airgapped install. For the full reference, see [Configuration settings](/self-hosting/methods/kubernetes#configuration-settings).

### Version, license domain, and airgapped mode

```yaml
# The Plane version to deploy. Must match the version your license was issued for.
planeVersion: v3.1.4

license:
  # Required. The FQDN the license is bound to. This is also used as the
  # ingress host, so this is how you reach Plane.
  licenseDomain: plane.internal.example.com

# Enable airgapped mode (REQUIRED)
airgapped:
  enabled: true
  # Optional: CA certificates the API and live services should trust when
  # talking to an internal S3-compatible endpoint. Create each Secret first:
  #   kubectl -n plane create secret generic plane-s3-ca \
  #     --from-file=s3-custom-ca.crt=/path/to/ca.crt
  s3Secrets:
    - name: plane-s3-ca
      key: s3-custom-ca.crt
```

::: info
`license.licenseServer` defaults to `https://prime.plane.so`, which is unreachable from an air gap. With `airgapped.enabled: true`, licensing is handled entirely by the license file you upload in [step 6](#step-6-activate-your-license) — leave `licenseServer` at its default and do not attempt to make it reachable.
:::

### Private registry credentials

If your internal registry requires authentication, the chart needs an image pull secret. Without this, every pod fails with `ImagePullBackOff`.

Either let the chart create the secret:

```yaml
dockerRegistry:
  enabled: true
  registry: registry.internal.example.com
  loginid: <username>
  password: <password-or-token>
```

Or reference a `kubernetes.io/dockerconfigjson` Secret you manage yourself:

```yaml
dockerRegistry:
  enabled: true
  existingSecret: plane-registry-creds
```

### Service images

Point every service at your internal registry.

::: warning
`services.<service>.image` is a repository **without a tag** — the chart appends `planeVersion` as the tag itself. Adding a tag (or leaving a trailing `:`) produces an invalid image reference, and the pod will never start.

`services.iframely.image` is the one exception: it carries its own tag, because it is versioned independently of Plane.
:::

```yaml
services:
  web:
    image: registry.internal.example.com/plane/web-commercial

  api:
    image: registry.internal.example.com/plane/backend-commercial

  space:
    image: registry.internal.example.com/plane/space-commercial

  admin:
    image: registry.internal.example.com/plane/admin-commercial

  live:
    image: registry.internal.example.com/plane/live-commercial

  monitor:
    image: registry.internal.example.com/plane/monitor-commercial

  silo:
    enabled: true
    image: registry.internal.example.com/plane/silo-commercial

  # Optional services - disabled by default in the chart
  email_service:
    enabled: true
    image: registry.internal.example.com/plane/email-commercial

  iframely:
    enabled: true
    image: registry.internal.example.com/plane/iframely:v1.2.0 # tag included
```

`api`, `worker`, `worker_importers`, `beatworker`, `external_api`, `outbox_poller`, and the consumer and migration workloads all share `services.api.image`, so you only set it once.

### Init container images

Override the three `init_image` keys so init containers pull from your registry with a pinned tag instead of `busybox:latest`:

```yaml
services:
  silo:
    init_image: registry.internal.example.com/plane/busybox:1.36
  live:
    init_image: registry.internal.example.com/plane/busybox:1.36
  minio:
    init_image: registry.internal.example.com/plane/busybox:1.36
```

Any override must be BusyBox-compatible — the init scripts need `/bin/sh`, `grep`, `nslookup`, `sleep`, `ls`, `cat`, and `touch`.

### Image pull policy

The chart defaults Plane's application services to `pullPolicy: Always`. In an airgapped cluster that means every pod restart re-hits your internal registry and hard-fails when it is briefly unavailable. Prefer `IfNotPresent`:

```yaml
services:
  web:
    pullPolicy: IfNotPresent
  api:
    pullPolicy: IfNotPresent
  # ...repeat for space, admin, live, monitor, silo, email_service, iframely
```

### Storage class

Airgapped clusters frequently have no default `StorageClass`. Name yours explicitly, otherwise the PVCs for the bundled datastores stay `Pending` and the install times out:

```yaml
env:
  storageClass: <your-storage-class>
```

Confirm the name with `kubectl get storageclass`.

### Infrastructure services

For each datastore, either run it in-cluster (`local_setup: true`, using a mirrored image) or point Plane at a managed service reachable inside your network.

```yaml
services:
  redis:
    local_setup: true # false if using an external service
    image: valkey/valkey:7.2.11-alpine

  postgres:
    local_setup: true # false if using an external service
    image: postgres:15.7-alpine

  rabbitmq:
    local_setup: true # false if using an external service
    image: rabbitmq:3.13.6-management-alpine
    external_rabbitmq_url: "" # required only when local_setup is false

  minio:
    local_setup: true # false if using S3 or another S3-compatible service
    image: minio/minio:latest
    image_mc: minio/mc:latest

  opensearch:
    local_setup: false # chart default; true to run OpenSearch in-cluster
    image: opensearchproject/opensearch:3.3.2

env:
  # Required when the corresponding local_setup is false
  remote_redis_url: ""
  pgdb_remote_url: ""

  # Required when minio.local_setup is false
  aws_access_key: ""
  aws_secret_access_key: ""
  aws_region: ""
  aws_s3_endpoint_url: ""

  # Required when opensearch.local_setup is false
  opensearch_remote_url: ""
  opensearch_remote_username: ""
  opensearch_remote_password: ""
```

::: tip
If your internal S3 endpoint presents a certificate from a private CA, set `airgapped.s3Secrets` as shown above. The `boto` client used by the API does not read the container's CA bundle, so the certificate has to be supplied this way.
:::

### Ingress and TLS

```yaml
ingress:
  enabled: true
  # Selects WHICH KIND of ingress resource is rendered: nginx, traefik, or openshift.
  controller: nginx
  # The class name written to the Ingress. Free-form.
  ingressClass: nginx
  ingress_annotations:
    { "nginx.ingress.kubernetes.io/proxy-body-size": "5m", "nginx.ingress.kubernetes.io/proxy-buffer-size": "16k" }

ssl:
  # A TLS Secret holding the certificate issued by your internal CA.
  tls_secret_name: plane-tls
  createIssuer: false
  generateCerts: false
```

::: warning
**Do not use the chart's Let's Encrypt path in an air gap.** `ssl.createIssuer` with `generateCerts: true` drives cert-manager against `https://acme-v02.api.letsencrypt.org/directory`, and the `cloudflare` and `digitalocean` issuers call out to those providers' DNS APIs. None of these are reachable from an isolated network, and the install will stall waiting for a certificate that never issues.

Instead, issue the certificate from your internal PKI, load it as a Secret, and reference it with `ssl.tls_secret_name`. If TLS is terminated in front of Plane by an internal load balancer, set `ssl.externalTermination: true` instead so the app still builds `https://` URLs for itself.
:::

::: warning
If `ingress.controller` is empty and your `ingressClass` is not exactly `nginx`, `openshift`, or `traefik*`, **the chart renders no ingress at all and reports no error**. Set `ingress.controller` explicitly whenever your class name is anything else — for example `controller: nginx` with `ingressClass: nginx-internal`.
:::

### Rotate the default secrets

The chart ships working placeholder values for several secrets so that a first install succeeds. Every one of them is public — replace all of them before you go live:

```bash
openssl rand -hex 32   # for secret_key, live_server_secret_key, hmac_secret_key, internal_secret
openssl rand -hex 16   # for aes_secret_key - must be exactly 32 characters
```

```yaml
env:
  secret_key: <generated>
  live_server_secret_key: <generated>
  silo_envs:
    hmac_secret_key: <generated>
    aes_secret_key: <generated> # exactly 32 characters
    cursor_webhook_secret: <generated>
  pi_envs:
    internal_secret: <generated> # only if Plane AI is enabled

  # Only when running the bundled datastores
  pgdb_username: <username>
  pgdb_password: <password>

services:
  rabbitmq:
    default_user: <username>
    default_password: <password>
  minio:
    root_user: <username>
    root_password: <password>
  opensearch:
    username: <username>
    # Min 8 chars with an uppercase, lowercase, digit, and special character
    password: <password>
```

::: tip
Rather than keeping these in `custom-values.yaml`, you can point the chart at Secrets you manage with Vault, External Secrets Operator, or sealed-secrets using the `external_secrets.*_existingSecret` keys. See [External Secrets Config](/self-hosting/methods/kubernetes#external-secrets-config) and the secrets-management section of [Airgapped deployment architecture](/self-hosting/methods/airgapped-requirements).
:::

### Integrations and importers (optional)

Integrations point at your **internal** GitHub Enterprise, GitLab, or Slack-compatible instances — no SaaS endpoint is contacted. Configure them under `services.silo.connectors`:

```yaml
services:
  silo:
    enabled: true
    connectors:
      slack:
        enabled: false
        client_id: ""
        client_secret: ""
        base_url: ""
        signing_secret: ""
      github:
        enabled: false
        client_id: ""
        client_secret: ""
        app_name: ""
        app_id: ""
        private_key: ""
        webhook_secret: ""
      gitlab:
        enabled: false
        client_id: ""
        client_secret: ""

env:
  silo_envs:
    batch_size: 100
    mq_prefetch_count: 1
    request_interval: 400
```

The chart also supports `sentry`, `bitbucket`, and `hubspot` connectors under the same key.

### Email intake (optional)

Email intake lets Plane capture incoming email as work items. Configure DNS first, following [Configure DNS for the email service](/self-hosting/govern/configure-dns-email-service).

```yaml
services:
  email_service:
    enabled: true
    replicas: 1
    image: registry.internal.example.com/plane/email-commercial
    pullPolicy: IfNotPresent
    memoryLimit: 1000Mi
    cpuLimit: 500m
    memoryRequest: 128Mi
    cpuRequest: 100m

env:
  email_service_envs:
    smtp_domain: mail.internal.example.com
```

### Plane AI (optional)

`services.pi` and `services.runner` are disabled by default. If you enable them, mirror `plane-pi-commercial` and `node-runner-commercial`, and point Plane AI at an LLM and embedding endpoint hosted **inside** your network — see [Configure Plane AI](/self-hosting/govern/plane-ai/configure-plane-ai) and [Configure an embedding model](/self-hosting/govern/plane-ai/configure-embedding-model).

```yaml
services:
  pi:
    enabled: true
    image: registry.internal.example.com/plane/plane-pi-commercial
  runner:
    enabled: true
    image: registry.internal.example.com/plane/node-runner-commercial
```

### Hardened clusters (optional)

If your cluster enforces the Pod Security Admission `restricted` profile, enable the chart's hardened security context:

```yaml
securityContext:
  enabled: true
```

This applies a non-root (uid 1000) pod and container security context to all first-party Plane workloads. It does not cover the bundled third-party datastores — run those externally in hardened clusters. For OpenShift, which assigns UIDs itself, the chart ships `examples/values-openshift.yaml`.

## Step 5: Install

**On the airgapped host.**

```bash
helm upgrade plane-app "plane-enterprise-${CHART_VERSION}.tgz" \
    --install \
    --create-namespace \
    --namespace plane \
    -f custom-values.yaml \
    --timeout 20m \
    --wait \
    --wait-for-jobs
```

A first airgapped install pulls every image from your internal registry and runs the database migrations, so allow more time than a connected install would need.

### Verify the installation

```bash
# Pods - everything should reach Running or Completed
kubectl get pods -n plane

# Services and ingress
kubectl get services -n plane
kubectl get ingress -n plane -o wide

# Persistent volumes - watch for PVCs stuck in Pending
kubectl get pv,pvc -n plane
```

Check the logs of the migration job and the API. Workload pods are labeled `app.name=<namespace>-<release>-<service>`, so with namespace `plane` and release `plane-app`:

```bash
# Database migrations
kubectl get jobs -n plane
kubectl logs -n plane -l app.name=plane-plane-app-api-migrate --tail=200

# API
kubectl logs -n plane -l app.name=plane-plane-app-api --tail=100 -f
```

Once the migration job shows `Completed` and the API is serving, open `https://<license.licenseDomain>` in a browser and create the first admin account.

## Step 6: Activate your license

Follow [Activate Airgapped Edition license](/self-hosting/manage/manage-licenses/activate-airgapped) to upload the license file you transferred in step 3.

## Upgrade an airgapped install

An upgrade is the same flow as an install, repeated for the new version:

1. **On the staging host** — set the new `PLANE_VERSION` and `CHART_VERSION`, and mirror the new image tags into your internal registry. Old tags are not reused.
2. **Download a new license file.** Licenses are issued per Plane version, so a version bump needs a fresh download from the [Prime portal](https://prime.plane.so/licenses).
3. **Transfer** the new chart archive and license file across the gap.
4. **On the airgapped host** — take a backup (see [Backup and restore](/self-hosting/manage/backup-restore)), update `planeVersion` in `custom-values.yaml`, and re-run the `helm upgrade` command from step 5 with the new chart archive.
5. **Re-upload the license file** if activation prompts for it.

Never set `planeVersion: stable` — always pin the exact version your license covers.

## Troubleshooting

**Pods stuck in `ImagePullBackOff` or `ErrImagePull`**

```bash
kubectl describe pod -n plane <pod-name> | tail -20
```

Check, in order:

- The image reference resolves in your registry: `crane manifest <registry>/<image>:<tag>`
- `services.<service>.image` has **no** tag on it (the chart appends `:planeVersion`), and no trailing `:`
- `dockerRegistry` is configured, if your registry needs authentication
- `busybox` is mirrored and the `init_image` keys point at it — an init container failure keeps the pod in `Init:ImagePullBackOff`
- Nodes can reach the registry, and trust its certificate if it is served from a private CA

**PVCs stuck in `Pending`**

```bash
kubectl get pvc -n plane
kubectl get storageclass
```

Set `env.storageClass` to a class that exists, or run the datastores externally and set the corresponding `local_setup: false`.

**Migration job fails or retries**

```bash
kubectl logs -n plane -l app.name=plane-plane-app-api-migrate --tail=200
```

Most failures here are database connectivity: check `env.pgdb_remote_url` (or the bundled Postgres pod), and that the database user can create schema objects.

**No ingress created, no error reported**

```bash
kubectl get ingress -n plane
```

If this is empty, set `ingress.controller` explicitly — see the warning in [Ingress and TLS](#ingress-and-tls).

**`live` or `silo` crash-looping against internal S3**

Confirm `airgapped.enabled: true` and that `airgapped.s3Secrets` references a Secret that exists in the `plane` namespace with the key name you specified.

For more, see [Troubleshooting](/self-hosting/troubleshoot/installation-errors), or reach out to our support team.

## Additional configuration

For the full list of chart values, see [Configuration settings](/self-hosting/methods/kubernetes#configuration-settings).
