import { Gitlab } from '@gitbeaker/rest';
import { GitClient } from './types';

export class GitLabClient implements GitClient {
  private readonly gitlab;

  constructor(token: string, host = 'https://gitlab.com') {
    this.gitlab = new Gitlab({ token, host });
  }

  deleteRepository(org: string, name: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  waitPullMerged(org: string, repo: string, pullNumber: number, retries?: number | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async checkRepositoryExists(owner: string, name: string): Promise<boolean> {
    const project = await this.gitlab.Projects.show(`${owner}/${name}`);
    return !!project.id;
  }

  async createWebhook(owner: string, repo: string, webhookUrl: string): Promise<void> {
    try {
      const hook = await this.gitlab.ProjectHooks.add(`${owner}/${repo}`, webhookUrl, {
        token: process.env.GIT_WEBHOOK_SECRET,
        pushEvents: true,
        mergeRequestsEvents: true,
        tagPushEvents: true,
        enableSslVerification: false
      });
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to create webhook`);
    }
  }

  async createCommit(owner: string, repo: string, branch = 'main') {
    try {
      await this.gitlab.Commits.create(`${owner}/${repo}`, branch, 'empty commit', [{
        action: 'create',
        filePath: 'test',
        content: 'Hello world'
      }]);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to create commit');
    }
  }

  async getGitopsImage(owner: string, componentName: string, env = 'development', branch = 'main') {
    try {
      const file = await this.gitlab.RepositoryFiles.show(
        `${owner}/${componentName}-gitops`,
        `components/${componentName}/overlays/${env}/deployment-patch.yaml`,
        branch
      );
      const data = Buffer.from(file.content, 'base64').toString('utf-8');
      const pattern = /- image: (.*)/;
      const matches = data.match(pattern);

      if (matches && matches.length > 1) {
        const extractedImage = matches[1];
        return extractedImage;
      } else {
        throw new Error("Image not found in the gitops repository path");
      }
    } catch (err) {
      console.error(err);
      throw new Error(`Error: ${err}`);
    }
  }

  async getLatestRevision(owner: string, repo: string): Promise<string> {
    try {
      const response = await this.gitlab.Commits.all(`${owner}/${repo}`, {
        refName: 'main'
      });
      return response[0].id;
    } catch (error) {
      console.error(error)
      throw new Error(`Error: ${error}`);
    }
  }
}