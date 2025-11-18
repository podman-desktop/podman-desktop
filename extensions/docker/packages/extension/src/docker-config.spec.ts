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

import type { Configuration } from '@podman-desktop/api';
import { configuration } from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import { DockerConfig } from './docker-config.js';

beforeEach(() => {
  vi.resetAllMocks();
});

test('check default path if there is no config', async () => {
  // mock configuration.getConfiguration
  vi.mocked(configuration.getConfiguration).mockReturnValue({
    get: vi.fn(() => undefined),
  } as unknown as Configuration);

  const dockerConfig = new DockerConfig();
  const path = dockerConfig.getPath();
  expect(path).toBe(DockerConfig.DEFAULT_CONFIG_FOLDER);
});

test('check path if there is a config', async () => {
  const myFakeConfig = 'myCustomPath';

  // mock configuration.getConfiguration
  vi.mocked(configuration.getConfiguration).mockReturnValue({
    get: vi.fn(() => myFakeConfig),
  } as unknown as Configuration);

  const dockerConfig = new DockerConfig();
  const path = dockerConfig.getPath();
  expect(path).toBe(myFakeConfig);
});

test('check path is updated if the config changes', async () => {
  // mock configuration.getConfiguration with an undefined value
  vi.mocked(configuration.getConfiguration).mockReturnValue({
    get: vi.fn(() => undefined),
  } as unknown as Configuration);

  const dockerConfig = new DockerConfig();

  const path = dockerConfig.getPath();
  expect(path).toBe(DockerConfig.DEFAULT_CONFIG_FOLDER);

  // now change the value
  const differentValuePath = 'differentValue';
  vi.mocked(configuration.getConfiguration).mockReturnValue({
    get: vi.fn(() => differentValuePath),
  } as unknown as Configuration);

  // capture the callback sent to onDidChangeConfiguration
  // and call the data
  const callback = vi.mocked(configuration.onDidChangeConfiguration).mock.calls[0][0];
  // call the callback
  callback({ affectsConfiguration: vi.fn(() => true) });

  // check the new value is updated
  const newPath = dockerConfig.getPath();
  expect(newPath).toBe(differentValuePath);
});
