import * as core from '@actions/core'

import { update } from './update'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    core.setSecret('op-token')

    const repo_name: string = core.getInput('repo')
    const op_token: string = core.getInput('op-token')

    await update(repo_name, { token: op_token })
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
