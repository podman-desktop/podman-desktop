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

import type { ProviderConnectionStatus } from '@podman-desktop/api';
import type {
  ProviderConnectionInfo,
  ProviderContainerConnectionInfo,
  ProviderKubernetesConnectionInfo,
  SystemOverviewStatus,
} from '@podman-desktop/core-api';
import type { ButtonType } from '@podman-desktop/ui-svelte';
import { Buffer } from 'buffer';

import {
  type ConnectionCallback,
  eventCollect,
  registerConnectionCallback,
} from '/@/lib/preferences/preferences-connection-rendering-task';

const STATUS_TEXT_CLASS: Record<SystemOverviewStatus, string> = {
  healthy: 'text-[var(--pd-status-running)]',
  stable: 'text-[var(--pd-status-stopped)]',
  progressing: 'text-[var(--pd-status-starting)]',
  critical: 'text-[var(--pd-status-terminated)]',
};

const STATUS_BG_CLASS: Record<SystemOverviewStatus, string> = {
  healthy: 'bg-[var(--pd-status-running-bg)]',
  stable: 'bg-[var(--pd-status-stopped-bg)]',
  progressing: 'bg-[var(--pd-status-starting-bg)]',
  critical: 'bg-[var(--pd-status-terminated-bg)]',
};

export function getStatusTextClass(status: SystemOverviewStatus): string {
  return STATUS_TEXT_CLASS[status];
}

export function getStatusBgClass(status: SystemOverviewStatus): string {
  return STATUS_BG_CLASS[status];
}

export interface ConnectionStatusConfig {
  label: string;
  buttonType: ButtonType;
}

const CONNECTION_STATUS_CONFIG: Record<ProviderConnectionStatus, ConnectionStatusConfig> = {
  started: { label: 'Running', buttonType: 'secondary' },
  stopped: { label: 'Stopped', buttonType: 'primary' },
  unknown: { label: 'Unknown', buttonType: 'danger' },
  starting: { label: 'Starting', buttonType: 'secondary' },
  stopping: { label: 'Stopping', buttonType: 'secondary' },
};

export function getConnectionStatusConfig(status: ProviderConnectionStatus): ConnectionStatusConfig {
  return CONNECTION_STATUS_CONFIG[status];
}

export function getConnectionButtonText(status: ProviderConnectionStatus, providerName: string): string {
  if (status === 'stopped') return `Start ${providerName}`;
  if (status === 'unknown') return 'See Details in Resources';
  return 'View';
}

function createNoopLogger(): ConnectionCallback {
  return { log: (): void => {}, warn: (): void => {}, error: (): void => {}, onEnd: (): void => {} };
}

export function getConnectionDetailPath(providerInternalId: string, connection: ProviderConnectionInfo): string {
  switch (connection.connectionType) {
    case 'container': {
      const containerConn = connection as ProviderContainerConnectionInfo;
      return `/preferences/container-connection/view/${providerInternalId}/${Buffer.from(containerConn.name).toString('base64')}/${Buffer.from(containerConn.endpoint.socketPath).toString('base64')}/summary`;
    }
    case 'kubernetes': {
      const k8sConn = connection as ProviderKubernetesConnectionInfo;
      return `/preferences/kubernetes-connection/${providerInternalId}/${Buffer.from(k8sConn.endpoint.apiURL).toString('base64')}/summary`;
    }
    case 'vm':
      return `/preferences/vm-connection/${providerInternalId}/${connection.name}/terminal`;
  }
}

export async function startConnection(
  providerInternalId: string,
  connectionSnapshot: ProviderConnectionInfo,
): Promise<void> {
  const loggerHandlerKey = registerConnectionCallback(createNoopLogger());
  await window.startProviderConnectionLifecycle(providerInternalId, connectionSnapshot, loggerHandlerKey, eventCollect);
}
