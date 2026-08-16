---
title: After you install
description: First-run checklist for a new self-hosted Plane instance. Create the instance admin in God Mode, set up email and authentication, activate your license, enable HTTPS, connect managed services, and set up backups.
keywords: plane god mode setup, instance admin, first admin, plane smtp setup, activate plane license, plane ssl, plane backup, self-hosting checklist, post install
---

# After you install

Your instance is running. Work through this list in order. The first item is required before anyone can sign in. The next few make the instance usable for a team. The rest harden it for production. Each step links to the page with the details.

Already purchased Pro, Business, or Enterprise Grid? Do step 1, then jump to [Activate your license](#activate-your-license).

::: info Applies to
Commercial and Airgapped Editions on every deployment method. Steps that differ by edition are called out. On the Community Edition, everything here applies too, except that the CLI commands are the `setup.sh` ones. See [Community Edition → Manage your instance](/self-hosting/community/manage).
:::

## 1. Create the instance admin in God Mode <Badge type="danger" text="Required" />

Open **`https://<your-domain>/god-mode/`** in a browser. On a fresh instance this shows the _secure instance setup_ form instead of a sign-in screen. Enter the admin's email, a strong password (the form rejects weak or common passwords), a first name, and your company name, and choose whether to share anonymous usage data.

Submitting the form creates the first instance admin, marks the instance as set up, and opens God Mode's **General** settings. Until this is done, **no one can sign in or sign up in the app**, including you.

Store these credentials safely. This account administers every workspace on the instance. You can invite more instance admins later from **God Mode → User management**. See [Instance admin and God Mode](/self-hosting/govern/instance-admin).

## 2. Set up email {#set-up-email}

Go to **God Mode → Email**. Enter your SMTP host, port, sender address, security (TLS or SSL), and credentials, then send the test email. Plane uses outbound email for workspace invitations, magic-link sign-in codes, password resets, exports, and notifications. Without it, invited users don't receive their invitation.

Provider examples (Amazon SES, SendGrid, Google Workspace, and others) are in [SMTP for email](/self-hosting/govern/communication). SMTP is configured in God Mode, not in the environment file.

## 3. Choose how people sign in

**God Mode → Authentication** controls unique-code (magic link) sign-in, passwords, and whether anyone can sign up or only invited users. Enable your identity provider if you use one: [Google OAuth](/self-hosting/govern/google-oauth), [GitHub OAuth](/self-hosting/govern/github-oauth), [OIDC SSO](/self-hosting/govern/oidc-sso), [SAML SSO](/self-hosting/govern/saml-sso), or [LDAP](/self-hosting/govern/ldap). See [Authentication](/self-hosting/govern/authentication) for what each plan includes.

Turn off **Allow anyone to sign up without an invite** if the instance is reachable from the internet and you don't want open registration.

## 4. Create your first workspace and invite your team

Open `https://<your-domain>/` and sign in with the instance-admin account. Create a workspace, then invite members from **Workspace settings → Members**. Instance admins can see and manage every workspace from **God Mode → Workspaces**.

## 5. Activate your license (paid plans) {#activate-your-license}

The Commercial and Airgapped Editions run on the Free plan out of the box. To unlock Pro, Business, or Enterprise Grid features, activate the license from the [Prime portal](https://prime.plane.so/licenses):

:::tabs key:edition

== Commercial {#commercial}

- **Pro or Business:** in the workspace, go to **Workspace settings → Billing and plans → Activate this workspace**, paste the license key, and click **Activate**. Each key is bound to one workspace and to this machine. See [Activate Pro or Business](/self-hosting/manage/manage-licenses/activate-pro-and-business#activate-your-license).
- **Enterprise Grid:** the license covers the whole instance. Activate it in **God Mode → Billing**. See [Activate Enterprise Grid](/self-hosting/manage/manage-licenses/activate-enterprise).

The license monitor re-validates with Prime every 30 minutes. The instance needs outbound access to `prime.plane.so` for this.

== Airgapped {#airgapped}

Licenses are activated from a license file instead of a key. No outbound access is needed.

- **Pro or Business:** **Workspace settings → Billing and plans → Activate this workspace**, then upload the license file. See [Activate on Airgapped Edition](/self-hosting/manage/manage-licenses/activate-airgapped).
- **Enterprise Grid:** upload the license file in **God Mode → Billing**. See [Activate Enterprise Grid on Airgapped Edition](/self-hosting/manage/manage-licenses/activate-airgapped-enterprise).

:::

## 6. Serve Plane over HTTPS

If you installed with a domain name and ports 80/443 are reachable from the internet, the built-in proxy already obtained a Let's Encrypt certificate and Plane is served over HTTPS. If not, or if your DNS record was created after the install:

- Built-in proxy: set `SITE_ADDRESS`, `CERT_EMAIL`, and `WEB_URL` as described in [SSL](/self-hosting/govern/configure-ssl), then restart.
- Your own load balancer or reverse proxy in front of Plane: [External reverse proxy](/self-hosting/govern/reverse-proxy).
- Kubernetes: configure the ingress and cert-manager values described in [Kubernetes](/self-hosting/methods/kubernetes).

To change the address later, see [Custom domain](/self-hosting/govern/custom-domain).

## 7. Move data to managed services (production)

The bundled PostgreSQL, Redis, RabbitMQ, and MinIO are fine for evaluation and small teams. For production, point Plane at managed PostgreSQL and S3-compatible object storage so that a machine failure doesn't take your data with it. Docker installs: `sudo prime-cli configure`. All methods: [External services](/self-hosting/govern/database-and-storage) and, for existing data, [Migrate to external services](/self-hosting/manage/migration/migrate-data-to-external-services).

Also review `/opt/plane/plane.env` (Docker) or your Helm values and rotate any default secret you didn't set yourself: `SECRET_KEY`, `LIVE_SERVER_SECRET_KEY`, and the database and MinIO passwords. See [Environment variables](/self-hosting/govern/environment-variables) and [External secrets](/self-hosting/govern/external-secrets).

## 8. Set up backups

Set up backups before real users start working, and test a restore within the first month. Docker: `sudo prime-cli backup` and `sudo prime-cli restore` ([Backup and restore](/self-hosting/manage/backup-restore)). Managed services: use your provider's snapshots and bucket versioning. Back up `plane.env` (or your Helm values) too. It holds the secrets your data is encrypted with.

## 9. Monitor health and plan upgrades

- Point your uptime monitor at `/api/ready/` and `/api/health/`. See [Health checks](/self-hosting/manage/health-checks). On Docker, `sudo prime-cli monitor` shows every service and its logs.
- Plane ships frequently. Read [Update Plane](/self-hosting/manage/upgrade-plane), pick a cadence (quarterly at minimum), and follow the [changelog](https://plane.so/changelog). Current release: %%COMMERCIAL_VERSION%%.
- Optional features to configure next: [Integrations](/self-hosting/govern/integrations/github) (GitHub, GitLab, Slack, Bitbucket, Sentry), [Intake email](/self-hosting/govern/configure-dns-email-service), [OpenSearch for search](/self-hosting/govern/advanced-search), and [Plane AI](/self-hosting/govern/plane-ai/configure-plane-ai).

## Something not working?

Start with [Troubleshoot](/self-hosting/troubleshoot/overview), which maps each symptom to the service and log to check, then the pages for [installation](/self-hosting/troubleshoot/installation-errors), [license](/self-hosting/troubleshoot/license-errors), [CLI](/self-hosting/troubleshoot/cli-errors), and [storage](/self-hosting/troubleshoot/storage-errors) errors. Still stuck? See [Get help](/self-hosting/overview#get-help).
