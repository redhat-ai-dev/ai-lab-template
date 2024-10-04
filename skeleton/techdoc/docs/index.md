# AI Software Template

This application, ${{ values.name }}, was created from an AI Software Template. These software templates create a new source code repository as well as a new gitops deployment repository.

Included in the source code repository will be the chosen sample source application.

## Repositories

The source code for your application can be found in [${{ values.srcRepoURL }} ](${{ values.srcRepoURL }} ).
 
The gitops repository, which contains the kubernetes manifests for the application can be found in 
[${{ values.repoURL }} ](${{ values.repoURL }} ). 

## Application namespaces 

The default application will be found in the namespace: **`${{ values.namespace }}`**. Applications can be deployed into their own unique namespace or multiple software templates can generate numerous applications into the same namespace.