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
 *********************************************************************/

import { describe, expect, test } from 'vitest';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  canRemoveExtensionFromPreferences,
  getExtensionRemoveBlockedReason,
  getExtensionRemoveBlockedReasonShort,
  getExtensionRemovePreferenceDetail,
} from './extension-remove-preference';

describe('extension-remove-preference', () => {
  test('always returns a specific blocked reason when removal is disabled', () => {
    const builtIn = {
      id: 'podman-desktop.compose',
      displayName: 'Compose',
      fetchable: false,
      installedExtension: {
        id: 'podman-desktop.compose',
        removable: false,
        devMode: false,
        type: 'pd',
      },
    } as CatalogExtensionInfoUI;

    const bundled = {
      id: 'podman-desktop.kind',
      displayName: 'Kind',
      fetchable: false,
      installedExtension: {
        id: 'podman-desktop.kind',
        removable: false,
        devMode: false,
        type: 'pd',
      },
    } as CatalogExtensionInfoUI;

    const removable = {
      id: 'podman-desktop.quadlet',
      displayName: 'Podman Quadlet',
      fetchable: true,
      installedExtension: {
        id: 'podman-desktop.quadlet',
        removable: true,
        devMode: false,
        type: 'pd',
      },
    } as CatalogExtensionInfoUI;

    expect(getExtensionRemoveBlockedReason(builtIn)).toContain('Built-in extensions');
    expect(getExtensionRemoveBlockedReason(bundled)).toBe('Bundled with Podman Desktop and cannot be uninstalled');
    expect(getExtensionRemoveBlockedReasonShort(bundled)).toBe('Bundled extension cannot be uninstalled');
    expect(getExtensionRemoveBlockedReasonShort(builtIn)).toBe('Built-in extension cannot be uninstalled');
    expect(getExtensionRemoveBlockedReason(removable)).toBeUndefined();
    expect(getExtensionRemovePreferenceDetail(removable)).toContain('Permanently uninstall Podman Quadlet');
    expect(canRemoveExtensionFromPreferences(removable)).toBe(true);
  });
});
