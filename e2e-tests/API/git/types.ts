export interface GitClient {
  checkRepositoryExists(org: string, name: string): Promise<boolean>
  waitPullMerged(org: string, repo: string, pullNumber: number, retries?: number): Promise<void>
  getGitopsImage(owner: string, componentName: string, environment: string): Promise<string | undefined>
  getLatestRevision(org: string, name: string): Promise<string>
  createWebhook(owner: string, repo: string, webhookUrl: string): Promise<void>
  createCommit(owner: string, repo: string, branch?: string): Promise<void>
  deleteRepository(org: string, name: string): Promise<boolean>
}