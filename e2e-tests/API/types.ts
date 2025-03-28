import { V1ObjectMeta, V1Condition } from "@kubernetes/client-node"
import { PipelineRunKind, TaskRunKind } from '@janus-idp/shared-react';

export type TaskIdReponse = { id: string }

interface ExistingModel {
  name: string
  owner?: string
  modelServer: 'Existing model server'
  modelEndpoint: string
  modelName: string
  includeModelEndpointSecret: false
}

export interface ExistingModelSecret {
  name: string
  owner?: string
  modelServer: 'Existing model server'
  modelEndpoint: string
  modelName: string
  includeModelEndpointSecret: true
  modelEndpointSecretName: string
  modelEndpointSecretKey: string
}

interface DeployedModel {
  name: string
  owner?: string
  modelServer: 'llama.cpp' | 'vLLM' | 'whisper.cpp' | 'detr-resnet-101'
  modelNameDeployed: string
}

interface StandaloneModel {
  name: string
  owner?: string
  modelServer: 'vLLM'
  modelNameDeployed: 'ibm-granite/granite-3.1-8b-instruct'
}

export type ApplicationInfo = ExistingModel | ExistingModelSecret | DeployedModel | StandaloneModel;

interface GithubInfo {
  hostType: 'GitHub'
  repoOwner: string
  repoName: string
  branch: string
  githubServer: string
}

interface GitlabInfo {
  hostType: 'GitLab'
  repoOwner: string
  repoName: string
  branch: string
  gitlabServer: string
}

export type RepositoryInfo = GithubInfo | GitlabInfo


export interface ApplicationDeploymentInfo {
  imageRegistry: string
  imageOrg: string
  imageName: string
  namespace: string
  rhoaiSelected: boolean
}

interface ModelDeploymentInfo {
  namespace: string
}

export type DeploymentInfo = ApplicationDeploymentInfo | ModelDeploymentInfo;

export const isApplicationDeployment = (object: DeploymentInfo): object is ApplicationDeploymentInfo => {
  return (object as ApplicationDeploymentInfo).imageRegistry !== undefined;
}

export interface PipelineRunSpec {
  apiVersion: string
  kind: string
  metadata: V1ObjectMeta
  spec: JSON
  status: PipelineRunStatusSpec
}

export interface PipelineRunStatusSpec {
  conditions: V1Condition[]
}

export interface PipelineRunList {
  items: PipelineRunKind[]
}

export interface PipelineRunList {
  items: PipelineRunKind[]
}

export interface TaskRunList {
  items: TaskRunKind[]
}

export interface ApplicationSpec {
  apiVersion: string
  kind: string
  metadata: V1ObjectMeta
  status: ApplicationStatus
}

export interface ApplicationStatus {
  sync?: Status
  health?: Health
}

export interface Status {
  status?: string
  revision?: string
}

export interface Health {
  status?: string
}

export interface OpenshiftRoute {
  apiVersion: string
  kind: string
  metadata: V1ObjectMeta
  spec: OpenshiftRouteSpec
}

export interface OpenshiftRouteSpec {
  host: string
}