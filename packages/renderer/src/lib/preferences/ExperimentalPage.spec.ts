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

import '@testing-library/jest-dom/vitest';

import { fireEvent, render } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import ExperimentalPage from '/@/lib/preferences/ExperimentalPage.svelte';
import { CONFIGURATION_DEFAULT_SCOPE } from '/@api/configuration/constants';
import type { IConfigurationPropertyRecordedSchema } from '/@api/configuration/models';

beforeEach(() => {
  vi.resetAllMocks();
  // mock false by default
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);
});

const DUMMY_CONFIG: IConfigurationPropertyRecordedSchema = {
  id: 'dummy-config',
  title: 'Dummy Config',
  default: false,
  parentId: 'preferences.potatoes',
  type: 'boolean',
  scope: CONFIGURATION_DEFAULT_SCOPE,
};

const EXPERIMENTAL_CONFIG: IConfigurationPropertyRecordedSchema = {
  id: 'dummy-experimental-config',
  title: 'Dummy Experimental Config',
  default: false,
  parentId: 'preferences.potatoes',
  type: 'boolean',
  scope: CONFIGURATION_DEFAULT_SCOPE,
  experimental: {
    githubDiscussionLink: '',
  },
};

test('only experimental configuration should be displayed', async () => {
  const { queryByText } = render(ExperimentalPage, {
    properties: [DUMMY_CONFIG, EXPERIMENTAL_CONFIG],
  });

  await vi.waitFor(() => {
    expect(queryByText(DUMMY_CONFIG.title)).toBeNull();
    expect(queryByText(EXPERIMENTAL_CONFIG.title)).toBeDefined();
  });
});

test('Enable all should update all configuration', async () => {
  const generated: IConfigurationPropertyRecordedSchema[] = Array.from({ length: 10 }, (_, index) => ({
    ...EXPERIMENTAL_CONFIG,
    title: `Config ${index}`,
    id: `dummy-${index}`,
  }));

  const { container } = render(ExperimentalPage, {
    properties: generated,
  });

  // Get the input element
  const enableAll: HTMLInputElement = await vi.waitFor(() => {
    const enableAll = container.querySelector('#input-experimental-enable-all');
    expect(enableAll).toBeInstanceOf(HTMLInputElement);
    expect(enableAll).not.toBeChecked();
    return enableAll as HTMLInputElement;
  });

  // the component should have used the getInitialValue on each property
  for (const configuration of generated) {
    expect(window.getConfigurationValue).toHaveBeenCalledWith(configuration.id, configuration.scope);
  }

  // let's check the box
  await fireEvent.click(enableAll);

  await vi.waitFor(() => {
    for (const configuration of generated) {
      expect(window.updateConfigurationValue).toHaveBeenCalledWith(configuration.id, true, configuration.scope);
    }
  });
});

test('all value checked should check the enable all', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  const { container } = render(ExperimentalPage, {
    properties: [EXPERIMENTAL_CONFIG],
  });

  // Get the input element
  const enableAll: HTMLInputElement = await vi.waitFor(() => {
    const enableAll = container.querySelector('#input-experimental-enable-all');
    expect(enableAll).toBeInstanceOf(HTMLInputElement);
    return enableAll as HTMLInputElement;
  });

  expect(window.getConfigurationValue).toHaveBeenCalledWith(EXPERIMENTAL_CONFIG.id, EXPERIMENTAL_CONFIG.scope);

  await vi.waitFor(() => {
    expect(enableAll).toBeChecked();
  });
});
