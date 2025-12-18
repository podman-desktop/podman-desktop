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

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { Plugin } from '@docusaurus/types';

import { GITHUB_OWNER, GITHUB_REPOSITORY } from '../../../packages/api/src/repository-infos';
import type { GitHubMetadata } from './github-metadata';
import { GitHubService } from './github-service';
import { parseMaintainersFromMarkdown } from './maintainers-parser';

// Path to MAINTAINERS.md relative to website directory
const MAINTAINERS_FILE_PATH = resolve(__dirname, '../../../MAINTAINERS.md');

export default async function githubMetadataPlugin(): Promise<Plugin<GitHubMetadata>> {
  const githubService = new GitHubService(GITHUB_OWNER, GITHUB_REPOSITORY);

  return {
    name: 'docusaurus-plugin-github-metadata',

    async loadContent(): Promise<GitHubMetadata> {
      // Get release metadata
      const metadata = await githubService.getMetadata();

      // Read and parse MAINTAINERS.md to get excluded usernames
      let excludedUsernames: Set<string>;
      try {
        const maintainersContent = readFileSync(MAINTAINERS_FILE_PATH, 'utf-8');
        excludedUsernames = parseMaintainersFromMarkdown(maintainersContent);
      } catch (err) {
        throw new Error(
          `Failed to read MAINTAINERS.md at ${MAINTAINERS_FILE_PATH}.
            This file is required to filter out maintainers from the contributors list.
            Error: ${err instanceof Error ? err.message : err}`,
        );
      }

      // Fetch latest contributors, excluding maintainers
      // Parameters: excludedUsernames, contributorLimit (5), pagesToFetch (5 = 500 commits)
      const latestContributors = await githubService.getLatestContributors(excludedUsernames, 5, 5);

      // Return combined metadata
      return {
        ...metadata,
        latestContributors,
      };
    },

    async contentLoaded({ content, actions }): Promise<void> {
      const { setGlobalData } = actions;
      setGlobalData(content);
    },
  };
}
