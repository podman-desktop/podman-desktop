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

import { beforeEach, expect, test, vi } from 'vitest';

import {
  markExtensionUserDisabled,
  markExtensionUserEnabled,
  resetExtensionLifecycleUserTogglesForTests,
} from '/@/lib/extensions/extension-lifecycle-user-toggle';
import { areExtensionsImprovementsSuggested } from '/@/lib/extensions/extensions-prototype-scope';

vi.mock(import('/@/lib/extensions/extensions-prototype-scope'), () => ({
  areExtensionsImprovementsSuggested: vi.fn(() => true),
}));

const { shouldHideExtensionNavigationItem } = await import('./navigation-registry-extension.svelte');

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(true);
  resetExtensionLifecycleUserTogglesForTests();
});

test('does not hide when suggestion scope is off', () => {
  vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(false);
  markExtensionUserDisabled('podman-desktop.ai-lab');

  expect(shouldHideExtensionNavigationItem('podman-desktop.ai-lab')).toBe(false);
});

test('hides when the extension was user-disabled', () => {
  markExtensionUserDisabled('podman-desktop.ai-lab');

  expect(shouldHideExtensionNavigationItem('podman-desktop.ai-lab')).toBe(true);
});

test('hides when nav id matches a user-disabled runtime id loosely', () => {
  markExtensionUserDisabled('podman-desktop.ai-lab');

  expect(shouldHideExtensionNavigationItem('ai-lab')).toBe(true);
});

test('shows again after the extension is user-enabled', () => {
  markExtensionUserDisabled('podman-desktop.ai-lab');
  markExtensionUserEnabled('podman-desktop.ai-lab');

  expect(shouldHideExtensionNavigationItem('podman-desktop.ai-lab')).toBe(false);
});

test('does not hide active extensions', () => {
  expect(shouldHideExtensionNavigationItem('podman-desktop.compose')).toBe(false);
});
