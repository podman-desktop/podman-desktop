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

import type * as containerDesktopAPI from '@podman-desktop/api';
import type {
  ContainerInfo,
  ImageInfo,
  ListImagesOptions,
  PodInfo,
  ProxyState,
  SecretInfo,
  SystemOverviewStatusInfo,
  VolumeListInfo,
} from '@podman-desktop/core-api';

/**
 * Hand-authored interface for methods exposed via `contextBridge.exposeInMainWorld`.
 *
 * Each property corresponds to a `window.*` method available in the renderer.
 * "Find References" on any property name shows:
 *  - This interface definition
 *  - The `expose(name, impl)` call in the preload
 *  - Every `window.<name>` usage in the renderer
 *
 * Methods are migrated here incrementally from the generated `exposedInMainWorld.d.ts`.
 */
export interface ExposedMainWorldApi {
  // -- Tasks ------------------------------------------------------------------
  clearTasks: () => Promise<void>;
  clearTask: (taskId: string) => Promise<void>;
  executeTask: (taskId: string) => Promise<void>;

  // -- Proxy ------------------------------------------------------------------
  getProxySettings: () => Promise<containerDesktopAPI.ProxySettings | undefined>;
  getProxyState: () => Promise<ProxyState>;
  updateProxySettings: (proxySettings: containerDesktopAPI.ProxySettings) => Promise<void>;
  setProxyState: (state: ProxyState) => Promise<void>;

  // -- Dashboard --------------------------------------------------------------
  getDashboardSystemOverviewStatus: () => Promise<SystemOverviewStatusInfo>;

  // -- Feature Registry -------------------------------------------------------
  getRegisteredFeatures: () => Promise<string[]>;

  // -- Containers -------------------------------------------------------------
  listContainers: () => Promise<ContainerInfo[]>;
  listImages: (options?: ListImagesOptions) => Promise<ImageInfo[]>;
  listVolumes: (fetchUsage?: boolean) => Promise<VolumeListInfo[]>;
  listPods: () => Promise<PodInfo[]>;
  listSecrets: () => Promise<SecretInfo[]>;
  removeSecret: (engineId: string, secretId: string) => Promise<void>;
}
