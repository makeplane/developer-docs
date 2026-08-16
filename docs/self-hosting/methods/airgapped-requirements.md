---
title: Airgapped Edition overview
description: How the Airgapped Edition works and what to prepare. The bundle and license-file flow, private registry, requirements for Docker and Kubernetes, and the guarantees for isolated networks.
keywords: plane airgapped edition, airgapped requirements, air-gapped plane, offline plane install, private registry, airgapped kubernetes, airgapped docker, self-hosting
---

# Airgapped Edition overview <EditionBadge edition="airgapped" plan="enterprise" />

::: info Availability
The Airgapped Edition is available to Enterprise Grid customers (minimum commitment of 100 seats). Contact [sales](mailto:sales@plane.so) for trials, exceptions to the seat threshold, pricing, and licensing. It runs the same codebase and version series as the Commercial Edition. Current release: **%%COMMERCIAL_VERSION%%**.
:::

The Airgapped Edition is Plane for networks with **no outbound internet access**. Images come from your own registry, licenses are activated with files instead of keys, and nothing inside the deployment calls out. This page explains how the pieces fit together and what to prepare. Then follow the install guide for [Docker](/self-hosting/methods/airgapped-edition) or [Kubernetes](/self-hosting/methods/airgapped-edition-kubernetes).

## How an airgapped install works

