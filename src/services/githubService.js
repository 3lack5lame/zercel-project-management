// GitHub API Service
import { Octokit } from 'octokit';

class GitHubService {
  constructor(accessToken) {
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }

  // Get authenticated user info
  async getUser() {
    const response = await this.octokit.rest.users.getAuthenticated();
    return response.data;
  }

  // Create a new repository
  async createRepository(name, description = '', isPrivate = false) {
    const response = await this.octokit.rest.repos.createForAuthenticatedUser({
      name,
      description,
      private: isPrivate,
      auto_init: true, // Initialize with README
    });
    return response.data;
  }

  // Create a branch for a task
  async createBranch(owner, repo, branchName, fromBranch = 'main') {
    // Get the reference of the source branch
    const sourceRef = await this.octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${fromBranch}`,
    });

    // Create new branch
    const response = await this.octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: sourceRef.data.object.sha,
    });

    return response.data;
  }

  // Create a Codespace for a task
  async createCodespace(owner, repo, branch, machineType = 'standardLinux32gb') {
    const response = await this.octokit.rest.codespaces.createForAuthenticatedUser({
      repo,
      owner,
      ref: branch,
      machine_type: machineType,
    });
    return response.data;
  }

  // Get Codespace details
  async getCodespace(codespaceName) {
    const response = await this.octokit.rest.codespaces.getForAuthenticatedUser({
      codespace_name: codespaceName,
    });
    return response.data;
  }

  // Start a Codespace
  async startCodespace(codespaceName) {
    const response = await this.octokit.rest.codespaces.startForAuthenticatedUser({
      codespace_name: codespaceName,
    });
    return response.data;
  }

  // Create a pull request
  async createPullRequest(owner, repo, title, body, head, base = 'main') {
    const response = await this.octokit.rest.pulls.create({
      owner,
      repo,
      title,
      body,
      head,
      base,
    });
    return response.data;
  }

  // Get repository
  async getRepository(owner, repo) {
    const response = await this.octokit.rest.repos.get({
      owner,
      repo,
    });
    return response.data;
  }

  // List user repositories
  async listRepositories(type = 'owner', sort = 'updated') {
    const response = await this.octokit.rest.repos.listForAuthenticatedUser({
      type,
      sort,
      per_page: 100,
    });
    return response.data;
  }

  // Get file content
  async getFileContent(owner, repo, path, ref = 'main') {
    const response = await this.octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });
    return response.data;
  }

  // Create or update file
  async createOrUpdateFile(owner, repo, path, content, message, branch = 'main') {
    const response = await this.octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: btoa(content), // Base64 encode
      branch,
    });
    return response.data;
  }

  // Create an issue
  async createIssue(owner, repo, title, body, labels = [], assignees = []) {
    const response = await this.octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
      assignees,
    });
    return response.data;
  }

  // List issues with filters
  async listIssues(owner, repo, state = 'open', labels = []) {
    const response = await this.octokit.rest.issues.listForRepo({
      owner,
      repo,
      state,
      labels: labels.join(','),
      per_page: 50,
    });
    return response.data;
  }
}

export default GitHubService;
