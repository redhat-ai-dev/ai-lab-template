# **AI Software Template GitOps**

This repository contains the necessary content required for managing GitOps. It was created as part of an AI Software Template execution. The associated source component is available for reference in the **Overview** tab as described in the following image.

![Overview Tab](./images/overview-dependency.png)

# **Deployed Resources**

{%- if values.existingModelServer %}
During the template setup a custom model server was entered. Therefore, no model or model server was deployed by this application.

{%- else %}

A deployment with the following characteristics was made based on input from the AI Software Template.

## **Model & Model Server**

A [${{ values.modelServerName }}]({%- if values.vllmSelected %} ${{ values.modelServiceSrcVLLM }} {%- else %} ${{ values.modelServiceSrcOther }} {%- endif %}) model server was deployed to serve the [${{ values.modelName }}](${{ values.modelSrc }}) model.

!!! info

    This model server is available on port ${{ values.modelServicePort }}!

{%- endif %}

{%- if values.supportApp %}

# **Application**

The AI Software Template that was executed comes with a sample application. This application will be built from ${{ values.srcRepoURL }}, stored in [${{ values.imageRegistry }}/${{ values.imageOrg }}/${{ values.imageName }}](https://${{ values.imageRegistry }}/${{ values.imageOrg }}/${{ values.imageName }}) and deployed through ArgoCD. 

This sample application is accessible through port ${{ values.appPort }}.

{%- endif %}