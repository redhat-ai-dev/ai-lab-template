## Bring your own cluster (remote deployments)

This guide explains how to deploy application workloads to a remote OpenShift cluster while keeping Tekton Pipelines and webhooks on the host (RHDH) cluster. 

## Terminology

- **Host cluster**: The cluster running RHDH, Argo CD, and Tekton Pipelines
- **Remote cluster**: The target cluster where application workloads will be deployed
- **Destination cluster**: In Argo CD terminology, this refers to the cluster where an Application will deploy its resources. This can be either the host cluster or a remote cluster.

The GitOps application is split into two Argo CD Applications (for more information on how Argo CD Applications work, see the [Argo CD Application documentation](https://argo-cd.readthedocs.io/en/stable/core_concepts/#application)):

- **app**: Deploys the application manifests to the destination cluster (host or remote)
- **app-tekton**: Manages Tekton resources on the host cluster so all PipelineRuns execute there

### High-level behavior
- **Tekton webhooks and PipelineRuns stay on the host cluster** (the cluster running RHDH, Argo CD, and Tekton).
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
- CLI access: `oc`/`kubectl` authenticated to both clusters, `ArgoCD` CLI
- Versions: RHDH 1.6+ with OCP 4.17
- If deploying RHOAI-based apps on the remote cluster, install:
  - Node Feature Discovery (with a `NodeFeatureDiscovery` CR)
  - NVIDIA GPU Operator (with a `ClusterPolicy` CR)
  - OpenShift AI Operator (with a `DataScienceCluster` CR)

---

## Step 1: Expose the remote cluster to RHDH UI via dynamic plugins (Topology/Kubernetes)

Before installing/configuring RHDH using the ai-rhdh-installer, add the remote cluster to the installer’s dynamic plugin configuration so the Topology and Kubernetes plugins can read it.

On the remote cluster, create a service account and bind permissions:

#### Create a service account token


Service account token to view:

- Kubernetes: Manually create a Secret for a Service Account — `https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#manually-create-a-secret-for-a-service-account`
- Backstage: Kubernetes configuration — `https://backstage.io/docs/next/features/kubernetes/configuration/`


```bash
oc create serviceaccount rhdh-sa -n default

# Grant read-only access cluster-wide
oc create clusterrolebinding rhdh-sa-view \
  --clusterrole=view \
  --serviceaccount=default:rhdh-sa

# Create a Secret that yields a view token
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

Add a cluster entry to the installer’s plugin config. Example shapes for cluster locator configuration:

Minimal entry (used by some dynamic plugins):

```yaml
- authProvider: serviceAccount
  name: <remote-cluster-name>
  serviceAccountToken: <paste-token-here>
  skipTLSVerify: true
  url: https://api.<your-remote-cluster>.
```

Full Backstage Kubernetes backend plugin config using `clusterLocatorMethods`:

```yaml
pluginConfig:
  kubernetes:
    serviceLocatorMethod:
      type: multiTenant
    clusterLocatorMethods:
      - type: config
        clusters:
          - url: https://kubernetes.default.svc
            name: <cluster-name>
            authProvider: serviceAccount
            serviceAccountToken: ${K8S_SA_TOKEN}
            skipTLSVerify: true
          # Your remote cluster info goes here
    customResources:
      - group: route.openshift.io
        apiVersion: v1
        plural: routes
      - group: tekton.dev
        apiVersion: v1
        plural: pipelineruns
      - group: tekton.dev
        apiVersion: v1
        plural: taskruns
```

Notes:
- For more options (e.g., `catalog`, `gke`, metrics, dashboards), see the Backstage docs: [Backstage Kubernetes configuration](https://backstage.io/docs/next/features/kubernetes/configuration/).
- Avoid storing tokens in catalog annotations; prefer the config locator method with `serviceAccountToken`.

Then proceed with the installer’s configure step to apply changes.

---

## Step 2: Register the remote cluster in Argo CD (host cluster)
Argo CD must know how to reach the remote cluster to deploy the application there. For comprehensive instructions on cluster registration, refer to the official documentation:
- [Argo CD Cluster Management](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#clusters)
- [External Cluster Credentials](https://argo-cd.readthedocs.io/en/stable/operator-manual/security/#external-cluster-credentials)

You can register the cluster either via the Argo CD CLI (recommended) or by creating a cluster Secret (manual).

### Register via Argo CD CLI

```bash
# 1) Inspect kubeconfig contexts on your workstation
kubectl config get-contexts

# 2) Use the remote cluster context and verify access
kubectl config use-context <remote-cluster-context-name>
kubectl get nodes

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

### Rotate the Argo CD bearer token for an external cluster

For detailed token rotation procedures, refer to the [Argo CD Security documentation](https://argo-cd.readthedocs.io/en/stable/operator-manual/security/#external-cluster-credentials).

Here's one common approach:

```bash
# Run against the external cluster's kubeconfig context
kubectl config use-context <remote-cluster-context-name>

# Delete the argocd-manager token secret so a new one is created
kubectl delete secret argocd-manager-token-XXXXXX -n kube-system

# Re-add the cluster to rotate credentials
argocd cluster add <remote-cluster-context-name>
```


## Step 4: Generate and import the template
- Regenerate templates in your fork if needed:

- Import the updated template into RHDH.
- In the template wizard, select Remote cluster deployment and provide the remote API URL that matches the Argo CD secret `server` value.
- Choose the target namespace (same name will be used on the host for Tekton PipelineRuns).

---

## Validation
- Topology/Kubernetes plugins show the remote cluster’s resources
- Argo CD has two apps:
  - `app` targets the remote cluster and syncs application workloads
  - `app-tekton` targets the host cluster and manages Tekton resources
- PipelineRuns execute on the host cluster; workloads appear on the remote namespace

---
