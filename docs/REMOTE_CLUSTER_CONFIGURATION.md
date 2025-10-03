# Remote cluster configuration with ai-rhdh-installer

Use this guide if you manage RHDH via the `ai-rhdh-installer` repository and want to enable remote cluster deployments. 

**For comprehensive remote cluster setup instructions, see the complete guide: [documentation/app/template-remote-cluster.md](../documentation/app/template-remote-cluster.md)**

This document covers only the ai-rhdh-installer specific configuration steps.

---

## Terminology

- **Host cluster**: The cluster running RHDH, Argo CD, and Tekton Pipelines
- **Remote cluster**: The target cluster where application workloads will be deployed
- **Destination cluster**: In Argo CD terminology, this refers to the cluster where an Application will deploy its resources. This can be either the host cluster or a remote cluster.

The GitOps application is split into two Argo CD Applications (for more information on how Argo CD Applications work, see the [Argo CD Application documentation](https://argo-cd.readthedocs.io/en/stable/core_concepts/#application)):

- **app**: Deploys the application manifests to the destination cluster (host or remote)
- **app-tekton**: Manages Tekton resources on the host cluster so all PipelineRuns execute there

---

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

## Step 1: Configure RHDH with ai-rhdh-installer (host cluster)

### Interactive setup

First, service account token with view permissions on the **remote** cluster (see [template-remote-cluster.md](../documentation/app/template-remote-cluster.md#create-a-service-account-token) for detailed instructions):

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

The installer updates dynamic plugins (Kubernetes/Topology, optionally Tekton) with the remote cluster.

---

## Step 2: Register the remote cluster in Argo CD (host cluster)
Argo CD must know how to reach the remote cluster to deploy the application there. For comprehensive instructions on cluster registration, refer to the official documentation:
- [Argo CD Cluster Management](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#clusters)
- [External Cluster Credentials](https://argo-cd.readthedocs.io/en/stable/operator-manual/security/#external-cluster-credentials)

You can register the cluster either via the Argo CD CLI (recommended) or create a Kubernetes Secret with the remote cluster information (manual), if you're having issues with Argo CD CLI. Refer to the Argo CD [docs](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#clusters)

### Register via Argo CD CLI

```bash
# 1) Log into Argo CD (host cluster)
#    Use --insecure if you don't have a valid TLS cert; add --sso if SSO is enabled, --skip-test-tls if times out
argocd login <argocd-url>

# 2) Register the remote cluster with Argo CD using its kubeconfig context
kubectl config get-contexts
argocd cluster add <remote-cluster-context-name>

# 3) Verify Argo CD sees the cluster
argocd cluster list
```

### Rotate the Argo CD bearer token for an external cluster (Optional)

For detailed token rotation procedures, refer to the [Argo CD Security documentation](https://argo-cd.readthedocs.io/en/stable/operator-manual/security/#external-cluster-credentials).

Here's one common approach:

```bash
# Run against the external cluster's kubeconfig context
kubectl config use-context <remote-cluster-context-name>

# Delete the argocd-manager token secret so a new one is created
kubectl delete secret <argocd-manager-token> -n kube-system

# Re-add the cluster to rotate credentials
argocd cluster add <remote-cluster-context-name>
```

---
