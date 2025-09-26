# Remote cluster configuration with ai-rhdh-installer

Use this guide if you manage RHDH via the `ai-rhdh-installer` repository and want to enable remote cluster deployments. If you are not using the installer, see `Bring your own cluster: documentation/app/template-remote-cluster.md`.

---

## Prerequisites
- Two OpenShift clusters:
  - Host cluster: runs RHDH, Argo CD, Tekton
  - Remote cluster: receives the application deployment
- CLI access: `oc`/`kubectl` authenticated to both clusters, `ArgoCD` CLI
- Versions: RHDH 1.8 with OCP 4.17
- If deploying RHOAI-based apps on the remote cluster, install:
  - Node Feature Discovery (with a `NodeFeatureDiscovery` CR)
  - NVIDIA GPU Operator (with a `ClusterPolicy` CR)
  - OpenShift AI Operator (with a `DataScienceCluster` CR)

---

## Step 1: Configure RHDH with ai-rhdh-installer on your Host Cluster

### Interactive setup

First, create a non-expiring service account token with view permissions on the **remote** cluster:

```bash
oc create serviceaccount rhdh-sa -n default

# Grant read-only access cluster-wide
oc create clusterrolebinding rhdh-sa-view \
  --clusterrole=view \
  --serviceaccount=default:rhdh-sa

# Create a Secret that yields a permanent token
cat <<'EOF' | oc apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: rhdh-sa-token
  namespace: default
  annotations:
    kubernetes.io/service-account.name: rhdh-sa
type: kubernetes.io/service-account-token
EOF

# Retrieve and print the token
oc get secret rhdh-sa-token -n default -o jsonpath='{.data.token}' | base64 --decode
```

Run the installer and answer the prompts to enable remote cluster support:

```bash
bash configure.sh
```

When prompted:
- "Would you like to enable remote cluster setup? (y/n):" → enter `y`
- Provide the remote cluster API URL (e.g., `https://api.<remote-cluster>:443`)
- Provide a remote cluster name
- Paste a Service Account token that has read access (view/cluster-reader)
- Choose TLS verification preference (for labs you may skip TLS; in production provide a CA)

The installer updates dynamic plugins (Kubernetes/Topology, optionally Tekton) with the remote cluster. Then proceed to Argo CD cluster registration and namespace preparation.


## Step 2: Register the remote cluster in Argo CD on your Host Cluster

For detailed instructions on registering external clusters with Argo CD, refer to the official documentation:
- [Argo CD Cluster Management](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#clusters)
- [External Cluster Credentials](https://argo-cd.readthedocs.io/en/stable/operator-manual/security/#external-cluster-credentials)
- [Cluster Bootstrap](https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-bootstrapping/)

Below is one common approach using the Argo CD CLI:

```bash
# 1) Inspect kubeconfig contexts on your workstation
oc config get-contexts

# 2) Use the remote cluster context and verify access
oc config use-context <remote-cluster-context-name>
oc get nodes

# 3) Ensure you're logged into the remote cluster with oc (OpenShift)
#    If not logged in, authenticate with a token (adjust flags as needed)
oc whoami || oc login https://api.<remote-cluster>:443

# 4) Log into Argo CD (host cluster)
#    Use --insecure if you don't have a valid TLS cert; add --sso if SSO is enabled
argocd login <argocd-url>

# 5) Register the remote cluster with Argo CD using its kubeconfig context
argocd cluster add <remote-cluster-context-name>

# 6) Verify Argo CD sees the cluster
argocd cluster list
```

#### To rotate the Argo CD bearer token for an external cluster

For detailed token rotation procedures, refer to the [Argo CD Security documentation](https://argo-cd.readthedocs.io/en/stable/operator-manual/security/#external-cluster-credentials).

Here's one common approach:

```bash
# Run against the external cluster's kubeconfig context
oc config use-context <remote-cluster-context-name>

# Delete the argocd-manager token secret so a new one is created
oc delete secret argocd-manager-token-XXXXXX -n kube-system

# Re-add the cluster to rotate credentials
argocd cluster add <remote-cluster-context-name>
```
Permanent, non-expiring service account token to view:

- Kubernetes: Manually create a Secret for a Service Account — `https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#manually-create-a-secret-for-a-service-account`
- Backstage: Kubernetes configuration — `https://backstage.io/docs/next/features/kubernetes/configuration/`

See: Argo CD — External cluster credentials: https://argo-cd.readthedocs.io/en/stable/operator-manual/security/#external-cluster-credentials


## Step 3: Use the Software Template
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
