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

import ExpandableStateTest from './ExpandableStateTest.svelte';

vi.mock(import('/@/stores/configurationProperties'));

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

test('expanded defaults to true when no config value is set', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(undefined);

  const { getByTestId } = render(ExpandableStateTest, { configKey: CONFIG_KEY });

  await waitFor(() => expect(getByTestId('initialized')).toHaveTextContent('true'));
  expect(getByTestId('expanded')).toHaveTextContent('true');
});

test('expanded reflects the value returned from getConfigurationValue', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);

  const { getByTestId } = render(ExpandableStateTest, { configKey: CONFIG_KEY });

  await waitFor(() => expect(getByTestId('initialized')).toHaveTextContent('true'));
  expect(getByTestId('expanded')).toHaveTextContent('false');
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

test('expanded state updates when configuration change event is fired', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  const { getByTestId } = render(ExpandableStateTest, { configKey: CONFIG_KEY });

  await waitFor(() => expect(getByTestId('expanded')).toHaveTextContent('true'));

  // Simulate a configuration change event
  const { onDidChangeConfiguration } = await import('/@/stores/configurationProperties');
  onDidChangeConfiguration.dispatchEvent(new CustomEvent(CONFIG_KEY, { detail: { key: CONFIG_KEY, value: false } }));

  await waitFor(() => expect(getByTestId('expanded')).toHaveTextContent('false'));
});

test('expanded state does not change when event has no detail property', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  const { getByTestId } = render(ExpandableStateTest, { configKey: CONFIG_KEY });

  await waitFor(() => expect(getByTestId('expanded')).toHaveTextContent('true'));

  const { onDidChangeConfiguration } = await import('/@/stores/configurationProperties');
  // Dispatch an event without a detail property
  onDidChangeConfiguration.dispatchEvent(new Event(CONFIG_KEY));

  // State should remain unchanged
  expect(getByTestId('expanded')).toHaveTextContent('true');
});

test('expanded state does not change when event key does not match', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  const { getByTestId } = render(ExpandableStateTest, { configKey: CONFIG_KEY });

  await waitFor(() => expect(getByTestId('expanded')).toHaveTextContent('true'));

  const { onDidChangeConfiguration } = await import('/@/stores/configurationProperties');
  // Dispatch an event with a different key
  onDidChangeConfiguration.dispatchEvent(new CustomEvent(CONFIG_KEY, { detail: { key: 'other.key', value: false } }));

  // State should remain unchanged
  expect(getByTestId('expanded')).toHaveTextContent('true');
});

test('event listener is removed on destroy', async () => {
  const { onDidChangeConfiguration } = await import('/@/stores/configurationProperties');
  const removeEventListenerSpy = vi.spyOn(onDidChangeConfiguration, 'removeEventListener');

  const { unmount } = render(ExpandableStateTest, { configKey: CONFIG_KEY });

  await waitFor(() => expect(window.getConfigurationValue).toHaveBeenCalled());

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith(CONFIG_KEY, expect.any(Function));
});
