---
title: Community Edition
description: Self-host the open-source Plane Community Edition. What it includes, how it is licensed and versioned, how to install it with setup.sh or Helm, and how to move to the Commercial Edition later.
keywords: plane community edition, plane open source, self-host plane free, agpl plane, setup.sh, plane-ce helm chart, plane community docker
---

# Community Edition <EditionBadge edition="community" />

The Community Edition is Plane's open-source edition, released under [AGPL v3.0](https://github.com/makeplane/plane/blob/preview/LICENSE.txt) from [github.com/makeplane/plane](https://github.com/makeplane/plane). It has the same core project and knowledge management features as the Plane Cloud Free tier, no seat limit, and no license key.

::: info Looking for paid features, support, or an isolated-network deployment?
Those are the [Commercial Edition](/self-hosting/methods/overview) (recommended; includes a free plan and unlocks Pro, Business, and Enterprise Grid with a license key) and the [Airgapped Edition](/self-hosting/methods/airgapped-requirements). If you already run the Community Edition, you can [move your data to the Commercial Edition](/self-hosting/upgrade-from-community).
:::

## What you get

- Projects, work items, cycles, modules, views, pages, intake, dashboards, estimates, REST API, and webhooks. This is the Cloud Free tier feature set.
- The full stack: web app, public spaces, admin console (God Mode), API, workers, real-time collaboration server, and, unless you use your own, PostgreSQL, Redis (Valkey), RabbitMQ, and MinIO, behind a bundled Caddy proxy.
- No user cap and no license key. Paid-plan features (SSO, SAML, LDAP, audit logs, Plane AI, integrations, and more) are not part of this edition.

## How it differs from the Commercial Edition

|                    | Community Edition                                                                               | Commercial Edition                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Source and license | Open source, AGPL v3.0                                                                          | Closed source                                                       |
| Installer          | `setup.sh` from GitHub releases; `plane-ce` Helm chart                                          | Prime CLI (`prime.plane.so/install`); `plane-enterprise` Helm chart |
| Management         | `./setup.sh` menu and subcommands                                                               | `sudo prime-cli`                                                    |
| Version series     | %%CE_VERSION%% (chart %%HELM_CE_VERSION%%)                                                      | %%COMMERCIAL_VERSION%% (chart %%HELM_EE_VERSION%%)                  |
| Plans              | Free only                                                                                       | Free, Pro, Business, Enterprise Grid                                |
| Support            | [Discord](https://discord.gg/plane), [GitHub issues](https://github.com/makeplane/plane/issues) | Plane support by plan                                               |

Release cadence: features ship to Plane Cloud first, then Commercial, then Community. See [Versions and releases](/self-hosting/versions).

## Install

<CardGroup>
  <Card title="Docker Compose" icon="docker" href="/self-hosting/community/docker-compose" link-text="Install with setup.sh">
    Download <code>setup.sh</code> from the latest GitHub release, run <em>Install</em>, edit <code>plane.env</code>, and start. Single machine, about 20 minutes.
  </Card>
  <Card title="Kubernetes" icon="kubernetes" href="/self-hosting/community/kubernetes" link-text="Install with Helm">
    Deploy with the <code>plane-ce</code> Helm chart. Bundled or external PostgreSQL, Redis, RabbitMQ, and MinIO.
  </Card>
</CardGroup>

The Community release also ships `swarm.sh` for Docker Swarm and a `plane-aio-community` all-in-one image. Both are described in the [deployment README](https://github.com/makeplane/plane/tree/preview/deployments) in the repository.

## After you install

The [After you install](/self-hosting/methods/after-install) checklist applies to the Community Edition too. In particular, create the instance admin at `/god-mode/` before anyone can sign in, and configure SMTP in **God Mode → Email**, not in `plane.env`. Day-to-day operations (start and stop, upgrades, logs, backup and restore, changing the domain, external services) are in [Manage your instance](/self-hosting/community/manage).

## AGPL in practice

Running or modifying the Community Edition for your own organization has no obligations beyond the AGPL terms. Hosting it as a service for external users, or embedding it in a product, requires you to publish your modifications under AGPL, or to [talk to sales](https://plane.so/talk-to-sales) about a commercial license. See [Self-hosting 101](/self-hosting/self-hosting-101#agpl-in-practice).
