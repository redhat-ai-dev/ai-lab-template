## Bring your own cluster (remote deployments)

This guide explains how to deploy application workloads to a remote OpenShift cluster while keeping Tekton Pipelines and webhooks on the host (RHDH) cluster. The GitOps application is split into two Argo CD apps:

- app: Deploys the application manifests to the destination cluster (host or remote)
- app-tekton: Manages Tekton resources on the host cluster so all PipelineRuns execute there

### High-level behavior
- Tekton webhooks and PipelineRuns stay on the host cluster.
- When a remote cluster is selected, only the application runtime resources deploy to the remote cluster.
- The same namespace name is used on both clusters. For the initial iteration, choosing different namespaces across clusters is not supported.

### Who should use this

#### Platform Engineers
- Configure the remote cluster in the dynamic plugins (Topology and Kubernetes) so RHDH can read cluster resources.
- Register the remote cluster in Argo CD on the host cluster via a cluster secret.
- Ensure the remote namespace is prepared with required secrets/permissions or provide a bootstrap mechanism.

#### Application Engineers
- Use the Software Template wizard to select Remote cluster deployment.
- Provide the remote cluster API URL (must match the Argo CD cluster `server`).
- Provide the namespace to deploy into (same name will be used on host for Tekton PipelineRuns).

---

## Prerequisites
- Two OpenShift clusters:
  - Host cluster: runs RHDH, Argo CD, Tekton
  - Remote cluster: receives the application deployment
- CLI access: `oc`/`kubectl` authenticated to both clusters
- Versions: RHDH 1.3–1.4 typically with OCP 4.16; RHDH 1.2 with OCP 4.15
- If deploying RHOAI-based apps on the remote cluster, install:
  - Node Feature Discovery (with a `NodeFeatureDiscovery` CR)
  - NVIDIA GPU Operator (with a `ClusterPolicy` CR)
  - OpenShift AI Operator (with a `DataScienceCluster` CR)

---

## Step 1: Expose the remote cluster to RHDH UI via dynamic plugins (Topology/Kubernetes)
Before installing/configuring RHDH using the ai-rhdh-installer, add the remote cluster to the installer’s dynamic plugin configuration so the Topology and Kubernetes plugins can read it.

On the remote cluster, create a service account and bind permissions:

```bash
# Remote cluster context
oc config use-context <remote-cluster-context>

# Create a service account
kubectl create serviceaccount backstage-sa -n default

# Bind permissions (view is generally sufficient; if needed, use cluster-reader)
kubectl create clusterrolebinding backstage-view-binding \
  --clusterrole=view \
  --serviceaccount=default:backstage-sa

# Get a token for the SA (OCP 4.11+)
kubectl create token backstage-sa -n default
```

Add a cluster entry to the installer’s plugin config. Example shape for a plugin cluster entry:

```yaml
- authProvider: serviceAccount
  name: <remote-cluster-name>
  serviceAccountToken: <paste-token-here>
  skipTLSVerify: true
  url: https://api.<your-remote-cluster>.
```

Then proceed with the installer’s configure step to apply changes.

---

## Step 2: Register the remote cluster in Argo CD (host cluster)
Argo CD must know how to reach the remote cluster to deploy the application there. Create a cluster secret in the RHDH namespace (e.g., `ai-rhdh`) on the host cluster.

First, obtain a bearer token for the remote cluster. While pointing to the remote cluster context:

```bash
oc config use-context <remote-cluster-context>
# Option A: SA token created above
kubectl create token backstage-sa -n default

# Option B: Inspect kubeconfig (ensure you extract a valid token)
kubectl config view --minify --raw -o yaml | sed -n '/users:/,$p'
```

Create the Argo CD cluster secret on the host cluster (namespace where Argo CD in RHDH runs, e.g. `ai-rhdh`):

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
  # base64-encoded values are accepted by Argo CD, but inline config is also supported by some setups
  config: |
    {"bearerToken": "<remote-bearer-token>", "tlsClientConfig": {"insecure": true}}
  name: api-<your-remote-cluster>:443
  server: https://api.<your-remote-cluster>:443
```

Notes:
- `name` and `server` must match exactly what your Argo CD expects for the cluster identity.
- Use `insecure: true` for quick start; in production, prefer providing the CA bundle instead.

---

## Step 3: Prepare the target namespace on the remote cluster
Application deployment assumes the target namespace on the remote cluster is pre-initialized with the necessary resources (e.g., pull secrets, permissions). Options:

- Recommended: Remote cluster admin prepares the namespace and required secrets.
- Temporary workaround: Install RHDH on the remote cluster and initialize the same namespace by deploying any template once there. This primes the namespace so the remote deployment can pull images when GitOps updates occur.
- Manual: Create the required secrets/resources by hand according to your template needs.

For now, ensure the namespace name matches on both clusters.

---

## Step 4: Generate and import the template
- Regenerate templates in your fork if needed:

```bash
bash generate.sh
```

- Import the updated template into RHDH.
- In the template wizard, select Remote cluster deployment and provide the remote API URL that matches the Argo CD secret `server` value.
- Choose the target namespace (same name will be used on the host for Tekton PipelineRuns).

---

## Validation
- Topology view shows resources from both clusters.
- Argo CD:
  - `app` targets the remote cluster and syncs application workloads.
  - `app-tekton` targets the host cluster and manages Tekton resources.
- OpenShift Pipelines (host cluster): PipelineRuns are created and run on the host.
- Remote cluster: Deployments, Services, Routes (if any) appear in the selected namespace.

---

## Notes and limitations
- Same namespace name on host and remote is required for this iteration.
- Multiple remote namespaces per template are out of scope and may require future enhancements.
- This feature is evolving; comprehensive end-user documentation improvements are being tracked upstream.
