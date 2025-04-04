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
import type { Disposable } from '@podman-desktop/api';

import type { ConfigurationRegistry, IConfigurationPropertyRecordedSchema } from '/@/plugin/configuration-registry.js';
import type { GithubClient } from '/@/plugin/github/github-client.js';
import type { GithubDiscussionsData } from '/@/plugin/github/github-discussions-data.js';
import type { IExperimentalConfiguration } from '/@api/configuration/models.js';

// Handy type to specify a configuration schema with an experimental property defined
type ExperimentalSchema = IConfigurationPropertyRecordedSchema & { experimental: IExperimentalConfiguration };

export class ExperimentalDiscussion implements Disposable {
  #caches: Map<string, GithubDiscussionsData>;

  constructor(
    protected readonly github: GithubClient,
    protected readonly configurationRegistry: ConfigurationRegistry,
  ) {
    this.#caches = new Map<string, GithubDiscussionsData>();
  }

  public getExperimentalDiscussionReactions(): Record<string, GithubDiscussionsData> {
    return Object.fromEntries(this.#caches);
  }

  dispose(): void {
    this.#caches.clear();
  }

  init(): void {}

  protected parseGitHubDiscussionLink(url: string): {
    organisation: string;
    repository: string;
    discussion: number;
  } {
    const match = RegExp(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/discussions\/(\d+)\/?$/).exec(url);

    if (!match?.[1] || !match[2] || !match[3]) {
      throw new Error(`Invalid GitHub discussion URL: ${url}`);
    }

    return {
      organisation: match[1],
      repository: match[2],
      discussion: parseInt(match[3], 10),
    };
  }

  /**
   * This action may take some time
   */
  async collectExperimentalConfigurationReactions(): Promise<Record<string, GithubDiscussionsData>> {
    if (this.github.disabled) return {};

    console.time('caching experimental configuration reactions');
    const configurations = this.getExperimentalProperties();
    for (const configuration of configurations) {
      // ignore configuration without ID.
      if (!configuration.id) continue;

      // ignore existing cached
      if (this.#caches.has(configuration.id)) continue;

      // skip any experimental without proper GitHub discussion link
      if (!configuration.experimental.githubDiscussionLink) continue;
      // let's parse the GitHub url
      const { organisation, repository, discussion } = this.parseGitHubDiscussionLink(
        configuration.experimental.githubDiscussionLink,
      );

      const { data } = await this.github.getReposDiscussion(organisation, repository, discussion);
      this.#caches.set(configuration.id, data);
    }
    console.timeEnd('caching experimental configuration reactions');

    return this.getExperimentalDiscussionReactions();
  }

  protected getExperimentalProperties(): Array<ExperimentalSchema> {
    const configurations = this.configurationRegistry.getConfigurationProperties();
    return Object.values(configurations).filter(
      (configuration): configuration is ExperimentalSchema => !!configuration.experimental,
    );
  }
}
