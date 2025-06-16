# CONTRIBUTING

If you would like to contribute to the Software Templates on this repository, there are a few processes that you would need to follow. 

The Software Templates are found in the [../templates](../templates) directory and the reference reusable content are in the [../skeleton](../skeleton) directory.  The Software Templates are maintained by importing external resources. This allows the external resources to be standalone, developed independently, evolved and then imported.

This document addresses how you can contribute for 
- Pipelines
- GitOps
- AI Samples
- Software Templates

## Pipelines

To update and/or contribute to the Pipelines, head over to the [rhdh-pipelines](https://github.com/redhat-ai-dev/rhdh-pipelines) repository.

The [update-tekton-definition](../scripts/update-tekton-definition) script copies over the necessary resources from the rhdh-pipelines repository into the [skeleton](../skeleton/) directory.

At this moment, the Software Templates support Tekton. All the Tekton resources - PipelineRun, Pipeline and Task are located in the rhdh-piplines repository.


## GitOps

To update and/or contribute to the GitOps, head over to the [ai-lab-app](https://github.com/redhat-ai-dev/ai-lab-app) repository.

The [import-gitops-template](../scripts/import-gitops-template) script copies over the necessary resources from the ai-lab-app repository into the [skeleton](../skeleton/) directory.

At this moment, the Software Templates support ArgoCD. All the ArgoCD Applications and Kubernetes/OpenShift resources to run the sample application are located in the ai-lab-app repository.

## AI Samples

To update and/or contribute to the AI Samples, head over to the [ai-lab-samples](https://github.com/redhat-ai-dev/ai-lab-samples) repository.

The [import-ai-lab-samples](../scripts/import-ai-lab-samples) script copies over the necessary application files and resources into the the [templates](../templates/) directory. The script also copies over the necessary techdocs and the skeleton Software Template from the skeleton directory.

If you want to contribute to the techdocs associated with the Templates, check out the [techdoc](../skeleton/techdoc/) and [template-card-techdocs](../skeleton/template-card-techdocs/) directories.


## Software Templates

The base skeleton Software Template [template.yaml](../skeleton/template.yaml) is located in the skeleton directory. The skeleton template.yaml file is the main template file with gated logic for each Software Template. For example, the logic gated between `SED_LLM_LLAMA_SERVER_START` and `SED_LLM_LLAMA_SERVER_END` are only for a Llama model server Software Template. These gated conditions are applied in the [util](../scripts/util) script.

The ENV and properties for each Software Template are defined in the [envs](../scripts/envs/) directory. In this directory, each Software Template has their own file with the basic properties - name, description, model, model-server, etc. For instance, if you want to update a model being used in a Software Template, update these env files.

To generate Template updates based on your changes - Pipelines, GitOps, AI Samples, Software Template properties; run the [generate](../generate.sh) script: 

```
./generate.sh
```

This will generate all the Software Templates in the [templates](../templates/) directory based on your changes, which you can then commit to this repository.
