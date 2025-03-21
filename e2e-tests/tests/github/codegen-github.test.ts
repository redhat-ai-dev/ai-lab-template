import { ApplicationInfo, DeploymentInfo, RepositoryInfo } from '../../API/types';
import { generateComponentName, templateSuite } from '../../suite/template';

const template = 'codegen'
const name = generateComponentName(template);
const appInfo: ApplicationInfo = {
  name: name,
  modelServer: 'llama.cpp',
  modelNameDeployed: 'Nondzu/Mistral-7B-code-16k-qlora'
};
const repoInfo: RepositoryInfo = {
  branch: 'main',
  githubServer: process.env.GITHUB_HOST ?? 'github.com',
  hostType: 'GitHub',
  repoName: name,
  repoOwner: process.env.GITHUB_ORG ?? 'rhdh-pai-qe'
};
const deploymentInfo: DeploymentInfo = {
  imageName: template,
  imageOrg: process.env.IMAGE_ORG ?? 'rhdh-pai-qe',
  imageRegistry: process.env.IMAGE_REGISTRY ?? 'quay.io',
  namespace: process.env.DEPLOYMENT_NAMESPACE ?? 'rhdh-app',
  rhoaiSelected: true
};

templateSuite(template, appInfo, repoInfo, deploymentInfo, process.env.RHDH_NAMESPACE ?? 'ai-rhdh');
