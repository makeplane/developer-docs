---
title: Kubernetes
description: Deploy Plane Commercial Edition on Kubernetes with the plane-enterprise Helm chart. Prerequisites, quick start and values-file installs, verification, upgrades, and links to the values reference and high-availability guide.
keywords: plane kubernetes, plane helm chart, plane-enterprise, helm install plane, plane k8s deployment, production plane kubernetes, self-hosting
---

# Kubernetes <EditionBadge edition="commercial" />

::: info Edition availability
This guide deploys the **Commercial Edition** (%%COMMERCIAL_VERSION%%) with the `plane-enterprise` Helm chart (%%HELM_EE_VERSION%%). It includes the Free plan. A license key unlocks Pro, Business, or Enterprise Grid. For clusters without internet access, see [Airgapped on Kubernetes](/self-hosting/methods/airgapped-edition-kubernetes). For the open-source Community Edition, see [Community Edition → Kubernetes](/self-hosting/community/kubernetes).
:::

Kubernetes is the production deployment path. Each Plane service runs as its own Deployment, so you can scale services independently, spread them across zones, and use managed data services. The chart can also run PostgreSQL, Redis (Valkey), RabbitMQ, MinIO, and OpenSearch in-cluster for a quick start. Allow about an hour for a first install, and read [High availability](/self-hosting/govern/high-availability) before a production rollout.

