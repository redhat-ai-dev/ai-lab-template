# Trusted Application Pipeline Software Template

This application, **${{ values.name }}**, was created from a Trusted Application Pipeline Software Template.

The software templates create a new source and gitops deployment repositories with a sample source application. 

## Repositories

The source code for your application can be found in [${{ values.srcRepoURL }} ](${{ values.srcRepoURL }} ).
 
The gitops repository, which contains the kubernetes manifests for the application can be found in 
[${{ values.repoURL }} ](${{ values.repoURL }} ) 

## Application namespaces 

The default application will be found in the namespace: ${{ values.namespace }}. Applications can be deployed into unique namespaces or multiple software templates can also bet generated into the same group namespaces.  