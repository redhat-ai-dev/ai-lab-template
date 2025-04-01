import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { DeveloperHubClient } from "../API/developerHub-client";
import { GitHubClient } from "../API/git/github";
import { KubeClient } from "../API/kube";
import { ApplicationInfo, DeploymentInfo, RepositoryInfo, ExistingModelSecret, isApplicationDeployment } from "../API/types";
import { AITemplate } from './types';
import { GitLabClient } from '../API/git/gitlab';
import { GitClient } from '../API/git/types';

export const generateComponentName = (template: AITemplate) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const extraChar = characters.charAt(Math.floor(Math.random() * characters.length));
  return `${template}-${extraChar}${Date.now()}`;
}

function hasSecret(object: ApplicationInfo): object is ExistingModelSecret {
  return (object as ExistingModelSecret).includeModelEndpointSecret !== undefined;
}

export const templateSuite = (template: AITemplate, appInfo: ApplicationInfo, repoInfo: RepositoryInfo, deploymentInfo: DeploymentInfo, rhdhNamespace: string) => {
  let title = `${template} on ${repoInfo.hostType}`

  if (isApplicationDeployment(deploymentInfo)) {
    title = title.concat(`${appInfo.modelServer === 'Existing model server' ? ', existing model' : ''}`);
    title = title.concat(`${deploymentInfo.rhoaiSelected ? ', RHOAI' : ''}`);
  }

  describe(title, () => {
    let hub: DeveloperHubClient;
    let git: GitClient;
    let kube: KubeClient;

    const hubUrl = process.env.DEVELOPER_HUB_URL || '';
    let gitToken;

    beforeAll(async () => {
      if (!hubUrl) {
        throw new Error('No URL specified for developer hub');
      }

      hub = new DeveloperHubClient(hubUrl);
      if (repoInfo.hostType === 'GitHub') {
        gitToken = process.env.MY_GITHUB_TOKEN || '';
        git = new GitHubClient(gitToken);
      } else {
        gitToken = process.env.GITLAB_TOKEN || '';
        git = new GitLabClient(gitToken);
      }
      kube = new KubeClient();

      if (hasSecret(appInfo)) {
        const apiKey = process.env.MODEL_SECRET;
        if (!apiKey) {
          throw new Error('No secret specified for model endpoint');
        }
        await kube.createSecret(appInfo.modelEndpointSecretName, deploymentInfo.namespace, appInfo.modelEndpointSecretKey, apiKey);
      }
    });

    afterAll(async () => {
      // clean up if no tests failed
      const fails = (globalThis as any).hasTestFailures as boolean;
      if (!fails) {
        // remove repositories
        await git.deleteRepository(repoInfo.repoOwner, repoInfo.repoName);
        await git.deleteRepository(repoInfo.repoOwner, `${repoInfo.repoName}-gitops`);

        // remove gitops application & resources
        await kube.deleteArgoCDApplication(appInfo.name, rhdhNamespace);

        // remove AI workbench
        if (isApplicationDeployment(deploymentInfo) && deploymentInfo.rhoaiSelected) {
          await kube.deleteAIWorkbench(appInfo.name, deploymentInfo.namespace);
        }
      }
    });

    it('template is preloaded into rhdh', async () => {
      const templates = await hub.getTemplates();
      const names = templates.map((value) => value.metadata.name);

      expect(names.includes(template));
    });

    it('template finishes without errors', async () => {
      const options = hub.createTemplateOptions(template, appInfo, repoInfo, deploymentInfo);
      const taskId = await hub.createComponentTask(options);
      await hub.waitForTask(taskId.id);
    }, 60000);
    
    it('gitops repository is created', async () => {
      expect(await git.checkRepositoryExists(repoInfo.repoOwner, `${repoInfo.repoName}-gitops`)).toBe(true);
    }, 10000);

    if (isApplicationDeployment(deploymentInfo)) {
      it('source repository is created', async () => {
        expect(await git.checkRepositoryExists(repoInfo.repoOwner, repoInfo.repoName)).toBe(true);
      }, 10000);

      if (repoInfo.hostType === 'GitHub') {
        it('blank pull request is automatically created and merged', async () => {
          await git.waitPullMerged(repoInfo.repoOwner, repoInfo.repoName, 1);
        }, 30000);
      }

      if (repoInfo.hostType === 'GitLab') {
        it('create webhook for PaC', async () => {
          const webhookUrl = await kube.getComponentUrl('pipelines-as-code-controller', 'openshift-pipelines');
          await git.createWebhook(repoInfo.repoOwner, repoInfo.repoName, webhookUrl);
        });

        it('create a blank commit to trigger build pipeline', async () => {
          // webhook seems to need some time to activate
          await new Promise((res) => { setTimeout(res, 1000); });
          await git.createCommit(repoInfo.repoOwner, repoInfo.repoName);
        });
      }

      it('wait for build pipeline to finish', async () => {
        const eventType = repoInfo.hostType === 'GitHub' ? 'push' : 'Push';
        const plr = await kube.getPipelineRunByRepository(repoInfo.repoName, eventType);
        if (!plr) {
          throw new Error('pipeline run not found');
        }
        await kube.waitPipelineRunToFinish(plr, deploymentInfo.namespace, 30 * 60000);
      }, 32 * 60000);

      it('image is updated in gitops repo', async () => {
        const image = await git.getGitopsImage(repoInfo.repoOwner, appInfo.name, 'development');
        const regex = new RegExp(`${deploymentInfo.imageRegistry}/${deploymentInfo.imageOrg}/${deploymentInfo.imageName}`)

        let defaultImage = 'ai-template-bootstrap-app:latest';
        if (repoInfo.hostType === 'GitLab') {
          defaultImage = `quay.io/redhat-ai-dev/${template}:latest`;
        }
        expect(image).not.toMatch(defaultImage);
        expect(image).toMatch(regex);
      }, 10000);
    }

    it('wait for argocd application to sync and be healhy', async () => {
      const revision = await git.getLatestRevision(repoInfo.repoOwner, `${repoInfo.repoName}-gitops`);
      await kube.waitForArgoCDApplicationToBeHealthy(`${appInfo.name}-app`, rhdhNamespace, revision, 10 * 60000);
    }, 10 * 61000);

    if (isApplicationDeployment(deploymentInfo)) {
      it('application is running', async () => {
        const appUrl = await kube.getComponentUrl(appInfo.name, deploymentInfo.namespace);
        let success = false;

        let retries = 5
        while (retries > 0) {
          if (!await hub.checkComponentEndpoint(appUrl)) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            retries--;
          } else {
            success = true;
            break;
          }
        }

        expect(success).toBe(true);
      }, 12000);

      if (deploymentInfo.rhoaiSelected === true) {
        it('AI workbench is created', async () => {
          const workbenchReady = await kube.getAIWorkbenchStatus(appInfo.name, deploymentInfo.namespace);
          expect(workbenchReady).toBe(true);
        });
      }
    }
  });
}
