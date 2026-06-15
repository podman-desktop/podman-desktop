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

import {
  EXTENSION_POST_INSTALL_LOCATIONS,
  resolveExtensionPostInstallLocation,
} from './extension-post-install-locations';

describe('extension-post-install-locations', () => {
  test('maps Kind to Kubernetes', () => {
    const location = resolveExtensionPostInstallLocation('podman-desktop.kind');
    expect(location).toEqual(EXTENSION_POST_INSTALL_LOCATIONS['podman-desktop.kind']);
    expect(location?.link).toBe('/kubernetes');
    expect(location?.tooltip).toContain('Kubernetes');
  });

  test('maps Compose to Settings', () => {
    const location = resolveExtensionPostInstallLocation('podman-desktop.compose');
    expect(location?.link).toBe('/preferences');
    expect(location?.navLabel).toBe('Settings');
  });

  test('returns undefined for unknown extensions', () => {
    expect(resolveExtensionPostInstallLocation('unknown.extension')).toBeUndefined();
  });
});
