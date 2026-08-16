---
title: Configure custom domain
description: Configure custom domain for self-hosted Plane. Setup your own domain name for your Plane instance.
keywords: plane custom domain, domain setup, dns configuration, self-hosting, plane domain name, custom url
---

# Configure custom domain <EditionBadge edition="commercial" />

During installation, you configure a domain for your instance. If you need to change that domain later, whether you're moving to a production domain, switching to a different hostname, or updating your DNS configuration, this guide walks you through the process.

:::info
**Prime CLI is for Docker installations only.** These commands only work on Plane instances originally installed using `prime-cli`.

If you're running Kubernetes or another deployment method, the environment variable names are the same, but the configuration method differs based on your setup.
:::

:::warning
**Plan for downtime**  
Changing domains requires restarting Plane services. Your instance will be unavailable for a few minutes during the restart. Plan accordingly or notify your users.
:::

## Check current domain configuration

First, see which environment variables currently reference your old domain. This helps you identify exactly what needs updating.

```bash
cat /opt/plane/plane.env | grep <old_domain>
```

**Example output:**

```ini
DOMAIN_NAME=localhost
SITE_ADDRESS=http://localhost
WEB_URL=http://localhost
CORS_ALLOWED_ORIGINS=http://localhost,https://localhost
```

This shows you all the variables that contain your current domain. You'll update each of these in the next step.

## Update domain in environment file

1. Open the Plane environment configuration file:

   ```bash
   vim /opt/plane/plane.env
   ```

2. Find and update these environment variables with your new domain:
   - **DOMAIN_NAME**

   Set this to your bare domain name without protocol:

   ```ini
   DOMAIN_NAME=plane.company.com
   ```

   Don't include `http://` or `https://` here, just the hostname.
   - **SITE_ADDRESS**

   This is the address the built-in Caddy proxy listens on. It decides how TLS is handled:

   ```ini
   # Caddy serves this hostname and provisions a Let's Encrypt certificate automatically
   # (needs ports 80 and 443 reachable from the internet, and DNS pointing at this host)
   SITE_ADDRESS=plane.company.com

   # Plain HTTP for this hostname (no certificate), for internal or test setups
   SITE_ADDRESS=http://plane.company.com

   # Plain HTTP on port 80 for any hostname. Use this when an external reverse proxy or
   # load balancer terminates TLS in front of Plane. See External reverse proxy.
   SITE_ADDRESS=:80
   ```

   See [SSL](/self-hosting/govern/configure-ssl) and [External reverse proxy](/self-hosting/govern/reverse-proxy).
   - **WEB_URL**

   The public URL users open in the browser, always with the protocol:

   ```ini
   WEB_URL=https://plane.company.com
   ```

   - **CORS_ALLOWED_ORIGINS**

   List all domains that should be allowed to make cross-origin requests to your Plane instance. This typically includes both HTTP and HTTPS versions of your domain:

   ```ini
   CORS_ALLOWED_ORIGINS=https://plane.company.com,http://plane.company.com
   ```

   Separate multiple entries with commas, no spaces. If you have multiple domains or subdomains that need access, add them all here.

## Restart Plane services

Apply your configuration changes by restarting Plane:

```bash
sudo prime-cli restart
```

This process typically takes a few minutes. You'll see output indicating the status of each service as it restarts.

## Community Edition

On the Community Edition the same settings live in `plane-app/plane.env` (`APP_DOMAIN`, `WEB_URL`, `CORS_ALLOWED_ORIGINS`, and `SITE_ADDRESS`/`CERT_EMAIL` for the bundled Caddy proxy). Edit the file, then run `./setup.sh restart`. See [Community Edition → Manage your instance](/self-hosting/community/manage#change-the-domain).
