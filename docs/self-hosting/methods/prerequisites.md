---
title: Before you install
description: What to prepare before installing self-hosted Plane. Machine sizing, Docker and Kubernetes versions, ports, DNS, network access, and Airgapped Edition requirements.
keywords: plane system requirements, plane prerequisites, docker version, kubernetes version, ports 80 443, dns, self-hosting requirements, airgapped requirements
---

# Before you install

Prepare the items on this page before you run an installer. Most installation problems come from a missing DNS record, a port that is already in use, or an old Docker Compose.

::: info Which method?
See [Choose your install](/self-hosting/methods/overview). Each install guide links back here and lists only its own additional requirements.
:::

## Machine sizing

| Deployment                                                                                | Minimum                                                                                                                                  | Recommended for production                                                                                                              | Disk                                                                                                |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [Docker Compose](/self-hosting/methods/docker-compose), Swarm, Podman, Coolify, Portainer | 2 vCPU, 4 GB RAM                                                                                                                         | 4 vCPU, 8 GB RAM                                                                                                                        | 20 GB for images and logs, plus space for the database and uploads if they stay on the machine      |
| [Docker AIO](/self-hosting/methods/docker-aio)                                            | 2 vCPU, 4 GB RAM (app container only)                                                                                                    | 4 vCPU, 8 GB RAM                                                                                                                        | 10 GB. Data lives in your external PostgreSQL, Redis, RabbitMQ, and S3                              |
| [Kubernetes](/self-hosting/methods/kubernetes)                                            | About 4 vCPU / 8 GB of schedulable capacity for a single-replica install with the bundled data services (OpenSearch alone requests 2 GB) | Worker nodes across three availability zones and managed data services. See [High availability](/self-hosting/govern/high-availability) | PersistentVolumes for PostgreSQL, Redis, RabbitMQ, MinIO, and OpenSearch if you run them in-cluster |

- **CPU architecture:** x86-64 (AMD64) or AArch64 (ARM64).
- **Operating system (Docker-based methods):** Ubuntu 22.04+, Debian 12+, RHEL/CentOS/Rocky 9+, Amazon Linux 2 or 2023. macOS works for evaluation with Docker Desktop. On Windows, use WSL2 with one of the Linux distributions above.
- **Disk for uploads:** if you keep MinIO on the machine, plan for attachments and exports to grow. For production, use S3-compatible storage from the start. See [External services](/self-hosting/govern/database-and-storage).

## Software

| Installing with                                       | You need                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Docker Compose, Swarm, Coolify, Portainer, Docker AIO | Docker Engine **24 or later** with the **Compose v2 plugin**. Check with `docker --version` and `docker compose version` (with a space). The old `docker-compose` v1 binary is not supported. Install Docker with `curl -fsSL https://get.docker.com \| sh` on Linux, or Docker Desktop on macOS.                            |
| Podman Quadlets                                       | Podman **4.4 or later** with `netavark`, `passt`, and `uidmap`, and a systemd user session for the installing user (`loginctl enable-linger <user>` so services keep running after logout).                                                                                                                                  |
| Kubernetes                                            | Kubernetes **1.31 to 1.33**, `kubectl` and Helm **3.x** with access to the cluster, an ingress controller with an **IngressClass** (the chart defaults to `traefik` and also supports `nginx`), a default **StorageClass** for PersistentVolumeClaims, and **cert-manager** if you want the chart to issue TLS certificates. |
| Airgapped Edition                                     | Everything above for your chosen method, plus a **private container registry** reachable from every host or node, and a machine with internet access to mirror images. See [Airgapped overview](/self-hosting/methods/airgapped-requirements).                                                                               |

## Access to the machine

- **Docker-based installs run as root or with `sudo`.** The Prime CLI installer (`curl -fsSL https://prime.plane.so/install/ | sh -`) installs `prime-cli` under `/bin` and Plane under `/opt/plane`. All `prime-cli` commands run with `sudo`.
- **Podman installs are rootless.** Run `install.sh` as the user who will own the systemd services, not as root.
- **Kubernetes** needs a kubeconfig with permission to create namespaces, deployments, services, ingresses, PVCs, and secrets.

## Domain and DNS

