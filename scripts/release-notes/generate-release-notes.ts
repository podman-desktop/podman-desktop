#!/usr/bin/env tsx

/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import { ReleaseNotesPreparator } from './release-notes-preparator';

export function showHelp(): void {
  console.log('Parameters:');
  console.log('--token - GitHub token or export GITHUB_TOKEN env variable');
  console.log('--org - GitHub organization (default is "podman-desktop")');
  console.log('--repo - GitHub repository (default is "podman-desktop")');
  console.log('--username - GitHub username or export GITHUB_USERNAME env variable');
  console.log('--milestone - GitHub milestone for which we want to generate release notes e.g. 1.18.0');
  console.log('--ollama - script will try to use ollama when model is provided');
  console.log(
    '--model - name of ollama model for generating highlited PRs e.g. gemma3:27b (before running this script run "ollama run gemma3:27b")',
  );
  console.log('--port - port on which is service running');
  console.log(
    '--endpoint - endpoint of a running service, default is "/v1/chat/completions" for AI Lab and "/api/generate" for Ollama',
  );
}

export async function run(): Promise<void> {
  let token = process.env.GITHUB_TOKEN;
  const args = process.argv.slice(2);
  let organization = 'podman-desktop';
  let repo = 'podman-desktop';
  let model: string | undefined = undefined;
  let milestone: string = '';
  let port: string | undefined = undefined;
  let endpoint: string | undefined = undefined;
  let username = process.env.GITHUB_USERNAME;
  let useOllama = false;
  if (args.length === 0) {
    showHelp();
    return;
  }
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--token':
        token = args[++i];
        break;
      case '--org':
        organization = args[++i];
        break;
      case '--repo':
        repo = args[++i];
        break;
      case '--username':
        username = args[++i];
        break;
      case '--milestone':
        milestone = args[++i];
        break;
      case '--model':
        model = args[++i];
        break;
      case '--port':
        port = args[++i];
        break;
      case '--endpoint':
        endpoint = args[++i];
        break;
      case '--ollama':
        useOllama = true;
        break;
      case '--help':
      case '-h':
        showHelp();
        break;
      default:
        console.warn(`Unknown option: ${args[i]}`);
        break;
    }
  }

  if (useOllama && !model) {
    console.error('When using --ollama, you need to specify --model argument');
    return;
  }

  if (useOllama) {
    port ??= '11434';
    endpoint ??= '/api/generate';
  } else {
    port ??= '45621';
    endpoint ??= '/v1/chat/completions';
  }

  if (!token) {
    console.log('No token found. Use either GITHUB_TOKEN or pass it as an argument');
  } else if (!username) {
    console.log('No username found. Use either GITHUB_USERNAME or pass it as an argument');
  } else {
    const releaseNotesPreparator = new ReleaseNotesPreparator(
      token,
      organization,
      repo,
      milestone,
      username,
      model,
      port,
      endpoint,
      useOllama,
    );
    await releaseNotesPreparator.generate();
  }
}

run().catch((err: unknown) => {
  console.error(err);
});
