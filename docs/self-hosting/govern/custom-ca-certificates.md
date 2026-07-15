---
title: Custom CA certificates • Commercial Edition
description: Make self-hosted Plane trust S3-compatible storage or other endpoints that present certificates signed by a private or internal CA, on Docker Compose and Kubernetes.
keywords: plane custom ca, private ca, self-signed certificate, internal certificate authority, s3 endpoint certificate, minio tls, custom ca kubernetes, custom ca docker compose, node_extra_ca_certs, aws_ca_bundle
---

# Custom CA certificates • Commercial Edition

If your S3-compatible storage endpoint (`AWS_S3_ENDPOINT_URL`) — or any other upstream service Plane talks to — presents a TLS certificate signed by a private or internal Certificate Authority, Plane services fail to connect with errors like `SSLError: certificate verify failed` or `unable to get local issuer certificate`. This is common with internal MinIO deployments, corporate PKI, and airgapped environments.

This guide shows how to make Plane trust your CA on both Docker Compose and Kubernetes deployments.

::: info
This page covers making Plane **trust upstream endpoints**. To serve Plane itself over HTTPS, see [SSL](/self-hosting/govern/configure-ssl).
:::

## How it works

In both deployment methods, Plane installs your CA certificate(s) alongside the standard public roots:

- **Python services** (api, workers, Plane AI) are pointed at a bundle containing the system roots plus your custom CAs via `SSL_CERT_FILE`, `REQUESTS_CA_BUNDLE`, `CURL_CA_BUNDLE`, and `AWS_CA_BUNDLE`. The boto module used for S3 doesn't read the OS trust store on its own, which is why `AWS_CA_BUNDLE` is set explicitly.
- **Node.js services** (live, silo) receive your custom CAs via `NODE_EXTRA_CA_CERTS`, which is additive to Node's built-in roots.

::: warning
The public roots are always retained in the bundle. Replacing them entirely would break licensing calls to `prime.plane.so` and any other public HTTPS endpoints.
:::

## Docker Compose

::: info
Available in Plane Commercial Edition releases after v1.14.0 that include the `ca-init` service in `docker-compose.yml`.
:::

1. Save your PEM-encoded CA certificate(s) as `.crt` files in the `certs` folder inside your install directory. With the default install directory this is:

   ```bash
   /opt/plane/certs/my-internal-ca.crt
   ```

   Multiple `.crt` files are supported — for example one for your S3 endpoint and one for a separate internal service.

2. Restart Plane:

   ```bash
   prime-cli restart
   ```

   Or with plain Docker Compose:

   ```bash
   docker compose --env-file plane.env up -d
   ```

On startup, a one-shot `ca-init` service builds the CA bundles into a shared Docker volume before the app services start. No image changes or manual container edits are needed.

::: warning Upstream trust only
The CA bundles make Plane's backend services trust **upstream** endpoints — an external S3-compatible store, SMTP server, or webhook target. They don't enable TLS on the bundled `plane-minio` service: the built-in proxy always talks plain HTTP to it, so installing a server certificate on the bundled MinIO is not supported.
:::

::: info Serving Plane over HTTPS with the bundled MinIO
If your Plane domain is served over HTTPS and you use the bundled MinIO, also set `MINIO_ENDPOINT_SSL=1` in `plane.env`. Behind the reverse proxy the API sees plain HTTP requests, so without this flag browser-facing presigned storage URLs are generated with `http://` and get blocked as mixed content on an HTTPS page. This flag only changes the URL scheme — it is independent of the CA bundles above.
:::

### Verify

Check the init container logs:

```bash
docker compose logs ca-init
```

You should see `Installing custom CA certificates...` followed by `CA bundles prepared successfully`. If the `certs` folder is empty, the log says `No custom CA certificates found` and the bundles contain the system roots only.

To confirm the API trusts your endpoint:

```bash
docker compose exec api python -c "import os, requests; print(requests.get(os.environ['AWS_S3_ENDPOINT_URL'], timeout=10).status_code)"
```

Any status code (including `403`) means the TLS handshake succeeded; a certificate error means the CA wasn't picked up.

## Kubernetes

::: info
Available in the `plane-enterprise` Helm chart **v2.7.0 and later**. Custom CA support is independent of `airgapped.enabled` — set it in any deployment.
:::

1. Create a Kubernetes Secret from your PEM-encoded CA certificate in the namespace where Plane is installed:

   ```bash
   kubectl -n plane create secret generic plane-s3-ca \
     --from-file=s3-custom-ca.crt=/path/to/ca.crt
   ```

2. Reference the Secret in your Helm values under the top-level `customCA` section:

   ```yaml
   customCA:
     s3Secrets:
       - name: plane-s3-ca
         key: s3-custom-ca.crt
   ```

   Multiple certificates are supported — add one list item per Secret:

   ```yaml
   customCA:
     s3Secrets:
       - name: plane-s3-ca
         key: s3-custom-ca.crt
       - name: plane-internal-ca
         key: internal-ca.crt
   ```

3. Apply the change:

   ```bash
   helm upgrade plane-app makeplane/plane-enterprise -n plane -f values.yaml
   ```

The chart mounts the certificate(s) into the relevant pods (api, workers, live, silo, and Plane AI), runs `update-ca-certificates`, and points the runtime at the resulting bundle.

### Single-secret form

If you only have one CA certificate, you can use the flat form instead of the list:

```yaml
customCA:
  s3SecretName: plane-s3-ca
  s3SecretKey: s3-custom-ca.crt
```

This is used only when `customCA.s3Secrets` is empty. Prefer `customCA.s3Secrets`.

### Upgrading from `airgapped.s3*` settings

Older chart versions configured custom CAs under the `airgapped` section and required `airgapped.enabled=true`. Those keys — `airgapped.s3Secrets`, `airgapped.s3SecretName`, and `airgapped.s3SecretKey` — still work as a deprecated fallback, so **no change is required when upgrading**.

To migrate, move the same values to the `customCA` section:

```yaml
# Before
airgapped:
  s3Secrets:
    - name: plane-s3-ca
      key: s3-custom-ca.crt

# After
customCA:
  s3Secrets:
    - name: plane-s3-ca
      key: s3-custom-ca.crt
```

Resolution precedence is: `customCA.s3Secrets` → `customCA.s3SecretName`/`s3SecretKey` → `airgapped.s3Secrets` → `airgapped.s3SecretName`/`s3SecretKey`.

## Troubleshoot

- **Certificates must be PEM-encoded.** If your CA is in DER format, convert it first:

  ```bash
  openssl x509 -inform der -in ca.der -out ca.crt
  ```

- **Include the full chain.** If your server certificate is issued by an intermediate CA, the file should contain the root CA (and the intermediate, if your endpoint doesn't serve it).

- **Still failing after adding certificates?** On Docker Compose, confirm the files end in `.crt` and live in the `certs` folder of your install directory, then check `docker compose logs ca-init`. On Kubernetes, confirm the Secret exists in the Plane namespace and the `key` matches the file key inside the Secret.
