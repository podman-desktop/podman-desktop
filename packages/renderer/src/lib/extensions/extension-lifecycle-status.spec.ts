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

import { getExtensionLifecyclePresentation } from './extension-lifecycle-status';

describe('getExtensionLifecyclePresentation', () => {
  test('docker desktop extension is always active', () => {
    expect(getExtensionLifecyclePresentation('stopped', 'dd')).toEqual({
      statusDotStatus: 'running',
      label: 'Active',
      textColorVar: 'var(--pd-status-running)',
    });
  });

  test('started extension is active', () => {
    expect(getExtensionLifecyclePresentation('started', 'pd')).toEqual({
      statusDotStatus: 'running',
      label: 'Active',
      textColorVar: 'var(--pd-status-running)',
    });
  });

  test('stopped extension is disabled', () => {
    expect(getExtensionLifecyclePresentation('stopped', 'pd')).toEqual({
      statusDotStatus: 'stopped',
      label: 'Disabled',
      textColorVar: 'var(--pd-status-stopped)',
    });
  });

  test('starting extension is activating', () => {
    expect(getExtensionLifecyclePresentation('starting', 'pd')).toEqual({
      statusDotStatus: 'starting',
      label: 'Activating',
      textColorVar: 'var(--pd-status-starting)',
    });
  });

  test('stopping extension is disabling', () => {
    expect(getExtensionLifecyclePresentation('stopping', 'pd')).toEqual({
      statusDotStatus: 'waiting',
      label: 'Disabling',
      textColorVar: 'var(--pd-status-waiting)',
    });
  });

  test('failed extension is failed', () => {
    expect(getExtensionLifecyclePresentation('failed', 'pd')).toEqual({
      statusDotStatus: 'terminated',
      label: 'Failed',
      textColorVar: 'var(--pd-status-terminated)',
    });
  });
});
