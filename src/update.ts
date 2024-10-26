import { createClient } from '@1password/sdk'
import * as github from '@actions/github'

export interface UpdateOptions {
  token: string
}

export async function update(
  repo: string,
  options: UpdateOptions
): Promise<void> {
  const client = await createClient({
    auth: options.token,
    integrationName: 'Update Upstream Integration',
    integrationVersion: '0.1.0'
  })

  const token = await client.secrets.resolve(
    'op://cloud/macports_update_token/credential'
  )

  const username = github.context.repo.owner
  const octokit = github.getOctokit(token)

  const repo_to_update = await octokit.rest.repos.get({
    owner: username,
    repo: repo
  })

  const parent_repo_url = repo_to_update.data.parent?.clone_url
  const child_repo_url = repo_to_update.data.clone_url

  console.log('parent: %s', parent_repo_url)
  console.log('child: %s', child_repo_url)
}
