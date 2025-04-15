# AI templates e2e tests

This is a template for e2e tests for RHDH AI templates, allowing for quick e2e test creation for different configurations.

## Creating a test suite

By default, the test files are expected in the `tests` folder, any files with the `.test.ts` suffix are considered.

Start by creating one such file, e.g. `tests/chatbot.test.ts`.
Next, we need to specify the template to use, and the values it takes. There are interfaces available to create type-safe objects that serve as template inputs:
 - `AITemplate` - enum of available tempalte names  
 - `ApplicationInfo`, `DeploymentInformation`, `RepositoryInfo` - each refers to values for one step of the template

This is what a test file might look like:
```typescript
import { ApplicationInfo, DeploymentInformation, RepositoryInfo } from '../../API/types';
import { generateComponentName, templateSuite } from '../../suite/template';

const template = 'chatbot' // choose a template from the available names
const name = generateComponentName(template); // generates a unique component name (optional, but recommended)
const appInfo: ApplicationInfo = {
  name: name,
  modelServer: 'llama.cpp',
  modelNameDeployed: 'instructlab/granite-7b-lab'
};
const repoInfo: RepositoryInfo = {
  branch: 'main',
  githubServer: 'github.com',
  hostType: 'GitHub',
  repoName: name,
  repoOwner: 'myOrg'
};
const deploymentInfo: DeploymentInformation = {
  imageName: 'myImage',
  imageOrg: 'myQuayOrg',
  imageRegistry: 'quay.io',
  namespace: 'rhdh-app',
  rhoaiSelected: false
};

templateSuite(template, appInfo, repoInfo, deploymentInfo, rhdhNamespace);
```
The above set of objects constitutes a setup for the `chatbot` template with the chosen model to be deployed, using `github.com` for source hosting, and quay.io for image hosting.
Calling the `templateSuite` function generates a jest test suite for the given template options.

Last step is to include the new test file in jest config. Make sure the `testMatch` pattern in `jest.config.js` matches the new file path.

At this point, the file `tests/chatbot.test.ts` becomes a test suite and will be loaded by jest.

## Environment setup & variables

In order to run the tests successfully, several requirements must be met:
 - nodejs 18+ minumum, recommended 20+
 - RHDH test instance, with `backend.auth.dangerouslyDisableDefaultAuthPolicy` set to true
 - kube config with the correct cluster context (logged in to the cluster hosting RHDH)
 - github/gitlab token with permissions to create and delete repositories under your organization

These environment variables are necessary for all tests:
 - `DEVELOPER_HUB_URL` base URL of your RHDH instance
 - for use with github:
   - `MY_GITHUB_TOKEN` github token when using github as source host
 - for use with gitlab:
   - `GITLAB_TOKEN` gitlab token when using gitlab as source host
   - `GIT_WEBHOOK_SECRET` PaC secret for webhooks, when using gitlab

Optionally, if using an external model service:
 - `MODEL_SECRET` bearer token for any secured existing model service

Use the following environment variables to customize the existing tests:
 - `GITHUB_HOST` sets host name for github instance (default `github.com`)
 - `GITHUB_ORG` sets github organization that will own the created repositories
 - `IMAGE_REGISTRY` sets the registry that will host the images created (default `quay.io`)
 - `IMAGE_ORG` sets the organization in the image registry that will own the images
 - `DEPLOYMENT_NAMESPACE` sets the namespace your applications will be deployed to on the cluster
 - `RHDH_NAMESPACE` the namespace that houses the developer hub instance and argocd applications

## Running the tests

With the test suite(s) defined and requirements met, run the tests by running `npm test` from terminal.
Note that different test files are going to be run in parallel.

After the test run finishes, reports will be placed in `artifacts` folder.
