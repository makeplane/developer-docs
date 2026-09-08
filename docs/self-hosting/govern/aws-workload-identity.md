---
title: Use IRSA or EKS Pod Identity for S3 storage
description: Configure Plane on Amazon EKS to reach its S3 bucket with an IAM role instead of static access keys, using IRSA or EKS Pod Identity.
keywords: plane irsa, eks pod identity, iam roles for service accounts, plane s3 iam role, keyless s3, plane eks, workload identity, self-hosting
---

# Use IRSA or EKS Pod Identity for S3 storage <Badge type="info" text="Community Edition" />

When you run Plane on Amazon EKS with an external S3 bucket, you don't have to store an access key and
secret in your cluster. Plane can assume an IAM role instead, using either of the two mechanisms AWS
provides:

- **IRSA** (IAM Roles for Service Accounts) — the role is bound to a Kubernetes ServiceAccount through
  the cluster's OIDC provider, and requested by an annotation on that ServiceAccount.
- **EKS Pod Identity** — the role is bound to a ServiceAccount through an EKS API object called a _pod
  identity association_. No annotation is involved.

Either way there is no long-lived credential to rotate, leak, or commit, and access is scoped by IAM
policy rather than by whoever holds the key.

::: warning Edition and chart support
This is supported by the **`plane-ce` chart, version 1.8.0 or later** (Community Edition).

The `plane-enterprise` chart (Commercial Edition) does **not** support it yet: it always writes
`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` into the storage secret, and an empty value there
defeats the credential lookup described below. On Commercial Edition, keep using static keys — see
[External services](/self-hosting/govern/database-and-storage) — or
[External secrets](/self-hosting/govern/external-secrets) to keep them out of `values.yaml`.
:::

Check your chart version before you start:

```bash
helm search repo plane/plane-ce --versions | head -5
```

## How Plane picks up the role

Plane's API builds its S3 client without passing credentials of its own, so the AWS SDK walks its
**default credential chain**. On EKS that chain finds whatever the pod was given:

| Mechanism        | What lands in the pod                                                                 |
| ---------------- | ------------------------------------------------------------------------------------- |
| IRSA             | A projected web-identity token, plus `AWS_ROLE_ARN` and `AWS_WEB_IDENTITY_TOKEN_FILE` |
| EKS Pod Identity | `AWS_CONTAINER_CREDENTIALS_FULL_URI` pointing at the node's Pod Identity Agent        |

Both resolve to short-lived credentials that the SDK refreshes on its own.

::: danger Leave the access key values empty
The chain is only consulted when `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are **absent from the
environment entirely**. An _empty_ value is still a value: the SDK treats it as an explicit credential,
signs every request with an empty access key, and never falls back to the role. The bucket then fails
every call while looking correctly configured.

The chart handles this for you — it omits both variables when `env.aws_access_key` and
`env.aws_secret_access_key` are empty. Just don't set them to `""` expecting them to be ignored, and
don't set them alongside a role: **a static key always wins over the pod's identity.**
:::

## Choose a mechanism

|                               | **EKS Pod Identity**                                      | **IRSA**                               |
| ----------------------------- | --------------------------------------------------------- | -------------------------------------- |
| Cluster prerequisite          | Pod Identity Agent add-on                                 | IAM OIDC provider for the cluster      |
| How the role is bound         | An EKS association (cluster + namespace + ServiceAccount) | An annotation on the ServiceAccount    |
| Role trust policy             | Same policy reusable for every cluster                    | References one cluster's OIDC issuer   |
| Reusable across clusters      | Yes                                                       | No — one trust entry per cluster       |
| Requires EKS                  | Yes                                                       | No — works on any OIDC-capable cluster |
| Visible in the chart's output | No, it is out of band                                     | Yes, as an annotation                  |

Prefer **Pod Identity** on new EKS clusters: the trust policy is simpler and portable. Use **IRSA** if
you are on an older cluster, already standardized on it, or running Kubernetes somewhere other than EKS.

## Step 1 — Create the IAM policy

Both mechanisms need the same permissions on the bucket. Plane generates presigned URLs for browser
uploads and downloads, and copies, inspects, and deletes objects as assets change.

Create a policy — for example `plane-s3-access` — replacing `<BUCKET-NAME>`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PlaneBucketLevel",
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetBucketLocation"],
      "Resource": "arn:aws:s3:::<BUCKET-NAME>"
    },
    {
      "Sid": "PlaneObjectLevel",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::<BUCKET-NAME>/*"
    }
  ]
}
```

::: info
If you plan to run the `update_bucket` command to
[switch to private buckets](/self-hosting/govern/private-bucket), add `s3:PutBucketPolicy` and
`s3:GetBucketPolicy` on the bucket ARN. You can remove them again once the migration is done.
:::

## Step 2 — Create the role and bind it

Pick the tab that matches the mechanism you chose. In both cases the ServiceAccount name is the one the
chart uses — by default `<release-name>-srv-account`, so `plane-app-srv-account` for a release named
`plane-app`.

::: code-group

