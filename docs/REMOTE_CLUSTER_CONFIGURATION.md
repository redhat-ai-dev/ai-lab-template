# Remote cluster configuration with ai-rhdh-installer

Use this guide if you manage RHDH via the `ai-rhdh-installer` repository and want to enable remote cluster deployments. If you are not using the installer, see `Bring your own cluster: template-remote-cluster.md`.

---

## Prerequisites
- Two OpenShift clusters:
  - Host cluster: runs RHDH, Argo CD, Tekton
  - Remote cluster: receives the application deployment
- CLI access: `oc`/`kubectl` for both clusters
- If deploying RHOAI apps to remote, install NFD, GPU Operator, and OpenShift AI with a `DataScienceCluster` on the remote cluster

---

## Step 1: Create a service account on the remote cluster
```bash
# Use remote cluster context
oc config use-context <remote-cluster-context>

# Service account for plugins/Argo to authenticate against remote
kubectl create serviceaccount backstage-sa -n default

# Grant read permissions (use cluster-reader if required by your policy)
kubectl create clusterrolebinding backstage-view-binding \
  --clusterrole=view \
  --serviceaccount=default:backstage-sa

# Obtain a token (OCP 4.11+)
kubectl create token backstage-sa -n default
```
Keep the token and API URL handy for the next steps.

---

## Configure RHDH with ai-rhdh-installer

### Interactive setup (recommended)

After completing Step 1, configure the remote cluster via the installer prompts:

```bash
bash configure.sh
```

When prompted:
- "Would you like to enable remote cluster setup? (y/n):" → enter `y`
- Provide the remote cluster API URL (e.g., `https://api.<remote-cluster>:443`)
- Provide a remote cluster name
- Paste the Service Account token
- Choose TLS verification preference (for labs you may skip TLS; in production provide a CA)

The script updates the dynamic plugins (Kubernetes/Topology) with the remote cluster (and optionally Tekton plugin). Then continue with Argo CD cluster registration, and prepares the remote namespace.

Note: If you used the interactive installer (`configure.sh`), you can skip Step 2 (manual plugin configuration) below.

### Step 2 (manual alternative): Configure dynamic plugins in ai-rhdh-installer

Add a cluster entry to the installer’s plugin config. Example shape for a plugin cluster entry:

```yaml
pluginConfig:
  kubernetes:
    clusterLocatorMethods:
      - type: config
        clusters:
          - url: https://api.<remote-cluster>:443
            name: <remote-cluster-name>
            authProvider: serviceAccount
            serviceAccountToken: <paste-remote-token>
            skipTLSVerify: true
```

If you surface Tekton resources across clusters in read-only mode, ensure the Tekton plugin cluster list in the installer also includes the remote cluster with the same token.

--- 

Argo CD needs cluster credentials to deploy workloads remotely. Create a cluster secret in the RHDH namespace (e.g., `ai-rhdh`) on the host cluster.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: remote-cluster
  namespace: ai-rhdh
  labels:
    argocd.argoproj.io/secret-type: cluster
type: Opaque
data:
  config: |
    {"bearerToken": "<remote-bearer-token>", "tlsClientConfig": {"insecure": true}}
  name: api-<remote-cluster>:443
  server: https://api.<remote-cluster>:443
```
Notes:
- `server` must match the remote API URL; `name` should be consistent with Argo CD expectations.
- Use a proper CA bundle instead of `insecure: true` for production.

---

## Step 3: Prepare the target namespace on the remote cluster
Ensure the deployment namespace exists and has required pull secrets and permissions. Options:
- Remote admin prepares the namespace and secrets
- Temporary workaround: install RHDH on the remote cluster and initialize the namespace once with any template

Namespace name must match on host (for Tekton) and remote.

---

## Step 4: Use the Software Template (Application Engineers)
- Import the desired template into RHDH
- Select Remote deployment in the wizard
- Enter the remote API URL exactly as in the Argo CD secret `server`
- Enter the namespace (same name will be used for host-side Tekton PipelineRuns)

---

## Validation
- Topology/Kubernetes plugins show the remote cluster’s resources
- Argo CD has two apps:
  - `app` targets the remote cluster and syncs application workloads
  - `app-tekton` targets the host cluster and manages Tekton resources
- PipelineRuns execute on the host cluster; workloads appear on the remote namespace

---

## Troubleshooting
- Remote resources not appearing: verify pluginConfig cluster entry and token
- Argo CD sync errors: check the cluster secret `server`/token and TLS settings
- Image pull errors: ensure pull secrets exist in the remote namespace

---

## Notes
- Same namespace name on host and remote is required in this iteration
- Multi-namespace remote deployments are out-of-scope and may be added later 