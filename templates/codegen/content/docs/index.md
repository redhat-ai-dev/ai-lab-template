# AI Software Template

This application, ${{ values.name }}, is created from an AI Software Template. These software templates create a new source code repository as well as a new GitOps deployment repository.

The chosen sample source applicable is included in the source code repository

## Sample Source Application

${{ values.appSummary }}

## Repositories

The source code for your application can be found in [${{ values.srcRepoURL }} ](${{ values.srcRepoURL }} ).
 
The GitOps repository, which contains the Kubernetes manifests for the application can be found in 
[${{ values.repoURL }} ](${{ values.repoURL }} ). 

## Application namespaces 

The default application is found in the namespace: **`${{ values.namespace }}`**. Applications can be deployed into their own unique namespace or multiple software templates can generate numerous applications into the same namespace.