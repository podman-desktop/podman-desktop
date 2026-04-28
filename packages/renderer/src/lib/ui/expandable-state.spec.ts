/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import { render, waitFor } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import { onDidChangeConfiguration } from '/@/stores/configurationProperties';

import ExpandableStateTest from './ExpandableStateTest.svelte';

const CONFIG_KEY = 'test.expanded';

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  vi.mocked(window.updateConfigurationValue).mockResolvedValue(undefined);
});

test('initialized defaults to false and becomes true after mount', async () => {
  const { getByTestId } = render(ExpandableStateTest, { configKey: CONFIG_KEY });

  await waitFor(() => expect(getByTestId('initialized')).toHaveTextContent('true'));
});

test.each([
  { configValue: undefined, expected: 'true', description: 'defaults to true when no config value is set' },
  { configValue: false, expected: 'false', description: 'reflects false from getConfigurationValue' },
  { configValue: true, expected: 'true', description: 'reflects true from getConfigurationValue' },
])('expanded $description', async ({ configValue, expected }) => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(configValue);

  const { getByTestId } = render(ExpandableStateTest, { configKey: CONFIG_KEY });

  await waitFor(() => expect(getByTestId('initialized')).toHaveTextContent('true'));
  expect(getByTestId('expanded')).toHaveTextContent(expected);
});

test('getConfigurationValue is called with the correct key on mount', async () => {
  render(ExpandableStateTest, { configKey: CONFIG_KEY });

  await waitFor(() => expect(window.getConfigurationValue).toHaveBeenCalledWith(CONFIG_KEY));
});

test('toggle calls updateConfigurationValue with correct key and value', async () => {
  const { getByRole } = render(ExpandableStateTest, { configKey: CONFIG_KEY });

  await waitFor(() => expect(window.getConfigurationValue).toHaveBeenCalled());

  const button = getByRole('button', { name: 'toggle' });
  button.click();

  await waitFor(() => expect(window.updateConfigurationValue).toHaveBeenCalledWith(CONFIG_KEY, false));
});

test.each([
  {
    description: 'updates when configuration change event is fired',
    event: new CustomEvent(CONFIG_KEY, { detail: { key: CONFIG_KEY, value: false } }),
    expected: 'false',
  },
  {
    description: 'does not change when event has no detail property',
    event: new Event(CONFIG_KEY),
    expected: 'true',
  },
  {
    description: 'does not change when event key does not match',
    event: new CustomEvent(CONFIG_KEY, { detail: { key: 'other.key', value: false } }),
    expected: 'true',
  },
])('expanded state $description', async ({ event, expected }) => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  const { getByTestId } = render(ExpandableStateTest, { configKey: CONFIG_KEY });

  await waitFor(() => expect(getByTestId('expanded')).toHaveTextContent('true'));

  onDidChangeConfiguration.dispatchEvent(event);

  await waitFor(() => expect(getByTestId('expanded')).toHaveTextContent(expected));
});

test('event listener is removed on destroy', async () => {
  const removeEventListenerSpy = vi.spyOn(onDidChangeConfiguration, 'removeEventListener');

  const { unmount } = render(ExpandableStateTest, { configKey: CONFIG_KEY });

  await waitFor(() => expect(window.getConfigurationValue).toHaveBeenCalled());

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith(CONFIG_KEY, expect.any(Function));
});
