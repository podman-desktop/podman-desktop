/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import type { Configuration } from '@podman-desktop/api';
import { configuration, context } from '@podman-desktop/api';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { DockerCompatibilitySetup } from './docker-compatibility-setup.js';
import type { DockerContextHandler } from './docker-context-handler.js';

const dockerContextHandler = {
  listContexts: vi.fn(),
  switchContext: vi.fn(),
} as unknown as DockerContextHandler;

class TestDockerCompatibilitySetup extends DockerCompatibilitySetup {
  async refreshContextList(): Promise<void> {
    return super.refreshContextList();
  }
}

let dockerCompatibilitySetup: TestDockerCompatibilitySetup;

const originalConsoleError = console.error;

beforeEach(() => {
  vi.resetAllMocks();
  console.error = vi.fn();
  dockerCompatibilitySetup = new TestDockerCompatibilitySetup(dockerContextHandler);
});

afterEach(() => {
  console.error = originalConsoleError;
});

test('check sending the docker cli contexts as context.setValue', async () => {
  // return a list of 2 contexts, second one being the current one
  vi.mocked(dockerContextHandler.listContexts).mockResolvedValue([
    {
      name: 'context1',
      metadata: {
        description: 'description1',
      },
      endpoints: {
        docker: {
          host: 'host1',
        },
      },
      isCurrentContext: false,
    },
    {
      name: 'context2',
      metadata: {
        description: 'description2',
      },
      endpoints: {
        docker: {
          host: 'host2',
        },
      },
      isCurrentContext: true,
    },
  ]);

  await dockerCompatibilitySetup.init();

  // check we called listContexts
  expect(dockerContextHandler.listContexts).toHaveBeenCalled();

  // check we called setValue with the expected values
  expect(context.setValue).toHaveBeenCalledWith(
    'docker.cli.context',
    [
      {
        label: 'context1 (host1)',
        selected: false,
        value: 'context1',
      },
      {
        label: 'context2 (host2)',
        selected: true,
        value: 'context2',
      },
    ],
    'DockerCompatibility',
  );
});

test('check set the context when configuration change', async () => {
  // empty list of context
  vi.mocked(dockerContextHandler.listContexts).mockResolvedValue([]);

  const spyRefreshContextList = vi.spyOn(dockerCompatibilitySetup, 'refreshContextList');

  await dockerCompatibilitySetup.init();

  // capture the callback sent to onDidChangeConfiguration
  const callback = vi.mocked(configuration.onDidChangeConfiguration).mock.calls[0][0];

  // mock configuration.getConfiguration
  vi.mocked(configuration.getConfiguration).mockReturnValue({
    get: vi.fn(() => 'context1'),
  } as unknown as Configuration);

  // mock switchContext
  vi.mocked(dockerContextHandler.switchContext).mockResolvedValue();

  // clear the refreshContextList call
  spyRefreshContextList.mockClear();

  // call the callback
  callback({ affectsConfiguration: vi.fn(() => true) });

  // check we called switchContext
  await vi.waitFor(() => expect(dockerContextHandler.switchContext).toHaveBeenCalledWith('context1'));

  // check we called the refreshContextList
  await vi.waitFor(() => expect(spyRefreshContextList).toHaveBeenCalled());
});

test('check set the context but switch context throw error', async () => {
  // empty list of context
  vi.mocked(dockerContextHandler.listContexts).mockResolvedValue([]);

  const spyRefreshContextList = vi.spyOn(dockerCompatibilitySetup, 'refreshContextList');
  await dockerCompatibilitySetup.init();

  // capture the callback sent to onDidChangeConfiguration
  const callback = vi.mocked(configuration.onDidChangeConfiguration).mock.calls[0][0];

  // mock configuration.getConfiguration
  vi.mocked(configuration.getConfiguration).mockReturnValue({
    get: vi.fn(() => 'context1'),
  } as unknown as Configuration);

  // mock switchContext
  vi.mocked(dockerContextHandler.switchContext).mockRejectedValue(new Error('error switching context'));

  spyRefreshContextList.mockClear();

  // call the callback
  callback({ affectsConfiguration: vi.fn(() => true) });

  // check we called switchContext
  await vi.waitFor(() => expect(dockerContextHandler.switchContext).toHaveBeenCalledWith('context1'));

  // check we called the refreshContextList
  expect(spyRefreshContextList).not.toHaveBeenCalled();

  // check we logged the error
  expect(console.error).toHaveBeenCalledWith('error while switching the context', expect.any(Error));
});
