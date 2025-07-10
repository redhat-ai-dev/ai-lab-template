import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { ScaffolderScaffoldOptions, ScaffolderTask } from '@backstage/plugin-scaffolder-react';
import axios, { Axios, AxiosResponse } from 'axios';
import * as https from 'https';
import { ApplicationInfo, DeploymentInfo, RepositoryInfo, TaskIdReponse, isApplicationDeployment } from './types';

export class DeveloperHubClient {
  private readonly RHDHUrl: string;
  private readonly axiosInstance: Axios;

  constructor(developerHubUrl: string) {
    this.RHDHUrl = developerHubUrl;
    this.axiosInstance = axios.create({
      httpAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
  }

  async getTemplates(): Promise<TemplateEntityV1beta3[]> {
    try {
      const response: AxiosResponse<TemplateEntityV1beta3[]> = await this.axiosInstance.get(`${this.RHDHUrl}/api/catalog/entities?filter=kind=template`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to retrieve templates: ${error}`);
    }
  }

  async createComponentTask(componentCreateOptions: ScaffolderScaffoldOptions): Promise<TaskIdReponse> {
    try {
      const response: AxiosResponse<TaskIdReponse> = await this.axiosInstance.post(`${this.RHDHUrl}/api/scaffolder/v2/tasks`, componentCreateOptions);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to create component: ${error}`);
    }
  }

  async waitForTask(taskId: string, retries = 10): Promise<ScaffolderTask> {
    const delayMs = 5 * 1000;
    let retried = 0;

    while (retried < retries) {
      try {
        const response: AxiosResponse<ScaffolderTask> = await this.axiosInstance.get(`${this.RHDHUrl}/api/scaffolder/v2/tasks/${taskId}`);
        if (response.data.status === 'failed' || response.data.status === 'cancelled') {
          throw new Error(`Task ${taskId} ${response.data.status}`);
        }
        if (response.data.status === 'completed') {
          return response.data;
        }
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        retried++;
      } catch (error) {
        console.error(error);
        throw new Error(`Error retrieving task ${taskId}. ${error}`);
      }
    }
    throw new Error(`Task ${taskId} timed out`);
  }

  async checkComponentEndpoint(url: string): Promise<boolean> {
    try {
      const response = await axios.get(url);
      return response.status === 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  createTemplateOptions(templateName: string, appInfo: ApplicationInfo, repoInfo: RepositoryInfo, deploymentInfo: DeploymentInfo): ScaffolderScaffoldOptions {
    const taskOptions: ScaffolderScaffoldOptions = {
      templateRef: `template:default/${templateName}`,
      values: {
        name: appInfo.name,
        owner: appInfo.owner ? appInfo.owner : 'user:guest',
        argoNS: appInfo.argoNS,
        argoProject: appInfo.argoProject ?? 'default',
        argoInstance: appInfo.argoInstance ?? 'default',
        modelServer: appInfo.modelServer,
        hostType: repoInfo.hostType,
        repoOwner: repoInfo.repoOwner,
        repoName: repoInfo.repoName,
        branch: repoInfo.branch,
        namespace: deploymentInfo.namespace
      }
    }
    if (appInfo.includeArgoLabel === true) {
      taskOptions.values.argoAppLabel = appInfo.argoAppLabel;
    }
    if (isApplicationDeployment(deploymentInfo)) {
      taskOptions.values.imageRegistry = deploymentInfo.imageRegistry;
      taskOptions.values.imageOrg = deploymentInfo.imageOrg;
      taskOptions.values.imageName = deploymentInfo.imageName;
      taskOptions.values.namespace = deploymentInfo.namespace;
      taskOptions.values.rhoaiSelected = deploymentInfo.rhoaiSelected;
    }
    if (appInfo.modelServer === 'Existing model server') {
      taskOptions.values.modelEndpoint = appInfo.modelEndpoint;
      taskOptions.values.modelName = appInfo.modelName;
      taskOptions.values.includeModelEndpointSecret = appInfo.includeModelEndpointSecret;
      if (appInfo.includeModelEndpointSecret === true) {
        taskOptions.values.modelEndpointSecretName = appInfo.modelEndpointSecretName;
        taskOptions.values.modelEndpointSecretKey = appInfo.modelEndpointSecretKey;
      }
    } else {
      taskOptions.values.modelNameDeployed = appInfo.modelNameDeployed;
    }

    if (repoInfo.hostType === 'GitHub') {
      taskOptions.values.githubServer = repoInfo.githubServer;
    } else {
      taskOptions.values.gitlabServer = repoInfo.gitlabServer;
    }

    return taskOptions;
  }
}