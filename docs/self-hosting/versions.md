---
title: Versions and releases
description: How Plane versions work per edition, where to find the current release for the Commercial, Airgapped, and Community Editions, and how Helm chart versions map to application versions.
keywords: plane version, plane release, plane latest version, plane helm chart version, plane commercial version, plane community version, changelog
---

# Versions and releases

Plane's editions are separate codebases with separate release cycles, so each has its own version series. Use this page to find the release to install and to read a version number when you see one.

## Current releases

| Edition                                                                      | Application version                                    | Helm chart                                 | Where releases are published                                                                                                                                     |
| ---------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Commercial Edition](/self-hosting/editions-and-versions#commercial-edition) | **%%COMMERCIAL_VERSION%%**                             | `plane-enterprise` **%%HELM_EE_VERSION%%** | [Changelog](https://plane.so/changelog), [Prime portal](https://prime.plane.so), [Artifact Hub](https://artifacthub.io/packages/helm/makeplane/plane-enterprise) |
| [Airgapped Edition](/self-hosting/editions-and-versions#airgapped-edition)   | **%%COMMERCIAL_VERSION%%** (same series as Commercial) | `plane-enterprise` **%%HELM_EE_VERSION%%** | Bundle download URL from Plane. Images mirrored by you                                                                                                           |
| [Community Edition](/self-hosting/editions-and-versions#community-edition)   | **%%CE_VERSION%%**                                     | `plane-ce` **%%HELM_CE_VERSION%%**         | [GitHub releases](https://github.com/makeplane/plane/releases), [Artifact Hub](https://artifacthub.io/packages/helm/makeplane/plane-ce)                          |

The docs quote these numbers throughout the self-hosting section. When a new release ships, they are updated in one place.

## Reading a version number

- **Application versions** look like `v3.1.0` (Commercial and Airgapped) or `v1.4.1` (Community). A Commercial `v3.x` is not newer than a Community `v1.x`. They are different series.
- **Helm chart versions** are separate from application versions. `helm search repo plane` shows both: `CHART VERSION` and `APP VERSION`. Install guides pin the application version with `planeVersion` in your values, so upgrading the chart and upgrading Plane are separate decisions.
- **Docker image tags** equal the application version, for example `makeplane/backend-commercial:%%COMMERCIAL_VERSION%%` or `makeplane/plane-backend:%%CE_VERSION%%`.

::: warning Don't rely on `latest` or `stable`
Pin an explicit version in Compose files and Helm values. Floating tags make upgrades happen when you don't expect them, break airgapped mirroring, and make it impossible to roll back to a known state.
:::

## Where each installer gets its version

| Method                                                             | How the version is chosen                                                                                                                                                                       |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prime CLI (Docker Compose)                                         | The CLI installs the latest Commercial release and upgrades with `sudo prime-cli upgrade`. `APP_RELEASE_VERSION` in `/opt/plane/plane.env` records what is running.                             |
| Compose files for Swarm, Portainer, Coolify, or custom deployments | You download the assets for a specific release. See [Download config files](/self-hosting/methods/download-config).                                                                             |
| Helm (`plane-enterprise`, `plane-ce`)                              | `planeVersion` in your values file, and the chart version you install.                                                                                                                          |
| Airgapped bundle                                                   | The bundle is built for one release. Each upgrade is a new bundle plus re-mirrored images. See [Update Airgapped](/self-hosting/manage/update-plane/airgapped-edition/update-airgapped-docker). |
| Community `setup.sh`                                               | Installs the latest GitHub release. `APP_RELEASE` in `plane-app/plane.env` records what is running.                                                                                             |

## Release cadence and support

New features ship to Plane Cloud first, then to the Commercial and Airgapped Editions, then to the Community Edition. Minor releases land every few weeks. Plan to upgrade at least quarterly so that you are never far behind on security fixes. See [Update Plane](/self-hosting/manage/upgrade-plane) and the [changelog](https://plane.so/changelog).
