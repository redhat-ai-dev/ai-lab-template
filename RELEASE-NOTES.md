# Release Notes

## [0.9.0](https://github.com/redhat-ai-dev/ai-lab-template/commits/v0.9.0) (2024-10-29)

Initial release of AI Software Templates.

### New Features
* Creates chatbot and codegen software templates
* App of apps, use common gitops app template
* Adds source repository
* Adds the Tekton pipelines
* Adds TechDoc to templates
* Vllm support
* Splits model server and app into two pods
* Adds steps and dispatch for empty PR to trigger a build
* Uses bootstrap image
* Updates software templates to support deploying to RHOAI
* Updates GitOps templates for deploying to RHOAI
* Adds audio to text
* Store model server environment variables in ConfigMap
* Adds object detection
* Allows existing model servers to be passed into templates
* Creates TechDoc for running applications in RHOAI
* Updates how to access RHOAI instructions
* Updates text under Software Templates for Consistency
* Adds RAG Recipe Template
* Creates base env script
* Updates Vllm description
* Updates to custom Utils Image (`quay.io/redhat-ai-dev/appstudio-utils` replaced with `quay.io/redhat-ai-dev/utils`)
* Updates sample descriptions
* Adds Job for ImageStream create w/ Roles and RoleBinding
* Updates DSP init job for new image
* Surface the Model Names & provide more contexts on Models and Model Names
* Updates Pipeline Definition reference to use [rhdh-pipelines](https://github.com/redhat-ai-dev/rhdh-pipelines)
* Changes rhtap references to ai-rhdh
* Updates templates with bearer authentication support for BYO server cases
* Provides more runtime context in TechDocs

### Bug Fixes
* Updates logical and argo app names, update-deployment task relies on it
* Fixes host type default typo
* Adds shebang comment in the beginning to avoid POSIX/non-POSIX issue
* Fixes Images Not Rendering In TechDocs

### Performance Improvements
* Updates to single environment to save memory usage

### Other Changes
* Adds GitHub workflow for verifying dependencies
* Adds the PR Template
* Removes RHTAP References from TechDocs
* Removes unused value references
