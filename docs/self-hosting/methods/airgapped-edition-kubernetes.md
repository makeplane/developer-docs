---
title: Airgapped on Kubernetes
description: Install the Airgapped Edition on Kubernetes with the plane-enterprise Helm chart in a cluster without internet access. Mirror images, transfer the chart, configure airgapped mode and your registry, install, verify, and activate the license file.
keywords: plane airgapped kubernetes, air-gapped helm, offline kubernetes plane, plane-enterprise airgapped, plane private registry helm, self-hosting
---

# Airgapped on Kubernetes <EditionBadge edition="airgapped" plan="enterprise" />

::: info Availability
The Airgapped Edition is available to Enterprise Grid customers (minimum 100 seats). Contact [sales](mailto:sales@plane.so) for trials and exceptions. Read the [Airgapped Edition overview](/self-hosting/methods/airgapped-requirements) first. Current release: Plane %%COMMERCIAL_VERSION%%, chart `plane-enterprise` %%HELM_EE_VERSION%%.
:::

This guide deploys Plane with the `plane-enterprise` chart in **airgapped mode**: images from your private registry, `airgapped.enabled: true`, an internal CA for TLS, and license activation from a file. It assumes you know the standard [Kubernetes](/self-hosting/methods/kubernetes) install. Only the airgapped differences are covered here. Every chart value is in the [Helm values reference](/self-hosting/methods/kubernetes-values).

## Before you begin