```bash [EKS Pod Identity]
# 1. Install the Pod Identity Agent add-on (once per cluster).
aws eks create-addon \
  --cluster-name <CLUSTER-NAME> \
  --addon-name eks-pod-identity-agent

# 2. Create the role with the Pod Identity trust policy (see below), then attach the policy.
aws iam create-role \
  --role-name plane-s3-role \
  --assume-role-policy-document file://pod-identity-trust.json

aws iam attach-role-policy \
  --role-name plane-s3-role \
  --policy-arn arn:aws:iam::<ACCOUNT-ID>:policy/plane-s3-access

# 3. Associate the role with Plane's ServiceAccount.
aws eks create-pod-identity-association \
  --cluster-name <CLUSTER-NAME> \
  --namespace plane \
  --service-account plane-app-srv-account \
  --role-arn arn:aws:iam::<ACCOUNT-ID>:role/plane-s3-role
```

```bash [IRSA]
# 1. Make sure the cluster has an IAM OIDC provider (once per cluster).
eksctl utils associate-iam-oidc-provider \
  --cluster <CLUSTER-NAME> \
  --approve

# 2. Create the role with the IRSA trust policy (see below), then attach the policy.
aws iam create-role \
  --role-name plane-s3-role \
  --assume-role-policy-document file://irsa-trust.json

aws iam attach-role-policy \
  --role-name plane-s3-role \
  --policy-arn arn:aws:iam::<ACCOUNT-ID>:policy/plane-s3-access
```

:::

### Trust policy

::: code-group

```json [pod-identity-trust.json]
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "pods.eks.amazonaws.com" },
      "Action": ["sts:AssumeRole", "sts:TagSession"]
    }
  ]
}
```

```json [irsa-trust.json]
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT-ID>:oidc-provider/oidc.eks.<REGION>.amazonaws.com/id/<OIDC-ID>"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "oidc.eks.<REGION>.amazonaws.com/id/<OIDC-ID>:aud": "sts.amazonaws.com",
          "oidc.eks.<REGION>.amazonaws.com/id/<OIDC-ID>:sub": "system:serviceaccount:plane:plane-app-srv-account"
        }
      }
    }
  ]
}
```

:::

::: warning
The Pod Identity trust policy needs **both** `sts:AssumeRole` and `sts:TagSession` — EKS tags the
session with the cluster and ServiceAccount, and the association fails to deliver credentials without it.

For IRSA, the `sub` condition must match the namespace and ServiceAccount exactly. Get your cluster's
`<OIDC-ID>` with:

```bash
aws eks describe-cluster --name <CLUSTER-NAME> \
  --query "cluster.identity.oidc.issuer" --output text
```

:::

::: tip
`eksctl` can do the role, policy attachment, and binding in one step for either mechanism:

```bash
eksctl create podidentityassociation \
  --cluster <CLUSTER-NAME> \
  --namespace plane \
  --service-account-name plane-app-srv-account \
  --permission-policy-arns arn:aws:iam::<ACCOUNT-ID>:policy/plane-s3-access
```

:::

## Step 3 — Configure the chart

Point Plane at the external bucket and **leave the access key and secret unset**.

::: code-group

```yaml [values.yaml — Pod Identity]
minio:
  local_setup: false

serviceAccount:
  create: true
  # Must match --service-account in the association. Defaults to <release>-srv-account.
  name: ""
  # Pod Identity binds by name, so no annotation is needed.
  annotations: {}
  # Advisory: turns on install notes that catch a static key shadowing the role.
  cloudIdentity: true

env:
  docstore_bucket: <BUCKET-NAME>
  aws_region: <REGION>
  # Leave all four empty so the chart omits them and the SDK uses the pod's role.
  aws_access_key: ""
  aws_secret_access_key: ""
  aws_s3_endpoint_url: ""
```

```yaml [values.yaml — IRSA]
minio:
  local_setup: false

serviceAccount:
  create: true
  # Must match the `sub` condition in the trust policy. Defaults to <release>-srv-account.
  name: ""
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::<ACCOUNT-ID>:role/plane-s3-role
  cloudIdentity: true

env:
  docstore_bucket: <BUCKET-NAME>
  aws_region: <REGION>
  # Leave all four empty so the chart omits them and the SDK uses the pod's role.
  aws_access_key: ""
  aws_secret_access_key: ""
  aws_s3_endpoint_url: ""
```

:::

Then upgrade:

```bash
helm upgrade --install plane-app plane/plane-ce \
    --create-namespace \
    --namespace plane \
    -f values.yaml \
    --timeout 10m \
    --wait \
    --wait-for-jobs
```

::: warning Set `env.aws_region`
Leave `aws_s3_endpoint_url` empty for AWS S3 so the SDK derives the correct regional endpoint, but do
set `aws_region`. Without a region, requests are signed for the wrong scope and S3 rejects them.
:::

### Settings reference

