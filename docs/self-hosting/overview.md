---
title: Self-host Plane
description: Deploy Plane on your own infrastructure. Install the Commercial Edition with Docker Compose or Kubernetes, or the Airgapped Edition for isolated networks, then configure, operate, and upgrade your instance.
keywords: self-host plane, plane docker, plane kubernetes, plane commercial edition, plane airgapped edition, self-hosted project management, docker compose plane, kubernetes helm plane, on-premise deployment
---

# Self-host Plane

Run Plane on infrastructure you control, from a single Docker host to a Kubernetes cluster, with or without internet access. You keep the data, the network path, the upgrade schedule, and the identity provider.

## Pick an edition, then a method

Self-hosted Plane ships in two editions for teams and organizations:

- **Commercial Edition** (recommended). Free for up to 12 seats per workspace. A license key unlocks Pro, Business, or Enterprise Grid.
- **Airgapped Edition**. The same product for networks without internet access. Enterprise Grid.

The open-source Community Edition is documented separately under [Community Edition](/self-hosting/community/overview). See [Plane editions](/self-hosting/editions-and-versions) for a comparison.

<CardGroup>
  <Card title="Docker Compose" icon="docker" href="/self-hosting/methods/docker-compose" link-text="Install with the Prime CLI">
    Recommended. One command on a single machine. About 15 minutes to a running instance. Commercial Edition.
  </Card>
  <Card title="Kubernetes" icon="kubernetes" href="/self-hosting/methods/kubernetes" link-text="Install with Helm">
    Deploy with the <code>plane-enterprise</code> Helm chart for high availability, autoscaling, and managed data services. Commercial Edition.
  </Card>
</CardGroup>

<CardGroup>
  <Card title="Airgapped Edition" icon="wifi-off" href="/self-hosting/methods/airgapped-requirements" link-text="Deploy in isolated networks">
    Private registry, offline license files, no outbound access. On Docker or Kubernetes. Enterprise Grid.
  </Card>
  <Card title="All deployment methods" icon="route" href="/self-hosting/methods/overview" link-text="Choose your install">
    Docker AIO, Swarm, Podman, Coolify, Portainer, FIPS, and a comparison of when to use which.
  </Card>
</CardGroup>

## Plan the rollout

<CardGroup cols="3">
  <Card title="Self-hosting 101" icon="book-open" href="/self-hosting/self-hosting-101">
    What self-hosting involves, how licensing works, what your team operates, and how to plan.
  </Card>
  <Card title="Before you install" icon="clipboard-list" href="/self-hosting/methods/prerequisites">
    Sizing, Docker and Kubernetes versions, ports, DNS, and network access.
  </Card>
  <Card title="After you install" icon="list-checks" href="/self-hosting/methods/after-install">
    Create the instance admin, set up email and sign-in, activate your license, enable HTTPS, set up backups.
  </Card>
</CardGroup>

## Configure and govern

<CardGroup>
  <Card title="Instance admin and God Mode" icon="user-star" href="/self-hosting/govern/instance-admin">
    Instance-wide settings, workspaces, users, and telemetry from the admin console.
  </Card>
  <Card title="Authentication" icon="key-round" href="/self-hosting/govern/authentication">
    Passwords, magic links, Google and GitHub OAuth, OIDC and SAML SSO, LDAP.
  </Card>
</CardGroup>

<CardGroup>
  <Card title="Email and communication" icon="mail" href="/self-hosting/govern/communication">
    SMTP for invitations, notifications, and password resets, with provider examples.
  </Card>
  <Card title="External services" icon="database" href="/self-hosting/govern/database-and-storage">
    Managed PostgreSQL, Redis, RabbitMQ, and S3-compatible storage for production.
  </Card>
</CardGroup>

## Why teams self-host Plane

- **Data residency.** All work items, pages, and attachments stay on infrastructure you control, in the region your regulator or customer contract requires.
- **Isolation.** Run in a VPC, on a private network, or with no internet access at all with the Airgapped Edition.
- **Control.** You decide when to upgrade, which identity provider to use, and which internal systems Plane can reach.
- **Compliance.** The Commercial and Airgapped Editions add SSO, SAML, LDAP, audit logs, and FIPS deployment options by plan.

## Get help

- **Troubleshoot:** [symptom-to-log map](/self-hosting/troubleshoot/overview), plus pages for [installation](/self-hosting/troubleshoot/installation-errors), [license](/self-hosting/troubleshoot/license-errors), [CLI](/self-hosting/troubleshoot/cli-errors), and [storage](/self-hosting/troubleshoot/storage-errors) errors.
- **Commercial and Airgapped Editions:** support according to your plan. Contact us from your Prime portal account, or [talk to sales](https://plane.so/talk-to-sales) for Enterprise support and airgapped bundles.
- **Community Edition:** [Discord](https://discord.gg/plane) for questions, [GitHub issues](https://github.com/makeplane/plane/issues) for bugs.
- **Changelog:** [plane.so/changelog](https://plane.so/changelog).
