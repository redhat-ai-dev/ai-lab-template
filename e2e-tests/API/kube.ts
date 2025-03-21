import { PipelineRunKind } from "@janus-idp/shared-react";
import { CoreV1Api, CustomObjectsApi, KubeConfig, V1ObjectMeta, V1Secret, V1ComponentStatus, V1DeleteOptions } from "@kubernetes/client-node";
import { ApplicationSpec, OpenshiftRoute, PipelineRunList } from "./types";

export class KubeClient {
  private readonly kubeConfig;

  constructor() {
    this.kubeConfig = new KubeConfig();
    this.kubeConfig.loadFromDefault();
  }

  async getPipelineRunByRepository(gitRepository: string, eventType: string): Promise<PipelineRunKind | undefined> {
    const customObjectsApi = this.kubeConfig.makeApiClient(CustomObjectsApi);
    const maxAttempts = 10;
    const retryInterval = 5 * 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const { body } = await customObjectsApi.listClusterCustomObject('tekton.dev', 'v1', 'pipelineruns',
          undefined, undefined, undefined, undefined, `pipelinesascode.tekton.dev/url-repository=${gitRepository}`);
        const pr = body as PipelineRunList;

        const filteredPipelineRuns = pr.items.filter((pipelineRun: PipelineRunKind) => {
          const metadata: V1ObjectMeta = pipelineRun.metadata!;
          const labels = metadata.labels;

          if (labels && labels['pipelinesascode.tekton.dev/event-type'] === eventType) {
            return true;
          }
          return false;
        });

        if (filteredPipelineRuns.length > 0) {
          console.log(`Found pipeline run ${filteredPipelineRuns[0].metadata!.name}`);

          return filteredPipelineRuns[0];
        } else {
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        }
      } catch (error) {
        console.error(`Error fetching pipeline runs (Attempt ${attempt}):`);
        if (attempt < maxAttempts) {
          console.log(`Retrying in ${retryInterval / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Max attempts reached. Unable to fetch pipeline runs for your component in cluster for ${gitRepository}`);
  }

  async waitPipelineRunToFinish(pipelineRun: PipelineRunKind, namespace: string, timeoutMs: number): Promise<boolean> {
    const name = pipelineRun.metadata?.name;
    if (!name) {
      throw new Error('No name available for pipelinerun');
    }
    const customObjectsApi = this.kubeConfig.makeApiClient(CustomObjectsApi);
    const retryInterval = 5 * 1000;
    let totalTimeMs = 0;

    while (timeoutMs === 0 || totalTimeMs < timeoutMs) {
      try {
        const { body } = await customObjectsApi.getNamespacedCustomObject('tekton.dev', 'v1', namespace, 'pipelineruns', name);
        const pr = body as PipelineRunKind;

        if (pr.status && pr.status.conditions) {
          const pipelineHasFinishedSuccessfully = pr.status.conditions.some(
            (condition) => condition.status === 'True' && condition.type === 'Succeeded'
          );
          const pipelineHasFailed = pr.status.conditions.some(
            (condition) => condition.status === 'False' && condition.reason === 'Failed'
          );

          if (pipelineHasFinishedSuccessfully) {
            console.log(`Pipeline run '${name}' finished successfully.`);
            return true;
          } else if (pipelineHasFailed) {
            console.error(`Pipeline run '${name}' failed.`);
            return false;
          }
        }
      } catch (error) {
        console.error('Error fetching pipeline run: retrying');
      }
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      totalTimeMs += retryInterval;
    }
    throw new Error(`Timeout reached waiting for pipeline run '${name}' to finish.`);
  }

  async waitForArgoCDApplicationToBeHealthy(name: string, namespace: string, targetRevision: string, timeoutMs: number): Promise<boolean> {
    const customObjectsApi = this.kubeConfig.makeApiClient(CustomObjectsApi);
    const retryInterval = 10 * 1000;
    let totalTimeMs = 0;

    while (timeoutMs === 0 || totalTimeMs < timeoutMs) {
      try {
        const { body } = await customObjectsApi.getNamespacedCustomObject('argoproj.io', 'v1alpha1', namespace, 'applications', name);
        const application = body as ApplicationSpec;

        if (application.status && application.status.sync && application.status.sync.status &&
          application.status.health && application.status.health.status) {

          // wait for the application to sync to the desired revision first
          if (application.status.sync.revision !== targetRevision) {
            await new Promise((resolve) => setTimeout(resolve, retryInterval));
            totalTimeMs += retryInterval;
            continue;
          }

          if (application.status.sync.status === 'Synced' && application.status.health.status === 'Healthy') {
            return true;
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
          totalTimeMs += retryInterval;
          continue;
        }
      } catch (error) {
        console.info('Error fetching argo application : retrying');
      }

      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      totalTimeMs += retryInterval;
    }

    throw new Error(`Timeout reached waiting for application '${name}' to be healthy`);
  }

  async getComponentUrl(name: string, namespace: string): Promise<string> {
    const customObjectsApi = this.kubeConfig.makeApiClient(CustomObjectsApi);
    try {
      const { body: openshiftRoute } = await customObjectsApi.getNamespacedCustomObject('route.openshift.io', 'v1', namespace, 'routes', name);
      const route = openshiftRoute as OpenshiftRoute;
      return `https://${route.spec.host}`;
    } catch (error) {
      throw new Error(`Failed to fetch openshift route ${name}: ${error}`);
    }
  }

  async createSecret(name: string, namespace: string, key: string, value: string) {
    const client = this.kubeConfig.makeApiClient(CoreV1Api);
    const body: V1Secret = {
      apiVersion: 'v1',
      metadata: {
        name: name
      },
      stringData: {
        [key]: value
      }
    }

    try {
      await client.createNamespacedSecret(namespace, body);
    } catch (error) {
      throw new Error(`Failed to create secret ${name}: ${error}`);
    }
  }

  async getAIWorkbenchStatus(componentName: string, namespace: string): Promise<boolean> {
    const customObjectsApi = this.kubeConfig.makeApiClient(CustomObjectsApi);
    try {
      const { body } = await customObjectsApi.getNamespacedCustomObject('kubeflow.org', 'v1', namespace, 'notebooks', `${componentName}-notebook`);
      const notebook = body as { status: V1ComponentStatus };

      const ready = notebook.status.conditions?.find((condition) => {
        return condition.type === 'Ready';
      });
      if (!ready || ready.status === 'False') {
        return false;
      }
      return true;
    } catch (error) {
      throw new Error(`Failed to fetch workbench status for ${componentName}: ${error}`);
    }
  }

  async deleteArgoCDApplication(componentName: string, namespace: string) {
    const customObjectsApi = this.kubeConfig.makeApiClient(CustomObjectsApi);
    await customObjectsApi.deleteNamespacedCustomObject('argoproj.io', 'v1alpha1', namespace, 'applications', `${componentName}-app-of-apps`);
  }

  async deleteAIWorkbench(componentName: string, namespace: string) {
    const customObjectsApi = this.kubeConfig.makeApiClient(CustomObjectsApi);
    await customObjectsApi.deleteNamespacedCustomObject('kubeflow.org', 'v1', namespace, 'notebooks', `${componentName}-notebook`);
  }
}