- Decide the URL users will open, for example `plane.<your-company>.com`. An IP address works for a quick trial. Docker installers ask for it during setup and write it into `plane.env`. Changing it later means editing the configuration and restarting. See [Custom domain](/self-hosting/govern/custom-domain).
- **Create the DNS A (or AAAA) record before you install** and confirm it resolves to the machine (`dig +short <your-domain>`). The built-in proxy requests a Let's Encrypt certificate on first start. If the record isn't live yet, the certificate request fails.
- If Plane sits behind your own load balancer or reverse proxy that terminates TLS, point DNS at that proxy and read [External reverse proxy](/self-hosting/govern/reverse-proxy) before installing. The Prime installer accepts `--behind-proxy`.

## Ports

| Port               | Direction | Needed for                                                                                                                                                                       |
| ------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **80** and **443** | Inbound   | Web app, API, and Let's Encrypt validation. Both must be free on the machine and open in your firewall or security group. Podman Quadlets publish **8080** and **8443** instead. |
| 25, 465, 587       | Inbound   | Only if you enable Plane's built-in email service for [Intake email](/self-hosting/govern/configure-dns-email-service). Off by default.                                          |
| 22                 | Inbound   | SSH, to run the installer.                                                                                                                                                       |

Nothing else needs to be exposed. PostgreSQL, Redis, RabbitMQ, and MinIO listen only on the internal Docker network.

## Outbound network access

| Destination                                        | Why                                                                                                     | Airgapped Edition                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `prime.plane.so`                                   | Installer and Prime CLI download, Compose assets for your version, license validation and feature flags | Not needed. Licenses are activated from a file     |
| Docker Hub (`registry-1.docker.io`, `makeplane/*`) | Plane images                                                                                            | Not needed. Images come from your private registry |
| Let's Encrypt (`acme-v02.api.letsencrypt.org`)     | Automatic HTTPS certificates from the built-in proxy                                                    | Use your own certificates or an internal CA        |
| Your SMTP provider                                 | Invitation, magic-link, and notification emails ([SMTP for email](/self-hosting/govern/communication))  | Internal mail relay                                |

Behind a corporate proxy, set `HTTP_PROXY`/`HTTPS_PROXY` for the Docker daemon so image pulls work, and allow the destinations above.

## Optional: managed services

You can point Plane at services you already run instead of the bundled containers. Supported versions:

- **PostgreSQL** 15.7 or later, or 16.x
- **Redis** or **Valkey** 7.2 or later
- **RabbitMQ** 3.13 or later
- Any **S3-compatible object storage** (AWS S3, GCS with S3 interoperability, MinIO, Ceph). The bucket needs a CORS policy. See [External services](/self-hosting/govern/database-and-storage).
- **OpenSearch** 3.x, only for [advanced search](/self-hosting/govern/advanced-search)

For production, we recommend managed PostgreSQL and object storage so that backups and durability are handled by your provider.

## Airgapped Edition extras

- The bundle download URL and a license file from Plane. [Talk to sales](https://plane.so/talk-to-sales) if you don't have them.
- A private registry, and a machine with internet access to mirror images into it. See [Clone Docker images](/self-hosting/methods/clone-docker-images).
- On Kubernetes: cert-manager configured with an internal CA, and mirrored images for any add-ons you use (metrics-server, ingress controller).

## Checklist

- [ ] Machine or cluster sized per the table above, with disk planned for data
- [ ] Docker 24+ with Compose v2 (`docker compose version`), or Podman 4.4+, or Kubernetes 1.31 to 1.33 with Helm 3
- [ ] Root or `sudo` access (Docker), or a rootless user with linger enabled (Podman)
- [ ] Domain decided and DNS record resolving to the machine or load balancer
- [ ] Ports 80 and 443 free and open (8080/8443 for Podman)
- [ ] Outbound access to `prime.plane.so`, Docker Hub, and Let's Encrypt, or, for airgapped, a populated private registry
- [ ] SMTP credentials ready for [after you install](/self-hosting/methods/after-install#set-up-email)

Next: [Docker Compose](/self-hosting/methods/docker-compose) or [Kubernetes](/self-hosting/methods/kubernetes).