1. **Get the download URL and license file from Plane.** [Sales](mailto:sales@plane.so) provides the bundle download URL. You download license files for your version from the [Prime portal](https://prime.plane.so/licenses).
2. **Mirror the images.** On a machine with internet access, copy every Plane image for your release into your private registry. [Clone Docker images](/self-hosting/methods/clone-docker-images) uses `crane` and lists all images. Mirror the infrastructure images too (PostgreSQL, Valkey, RabbitMQ, MinIO, OpenSearch) if you run them yourself rather than use managed services.
3. **Transfer the deployment files.** Docker: `docker-compose-airgapped.yml` and `variables-airgapped.env` for your release ([Download config files](/self-hosting/methods/download-config)). Kubernetes: the `plane-enterprise` Helm chart (%%HELM_EE_VERSION%%) as a `.tgz`.
4. **Install inside the perimeter**, pointing images at your registry and setting `IS_AIRGAPPED=1` (Docker) or `airgapped.enabled: true` (Helm).
5. **Activate the license** by uploading the file. Enterprise Grid is activated instance-wide in God Mode → Billing ([Activate Enterprise Grid on Airgapped Edition](/self-hosting/manage/manage-licenses/activate-airgapped-enterprise)). Workspace licenses are activated per workspace ([Activate on Airgapped Edition](/self-hosting/manage/manage-licenses/activate-airgapped)).
6. **Upgrade** by repeating steps 2 and 3 for the new release. See [Update Airgapped on Docker](/self-hosting/manage/update-plane/airgapped-edition/update-airgapped-docker) and [Update Airgapped on Kubernetes](/self-hosting/manage/update-plane/airgapped-edition/update-airgapped-kubernetes).

## What is an airgapped deployment?

An airgapped deployment operates in a completely isolated network environment with no external internet connectivity. This isolation is common in highly regulated industries, government facilities, and organizations with strict security requirements.

Plane supports fully airgapped deployments where all components - application services, databases, storage, and integrations - operate entirely within your isolated network perimeter.

## Deployment methods

Plane's Airgapped Edition can be deployed using Docker or Kubernetes. Choose the method that best fits your infrastructure.

<CardGroup>
  <Card title="Airgapped on Docker" icon="docker" href="/self-hosting/methods/airgapped-edition" link-text="Install with Docker Compose">
    Single machine, Docker Compose, images from your private registry.
  </Card>
  <Card title="Airgapped on Kubernetes" icon="kubernetes" href="/self-hosting/methods/airgapped-edition-kubernetes" link-text="Install with Helm">
    <code>plane-enterprise</code> Helm chart in airgapped mode, with cert-manager and an internal CA.
  </Card>
</CardGroup>

## Airgapped cluster architecture

Here's how Plane operates in an airgapped environment with internal enterprise applications:

![Airgapped cluster architecture](/images/airgapped/airgapped-cluster.webp#hero)

This diagram illustrates a critical principle: **all OAuth flows and API communication remain internal to the airgapped cluster**. When integrating with self-hosted GitHub Enterprise, GitLab, or other internal services, the entire authentication and data exchange happens within your isolated network. No internet access is required.

For a detailed breakdown of Plane's services and infrastructure dependencies, see [Plane self-hosted architecture](/self-hosting/plane-architecture).

**Critical guarantees for airgapped environments**

- **No telemetry**  
  Plane does not send application data, usage metrics, or telemetry outside the cluster. No analytics, crash reports, or usage statistics leave your network.

- **Offline licensing**  
  License validation happens through uploaded license files downloaded from the Prime portal. No internet connection required after initial license file transfer.

- **Zero external dependencies**  
  After initial image import, no external network connectivity is required for Plane to operate. All features work entirely within your isolated environment.

- **Internal-only communication**  
  All service-to-service communication stays within your cluster. Services never attempt to reach external APIs, CDNs, or third-party services.

### How integrations stay internal

The airgapped cluster diagram above shows the complete data flow. Key points:

- **OAuth providers** - Your internal GitHub Enterprise or GitLab instance acts as the OAuth provider
- **Authorization endpoints** - All OAuth URLs point to internal systems, never external SaaS services
- **API communication** - Plane makes API calls only to your internal instances
- **Webhook delivery** - Internal systems send webhooks to Plane's internal endpoints
- **No SaaS fallback** - Plane never attempts to reach github.com, gitlab.com, or slack.com APIs

This architecture ensures complete network isolation while maintaining full integration functionality.

---

## Requirements common to both methods

- **A private container registry** reachable from every host or node, populated with the images listed in [Clone Docker images](/self-hosting/methods/clone-docker-images) for your release, plus the infrastructure images if you run them in-cluster or on the host.
- **A machine with internet access** to mirror images and download the deployment files, and a controlled way to move artifacts across the boundary.
- **DNS inside the perimeter** that resolves your Plane hostname, and an **internal certificate authority** if you want HTTPS. Let's Encrypt is unreachable from an airgapped network.
- **SMTP relay inside the perimeter** for invitations and notifications ([SMTP for email](/self-hosting/govern/communication)). Optional inbound SMTP ports 25/465/587 for [intake email](/self-hosting/govern/configure-dns-email-service).
- **License files** downloaded from the [Prime portal](https://prime.plane.so/licenses) for the exact version you install.
- General sizing, OS, and port requirements from [Before you install](/self-hosting/methods/prerequisites).

## Docker-specific requirements

- Docker Engine **24 or later** with the Compose v2 plugin (`docker compose version`), root or sudo access, ports 80 and 443 free.
- The compose file and environment template for your release: `docker-compose-airgapped.yml` and `variables-airgapped.env` ([Download config files](/self-hosting/methods/download-config)).
- Image references in the compose file rewritten to your registry. This is a one-line `sed`. See the [Docker guide](/self-hosting/methods/airgapped-edition).
- A generated `MACHINE_SIGNATURE` (`uuidgen`) in `plane.env`. The license monitor runs in `start-airgapped` mode and never contacts Prime.
- For production, external PostgreSQL and S3-compatible storage reachable inside the perimeter, with the S3 endpoint's CA trusted by the API if it's internally signed.

## Kubernetes-specific requirements

### Base environment

Deploying airgapped Plane via Kubernetes requires preparing all dependencies to operate without any external network access.

#### Container images and artifacts

- Maintain an internal OCI or container registry to host all Plane service images
- Prepare a controlled process to pull, verify, and mirror Plane container images and Helm charts from an online staging environment into the airgapped registry

#### Kubernetes environment

**Supported versions:** Kubernetes 1.31 – 1.33

**Required components:**

- IngressClass configured
- StorageClass available
- cert-manager configured with an internal CA

**Node requirements:**

- Ensure node OS dependencies and container runtime packages are available from mirrored package repositories like apt, yum, or offline bundles

### Scaling

Horizontal scaling is handled via replica counts configurable in `values.yaml`.

Plane avoids using StatefulSets where possible due to the complexity of scaling stateful workloads in Kubernetes. The `monitor` service uses a StatefulSet.

**For airgapped clusters:**

- Ensure metrics-server images are mirrored if using HPA
- If using node autoscaling, ensure node images are pre-loaded and registries accessible on bootstrap

### Secrets management

Plane supports using existing external secret stores, provided they are reachable within the airgapped environment:

- AWS Secrets Manager for private VPC with no internet
- HashiCorp Vault
- Self-hosted Bitwarden
- Kubernetes Secrets
- SOPS, sealed-secrets, if preferred

### Additional considerations

- Ensure all secret providers can function without external network access
- cert-manager must use an internal certificate authority
- Keys and secret rotation policies should be part of the airgap operational procedures