| Setting                        | Default | Description                                                                                                                                                                                                 |
| ------------------------------ | :-----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `serviceAccount.create`        | `true`  | Set to `false` to run as a ServiceAccount you manage outside the chart — for example one created by `eksctl` or Terraform along with the role.                                                              |
| `serviceAccount.name`          |  `""`   | Name of the ServiceAccount every workload runs as. Defaults to `<release-name>-srv-account`. This is the name the association or trust policy must match.                                                   |
| `serviceAccount.annotations`   |  `{}`   | Annotations on the ServiceAccount. Where the IRSA `eks.amazonaws.com/role-arn` binding goes. Helm values only — this is a map, so it is not in the Rancher UI.                                              |
| `serviceAccount.podLabels`     |  `{}`   | Extra pod-template labels. Not needed for IRSA or Pod Identity; Azure Workload Identity requires one.                                                                                                       |
| `serviceAccount.cloudIdentity` | `false` | Advisory only, and changes nothing in the rendered output. Declares that this ServiceAccount is bound to an identity configured out of band, which enables warnings about a static credential shadowing it. |

::: danger One ServiceAccount for every workload
The chart runs **all** workloads under this single ServiceAccount — Postgres, Redis, RabbitMQ, and
MinIO included, not just the API and workers. A role attached here is reachable from all of them.

If least privilege matters, create your own ServiceAccount for the role, set
`serviceAccount.create: false`, and point `serviceAccount.name` at it.
:::

## Step 4 — Verify

1. Confirm the binding reached the ServiceAccount and the pods.

   ::: code-group

   ```bash [Pod Identity]
   aws eks list-pod-identity-associations \
     --cluster-name <CLUSTER-NAME> \
     --namespace plane

   # The agent injects this into the pod:
   kubectl exec -n plane deploy/plane-app-api -- \
     printenv AWS_CONTAINER_CREDENTIALS_FULL_URI
   ```

   ```bash [IRSA]
   kubectl get sa plane-app-srv-account -n plane \
     -o jsonpath='{.metadata.annotations.eks\.amazonaws\.com/role-arn}'

   # The webhook injects these into the pod:
   kubectl exec -n plane deploy/plane-app-api -- \
     printenv AWS_ROLE_ARN AWS_WEB_IDENTITY_TOKEN_FILE
   ```

   :::

   ::: info
   The IRSA environment variables are injected by a mutating webhook **when the pod is created**.
   Annotating the ServiceAccount on an already-running deployment changes nothing until the pods
   restart, so roll them: `kubectl rollout restart deploy -n plane`.
   :::

2. Confirm no static key is shadowing the role. Both commands should return nothing:

   ```bash
   kubectl exec -n plane deploy/plane-app-api -- printenv AWS_ACCESS_KEY_ID
   kubectl exec -n plane deploy/plane-app-api -- printenv AWS_SECRET_ACCESS_KEY
   ```

3. Confirm the role is actually assumed and the bucket is reachable:

   ```bash
   kubectl exec -n plane deploy/plane-app-api -- \
     python -c "import boto3; print(boto3.client('sts').get_caller_identity()['Arn'])"
   ```

   The output should name `plane-s3-role`. If it names a user or a different role, the pod is picking up
   credentials from somewhere else — most often the node's instance profile.

4. Upload an attachment to a work item in the UI, then confirm the object exists:

   ```bash
   aws s3 ls s3://<BUCKET-NAME>/ --recursive | tail
   ```

## CORS and private buckets

A role changes only _how Plane authenticates_. It doesn't change how the browser reaches S3: uploads and
downloads still use presigned URLs, so the bucket still needs a CORS policy. See
[Switch from public to private buckets](/self-hosting/govern/private-bucket) for the policy and for
migrating existing objects to private storage.

## Troubleshoot

| Symptom                                                                                    | Cause and fix                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uploads fail immediately; logs show `InvalidAccessKeyId` or `AuthorizationHeaderMalformed` | An empty `AWS_ACCESS_KEY_ID` is being used as a real credential. Clear `env.aws_access_key` and `env.aws_secret_access_key`, and check that no `external_secrets.storage.secretName` is supplying them. |
| `NoCredentialsError` / `Unable to locate credentials`                                      | Nothing was injected. For IRSA the pods predate the annotation — restart them. For Pod Identity the agent add-on is missing, or the association's namespace or ServiceAccount name doesn't match.       |
| `AccessDenied` on `sts:AssumeRoleWithWebIdentity`                                          | The IRSA trust policy's `sub` doesn't match. It must be exactly `system:serviceaccount:<namespace>:<serviceaccount>`, and the OIDC issuer must be this cluster's.                                       |
| Pod Identity association created, but no credentials arrive                                | The trust policy is missing `sts:TagSession`, or the Pod Identity Agent isn't running: `kubectl get pods -n kube-system -l app.kubernetes.io/name=eks-pod-identity-agent`.                              |
| `get_caller_identity` returns the node's role                                              | The role wasn't bound, so the SDK fell through to the node instance profile. Re-check the association or the annotation, then restart the pods.                                                         |
| Presigned URLs expire earlier than expected                                                | A presigned URL can't outlive the temporary credentials that signed it. Keep `SIGNED_URL_EXPIRATION` below the role's maximum session duration, or raise that duration on the role.                     |
| `IllegalLocationConstraintException` or signature errors                                   | `env.aws_region` is unset or doesn't match the bucket's region.                                                                                                                                         |
