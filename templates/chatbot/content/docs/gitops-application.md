# ai-lab-template-gitops

# Gitops Repo Patterns

This repository contains a http gitops repository format component for use as the ai-lab gitops template

### http 
- contains a deployment with a model service image `${{ values.modelServiceContainer }}` listening on port `${{ values.modelServicePort }}`, and an app interface image `${{ values.appContainer }}` listening on port `${{ values.appPort }}`, service and route for `${{ values.appPort }}`
- this matches the current RHTAP and ai-lab software templates default deployment