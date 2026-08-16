---
title: Choose your install
description: Pick a Plane edition and deployment method. Install the Commercial Edition with Docker Compose or Kubernetes, or deploy the Airgapped Edition in isolated networks.
keywords: install plane, plane deployment methods, plane commercial edition, plane airgapped edition, docker compose, kubernetes, helm, podman, self-hosting
---

# Choose your install

Self-hosted Plane comes in two editions for teams and organizations. Pick the edition first, then the deployment method that fits your infrastructure.

<CardGroup>
  <Card title="Commercial Edition" icon="rocket" href="#commercial-edition" link-text="See deployment methods">
    Recommended for most teams. Free for up to 12 seats per workspace. A license key unlocks Pro, Business, or Enterprise Grid at any time. Installed with the Prime CLI on Docker, or with Helm on Kubernetes.
  </Card>
  <Card title="Airgapped Edition" icon="wifi-off" href="#airgapped-edition" link-text="See deployment methods">
    The Commercial Edition for isolated networks. No outbound internet access, images served from your own registry, licenses activated with offline license files. Available with Enterprise Grid.
  </Card>
</CardGroup>

::: info Editions and versions
Both editions run the same codebase and version series. The current release is **%%COMMERCIAL_VERSION%%**. See [Plane editions](/self-hosting/editions-and-versions) for a comparison and [Versions and releases](/self-hosting/versions) for how versioning works. The open-source Community Edition has its own guides under [Community Edition](/self-hosting/community/overview).
:::

## Commercial Edition

Docker Compose is the fastest way to a working instance. Kubernetes is the production path when you need high availability and horizontal scaling.

<CardGroup>
  <Card title="Docker Compose" icon="docker" href="/self-hosting/methods/docker-compose" link-text="Install with Docker Compose">
    <strong>Recommended.</strong> One command installs the Prime CLI and starts the full stack on a single machine. About 15 minutes. Suitable for evaluations and for small to mid-sized teams in production.
  </Card>
  <Card title="Kubernetes" icon="kubernetes" href="/self-hosting/methods/kubernetes" link-text="Install with Helm">
    Deploy with the <code>plane-enterprise</code> Helm chart. Scale each service independently, run across availability zones, and use managed databases and storage.
  </Card>
</CardGroup>

### Other Docker-based methods

<CardGroup cols="3">
  <Card title="Docker AIO" icon="box" href="/self-hosting/methods/docker-aio">
    All Plane services in a single container. You provide PostgreSQL, Redis, RabbitMQ, and S3-compatible storage. For platforms that run one container per app.
  </Card>
  <Card title="Docker Swarm" icon="docker" href="/self-hosting/methods/docker-swarm">
    Deploy the Compose stack on a Swarm cluster with <code>docker stack deploy</code>.
  </Card>
  <Card title="Podman Quadlets" icon="podman" href="/self-hosting/methods/podman-quadlets">
    Rootless Podman managed by systemd, for hosts that don't run Docker.
  </Card>
</CardGroup>

<CardGroup cols="3">
  <Card title="Coolify" icon="coolify" href="/self-hosting/methods/coolify">
    Deploy from the Coolify UI with the Plane Compose template.
  </Card>
  <Card title="Portainer" icon="portainer" href="/self-hosting/methods/portainer">
    Deploy and manage the stack from the Portainer UI.
  </Card>
  <Card title="Download config files" icon="download" href="/self-hosting/methods/download-config">
    Get the Compose files and environment template for any release, for custom or scripted deployments.
  </Card>
</CardGroup>

## Airgapped Edition

For networks with no internet access. You mirror Plane's images into your own registry, install from downloaded files, and activate licenses with a file from the [Prime portal](https://prime.plane.so). Start with the overview.

