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

import { get } from 'svelte/store';
import { expect, test, vi } from 'vitest';

import { configurationProperties } from './configurationProperties';
import { isKubernetesExperimentalModeStore } from './kubernetes-experimental';

test('experimental mode is set', async () => {
  vi.mocked(window.getConfigurationValue).mockImplementation(async () => {
    return true;
  });
  configurationProperties.set([]);
  await vi.waitFor(() => {
    const result = get(isKubernetesExperimentalModeStore);
    expect(result).toEqual(true);
  });
});

test('experimental mode is set to false', async () => {
  vi.mocked(window.getConfigurationValue).mockImplementation(async () => {
    return false;
  });
  configurationProperties.set([]);
  await vi.waitFor(() => {
    const result = get(isKubernetesExperimentalModeStore);
    expect(result).toEqual(false);
  });
});

test('experimental mode is not defined', async () => {
  vi.mocked(window.getConfigurationValue).mockRejectedValue(new Error('an error'));
  configurationProperties.set([]);
  await vi.waitFor(() => {
    const result = get(isKubernetesExperimentalModeStore);
    expect(result).toEqual(false);
  });
});
