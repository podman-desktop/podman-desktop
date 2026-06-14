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

import { describe, expect, test } from 'vitest';

import { isExtensionLifecycleActive, resolveExtensionLifecycleWarnings } from './extension-lifecycle-warning';

describe('isExtensionLifecycleActive', () => {
  test('docker desktop extensions are always active', () => {
    expect(isExtensionLifecycleActive('stopped', 'dd')).toBe(true);
  });

  test('started podman desktop extension is active', () => {
    expect(isExtensionLifecycleActive('started', 'pd')).toBe(true);
  });

  test('non-started podman desktop extensions are not active', () => {
    expect(isExtensionLifecycleActive('stopped', 'pd')).toBe(false);
    expect(isExtensionLifecycleActive('failed', 'pd')).toBe(false);
    expect(isExtensionLifecycleActive('starting', 'pd')).toBe(false);
    expect(isExtensionLifecycleActive('stopping', 'pd')).toBe(false);
  });
});

describe('resolveExtensionLifecycleWarnings', () => {
  test('returns no warnings for active extensions', () => {
    expect(
      resolveExtensionLifecycleWarnings({
        state: 'started',
        type: 'pd',
        displayName: 'Compose',
      }),
    ).toEqual([]);
  });

  test('warns when extension is disabled with reactivate guidance', () => {
    const warnings = resolveExtensionLifecycleWarnings({
      state: 'stopped',
      type: 'pd',
      displayName: 'Registries',
    });

    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.title).toBe('Extension is disabled');
    expect(warnings[0]?.fix).toContain('Reactivate');
  });

  test('warns when extension failed and includes error detail', () => {
    const warnings = resolveExtensionLifecycleWarnings({
      state: 'failed',
      type: 'pd',
      displayName: 'Kube Context',
      error: { message: 'Connection timeout' },
    });

    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.severity).toBe('error');
    expect(warnings[0]?.detail).toContain('Connection timeout');
    expect(warnings[0]?.fix).toContain('Error tab');
  });

  test('warns when extension is activating', () => {
    const warnings = resolveExtensionLifecycleWarnings({
      state: 'starting',
      type: 'pd',
      displayName: 'kubectl CLI',
    });

    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.title).toBe('Extension is activating');
  });

  test('warns when extension is disabling', () => {
    const warnings = resolveExtensionLifecycleWarnings({
      state: 'stopping',
      type: 'pd',
      displayName: 'Lima',
    });

    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.title).toBe('Extension is disabling');
  });
});
