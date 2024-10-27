import { createClient } from '@1password/sdk'
import * as core from '@actions/core'
import * as github from '@actions/github'

export interface UpdateOptions {
  token: string
  branch: string
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

  const updated_repo = await octokit.rest.repos.mergeUpstream({
    owner: username,
    repo: repo,
    branch: 'master'
  })

  const message = updated_repo.data.message

  if (typeof message == 'string') {
    core.info(message)
  } else {
    core.warning('No message from merge')
  }
}