Chart source and README: [makeplane/helm-charts](https://github.com/makeplane/helm-charts/tree/master/charts/plane-enterprise), [Artifact Hub](https://artifacthub.io/packages/helm/makeplane/plane-enterprise).

## Before you begin

Read [Before you install](/self-hosting/methods/prerequisites). For Kubernetes you need:

- A cluster on **Kubernetes 1.31 to 1.33**, with `kubectl` and **Helm 3** configured against it, and capacity for about 4 vCPU / 8 GB for a single-replica install with the bundled data services (more if you enable Plane AI or OpenSearch).
- An **ingress controller**. The chart's default `ingress.ingressClass` is `traefik`. `nginx` is also supported. Point a DNS record for your hostname (`<your-domain>`) at the ingress.
- A default **StorageClass** for the bundled stateful services, or set `env.storageClass` explicitly.
- For TLS: **cert-manager** (the chart can create an Issuer and request certificates) or an existing TLS Secret to reference in `ssl.tls_secret_name`.
- Outbound access from the cluster to Docker Hub (`makeplane/*-commercial` images) and to `prime.plane.so` (license validation).

::: warning Production deployments
Use managed PostgreSQL and object storage instead of the in-cluster ones (`services.postgres.local_setup: false` with `env.pgdb_remote_url`, `services.minio.local_setup: false` with `env.aws_*`). See [External services](/self-hosting/govern/database-and-storage) and the [Helm values reference](/self-hosting/methods/kubernetes-values).
:::

## Install

1. Add the Plane Helm repository:

   ```bash
   helm repo add plane https://helm.plane.so/
   helm repo update
   ```

2. Set the two values every install needs: the release to deploy and the domain the license is bound to.

   ```bash
   PLANE_VERSION=%%COMMERCIAL_VERSION%%
   DOMAIN_NAME=<your-domain>
   ```

   ::: warning
   Pin an explicit release. Don't set `planeVersion` to `stable` or `latest`. See [Versions and releases](/self-hosting/versions).
   :::

3. Install with the minimum settings, or with a values file.

   **Quick start.** Bundled PostgreSQL, Redis, RabbitMQ, and MinIO on your default StorageClass, and an Ingress on `traefik`:

   ```bash
   helm upgrade --install plane-app plane/plane-enterprise \
     --create-namespace \
     --namespace plane \
     --set planeVersion=${PLANE_VERSION} \
     --set license.licenseDomain=${DOMAIN_NAME} \
     --set license.licenseServer=https://prime.plane.so \
     --set ingress.enabled=true \
     --set ingress.ingressClass=traefik \
     --set env.secret_key="$(openssl rand -hex 32)" \
     --set env.live_server_secret_key="$(openssl rand -hex 32)" \
     --timeout 10m \
     --wait \
     --wait-for-jobs
   ```

   For `nginx`, set `--set ingress.ingressClass=nginx` and add the annotations shown in the [values reference](/self-hosting/methods/kubernetes-values#ingress-and-ssl-setup). If the cluster has no default StorageClass, add `--set env.storageClass=<name>`.

   **Values file.** Recommended for production:

   ```bash
   helm show values plane/plane-enterprise > values.yaml
   ```

   Edit `values.yaml`. At minimum, set `planeVersion`, `license.licenseDomain`, `ingress.ingressClass`, `env.storageClass` (if you have no default), and your own `env.secret_key` and `env.live_server_secret_key`. Then configure external data services and TLS. Every value is described in the [Helm values reference](/self-hosting/methods/kubernetes-values). Install:

   ```bash
   helm upgrade --install plane-app plane/plane-enterprise \
     --create-namespace \
     --namespace plane \
     -f values.yaml \
     --timeout 10m \
     --wait \
     --wait-for-jobs
   ```

## Verify

```bash
kubectl -n plane get pods
kubectl -n plane get ingress
```

All Deployments should be `Running`. The migrator Job completes and exits. Once the ingress has an address and DNS resolves, open `https://<your-domain>`. You should see the sign-in screen. You can't sign in until you create the instance admin (next section). If pods are `Pending`, check PVC binding (`kubectl -n plane get pvc`) and node capacity. If the API crash-loops, check its logs for database connectivity.

## After you install

Follow **[After you install](/self-hosting/methods/after-install)**: create the instance admin at `https://<your-domain>/god-mode/`, set up SMTP and sign-in, and set up backups (PVC snapshots, or, better, managed PostgreSQL and object storage).

::: tip Purchased a plan? Activate your license
Copy the license key from the [Prime portal](https://prime.plane.so/licenses). Sign in with the email you used to purchase.

- **Pro or Business:** in the app, go to **Workspace settings → Billing and plans → Activate this workspace**, paste the key, and click **Activate**. Each key activates one workspace. [Steps](/self-hosting/manage/manage-licenses/activate-pro-and-business#activate-your-license).
- **Enterprise Grid:** open **God Mode → Billing**, paste the key, and click **Activate**. It covers every workspace on the instance. [Steps](/self-hosting/manage/manage-licenses/activate-enterprise).

The instance needs outbound access to `prime.plane.so` to validate the license. Without a license, Plane runs on the Free plan. See [plans and pricing](https://plane.so/pricing).
:::

## Manage the deployment

- **Upgrade Plane.** Bump `planeVersion` (and update the chart), then run `helm upgrade`:

  ```bash
  helm repo update
  helm upgrade plane-app plane/plane-enterprise \
    --namespace plane \
    -f values.yaml \
    --set planeVersion=<new version> \
    --timeout 10m \
    --wait \
    --wait-for-jobs
  ```

  Back up first and read the [changelog](https://plane.so/changelog). The migrator Job runs schema migrations before the API rolls.

- **Scale.** Set `services.<name>.replicas` (`web`, `api`, `worker`, `live`, `silo`, and so on). See [High availability](/self-hosting/govern/high-availability) for anti-affinity, PDBs, and which workloads must stay at one replica.
- **Change configuration.** Edit `values.yaml` and run `helm upgrade`. Secrets can come from existing Kubernetes Secrets or an external secret store. See [External secrets](/self-hosting/govern/external-secrets) and the [External Secrets Config](/self-hosting/methods/kubernetes-values#external-secrets-config) values.
- **Own ingress controller or external proxy.** Set `ingress.enabled: false` and create the routes listed under [Custom Ingress Routes](/self-hosting/methods/kubernetes-values#custom-ingress-routes).
- **Health probes.** `/api/ready/`, `/api/live/`, and per-service endpoints are documented in [Health checks](/self-hosting/manage/health-checks).
- **Uninstall.** `helm uninstall plane-app -n plane`. PVCs are kept unless you delete them.

## Troubleshoot

- **Pods `Pending` with unbound PVCs.** No default StorageClass. Set `env.storageClass`.
- **Ingress has no address, or returns 404.** The ingress controller isn't installed, or `ingress.ingressClass` doesn't match it. Check with `kubectl get ingressclass`.
- **`502 upstream sent too big header` or upload failures on nginx.** Add the `proxy-buffer-size` and `proxy-body-size` annotations from the values reference.
- **License won't activate.** The API can't reach `prime.plane.so`, or `license.licenseDomain` doesn't match the domain you are using. See [License errors](/self-hosting/troubleshoot/license-errors).
- More: [Troubleshoot](/self-hosting/troubleshoot/overview).
