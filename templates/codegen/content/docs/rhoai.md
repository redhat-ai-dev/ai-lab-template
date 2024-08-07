# Running Samples in OpenShift AI

This document will outline how you can run build and run your sample applications within an OpenShfit AI workbench.

## Prerequisites

- `oc` cli installed
- Permissions to run `oc port-forward` on the cluster, specifically an account with the following roles:
   - `get`, `create`, and `list` for the `pods/portforward` subresource

## Running the Sample

1) Navigate to the OpenShift AI workbench created for your sample application
2) Go to `File->Open` and select `Terminal`
3) In the terminal, run `cd ${{ values.name }}` to navigate to your sample app's directory
4) Run `pip install --upgrade -r requirements.txt` to install the dependencies for your application
5) Run `${{ values.appRunCommand }}` to run the sample

## Accessing the Sample

With the sample app now running, the following steps will allow you to access the sample app in your browser:

1) Navigate back to the OpenShift AI dashboard, and find the name of your workbench.

2) In a terminal window on your machine, run `oc get pods -l app=<workbench-name>`. This will retrieve the name of the pod where the workbench is running.

3) Run `oc port-forward 

4) Access `http://localhost:${{ values.appPort }}` in your browser to access the application