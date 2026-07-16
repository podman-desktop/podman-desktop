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

import { afterEach, describe, expect, test } from 'vitest';

import { getExtensionEffectiveLifecycleState } from './extension-effective-lifecycle-state';
import {
  markExtensionUserDisabled,
  markExtensionUserEnabled,
  resetExtensionLifecycleUserTogglesForTests,
} from './extension-lifecycle-user-toggle';
import {
  resetPrototypeLifecycleOverlaysForTests,
  setPrototypeLifecycleDemosEnabled,
} from './extension-prototype-lifecycle-overlay.svelte';

describe('getExtensionEffectiveLifecycleState', () => {
  afterEach(() => {
    resetExtensionLifecycleUserTogglesForTests();
    resetPrototypeLifecycleOverlaysForTests();
    setPrototypeLifecycleDemosEnabled(false);
  });

  test('returns Disabling (stopping) while disable transient is active', () => {
    setPrototypeLifecycleDemosEnabled(true);
    markExtensionUserDisabled('podman-desktop.kubernetes-dashboard');
    expect(getExtensionEffectiveLifecycleState('podman-desktop.kubernetes-dashboard', 'started')).toBe('stopping');
  });

  test('returns Enabling (starting) while enable transient is active', () => {
    setPrototypeLifecycleDemosEnabled(true);
    markExtensionUserEnabled('podman-desktop.kubernetes-dashboard');
    expect(getExtensionEffectiveLifecycleState('podman-desktop.kubernetes-dashboard', 'stopped')).toBe('starting');
  });

  test('returns stopped after disable when demos are off', () => {
    setPrototypeLifecycleDemosEnabled(false);
    markExtensionUserDisabled('podman-desktop.kubernetes-dashboard');
    expect(getExtensionEffectiveLifecycleState('podman-desktop.kubernetes-dashboard', 'started')).toBe('stopped');
  });
});
