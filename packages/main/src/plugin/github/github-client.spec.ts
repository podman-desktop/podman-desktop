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

import { afterEach, assert, beforeEach, describe, expect, test, vi } from 'vitest';

import { GithubClient } from '/@/plugin/github/github-client.js';

const FETCH_MOCK: typeof fetch = vi.fn();

// let's mock a timestamp in ONE hour
const RESET_TIMESTAMP = new Date().getTime() / 1000 + 60 * 60;

const BODY_RATE_LIMIT_BELOW: unknown = {
  resources: {
    // omitted
  },
  rate: {
    limit: 60,
    remaining: 57,
    reset: RESET_TIMESTAMP,
  },
};

const BODY_RATE_LIMIT_ABOVE: unknown = {
  resources: {
    // omitted
  },
  rate: {
    limit: 60,
    remaining: 0,
    reset: RESET_TIMESTAMP,
  },
};

const RESPONSE_RATE_LIMIT_BELOW: Response = {
  url: 'https://api.github.com/rate_limit',
  status: 200,
  headers: new Headers({
    'content-type': 'application/json; charset=utf-8',
    'x-ratelimit-remaining': '57',
    'x-ratelimit-reset': `${RESET_TIMESTAMP}`,
  }),
  text: () => Promise.resolve(JSON.stringify(BODY_RATE_LIMIT_BELOW)),
} as unknown as Response;

const RESPONSE_RATE_LIMIT_ABOVE: Response = {
  url: 'https://api.github.com/rate_limit',
  status: 200,
  headers: new Headers({
    'content-type': 'application/json; charset=utf-8',
    'x-ratelimit-remaining': '0',
    'x-ratelimit-reset': `${RESET_TIMESTAMP}`,
  }),
  text: () => Promise.resolve(JSON.stringify(BODY_RATE_LIMIT_ABOVE)),
} as unknown as Response;

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers();
  vi.mocked(FETCH_MOCK).mockResolvedValue(RESPONSE_RATE_LIMIT_BELOW);
});

afterEach(() => {
  vi.useRealTimers();
});

function getClient(): GithubClient {
  return new GithubClient({
    fetch: FETCH_MOCK,
  });
}

test('client not initialized should not be ready', () => {
  const client = getClient();
  expect(client.ready).toBeFalsy();
});

test('trying to use octokit on non-ready will throw an error', () => {
  const client = getClient();
  expect(() => {
    client.octokit.log.info('dummy');
  }).toThrowError('cannot use GitHub client: rate limit reached');
});

test('rate limit bellow should enable client', async () => {
  const client = getClient();
  client.init();

  await vi.waitFor(() => {
    expect(client.ready).toBeFalsy();
  });
});

test('init should check rate limits', async () => {
  const client = getClient();
  client.init();

  await vi.waitFor(() => {
    expect(FETCH_MOCK).toHaveBeenCalledWith('https://api.github.com/rate_limit', expect.anything());
  });
});

test('fetch error during init should disable for one hour the client', async () => {
  vi.mocked(FETCH_MOCK).mockRejectedValue(new Error('something went wrong'));

  const client = getClient();
  client.init();

  await vi.waitFor(() => {
    expect(FETCH_MOCK).toHaveBeenCalledOnce();
  });

  expect(client.ready).toBeFalsy();
  await vi.advanceTimersByTimeAsync(61 * 60 * 1000);

  await vi.waitFor(() => {
    expect(client.ready).toBeTruthy();
  });
});

describe('abort controller', () => {
  test('octokit should provide fetch an abort signal', async () => {
    const client = getClient();
    client.init();

    await vi.waitFor(() => {
      expect(FETCH_MOCK).toHaveBeenCalledOnce();
      const init = vi.mocked(FETCH_MOCK).mock.calls[0]?.[1];
      expect(init?.signal).toBeDefined();
    });
  });

  test('disposing the client should abort signal provided to fetch', async () => {
    const client = getClient();
    client.init();

    const call: RequestInit = await vi.waitFor(() => {
      expect(FETCH_MOCK).toHaveBeenCalledOnce();
      const init = vi.mocked(FETCH_MOCK).mock.calls[0]?.[1];
      assert(init, 'fetch should receive request init with an abort controller');
      return init;
    });

    expect(call.signal).toBeDefined();
    expect(call.signal?.aborted).toBeFalsy();

    client.dispose();

    expect(call.signal?.aborted).toBeTruthy();
  });
});

test('rate limit reached should make client not ready', async () => {
  vi.mocked(FETCH_MOCK).mockResolvedValue(RESPONSE_RATE_LIMIT_ABOVE);

  const client = getClient();
  client.init();

  await vi.waitFor(() => {
    expect(client.ready).toBeFalsy();
  });
});

test('should should register octokit hook', async () => {
  vi.mocked(FETCH_MOCK).mockResolvedValue(RESPONSE_RATE_LIMIT_BELOW);

  const client = getClient();
  client.init();

  await vi.waitFor(() => {
    expect(client.ready).toBeTruthy();
    expect(FETCH_MOCK).toHaveBeenCalledOnce();
  });

  // let's mock another call, with rate limit reached
  vi.mocked(FETCH_MOCK).mockResolvedValue(RESPONSE_RATE_LIMIT_ABOVE);
  // don't worry: we do not make external call, we provided a mocked fetch
  await client.octokit.rest.repos.get({
    owner: 'podman-desktop',
    repo: 'podman-desktop',
  });

  await vi.waitFor(() => {
    expect(client.ready).toBeFalsy();
    expect(FETCH_MOCK).toHaveBeenCalledTimes(2);
    expect(FETCH_MOCK).toHaveBeenCalledWith(
      'https://api.github.com/repos/podman-desktop/podman-desktop',
      expect.anything(),
    );
  });
});
