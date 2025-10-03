## Bring your own cluster (remote deployments)

This guide explains how to deploy application workloads to a remote OpenShift cluster while keeping Tekton Pipelines and webhooks on the host (RHDH) cluster. 

### High-level behavior
- **Tekton webhooks and PipelineRuns stay on the host cluster** (the cluster running RHDH, Argo CD, and Tekton).
- When a remote cluster is selected, only the application runtime resources deploy to the remote cluster.

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
- ⚠️ Complete the instructions on [configuring the remote cluster](https://github.com/redhat-ai-dev/ai-lab-template/blob/main/docs/REMOTE_CLUSTER_CONFIGURATION.md)

---

## Steps for remote deployment

- In the template wizard, select Remote cluster deployment and provide the remote API URL.
- Provide your namespace on the remote cluster for deployment.

---

## Validation
- Topology/Kubernetes plugins show the remote cluster’s resources
- Argo CD has two apps:
  - `app` targets the remote cluster and syncs application workloads
  - `app-tekton` targets the host cluster and manages Tekton resources
- PipelineRuns execute on the host cluster; workloads appear on the remote namespace

---
