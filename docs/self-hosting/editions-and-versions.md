---
title: Plane editions
description: Compare Plane's self-hosted editions. Commercial, Airgapped, and Community. How each is installed, licensed, and versioned, and which plans it supports.
keywords: plane editions, plane commercial edition, plane airgapped edition, plane community edition, plane pro, plane business, enterprise grid, self-hosting comparison, plane versions
---

# Plane editions

Plane is available as [Plane Cloud](https://app.plane.so) and as three self-hosted editions. Two terms matter when you self-host:

- **The edition is the codebase you run:** Commercial, Airgapped, or Community. Each has its own release cycle and installer.
- **The plan is the set of features your license unlocks:** Free, Pro, Business, or Enterprise Grid, on the Commercial and Airgapped Editions.

## At a glance

|                         | **Commercial Edition** (recommended)                                                                                                                                                                                                             | **Airgapped Edition**                                                                                                                                                                 | Community Edition                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Built for               | Teams and organizations that want full parity with Plane Cloud on their own infrastructure                                                                                                                                                       | Organizations that must run in isolated networks with no outbound internet access                                                                                                     | Developers and teams who want the open-source core and don't need paid features                                                     |
| Source                  | Closed source                                                                                                                                                                                                                                    | Closed source (same codebase as Commercial)                                                                                                                                           | Open source, [AGPL v3.0](https://github.com/makeplane/plane/blob/preview/LICENSE.txt)                                               |
| Plans                   | Free (12 seats per workspace) out of the box. Pro, Business, or Enterprise Grid with a license key                                                                                                                                               | Enterprise Grid. Licenses are activated from files instead of keys, instance-wide or per workspace for Pro/Business                                                                   | Free. No license key, no seat cap                                                                                                   |
| Features                | Full parity with Plane Cloud. Paid features unlock per plan                                                                                                                                                                                      | Same as Commercial                                                                                                                                                                    | Parity with the Cloud Free tier                                                                                                     |
| Installed with          | [Prime CLI on Docker Compose](/self-hosting/methods/docker-compose), [Helm chart `plane-enterprise`](/self-hosting/methods/kubernetes), plus [AIO, Swarm, Podman, Coolify, Portainer](/self-hosting/methods/overview#other-docker-based-methods) | [Bundle + private registry on Docker](/self-hosting/methods/airgapped-edition), [Helm chart `plane-enterprise` in airgapped mode](/self-hosting/methods/airgapped-edition-kubernetes) | [`setup.sh` on Docker Compose](/self-hosting/community/docker-compose), [Helm chart `plane-ce`](/self-hosting/community/kubernetes) |
| Network access          | Outbound to `prime.plane.so` for license validation and feature flags, Docker Hub for images                                                                                                                                                     | None required                                                                                                                                                                         | Outbound to GitHub and Docker Hub for installs and upgrades                                                                         |
| Current version         | %%COMMERCIAL_VERSION%% (Helm chart %%HELM_EE_VERSION%%)                                                                                                                                                                                          | %%COMMERCIAL_VERSION%% (same series as Commercial)                                                                                                                                    | %%CE_VERSION%% (Helm chart %%HELM_CE_VERSION%%)                                                                                     |
| Upgrades                | `sudo prime-cli upgrade` or `helm upgrade`. See [Update Plane](/self-hosting/manage/upgrade-plane)                                                                                                                                               | New bundle and re-mirrored images. See [Update Airgapped](/self-hosting/manage/update-plane/airgapped-edition/update-airgapped-docker)                                                | `./setup.sh` → Upgrade, or `helm upgrade`. See [Community → Manage](/self-hosting/community/manage)                                 |
| Support                 | Plane support according to your plan                                                                                                                                                                                                             | Enterprise support                                                                                                                                                                    | Community: [Discord](https://discord.gg/plane), [GitHub issues](https://github.com/makeplane/plane/issues)                          |
| Moving between editions | Community → Commercial: [migrate your data](/self-hosting/upgrade-from-community)                                                                                                                                                                | Community → Airgapped: [migrate your data](/self-hosting/manage/community-to-airgapped)                                                                                               | To unlock paid features, move to Commercial                                                                                         |

## Commercial Edition <EditionBadge edition="commercial" />

The edition we recommend for teams. It is the same application that runs Plane Cloud, packaged for your infrastructure.

- **Free plan included.** 12 free seats per workspace, so you can run it in production at small scale without buying anything.
- **Upgrade in place.** A license key from the [Prime portal](https://prime.plane.so/licenses) unlocks Pro or Business per workspace, or Enterprise Grid for the whole instance. The upgrade flow counts the seats you need from the users with paid roles in your workspace.
- **Full feature parity with Cloud**, including governance, compliance, and security features (SSO, SAML, LDAP, audit logs, and more, by plan).
- **Managed with the Prime CLI** on Docker (`sudo prime-cli`), or with Helm on Kubernetes.

Install it: [Choose your install](/self-hosting/methods/overview).

## Airgapped Edition <EditionBadge edition="airgapped" plan="enterprise" />

The Commercial Edition adapted for environments that prohibit outbound network communication: sovereign clouds, classified networks, regulated on-premise data centers.

- **Complete isolation.** No calls to `prime.plane.so` or any external service. Licenses are activated by uploading a license file, and feature flags ship with the release.
- **Full feature parity** with the Commercial Edition.
- **Images from your registry.** You mirror Plane's images into a private registry ([Clone Docker images](/self-hosting/methods/clone-docker-images)) and install from downloaded files on Docker, or with the `plane-enterprise` Helm chart in airgapped mode.
- **Available with Enterprise Grid.** [Talk to sales](https://plane.so/talk-to-sales) to get the download URL and your license file.

Install it: [Airgapped overview and requirements](/self-hosting/methods/airgapped-requirements).

## Community Edition <EditionBadge edition="community" />

The open-source edition, licensed under AGPL v3.0, with the same core project and knowledge management features as the Cloud Free tier and no user cap. Use it to audit the code, contribute, or run Plane at any scale without paid features. It has its own installer (`setup.sh`), Helm chart (`plane-ce`), version series, and guides: [Community Edition](/self-hosting/community/overview).

To use Pro, Business, or Enterprise Grid features on an existing Community instance, [migrate to the Commercial Edition](/self-hosting/upgrade-from-community).

## Why separate editions

We keep a clean separation rather than an open-core codebase with hidden switches. The Community Edition is fully open, with no restrictions beyond AGPL v3.0. The Commercial and Airgapped Editions are closed source so that we can ship enterprise features and support quickly. There is no code in the Community Edition that limits what you can modify, and no forced migration between editions.

## Versions

Each edition is built from a separate codebase with its own release cycle, so version numbers are not comparable across editions. The Commercial and Airgapped Editions are on the %%COMMERCIAL_VERSION%% series. The Community Edition is on %%CE_VERSION%%. New features land in Plane Cloud first, then in Commercial and Airgapped, then in Community. See [Versions and releases](/self-hosting/versions) for where to find release numbers and how Helm chart versions map to application versions, and [Update Plane](/self-hosting/manage/upgrade-plane) for how to upgrade.

## Changelog

The changelog for every edition is at [plane.so/changelog](https://plane.so/changelog).