From [Before you install](/self-hosting/methods/prerequisites) and the [airgapped overview](/self-hosting/methods/airgapped-requirements#kubernetes-specific-requirements):

- Kubernetes **1.31 to 1.33**, Helm 3, and `kubectl`. An ingress controller (`traefik` or `nginx`), a StorageClass, and **cert-manager configured with an internal CA**.
- Ports 80/443 reachable at the ingress, and 25/465/587 if you use intake email.
- Your **private registry** populated with the Plane images for %%COMMERCIAL_VERSION%% ([Clone Docker images](/self-hosting/methods/clone-docker-images)) plus, for anything you run in-cluster, `postgres:15.7-alpine`, `valkey/valkey:7.2.11-alpine`, `rabbitmq:3.13.6-management-alpine`, `minio/minio` and `minio/mc` (pin a release when mirroring), and `opensearchproject/opensearch:3.3.2`. Mirror add-on images your cluster needs too (ingress controller, cert-manager, metrics-server).
- The chart archive `plane-enterprise-%%HELM_EE_VERSION%%.tgz`, downloaded on a connected machine from [GitHub releases](https://github.com/makeplane/helm-charts/releases) or [Artifact Hub](https://artifacthub.io/packages/helm/makeplane/plane-enterprise) and transferred inside.
- License files from the [Prime portal](https://prime.plane.so/licenses).

::: warning Production deployments
Prefer managed PostgreSQL, object storage, RabbitMQ, and OpenSearch reachable inside your perimeter over the in-cluster ones (`services.<name>.local_setup: false`). See [External services](/self-hosting/govern/database-and-storage) and [High availability](/self-hosting/govern/high-availability).
:::

## Install

1. **Get the chart** (connected machine):

   ```bash
   curl -L -O https://github.com/makeplane/helm-charts/releases/download/plane-enterprise-%%HELM_EE_VERSION%%/plane-enterprise-%%HELM_EE_VERSION%%.tgz
   ```

2. **Start from the chart's default values** (airgapped machine):

   ```bash
   helm show values plane-enterprise-%%HELM_EE_VERSION%%.tgz > custom-values.yaml
   ```

3. **Edit `custom-values.yaml`.** The essentials for an airgapped install:

   ```yaml
   planeVersion: %%COMMERCIAL_VERSION%%

   license:
     licenseDomain: plane.internal.company.com # the hostname you'll serve Plane on

   airgapped:
     enabled: true # REQUIRED; no calls to prime.plane.so
     s3Secrets: [] # add your internal CA for S3 here if the endpoint is internally signed
     # s3Secrets:
     #   - name: plane-s3-ca
     #     key: s3-custom-ca.crt

   dockerRegistry:
     enabled: true # only if your registry needs credentials
     existingSecret: my-registry-pull-secret # or set registry/loginid/password

   ingress:
     enabled: true
     ingressClass: traefik # or nginx (see the values reference for nginx annotations)

   ssl:
     tls_secret_name: plane-tls # certificate from your internal CA (cert-manager or pre-created Secret)
   ```

   **Point every image at your registry.** The chart uses `makeplane/<image>` with `planeVersion` as the tag for the Plane services, and full image references for the infrastructure services. Replace the `makeplane/` prefix under `services.*.image` with your registry path. Mirror the images under the same names so that the change is a plain prefix. For example:

   ```yaml
   services:
     web:
       image: registry.internal.company.com/makeplane/web-commercial
     space:
       image: registry.internal.company.com/makeplane/space-commercial
     admin:
       image: registry.internal.company.com/makeplane/admin-commercial
     live:
       image: registry.internal.company.com/makeplane/live-commercial
     live_exporter:
       image: registry.internal.company.com/makeplane/live-commercial
     monitor:
       image: registry.internal.company.com/makeplane/monitor-commercial
     api:
       image: registry.internal.company.com/makeplane/backend-commercial
     worker:
       image: registry.internal.company.com/makeplane/backend-commercial
     beatworker:
       image: registry.internal.company.com/makeplane/backend-commercial
     silo:
       image: registry.internal.company.com/makeplane/silo-commercial
     email_service:
       image: registry.internal.company.com/makeplane/email-commercial
     iframely:
       image: registry.internal.company.com/makeplane/iframely:v2.5.3 # this one carries its tag in the value
     pi:
       image: registry.internal.company.com/makeplane/plane-pi-commercial
     runner:
       image: registry.internal.company.com/makeplane/node-runner-commercial
     # In-cluster infrastructure (only if local_setup: true):
     postgres:
       image: registry.internal.company.com/postgres:15.7-alpine
     redis:
       image: registry.internal.company.com/valkey/valkey:7.2.11-alpine
     rabbitmq:
       image: registry.internal.company.com/rabbitmq:3.13.6-management-alpine
     minio:
       image: registry.internal.company.com/minio/minio:<pinned release>
       image_mc: registry.internal.company.com/minio/mc:<pinned release>
     opensearch:
       image: registry.internal.company.com/opensearchproject/opensearch:3.3.2
   ```

   Every workload in the chart has an `image` value (`services.<name>.image`). Check `custom-values.yaml` for the full list. Anything still starting with `makeplane/` will fail to pull. Then set your own secrets (`env.secret_key`, `env.live_server_secret_key`, `env.silo_envs.hmac_secret_key`, `env.silo_envs.aes_secret_key`, service passwords), and configure external services (`env.pgdb_remote_url`, `env.remote_redis_url`, `services.rabbitmq.external_rabbitmq_url`, `env.aws_*`) as described in the [Helm values reference](/self-hosting/methods/kubernetes-values). Point integrations (GitHub Enterprise, GitLab, Slack) at your internal instances with `services.silo.connectors.*`.

4. **Install:**

   ```bash
   helm upgrade --install plane-app plane-enterprise-%%HELM_EE_VERSION%%.tgz \
     --create-namespace \
     --namespace plane \
     -f custom-values.yaml \
     --timeout 10m \
     --wait \
     --wait-for-jobs
   ```

## Verify

```bash
kubectl -n plane get pods
kubectl -n plane get ingress -o wide
kubectl -n plane get pvc
```

All pods `Running` (the migrator Job completes). `ImagePullBackOff` means an image path or tag isn't in your registry. Open `https://plane.internal.company.com`. You should see the sign-in page. Sign-in works after you create the instance admin.

## After you install

Follow **[After you install](/self-hosting/methods/after-install)**: create the instance admin at `/god-mode/`, configure your internal SMTP relay and sign-in, then activate the license.

::: tip Activate your license
Airgapped licenses are files, not keys, and activation makes no outbound calls. On a connected machine, sign in to the [Prime portal](https://prime.plane.so/licenses) with the email you used to purchase, click **Download license** for your Plane version, and transfer the file inside.

- **Enterprise Grid:** open **God Mode → Billing**, upload the file, and click **Activate**. It covers every workspace on the instance. [Steps](/self-hosting/manage/manage-licenses/activate-airgapped-enterprise).
- **Pro or Business:** in the workspace, go to **Workspace settings → Billing and plans → Activate this workspace** and upload the file. [Steps](/self-hosting/manage/manage-licenses/activate-airgapped).
  :::

## Upgrade

A new release means new images in your registry, a new chart `.tgz` if the chart moved, `planeVersion` bumped in `custom-values.yaml`, `helm upgrade`, and a new license file. Step by step: [Update Airgapped on Kubernetes](/self-hosting/manage/update-plane/airgapped-edition/update-airgapped-kubernetes).

## Airgapped values reference

### `airgapped.*` values

| Setting                | Default | Required | Description                                                                                                                                                                                                                                                                                                                               |
| ---------------------- | :-----: | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| airgapped.enabled      |  false  |    No    | Enable airgapped mode for the Plane API.                                                                                                                                                                                                                                                                                                  |
| airgapped.s3Secrets    |   []    |    No    | List of Kubernetes Secrets containing CA certificates to install. Each entry requires `name` (Secret name) and `key` (filename in the Secret). Example: `kubectl -n plane create secret generic plane-s3-ca --from-file=s3-custom-ca.crt=/path/to/ca.crt`. Supports multiple certs (e.g. S3 + internal CA). Available in 2.6.3 and later. |
| airgapped.s3SecretName |   ""    |    No    | **Deprecated** <br/> Name of a single Kubernetes Secret containing the S3 CA cert. Used only when `s3Secrets` is empty. Use `s3Secrets` instead.                                                                                                                                                                                          |
| airgapped.s3SecretKey  |   ""    |    No    | **Deprecated** <br/> Key (filename) of the cert file inside the Secret. Used only when `s3Secrets` is empty. Set together with `airgapped.s3SecretName`. Use `s3Secrets` instead.                                                                                                                                                         |

### CA certificate configuration (For airgapped deployments only)

Plane supports custom CA certificates for connecting to S3-compatible storage and other internal services in airgapped environments.

- **New deployments:** Use `airgapped.s3Secrets` as shown in the table above.
- **Existing deployments using `s3SecretName` and `s3SecretKey`:** Your configuration still works. Migrate only if you need to use multiple CA certificates.

### Migrating to the new configuration

:::warning
Requires Plane 2.6.3 or later.
:::

The new `s3Secrets` configuration supports multiple CA certificates, useful if you need to trust certificates from different sources (e.g., S3 endpoint CA and internal PKI). If you only need a single certificate, migration is optional.

To migrate:

1. Add your existing secret to the `s3Secrets` list:

```yaml
airgapped:
  enabled: true
  s3Secrets:
    - name: plane-s3-ca # your existing s3SecretName value
      key: s3-custom-ca.crt # your existing s3SecretKey value


  # s3SecretName and s3SecretKey can be removed after migration
```

2. Remove `s3SecretName` and `s3SecretKey` from your values file.

3. Upgrade your Helm release.

For everything else (services, replicas, resources, external secrets, ingress, custom routes), see the [Helm values reference](/self-hosting/methods/kubernetes-values).
