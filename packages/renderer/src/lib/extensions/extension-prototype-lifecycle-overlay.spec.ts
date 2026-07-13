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

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import {
  markExtensionUserDisabled,
  markExtensionUserEnabled,
  resetExtensionLifecycleUserTogglesForTests,
} from './extension-lifecycle-user-toggle';
import {
  isPrototypeActivatingOverlayActive,
  PROTOTYPE_TRANSIENT_LIFECYCLE_MS,
  resetPrototypeLifecycleOverlaysForTests,
  setPrototypeLifecycleDemosEnabled,
  startPrototypeActivatingTransient,
  startPrototypeDisablingTransient,
} from './extension-prototype-lifecycle-overlay.svelte';
import {
  applyPrototypeUseCaseOverlays,
  setPrototypeUseCasesEnabled,
  USE_CASE_EXTENSION_IDS,
} from './extension-prototype-use-cases';

describe('prototype lifecycle overlay', () => {
  const kubectl: CombinedExtensionInfoUI = {
    type: 'pd',
    id: USE_CASE_EXTENSION_IDS.activating,
    name: 'kubectl-cli',
    displayName: 'kubectl CLI',
    description: 'kubectl CLI',
    publisher: 'podman-desktop',
    removable: true,
    devMode: false,
    version: '1.0.0',
    state: 'started',
    path: '',
    readme: '',
  };

  const registries: CombinedExtensionInfoUI = {
    type: 'pd',
    id: USE_CASE_EXTENSION_IDS.communityDisabled,
    name: 'registries',
    displayName: 'Registries',
    description: 'Registries',
    publisher: 'podman-desktop',
    removable: true,
    devMode: false,
    version: '1.0.0',
    state: 'started',
    path: '',
    readme: '',
  };

  beforeEach(() => {
    vi.useFakeTimers();
    setPrototypeUseCasesEnabled(false);
    resetPrototypeLifecycleOverlaysForTests();
    resetExtensionLifecycleUserTogglesForTests();
    setPrototypeLifecycleDemosEnabled(true);
  });

  afterEach(() => {
    resetPrototypeLifecycleOverlaysForTests();
    resetExtensionLifecycleUserTogglesForTests();
    setPrototypeLifecycleDemosEnabled(false);
    setPrototypeUseCasesEnabled(false);
    vi.useRealTimers();
  });

  test('shows activating state for three seconds then returns to active', async () => {
    setPrototypeUseCasesEnabled(true);

    let [overlay] = applyPrototypeUseCaseOverlays([kubectl]);
    expect(overlay.state).toBe('starting');
    expect(isPrototypeActivatingOverlayActive()).toBe(true);

    await vi.advanceTimersByTimeAsync(PROTOTYPE_TRANSIENT_LIFECYCLE_MS);

    [overlay] = applyPrototypeUseCaseOverlays([kubectl]);
    expect(overlay.state).toBe('started');
    expect(isPrototypeActivatingOverlayActive()).toBe(false);
  });

  test('shows activating for three seconds when enabling from disabled', async () => {
    setPrototypeUseCasesEnabled(true);
    markExtensionUserDisabled(registries.id);

    let [overlay] = applyPrototypeUseCaseOverlays([registries]);
    expect(overlay.state).toBe('stopping');

    await vi.advanceTimersByTimeAsync(PROTOTYPE_TRANSIENT_LIFECYCLE_MS);
    [overlay] = applyPrototypeUseCaseOverlays([registries]);
    expect(overlay.state).toBe('stopped');

    markExtensionUserEnabled(registries.id);
    [overlay] = applyPrototypeUseCaseOverlays([registries]);
    expect(overlay.state).toBe('starting');

    await vi.advanceTimersByTimeAsync(PROTOTYPE_TRANSIENT_LIFECYCLE_MS);
    [overlay] = applyPrototypeUseCaseOverlays([registries]);
    expect(overlay.state).toBe('started');
  });

  test('shows disabling for three seconds when disabling from active', async () => {
    setPrototypeUseCasesEnabled(true);

    markExtensionUserDisabled(registries.id);

    let [overlay] = applyPrototypeUseCaseOverlays([registries]);
    expect(overlay.state).toBe('stopping');

    await vi.advanceTimersByTimeAsync(PROTOTYPE_TRANSIENT_LIFECYCLE_MS);
    [overlay] = applyPrototypeUseCaseOverlays([registries]);
    expect(overlay.state).toBe('stopped');
  });

  test('restarts activating demo when overlay is restarted', async () => {
    setPrototypeUseCasesEnabled(true);

    let [overlay] = applyPrototypeUseCaseOverlays([kubectl]);
    expect(overlay.state).toBe('starting');

    await vi.advanceTimersByTimeAsync(PROTOTYPE_TRANSIENT_LIFECYCLE_MS);
    [overlay] = applyPrototypeUseCaseOverlays([kubectl]);
    expect(overlay.state).toBe('started');

    startPrototypeActivatingTransient(kubectl.id);
    [overlay] = applyPrototypeUseCaseOverlays([kubectl]);
    expect(overlay.state).toBe('starting');
  });

  test('can start disabling transient directly', () => {
    setPrototypeUseCasesEnabled(true);
    startPrototypeDisablingTransient(registries.id);

    const [overlay] = applyPrototypeUseCaseOverlays([registries]);
    expect(overlay.state).toBe('stopping');
  });
});
