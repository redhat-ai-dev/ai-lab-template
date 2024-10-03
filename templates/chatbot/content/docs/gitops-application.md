# ai-lab-template-gitops

# Gitops Repo Patterns

This repository contains an HTTP Gitops repository format component for use as the AI-Lab Gitops template.

## HTTP

This contains a deployment with the following characteristics:

**Model service image** `$${{  values.modelServiceContainer  }}` **listening on port** `$${{  values.modelServicePort  }}`.

**App interface image** `$${{  values.appContainer  }}` **listening on port** `$${{  values.appPort  }}` for service and routing.

This matches the current AI-Lab software template default deployment.