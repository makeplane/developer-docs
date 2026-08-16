---
title: Podman Quadlets
description: Deploy Plane Commercial Edition with rootless Podman managed by systemd (Quadlets). Install Podman, download the quadlets bundle for a release, run install.sh, start the services in order, and verify.
keywords: plane podman, podman quadlets, systemd containers, rootless containers, docker alternative, plane podman deployment, self-hosting
---

# Podman Quadlets <EditionBadge edition="commercial" />

::: info Edition availability
Commercial Edition only. Podman Quadlets run each Plane service as a rootless systemd user unit. Use this on hosts where Docker isn't allowed. On a normal Docker host, [Docker Compose](/self-hosting/methods/docker-compose) is simpler.
:::

The quadlets bundle contains one `.container` unit per service, a shared network unit, a Caddyfile, and an `install.sh` that puts everything in place. The proxy publishes **8080** (HTTP) and **8443** (HTTPS) on the host. Put your own reverse proxy or firewall rules in front if you need 80/443. The data services (PostgreSQL, Redis, RabbitMQ, MinIO) are included. Point Plane at managed services for production.

## Before you begin

Read [Before you install](/self-hosting/methods/prerequisites). For Podman you need:

- **Podman 4.4 or later** with `netavark`, `passt`, and `uidmap`, plus `aardvark-dns` (package name varies: `aardvark-dns` on Debian/Ubuntu, `podman-plugins` on RHEL-family) for container name resolution.
- A **non-root user** with a systemd user session. Enable lingering so that services keep running after logout: `loginctl enable-linger $USER`.
- Ports **8080 and 8443** free, and DNS for your domain pointing at the host (or at the proxy in front of it).
- Outbound access to Docker Hub and `prime.plane.so`.
- `uuidgen` (`util-linux` or `uuid-runtime`). `install.sh` uses it to generate the machine signature.

Install Podman with your distribution's packages (`sudo dnf install podman` on Fedora/RHEL 9+, `sudo apt install podman uidmap netavark passt` on Debian 12+/Ubuntu 24.04+). If your distribution ships an older Podman, use a newer repository. For Debian 12, for example, the alvistack builds:

```bash
echo 'deb http://download.opensuse.org/repositories/home:/alvistack/Debian_12/ /' | sudo tee /etc/apt/sources.list.d/home:alvistack.list
curl -fsSL https://download.opensuse.org/repositories/home:alvistack/Debian_12/Release.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/home_alvistack.gpg > /dev/null
sudo apt update && sudo apt install -y podman uidmap netavark passt aardvark-dns
podman --version
```

## Install

1. Download and extract the quadlets bundle for the release (current: %%COMMERCIAL_VERSION%%), as the user who will run Plane:

   ```bash
   mkdir podman-quadlets
   curl -fsSL https://prime.plane.so/releases/%%COMMERCIAL_VERSION%%/podman-quadlets.tar.gz -o podman-quadlets.tar.gz
   tar -xvzf podman-quadlets.tar.gz -C podman-quadlets
   cd podman-quadlets
   ```

2. Run the installer (no `sudo`):

   ```bash
   ./install.sh --domain <your-domain>
   # or choose the install directory explicitly:
   ./install.sh --domain <your-domain> --base-dir /srv/plane
   ```

   Without `--base-dir`, the installer uses `/opt/plane` if your user can `sudo` non-interactively, otherwise `~/plane`. It creates the `data/`, `logs/`, and `proxy/` directories, writes `plane.env` with your domain, `WEB_URL=http://<domain>:8080`, and a generated `MACHINE_SIGNATURE`, and installs the unit files into `~/.config/containers/systemd/`.

3. Optional: before starting, edit `plane.env` in the install directory.
   - Behind a TLS-terminating proxy: set `WEB_URL=https://<your-domain>` and `CORS_ALLOWED_ORIGINS=https://<your-domain>`.
   - Managed services: `DATABASE_URL`, `REDIS_URL`, `AMQP_URL`, `USE_MINIO=0` plus `AWS_*` ([External services](/self-hosting/govern/database-and-storage)). OpenSearch: `OPENSEARCH_ENABLED=1`, `OPENSEARCH_URL`, credentials ([advanced search](/self-hosting/govern/advanced-search)).
   - Rotate `SECRET_KEY`, `LIVE_SERVER_SECRET_KEY`, `SILO_HMAC_SECRET_KEY`, `AES_SECRET_KEY`, and the bundled service passwords. See [Environment variables](/self-hosting/govern/environment-variables).

