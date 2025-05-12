import { ApplicationInfo, RepositoryInfo, DeploymentInfo } from "../../API/types";
import { generateComponentName, templateSuite } from "../../suite/template";
import { loadDefaultModel } from "../../util/models";

const template = 'audio-to-text'
const name = generateComponentName(template);
const modelServer = 'whisper.cpp';

const appInfo: ApplicationInfo = {
  name: name,
  modelServer: modelServer,
  modelNameDeployed: loadDefaultModel(template, modelServer)
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