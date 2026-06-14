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

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import {
  getPrototypeInstalledDemos,
  PROTOTYPE_INSTALLED_DEMO_PREFIX,
  setPrototypeInstalledDemosEnabled,
} from './extension-prototype-installed-demos';
import { ExtensionsUtils } from './extensions-utils';

describe('prototype installed demos', () => {
  const extensionsUtils = new ExtensionsUtils();

  afterEach(() => {
    setPrototypeInstalledDemosEnabled(true);
  });

  test('includes all origin and lifecycle variants', () => {
    const demos = getPrototypeInstalledDemos();
    expect(demos.length).toBeGreaterThanOrEqual(8);
    expect(demos.some(demo => demo.type === 'dd')).toBe(true);
    expect(demos.some(demo => demo.devMode)).toBe(true);
    expect(demos.some(demo => !demo.removable)).toBe(true);
    expect(demos.some(demo => demo.state === 'failed' && demo.error?.message)).toBe(true);
    expect(demos.every(demo => demo.id.startsWith(PROTOTYPE_INSTALLED_DEMO_PREFIX))).toBe(true);
  });

  test('mergePrototypeInstalledDemos appends demos once', () => {
    setPrototypeInstalledDemosEnabled(true);
    const existing: CombinedExtensionInfoUI = {
      type: 'pd',
      id: 'real-extension',
      name: 'real',
      displayName: 'Real Extension',
      description: 'Real',
      publisher: 'Publisher',
      removable: true,
      devMode: false,
      version: '1.0.0',
      state: 'started',
      path: '',
      readme: '',
    };

    const mergedOnce = extensionsUtils.mergePrototypeInstalledDemos([existing]);
    const mergedTwice = extensionsUtils.mergePrototypeInstalledDemos(mergedOnce);

    expect(mergedOnce.length).toBe(getPrototypeInstalledDemos().length + 1);
    expect(mergedTwice.length).toBe(mergedOnce.length);
  });
});
