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
import type { RestEndpointMethodTypes } from '@octokit/rest';
import { Octokit } from '@octokit/rest';
import type { OctokitResponse } from '@octokit/types';
import type { Disposable } from '@podman-desktop/api';

import type { GithubDiscussionsData } from '/@/plugin/github/github-discussions-data.js';

export class GithubClient implements Disposable {
  #controller: AbortController;

  #octokit: Octokit;
  /**
   * If we reached the rate limit, GitHub give us a reset timestamp
   */
  #reset: number | undefined;
  #retry: number;

  get disabled(): boolean {
    if (this.#retry > 2) return true;
    return !!this.#reset && this.#reset - new Date().getTime() > 0;
  }

  constructor() {
    this.#controller = new AbortController();
    this.#retry = 0;
    this.#octokit = new Octokit({
      request: {
        signal: this.#controller.signal,
      },
    });
  }

  init(): void {
    // check async
    this.checkConnection().catch(console.error);
  }

  public getReposDiscussion(
    organisation: string,
    repo: string,
    discussion: number,
  ): Promise<OctokitResponse<GithubDiscussionsData>> {
    console.log(`[github-client] get organisation ${organisation} repos ${repo} discussion ${discussion} reactions`);
    return this.#octokit.request(`/repos/${organisation}/${repo}/discussions/${discussion}`);
  }

  protected async checkConnection(): Promise<void> {
    try {
      // Let's get the rate limit
      const { data } = await this.getRateLimit();
      this.#retry = 0;
      if (data.rate.remaining < 5) {
        // the reset is in seconds (E.g. 1743596058) need to be changed to milliseconds
        this.#reset = data.rate.reset * 1000;
      }
    } catch (err: unknown) {
      console.error('Something went wrong while trying to ', err);
      // if we got an error let's have a reset time in an hour
      this.#reset = new Date().getTime() + 60 * 60 * 1000;
      // increment the retry counter
      this.#retry++;
    }
  }

  protected getRateLimit(): Promise<RestEndpointMethodTypes['rateLimit']['get']['response']> {
    return this.#octokit.rateLimit.get();
  }

  dispose(): void {
    this.#controller.abort('disposing github client');
  }
}
