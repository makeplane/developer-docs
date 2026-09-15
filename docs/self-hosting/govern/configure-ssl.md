---
title: Set up SSL
description: Configure SSL/TLS certificates for Plane. Set up HTTPS with Let's Encrypt or bring your own certificate from a corporate CA on Docker Compose, airgapped and Kubernetes deployments.
keywords: plane ssl, https setup, tls certificate, ssl configuration, lets encrypt, custom ssl certificate, corporate ca, self-signed certificate, kubernetes tls secret, secure deployment, self-hosting security
---

# Set up SSL <Badge type="info" text="Commercial Edition" />

This guide shows you how to configure SSL/TLS certificates for your self-hosted Plane instance. Plane handles certificate provisioning and renewal automatically using Let's Encrypt. If your instance runs behind an internal PKI, in an airgapped network, or must use a certificate issued by your own CA, you can [use your own certificate](#use-your-own-certificate) instead.

::: info
**Applies to:** Docker deployments of Plane Commercial Edition without an external reverse proxy. The [Kubernetes section](#kubernetes) covers the `plane-enterprise` Helm chart.

If you're using an external reverse proxy (nginx, Caddy, Traefik) or a load balancer, configure SSL there instead and skip this guide.
:::

## Before you begin

Ensure you have:

- A registered domain name pointing to your Plane server
- DNS records configured (A or CNAME record pointing to your server's IP)
- Ports 80 and 443 open on your server's firewall
- Prime CLI installed (included with Plane Commercial Edition)

::: warning
**DNS must be configured first.** Let's Encrypt validates domain ownership by making HTTP requests to your domain. Ensure your domain resolves to your server's IP address before proceeding.
:::

## Configure SSL settings

### Open the configuration file

Edit your Plane environment configuration:

```bash
vim /opt/plane/plane.env
```

### Set required variables

Add or update these environment variables:

```bash
# SSL Configuration
CERT_EMAIL=admin@yourcompany.com
SITE_ADDRESS=plane.yourcompany.com
WEB_URL=https://plane.yourcompany.com
```

**Variable explanations:**

**CERT_EMAIL**  
A valid email address for Let's Encrypt certificate registration. Let's Encrypt uses this to send renewal reminders and important notices about your certificates.

**SITE_ADDRESS**  
Your domain name **without** protocol. Use only the domain (e.g., `plane.company.com`), not `https://plane.company.com`. Plane's built-in proxy uses this to request certificates from Let's Encrypt.

**WEB_URL**  
Your full Plane URL **with** the `https://` protocol. This tells Plane services how to construct URLs for redirects, emails, and API responses.

### DNS provider configuration (optional)

If you're using Cloudflare or another DNS provider with API access, you can use DNS validation instead of HTTP validation. This is useful if:

- Your server is behind a firewall that blocks port 80
- You need wildcard certificates
- HTTP validation isn't working due to network restrictions

**For Cloudflare:**

```bash
CERT_ACME_DNS=acme_dns cloudflare <cloudflare-api-token>
```

Replace `<cloudflare-api-token>` with your Cloudflare API token. Create one at **Cloudflare Dashboard** → **My Profile** → **API Tokens** with **Zone:DNS:Edit** permissions.

**For other DNS providers:**

Check the [acme.sh DNS API documentation](https://github.com/acmesh-official/acme.sh/wiki/dnsapi) for provider-specific configuration.

## Apply SSL configuration

Restart Plane to apply the SSL settings:

```bash
sudo prime-cli restart
```

Prime CLI will:

1. Stop all Plane services
2. Request a new SSL certificate from Let's Encrypt
3. Configure the built-in proxy to use HTTPS
4. Restart all services with SSL enabled

This process typically takes 30-60 seconds.

## Verify SSL is working

Check that your Plane instance is accessible via HTTPS:

```bash
curl -I https://plane.yourcompany.com
```

You should see a response with `HTTP/2 200` or `HTTP/1.1 200` and SSL-related headers.

Visit your Plane instance in a browser at `https://plane.yourcompany.com`. You should see a secure connection (padlock icon) without certificate warnings.

## Use your own certificate

Use this when your instance runs behind an internal PKI, in an airgapped network, or must use a certificate issued by a specific CA. Plane's built-in proxy serves your certificate instead of requesting one from Let's Encrypt.

::: info
**Available in Plane v3.2.0 and later** for Docker Compose (Prime CLI), airgapped, Podman, Portainer and Docker AIO deployments of the Commercial Edition. Kubernetes deployments use a TLS Secret instead — see [Kubernetes](#kubernetes) below.
:::

### How it works

There is nothing to configure. The proxy container mounts the `ssl/` folder of your install directory read-only at `/ssl`. On startup it looks for a certificate and key pair there:

| File       | Content                                                          |
| ---------- | ---------------------------------------------------------------- |
| `cert.pem` | PEM-encoded **full chain** certificate (leaf plus intermediates) |
| `key.pem`  | PEM-encoded private key matching `cert.pem`                      |

The certbot names `fullchain.pem` and `privkey.pem` are accepted as well. When both files are present and valid, the proxy serves them. When the folder is empty, Let's Encrypt is used as described above. Any problem with the files is logged as a warning and the proxy still starts, so a bad certificate never blocks startup.

### Place the certificate and key

For a Prime CLI install the install directory is `/opt/plane`:

```bash
sudo mkdir -p /opt/plane/ssl
sudo cp fullchain.pem /opt/plane/ssl/cert.pem
sudo cp privkey.pem   /opt/plane/ssl/key.pem
sudo chmod 600 /opt/plane/ssl/key.pem
```

The proxy runs as root, so `root:root` files with mode `600` on the key are readable. If you run the proxy as another user, make sure that user can read both files.

::: tip
If your certificate is in DER or PKCS#12 format, convert it to PEM first:

```bash
openssl x509 -inform der -in cert.der -out cert.pem
openssl pkcs12 -in bundle.pfx -nodes -out combined.pem   # then split into cert and key
```

:::

### Set the domain

Edit `/opt/plane/plane.env` and set the domain the certificate was issued for. `CERT_EMAIL` is not needed:

```bash
SITE_ADDRESS=plane.yourcompany.com
WEB_URL=https://plane.yourcompany.com
```

::: warning
The certificate is ignored if `SITE_ADDRESS` is still a plain-HTTP address such as `localhost:80`, `:80`, or an `http://` URL. The proxy cannot serve TLS on those.
:::

### Apply and verify

Recreate the proxy so it picks up the mount and the new address:

```bash
sudo prime-cli restart
```

The proxy log confirms the certificate is in use:

```bash
docker compose -f /opt/plane/docker-compose.yml logs proxy | grep -i "ssl certificate"
```

```text
Custom SSL certificate enabled: /ssl/cert.pem (key: /ssl/key.pem)
```

Check that the issuer is your CA rather than Let's Encrypt:

```bash
openssl s_client -connect plane.yourcompany.com:443 -servername plane.yourcompany.com </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
```

### Rotate the certificate

Replace both files in `ssl/` and restart. The proxy reads the files at startup, so a running container keeps serving the old certificate until it is restarted:

```bash
sudo cp new-fullchain.pem /opt/plane/ssl/cert.pem
sudo cp new-privkey.pem   /opt/plane/ssl/key.pem
sudo prime-cli restart
```

### Go back to Let's Encrypt

Remove both files from `ssl/`, set `CERT_EMAIL`, and restart. Let's Encrypt provisioning resumes automatically.

### Troubleshooting

Every problem is logged by the proxy as a single line starting with `WARNING: custom SSL certificate ignored:` followed by the reason.

| Log message or symptom                                     | Cause and fix                                                                                                           |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `both cert.pem and key.pem are required`                   | Only one of the two files is present. Add the missing file or remove both.                                              |
| `files exist in /ssl but are not readable`                 | Fix file permissions on the host. The proxy needs read access to both files.                                            |
| `... is not a PEM encoded certificate` / `... private key` | Convert the files to PEM as shown above.                                                                                |
| `SITE_ADDRESS is 'localhost:80' (plain HTTP)`              | Set `SITE_ADDRESS` to your domain.                                                                                      |
| Browser reports an incomplete chain                        | `cert.pem` must contain the full chain, not the leaf alone.                                                             |
| Still serving the Let's Encrypt certificate                | Look for a `WARNING: custom SSL certificate ignored` line, or restart the proxy if it was not restarted after the copy. |
| Key does not match certificate                             | Compare `openssl x509 -noout -modulus -in cert.pem \| md5sum` with `openssl rsa -noout -modulus -in key.pem \| md5sum`. |

### Airgapped deployments

An airgapped host cannot reach Let's Encrypt, so a certificate from your internal CA is the only way to serve HTTPS. The mechanism is the same, with the install directory being the setup directory you chose during installation. See [Use your own SSL certificate](/self-hosting/methods/airgapped-edition#use-your-own-ssl-certificate) in the airgapped Docker guide for the exact steps.

## Kubernetes

The `plane-enterprise` Helm chart does not run the built-in proxy. TLS terminates at your ingress controller, so the `ssl/` folder does not apply. The chart supports three modes in its `ssl` values block:

| Your setup                                                    | Set                                                  | Who holds the certificate                                             |
| ------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------- |
| Bring your own certificate                                    | `ssl.tls_secret_name`                                | A `kubernetes.io/tls` Secret you create                               |
| Let cert-manager issue one                                    | `ssl.createIssuer: true` + `ssl.generateCerts: true` | A chart-created Secret (Let's Encrypt via cert-manager)               |
| TLS terminated in front of the cluster (ALB, NLB, Cloudflare) | `ssl.externalTermination: true`                      | The load balancer. Configure the certificate there, not in the chart. |

### Use your own certificate on Kubernetes

1. Create a TLS Secret in the release namespace from the full chain certificate and key:

   ```bash
   kubectl create secret tls plane-tls \
     --cert=fullchain.pem --key=privkey.pem -n plane-ns
   ```

2. Reference it in your `values.yaml` and make sure the other modes are off:

   ```yaml
   license:
     licenseDomain: plane.yourcompany.com
   ingress:
     enabled: true
   ssl:
     tls_secret_name: plane-tls
     createIssuer: false
     generateCerts: false
     externalTermination: false
   ```

3. Apply the change:

   ```bash
   helm upgrade --install plane-app makeplane/plane-enterprise \
     --namespace plane-ns -f values.yaml --wait
   ```

The chart then renders a `tls` block on the Ingress (nginx) or `tls.secretName` on the Traefik `IngressRoute`, and switches every URL Plane uses for itself to `https://`. If you set `ingress.minioHost` or `ingress.rabbitmqHost`, those hosts are added to the TLS block too, so the certificate must cover them as Subject Alternative Names. On OpenShift, Routes use the router's wildcard certificate by default; set `ingress.openshift.externalCertificate` to your Secret name to serve your own (OpenShift 4.16 or later).

**Rotate the certificate** by updating the Secret. Ingress controllers reload certificates on Secret changes, so no `helm upgrade` is needed:

```bash
kubectl create secret tls plane-tls --cert=new-fullchain.pem --key=new-privkey.pem \
  -n plane-ns --dry-run=client -o yaml | kubectl apply -f -
```

**Troubleshooting**

| Symptom                                                    | Cause and fix                                                                                                                          |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Browser gets the controller's default certificate          | The Secret is missing, in another namespace, or not type `kubernetes.io/tls` with `tls.crt` and `tls.key`. Check `kubectl get secret`. |
| Incomplete chain                                           | `tls.crt` must contain the full chain.                                                                                                 |
| Certificate warning on the MinIO or RabbitMQ console hosts | Those hosts are in the TLS block. Add them as SANs or unset `ingress.minioHost` / `ingress.rabbitmqHost`.                              |
| App links and OAuth redirects still use `http://`          | The URL scheme is derived from `ssl.tls_secret_name`. Confirm it is set with `helm get values plane-app -n plane-ns`.                  |

Outbound trust for an S3-compatible store signed by a private CA is configured separately with `airgapped.s3Secrets`. See [CA certificate configuration](/self-hosting/methods/kubernetes#ca-certificate-configuration-for-airgapped-deployments-only).
