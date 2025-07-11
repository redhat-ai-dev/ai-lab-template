# Template Requirements

This document outlines the plugins and configurations required to use the AI Lab templates effectively in your Red Hat Developer Hub (RHDH) environment.

## Required Plugins

The following plugins need to be configured in your RHDH dynamic plugins configuration:

### ArgoCD Integration
- **Purpose**: Provides GitOps deployment capabilities and visualization
- **Plugins**:
  - `backstage-community-plugin-redhat-argocd` (frontend)
  - `roadiehq-backstage-plugin-argo-cd-backend-dynamic` (backend)
  - `roadiehq-scaffolder-backend-argocd-dynamic` (scaffolder actions)

### Topology Visualization
- **Purpose**: Provides visual representation of application topology
- **Plugins**:
  - `backstage-community-plugin-topology`

### GitHub Integration
- **Purpose**: Enables GitHub repository management and scaffolding
- **Plugins**:
  - `backstage-plugin-catalog-backend-module-github-dynamic` (catalog discovery)
  - `backstage-plugin-catalog-backend-module-github-org-dynamic` (organization data)
  - `backstage-plugin-scaffolder-backend-module-github-dynamic` (scaffolder actions)

### GitLab Integration
- **Purpose**: Enables GitLab repository management and scaffolding
- **Plugins**:
  - `backstage-plugin-catalog-backend-module-gitlab-dynamic` (catalog discovery)
  - `backstage-plugin-catalog-backend-module-gitlab-org-dynamic` (organization data)
  - `backstage-plugin-scaffolder-backend-module-gitlab-dynamic` (scaffolder actions)

### Tekton Integration
- **Purpose**: Provides CI/CD pipeline visualization and management
- **Plugins**:
  - `backstage-community-plugin-tekton`

### Kubernetes Integration
- **Purpose**: Enables Kubernetes cluster integration and resource management
- **Plugins**:
  - `backstage-plugin-kubernetes` (frontend)
  - `backstage-plugin-kubernetes-backend-dynamic` (backend)

## GitHub App Permissions

When using GitHub integration, you'll need to set up a GitHub App with a few permissions.

For detailed GitHub App setup instructions, please refer to the [Backstage GitHub Apps documentation](https://backstage.io/docs/integrations/github/github-apps/).

## GitLab App Setup

When using GitLab integration, you'll need to create a GitLab App for your GitLab Group:

### Procedure
1. Create a GitLab App for your GitLab Group
2. See [create a group owned application](https://docs.gitlab.com/integration/oauth_provider/#create-a-group-owned-application)
3. The Callback URL can be any value as a placeholder for now
4. Set the following token scopes:
   - `api`
   - `read_user`
   - `read_repository`
   - `write_repository`
   - `openid`
   - `profile`
   - `email`
5. Keep note of your GitLab hostname (if Self-hosted)

**Note**: Store your Application ID and Secret somewhere safe.
