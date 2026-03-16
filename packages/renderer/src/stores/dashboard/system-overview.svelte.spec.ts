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

import type { ProviderContainerConnectionInfo, ProviderKubernetesConnectionInfo } from '@podman-desktop/core-api';
import { describe, expect, test } from 'vitest';

import { getConnectionDisplayName, getSystemOverviewStatus, SYSTEM_OVERVIEW_STATUS } from './system-overview.svelte';

describe('getSystemOverviewStatus', () => {
  test('should return healthy for started', () => {
    expect(getSystemOverviewStatus('started')).toEqual(SYSTEM_OVERVIEW_STATUS.healthy);
  });

  test('should return stable for stopped', () => {
    expect(getSystemOverviewStatus('stopped')).toEqual(SYSTEM_OVERVIEW_STATUS.stable);
  });

  test('should return critical for unknown', () => {
    expect(getSystemOverviewStatus('unknown')).toEqual(SYSTEM_OVERVIEW_STATUS.critical);
  });

  test('should return progressing for starting', () => {
    expect(getSystemOverviewStatus('starting')).toEqual(SYSTEM_OVERVIEW_STATUS.progressing);
  });

  test('should return progressing for stopping', () => {
    expect(getSystemOverviewStatus('stopping')).toEqual(SYSTEM_OVERVIEW_STATUS.progressing);
  });
});

describe('getConnectionDisplayName', () => {
  test('should return displayName for container connection when set', () => {
    const connection = {
      connectionType: 'container',
      name: 'podman-machine',
      displayName: 'Podman Machine',
    } as unknown as ProviderContainerConnectionInfo;
    expect(getConnectionDisplayName(connection)).toBe('Podman Machine');
  });

  test('should return name for container connection when displayName is undefined', () => {
    const connection = {
      connectionType: 'container',
      name: 'podman-machine',
    } as unknown as ProviderContainerConnectionInfo;
    expect(getConnectionDisplayName(connection)).toBe('podman-machine');
  });

  test('should return name for non-container connection', () => {
    const connection = {
      connectionType: 'kubernetes',
      name: 'minikube',
    } as unknown as ProviderKubernetesConnectionInfo;
    expect(getConnectionDisplayName(connection)).toBe('minikube');
  });
});
