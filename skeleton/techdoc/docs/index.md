# AI Software Template

# Background

You deployed this application named **${{ values.name }}** from an AI Software Template! This template created a new source code repository as well as a new GitOps deployment repository for you. You are able to find more information related to these repository locations in [Repository Information](#repository-information).

# Usage

The template you used contains the deployment of a sample application. To access this sample application, complete the following instructions.

You can view the Topology of deployed resources by navigating to the **Topology** tab in your RHDH ribbon:

![Topology Ribbon](./images/topology-ribbon.png)

From that view, to navigate straight to your sample application, you can click the arrow on the resource of the application.

![Topology View Application Link](./images/topology-app-link.png)

# Model & Model Server Information

{%- if values.customModelAndModelServerSelected %}
You have chosen to provide your own model server. Due to this documentation potentially going to a public repository, the endpoint URL has been omitted. During the template setup, you provided the following model name to be accessible through the endpoint: 

- **${{ values.customModelName }}**
{%- else %}
The following model was deployed by the template for your use: **[${{ values.modelName }}](${{ values.modelSrc }})**.

This model is accessible through a model service. You chose **[${{ values.modelServerName }}]({%- if values.modelServerName == 'vLLM' %} ${{ values.modelServiceSrcVLLM }} {%- else %} ${{ values.modelServiceSrcOther }} {%- endif %})** as your service.
{%- endif %}

# Repository Information

The source code for your chosen application can be found in [${{ values.srcRepoURL }}](${{ values.srcRepoURL }}).

The GitOps repository, which contains the Kubernetes manifests for the application can be found in 
[${{ values.repoURL }}](${{ values.repoURL }}). 

# Deployment Information

You can find deployed resources from this template in the **${{ values.namespace }}** namespace.
