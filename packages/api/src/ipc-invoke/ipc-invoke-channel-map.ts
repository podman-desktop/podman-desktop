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

import type { ContainerInfo } from '/@/container-info.js';
import type { ImageInfo, ListImagesOptions } from '/@/image-info.js';
import type { PodInfo } from '/@/pod-info.js';
import type { ProxyState } from '/@/proxy.js';
import type { SecretInfo } from '/@/secret-info.js';
import type { SystemOverviewStatusInfo } from '/@/system-overview-info.js';
import type { VolumeListInfo } from '/@/volume-info.js';

/**
 * Proxy settings for HTTP/HTTPS connections.
 *
 * Mirrors {@link containerDesktopAPI.ProxySettings} from `@podman-desktop/api`
 * but defined here to avoid a cross-package dependency.
 */
export interface IpcProxySettings {
  httpProxy: string | undefined;
  httpsProxy: string | undefined;
  noProxy: string | undefined;
}

/**
 * Named constants for IPC invoke channel strings.
 *
 * Use these instead of raw string literals so that "Find References" on any
 * constant shows every call site across main, preload, and the contract.
 */
export const IpcChannel = {
  // -- Tasks ------------------------------------------------------------------
  TASKS_CLEAR_ALL: 'tasks:clear-all',
  TASKS_CLEAR: 'tasks:clear',
  TASKS_EXECUTE: 'tasks:execute',

  // -- Proxy ------------------------------------------------------------------
  PROXY_GET_SETTINGS: 'proxy:getSettings',
  PROXY_GET_STATE: 'proxy:getState',
  PROXY_UPDATE_SETTINGS: 'proxy:updateSettings',
  PROXY_SET_STATE: 'proxy:setState',

  // -- Dashboard --------------------------------------------------------------
  DASHBOARD_GET_SYSTEM_OVERVIEW_STATUS: 'dashboard:getSystemOverviewStatus',

  // -- Feature Registry -------------------------------------------------------
  FEATURE_REGISTRY_GET_REGISTERED_FEATURES: 'feature-registry:getRegisteredFeatures',

  // -- Containers -------------------------------------------------------------
  CONTAINER_LIST_CONTAINERS: 'container-provider-registry:listContainers',
  CONTAINER_LIST_IMAGES: 'container-provider-registry:listImages',
  CONTAINER_LIST_VOLUMES: 'container-provider-registry:listVolumes',
  CONTAINER_LIST_PODS: 'container-provider-registry:listPods',
  CONTAINER_LIST_SECRETS: 'container-provider-registry:listSecrets',
  CONTAINER_REMOVE_SECRET: 'container-provider-registry:removeSecret',
} as const;

/**
 * Defines the channels used for renderer → main invoke IPC.
 *
 * Each key is a channel name and the value is the function signature
 * describing the parameters and return type for that channel.
 *
 * This map is used to strongly type {@link ipcHandle} (main) and
 * {@link ipcInvoke} (preload). Channels not listed here still compile
 * via the untyped `string` fallback overload, enabling incremental migration.
 */
export interface IpcInvokeChannelMap {
  // -- Tasks ------------------------------------------------------------------
  [IpcChannel.TASKS_CLEAR_ALL]: () => Promise<void>;
  [IpcChannel.TASKS_CLEAR]: (taskId: string) => Promise<void>;
  [IpcChannel.TASKS_EXECUTE]: (taskId: string) => Promise<void>;

  // -- Proxy ------------------------------------------------------------------
  [IpcChannel.PROXY_GET_SETTINGS]: () => Promise<IpcProxySettings | undefined>;
  [IpcChannel.PROXY_GET_STATE]: () => Promise<ProxyState>;
  [IpcChannel.PROXY_UPDATE_SETTINGS]: (proxySettings: IpcProxySettings) => Promise<void>;
  [IpcChannel.PROXY_SET_STATE]: (state: ProxyState) => Promise<void>;

  // -- Dashboard --------------------------------------------------------------
  [IpcChannel.DASHBOARD_GET_SYSTEM_OVERVIEW_STATUS]: () => Promise<SystemOverviewStatusInfo>;

  // -- Feature Registry -------------------------------------------------------
  [IpcChannel.FEATURE_REGISTRY_GET_REGISTERED_FEATURES]: () => Promise<string[]>;

  // -- Containers -------------------------------------------------------------
  [IpcChannel.CONTAINER_LIST_CONTAINERS]: () => Promise<ContainerInfo[]>;
  [IpcChannel.CONTAINER_LIST_IMAGES]: (options?: ListImagesOptions) => Promise<ImageInfo[]>;
  [IpcChannel.CONTAINER_LIST_VOLUMES]: (fetchUsage?: boolean) => Promise<VolumeListInfo[]>;
  [IpcChannel.CONTAINER_LIST_PODS]: () => Promise<PodInfo[]>;
  [IpcChannel.CONTAINER_LIST_SECRETS]: () => Promise<SecretInfo[]>;
  [IpcChannel.CONTAINER_REMOVE_SECRET]: (engineId: string, secretId: string) => Promise<void>;
}
