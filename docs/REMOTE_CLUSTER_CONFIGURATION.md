# Remote cluster configuration with ai-rhdh-installer

Use this guide if you manage RHDH via the `ai-rhdh-installer` repository and want to enable remote cluster deployments. 

**For comprehensive remote cluster setup instructions, see the complete guide: [documentation/app/template-remote-cluster.md](../documentation/app/template-remote-cluster.md)**

This document covers only the ai-rhdh-installer specific configuration steps.

---

## Step 1: Configure RHDH with ai-rhdh-installer on your Host Cluster

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



From here, refer to Steps 2-4 from [template-remote-cluster.md](../documentation/app/template-remote-cluster.md) to complete the remote cluster setup and validation.

---