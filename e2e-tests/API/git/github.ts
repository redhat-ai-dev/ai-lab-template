import { Octokit } from "@octokit/rest";
import { GitClient } from "./types";

export class GitHubClient implements GitClient {
  private readonly octokit: Octokit

  constructor(githubToken: string, apiUrl = 'https://api.github.com') {
    this.octokit = new Octokit({
      baseUrl: apiUrl,
      userAgent: 'rhdh-ai-dev-e2e',
      auth: githubToken,
    });
  }

  createWebhook(owner: string, repo: string, webhookUrl: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  createCommit(owner: string, repo: string, branch?: string | undefined): Promise<void> {
    throw new Error("Method not implemented.");
  }

  /**
   * check if a repository exists in GitHub
   * @param org A valid GitHub org
   * @param name A valid GitHub repository
   */
  async checkRepositoryExists(org: string, name: string): Promise<boolean> {
    try {
      const response = await this.octokit.repos.get({ owner: org, repo: name });
      return response.status === 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * wait until a pull request is merged
   * @param org A valid GitHub org
   * @param repo A valid GitHub repository
   * @param pullNumber A valid pull reuqest number
   * @param retries number of retries in 2 second intervals
   */
  async waitPullMerged(org: string, repo: string, pullNumber: number, retries = 15) {
    while (retries > 0) {
      try {
        const response = await this.octokit.pulls.checkIfMerged({ owner: org, repo, pull_number: pullNumber });
        if (response.status === 204) {
          return;
        }
        retries--;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          retries--;
          continue;
        } else {
          console.error(error);
          throw error;
        }
      }
    }
    throw new Error('Timed out waiting for pull request to be merged');
  }

  async getGitopsImage(owner: string, componentName: string, environment: string): Promise<string | undefined> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo: `${componentName}-gitops`,
        path: `components/${componentName}/overlays/${environment}/deployment-patch.yaml`,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      if (!("content" in data)) {
        return;
      }
      const content = data.content;
      const decodedData = Buffer.from(content, 'base64');
      const decodedContent = decodedData.toString();

      const pattern = /- image: (.*)/;
      const matches = decodedContent.match(pattern);

      if (matches && matches.length > 1) {
        const extractedImage = matches[1];
        return extractedImage;
      } else {
        throw new Error("Image not found in the gitops repository path");
      }
    } catch (error) {
      console.error(error)
      throw new Error(`Error: ${error}`);
    }
  }

  async getLatestRevision(org: string, name: string): Promise<string> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/commits/main', {
        owner: org,
        repo: name,
        headers: {
          accept: 'application/vnd.github.VERSION.sha',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      return response.data as string;
    } catch (error) {
      console.error(error)
      throw new Error(`Error: ${error}`);
    }
  }

  /**
   * delete repository in GitHub
   * @param org A valid GitHub org
   * @param name A valid GitHub repository
   */
  async deleteRepository(org: string, name: string): Promise<boolean> {
    try {
      const response = await this.octokit.request('DELETE /repos/' + org + '/' + `${name}`, {
        owner: org,
        repo: `${name}`,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      return response.status === 204;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}