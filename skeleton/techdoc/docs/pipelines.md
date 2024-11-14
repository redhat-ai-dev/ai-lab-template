# docker-build-ai-rhdh

## Shared Git resolver model for shared pipeline and tasks
 
This pipeline is used to create Containerfile based SSCS (Software Supply Chain Security) builds. The pipeline run by this runner clones the source, builds an image with SBOM (Software Bill of Materials), attests, and pushes these to the users image registry.  

Tasks references come from this [repository](https://github.com/redhat-ai-dev/rhdh-pipelines) `pac/pipelines` and the tasks are defined in `pac/tasks`. The tasks are referenced by URL using the git resolver in tekton. 
 
When the pipelines in this repository are updated, all future runs in existing pipelines are shared.

A developer can override these tasks with a local copy and updated annotations. 

Example 

To override the git-clone task, you may simply copy the git reference into your .tekton directory and then reference it from the remote task annotation. 

`pipelinesascode.tekton.dev/task-0: ".tekton/git-clone.yaml"` 

## Templates 
These pipelines are in template format. The references to this repository in the PaC template is `{{values.rawUrl}}` which is updated to point to this repo or the fork of this repo.

The intent of the template is to fork this repository and update its use in the Developer Hub templates directory. 