4. Start the services in order (as your user, no `sudo`):

   ```bash
   systemctl --user daemon-reload

   # network first; required for container name resolution
   systemctl --user start plane-nw-network.service

   # data services
   systemctl --user start plane-{db,redis,mq,minio}.service

   # backend
   systemctl --user start {migrator,api,worker,beat-worker,monitor,silo,automation-consumer,webhook-consumer,outbox-poller,live-exporter,runner}.service

   # optional: Plane AI (needs PLANE_PI_DATABASE_URL in plane.env)
   # systemctl --user start {pi-db-init,pi-migrator,pi-api,pi-beat,pi-worker}.service

   # frontends and proxy
   systemctl --user start {web,space,admin,live,iframely,proxy}.service
   ```

   Enable the units you want at boot with `systemctl --user enable <unit>`. With lingering enabled they start without a login.

## Verify

```bash
systemctl --user status plane-nw-network.service plane-{db,redis,mq,minio}.service --no-pager
systemctl --user status {api,worker,beat-worker,monitor,silo,web,space,admin,live,proxy}.service --no-pager
journalctl --user -u api --no-pager | tail -20      # ends with "Application startup complete"
```

Open `http://<your-domain>:8080` (or your proxy's URL). You should see the sign-in page. Create the instance admin next.

## After you install

Follow **[After you install](/self-hosting/methods/after-install)**, starting with `http://<your-domain>:8080/god-mode/`. For HTTPS, either terminate TLS at your own reverse proxy in front of 8080 ([External reverse proxy](/self-hosting/govern/reverse-proxy)), or set `SITE_ADDRESS` in `plane.env` to your domain and expose 8443.

::: tip Purchased a plan? Activate your license
Copy the license key from the [Prime portal](https://prime.plane.so/licenses). Sign in with the email you used to purchase.

- **Pro or Business:** in the app, go to **Workspace settings → Billing and plans → Activate this workspace**, paste the key, and click **Activate**. Each key activates one workspace. [Steps](/self-hosting/manage/manage-licenses/activate-pro-and-business#activate-your-license).
- **Enterprise Grid:** open **God Mode → Billing**, paste the key, and click **Activate**. It covers every workspace on the instance. [Steps](/self-hosting/manage/manage-licenses/activate-enterprise).

The instance needs outbound access to `prime.plane.so` to validate the license. Without a license, Plane runs on the Free plan. See [plans and pricing](https://plane.so/pricing).
:::

## Manage

```bash
systemctl --user restart api.service                 # restart one service after editing plane.env
systemctl --user stop {web,space,admin,live,iframely,proxy}.service   # stop groups in reverse order
journalctl --user -u <service> -f                    # follow logs
```

**Upgrade:** back up your data and copy `plane.env` aside first. `install.sh` overwrites `plane.env` and generates a **new** `MACHINE_SIGNATURE`, which would unbind your licenses. Then:

```bash
cp /opt/plane/plane.env ~/plane.env.backup           # keep your settings and MACHINE_SIGNATURE
# download and extract the new bundle, then in its folder:
./install.sh --domain <your-domain> [--base-dir /opt/plane]
# merge your values back: at minimum MACHINE_SIGNATURE, secrets, WEB_URL/CORS, external service URLs
diff ~/plane.env.backup /opt/plane/plane.env
systemctl --user daemon-reload
# stop and start the services in the order above
```

See [Backup and restore](/self-hosting/manage/backup-restore#other-deployment-methods).

## Troubleshoot

- **Containers can't resolve each other** (`plane-db` not found). The network unit isn't started, or `aardvark-dns` isn't installed.
- **Services stop when you log out.** Enable lingering: `loginctl enable-linger $USER`.
- **`monitor` fails.** `MACHINE_SIGNATURE` is missing in `plane.env` (`uuidgen` wasn't available when `install.sh` ran). Set it and restart.
- **Ports 8080/8443 not reachable.** Firewall. Or you expected 80/443: the quadlets publish 8080/8443 by design.
- Logs: `journalctl --user -u <service-name> --no-pager`. More: [Troubleshoot](/self-hosting/troubleshoot/overview).
