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
import type { Disposable } from '@podman-desktop/api';

export type RateLimit = RestEndpointMethodTypes['rateLimit']['get']['response'];

interface GithubClientOptions {
  fetch?: typeof fetch;
}

export class GithubClient implements Disposable {
  readonly #controller: AbortController;
  readonly #octokit: Octokit;

  #reset: number | undefined;
  #remaining: number | undefined;

  constructor(options?: GithubClientOptions) {
    this.#controller = new AbortController();

    this.#octokit = new Octokit({
      request: {
        fetch: options?.fetch,
        signal: this.#controller.signal,
      },
    });
  }

  /**
   * Get the Octokit instance managed by the GitHub client class
   */
  get octokit(): Octokit {
    if (!this.ready) throw new Error('cannot use GitHub client: rate limit reached');
    return this.#octokit;
  }

  /**
   * Based on the remaining and reset rate limit provided by GitHub define
   * if the client can be used or not
   */
  get ready(): boolean {
    // if we don't have any value of remaining & reset: consider bad
    // using ! operator would be misleading, as !0 would be true
    if (this.#remaining === undefined || this.#reset === undefined) return false;

    // if we have more than 5 remaining: consider ready
    if (this.#remaining > 5) return true;

    // if the reset timestamp is before us: consider ready
    return this.#reset - new Date().getTime() < 0;
  }

  init(): void {
    // check async
    this.checkConnection().catch(console.error);

    /**
     * In every request GitHub will provide the rate limits in the API response headers
     * ref https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28
     */
    this.#octokit.hook.wrap('request', async (request, options) => {
      const response = await request(options);

      // capture the remaining (The number of requests remaining in the current rate limit window)
      if (response.headers['x-ratelimit-remaining']) {
        this.#remaining = parseInt(response.headers['x-ratelimit-remaining'], 10);
      }

      // capture the reset (The time at which the current rate limit window resets, in UTC epoch seconds)
      if (response.headers['x-ratelimit-reset']) {
        this.#reset = parseInt(response.headers['x-ratelimit-reset'], 10) * 1000;
      }

      return response;
    });
  }

  protected async checkConnection(): Promise<void> {
    try {
      // Let's get the rate limit
      const { data } = await this.getRateLimit();
      this.#remaining = data.rate.remaining;
      this.#reset = data.rate.reset * 1000;
    } catch (err: unknown) {
      console.error('Something went wrong while trying to get rate limit', err);
      // set reset to one hour and remaining to zero
      this.#reset = new Date().getTime() + 60 * 60 * 1000;
      this.#remaining = 0;
    }
  }

  protected getRateLimit(): Promise<RateLimit> {
    return this.#octokit.rateLimit.get();
  }

  dispose(): void {
    this.#controller.abort('disposing github client');
    this.#reset = undefined;
    this.#remaining = undefined;
  }
}
