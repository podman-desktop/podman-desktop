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

import type { ExtensionCompatibilityIssue } from './extension-compatibility';
import {
  getExtensionCompatibilityPresentation,
  getExtensionLifecyclePresentation,
  getExtensionVersionUpdatePresentation,
} from './extension-lifecycle-status';

describe('getExtensionLifecyclePresentation', () => {
  test('version update uses neutral upgrading presentation', () => {
    expect(getExtensionVersionUpdatePresentation()).toEqual({
      statusDotStatus: 'stopped',
      label: 'Upgrading',
      textColorVar: 'var(--pd-status-stopped)',
    });
  });

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

describe('getExtensionCompatibilityPresentation', () => {
  test('incompatible version uses warning presentation', () => {
    const issue: ExtensionCompatibilityIssue = {
      type: 'incompatible-version',
      title: 'Incompatible with this Podman Desktop version',
      detail: 'Requires v99.0.0',
      fix: 'Upgrade Podman Desktop to v99.0.0 or later.',
    };
    expect(getExtensionCompatibilityPresentation(issue)).toEqual({
      statusDotStatus: 'degraded',
      label: 'Incompatible',
      textColorVar: 'var(--pd-state-warning)',
    });
  });

  test('missing dependency uses warning presentation', () => {
    const issue: ExtensionCompatibilityIssue = {
      type: 'missing-dependency',
      title: 'Missing required extension',
      detail: 'Requires minikube',
      fix: 'Install the minikube extension from the catalog.',
    };
    expect(getExtensionCompatibilityPresentation(issue)).toEqual({
      statusDotStatus: 'degraded',
      label: 'Missing dependency',
      textColorVar: 'var(--pd-state-warning)',
    });
  });
});
