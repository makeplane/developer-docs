---
title: Kubernetes (Community Edition)
description: Deploy the open-source Plane Community Edition on Kubernetes with the plane-ce Helm chart. Prerequisites, quick start, key values, verification, and upgrades.
keywords: plane community edition kubernetes, plane-ce helm chart, helm install plane, plane kubernetes open source, plane helm values
---

# Kubernetes <EditionBadge edition="community" />

::: info Edition availability
This guide deploys the open-source **Community Edition** (%%CE_VERSION%%) with the `plane-ce` Helm chart (%%HELM_CE_VERSION%%). For the Commercial Edition (recommended, free plan included, high-availability guidance), see [Kubernetes](/self-hosting/methods/kubernetes).
:::

The `plane-ce` chart deploys every Plane service plus, by default, PostgreSQL, Redis (Valkey), RabbitMQ, and MinIO as in-cluster stateful workloads. Each of those can be switched off in favor of a managed service. Chart source and full values reference: [makeplane/helm-charts](https://github.com/makeplane/helm-charts/tree/master/charts/plane-ce), [Artifact Hub](https://artifacthub.io/packages/helm/makeplane/plane-ce).

## Before you begin

Read [Before you install](/self-hosting/methods/prerequisites). For Kubernetes you need:

- A cluster on Kubernetes 1.31 to 1.33 with `kubectl` and Helm 3 access, and enough capacity for the pods (about 4 vCPU / 8 GB for a single-replica install with the bundled data services).
- An ingress controller. The chart's default `ingress.ingressClass` is `traefik`. `nginx` is also supported.
- A default StorageClass, or set `postgres.storageClass`, `redis.storageClass`, `rabbitmq.storageClass`, and `minio.storageClass` explicitly.
- A DNS record for your hostname pointing at the ingress. For TLS, either cert-manager or a TLS secret to reference in `ssl.tls_secret_name`.

## Install

1. Add the Helm repository:

   ```bash
   helm repo add plane https://helm.plane.so/
   helm repo update
   ```

2. Install with the minimum settings (hostname, version, and your own secrets), or with a values file.

   **Quick start**

   ```bash
   helm install plane-app plane/plane-ce \
     --create-namespace \
     --namespace plane-ce \
     --set planeVersion=%%CE_VERSION%% \
     --set ingress.appHost="plane.example.com" \
     --set ingress.ingressClass=traefik \
     --set env.secret_key="$(openssl rand -hex 32)" \
     --set env.live_server_secret_key="$(openssl rand -hex 32)" \
     --timeout 10m \
     --wait \
     --wait-for-jobs
   ```

   This creates PostgreSQL, Redis, RabbitMQ, and MinIO with PersistentVolumeClaims on your default StorageClass, and an Ingress for `plane.example.com`.

   **Values file** (recommended for anything beyond a trial)

   ```bash
   helm show values plane/plane-ce > values.yaml
   # edit values.yaml (see the key values below)
   helm install plane-app plane/plane-ce \
     --create-namespace \
     --namespace plane-ce \
     -f values.yaml \
     --timeout 10m \
     --wait \
     --wait-for-jobs
   ```

## Key values

The full list is in `helm show values plane/plane-ce`. These are the values most installs change.

| Value                                                                                                                | Default                        | What it does                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `planeVersion`                                                                                                       | %%CE_VERSION%%                 | Plane image tag to deploy. Pin an explicit version. Don't use `stable`.                                                              |
| `ingress.enabled`, `ingress.appHost`                                                                                 | `true`, `plane.example.com`    | Create an Ingress for the app hostname.                                                                                              |
| `ingress.minioHost`, `ingress.rabbitmqHost`                                                                          | empty                          | Optional extra hostnames for the MinIO console and RabbitMQ management UI.                                                           |
| `ingress.ingressClass`                                                                                               | `traefik`                      | `traefik` or `nginx`.                                                                                                                |
| `ssl.tls_secret_name`                                                                                                | empty                          | Use an existing TLS secret for the app hostname.                                                                                     |
| `ssl.createIssuer`, `ssl.issuer`, `ssl.email`, `ssl.generateCerts`                                                   | `false`, `http`, ...           | Let the chart create a cert-manager Issuer (`http`, `cloudflare`, or `digitalocean`) and request certificates.                       |
| `postgres.local_setup` / `env.pgdb_remote_url`                                                                       | `true` / empty                 | Run PostgreSQL in-cluster, or set `local_setup: false` and provide a `postgresql://` URL for a managed database.                     |
| `redis.local_setup` / `env.remote_redis_url`                                                                         | `true` / empty                 | Same for Redis/Valkey.                                                                                                               |
| `rabbitmq.local_setup` / `rabbitmq.external_rabbitmq_url`                                                            | `true` / empty                 | Same for RabbitMQ.                                                                                                                   |
| `minio.local_setup` / `env.aws_access_key`, `env.aws_secret_access_key`, `env.aws_region`, `env.aws_s3_endpoint_url` | `true` / empty                 | Run MinIO in-cluster, or point at S3-compatible storage. `env.docstore_bucket` names the bucket (`uploads`).                         |
| `env.doc_upload_size_limit`                                                                                          | `5242880`                      | Maximum upload size in bytes.                                                                                                        |
| `env.secret_key`, `env.live_server_secret_key`                                                                       | placeholder values             | **Set your own.** The defaults are public.                                                                                           |
| `env.cors_allowed_origins`                                                                                           | empty                          | Extra allowed origins if you serve Plane from more than one hostname.                                                                |
| `<service>.replicas`, `<service>.cpuLimit`, `<service>.memoryLimit`                                                  | `1`, `500m`, `1000Mi`          | Per service (`web`, `space`, `admin`, `live`, `api`, `worker`, `beatworker`).                                                        |
| `<datastore>.storageClass`, `<datastore>.volumeSize`                                                                 | cluster default, `1Gi`/`100Mi` | PVC class and size for `postgres`, `redis`, `rabbitmq`, `minio`. Increase `postgres.volumeSize` and `minio.volumeSize` for real use. |
| `<any>.nodeSelector`, `.tolerations`, `.affinity`, `.labels`, `.annotations`                                         | empty                          | Scheduling and metadata per workload.                                                                                                |

## Verify

```bash
kubectl -n plane-ce get pods
kubectl -n plane-ce get ingress
```

All pods should reach `Running`. The migrator job completes and exits. Then open `https://plane.example.com`. You should see the sign-in screen. Sign-in works after you create the instance admin.

## After you install

Follow **[After you install](/self-hosting/methods/after-install)**: create the instance admin at `/god-mode/`, configure SMTP in **God Mode → Email**, set up sign-in, and set up backups (for in-cluster data services, snapshot the PVCs or move to managed PostgreSQL and object storage).

## Upgrade

```bash
helm repo update
helm upgrade plane-app plane/plane-ce \
  --namespace plane-ce \
  -f values.yaml \
  --set planeVersion=<new version> \
  --timeout 10m \
  --wait \
  --wait-for-jobs
```

Back up your database first, and check the [changelog](https://plane.so/changelog) and [GitHub release notes](https://github.com/makeplane/plane/releases) for breaking changes. Uninstall with `helm uninstall plane-app -n plane-ce`. PVCs are kept unless you delete them.