<CardGroup cols="3">
  <Card title="Overview and requirements" icon="clipboard-list" href="/self-hosting/methods/airgapped-requirements">
    How the bundle and license flow works, and what to prepare on Docker and Kubernetes.
  </Card>
  <Card title="Airgapped on Docker" icon="docker" href="/self-hosting/methods/airgapped-edition">
    Install with Docker Compose from downloaded files and images in your private registry.
  </Card>
  <Card title="Airgapped on Kubernetes" icon="kubernetes" href="/self-hosting/methods/airgapped-edition-kubernetes">
    Install with the <code>plane-enterprise</code> Helm chart in a cluster with no outbound access.
  </Card>
</CardGroup>

<CardGroup>
  <Card title="Clone Docker images" icon="package" href="/self-hosting/methods/clone-docker-images">
    Copy every Plane image into your private registry with <code>crane</code>. Includes the image list for the current release.
  </Card>
  <Card title="FIPS deployment" icon="shield-check" href="/self-hosting/methods/fips-deployment">
    Run Plane on FIPS-enabled hosts with the FIPS image variants. Enterprise Grid.
  </Card>
</CardGroup>

## Which method should I pick?

| Method                                                                                  | Best for                                                                 | Edition                 | Time to first login  |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------- | -------------------- |
| [Docker Compose](/self-hosting/methods/docker-compose)                                  | Evaluations; single-server production for small and mid-sized teams      | Commercial              | ~15 min              |
| [Kubernetes](/self-hosting/methods/kubernetes)                                          | Production with high availability, autoscaling, managed data services    | Commercial              | ~1 hour              |
| [Airgapped on Docker](/self-hosting/methods/airgapped-edition)                          | Isolated networks, single server                                         | Airgapped (Enterprise)  | ~1 hour + mirroring  |
| [Airgapped on Kubernetes](/self-hosting/methods/airgapped-edition-kubernetes)           | Isolated networks, cluster deployments                                   | Airgapped (Enterprise)  | ~2 hours + mirroring |
| [Docker AIO](/self-hosting/methods/docker-aio)                                          | One-container platforms; you already run PostgreSQL, Redis, RabbitMQ, S3 | Commercial              | ~30 min              |
| [Docker Swarm](/self-hosting/methods/docker-swarm)                                      | Existing Swarm clusters                                                  | Commercial              | ~30 min              |
| [Podman Quadlets](/self-hosting/methods/podman-quadlets)                                | Docker-free hosts, rootless systemd-managed containers                   | Commercial              | ~30 min              |
| [Coolify](/self-hosting/methods/coolify) / [Portainer](/self-hosting/methods/portainer) | Teams already managing containers through those UIs                      | Commercial              | ~30 min              |
| [FIPS deployment](/self-hosting/methods/fips-deployment)                                | FIPS 140-3 compliance requirements                                       | Commercial (Enterprise) | Kubernetes timings   |

If you are evaluating Plane, use Docker Compose. You can move to Kubernetes later, or point the same instance at managed databases and storage. If you are deploying for a large organization or need zero-downtime upgrades, start on Kubernetes.

## Before and after you install

<CardGroup cols="3">
  <Card title="Before you install" icon="clipboard-list" href="/self-hosting/methods/prerequisites">
    Machine sizing, Docker and Kubernetes versions, ports, DNS, and network access.
  </Card>
  <Card title="After you install" icon="list-checks" href="/self-hosting/methods/after-install">
    Create the instance admin in God Mode, set up email and authentication, enable HTTPS, set up backups.
  </Card>
  <Card title="Activate your license" icon="key-round" href="/self-hosting/methods/after-install#activate-your-license">
    Purchased Pro, Business, or Enterprise Grid? Activate the key from the Prime portal, or the license file on Airgapped, right after install.
  </Card>
</CardGroup>

## Community Edition

The open-source [Community Edition](/self-hosting/community/overview) (AGPL v3.0, current release %%CE_VERSION%%) is installed with the `setup.sh` script or the `plane-ce` Helm chart. Guides: [Docker Compose](/self-hosting/community/docker-compose), [Kubernetes](/self-hosting/community/kubernetes), [Manage your instance](/self-hosting/community/manage). To move a Community instance to the Commercial Edition, see [Upgrade Community to Commercial](/self-hosting/upgrade-from-community).
