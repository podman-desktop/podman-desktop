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

import { describe, expectTypeOf, test } from 'vitest';

import type { ContainerInfo } from '/@/container-info.js';
import type { ImageInfo, ListImagesOptions } from '/@/image-info.js';
import type { PodInfo } from '/@/pod-info.js';
import type { ProxyState } from '/@/proxy.js';
import type { SecretInfo } from '/@/secret-info.js';
import type { SystemOverviewStatusInfo } from '/@/system-overview-info.js';
import type { VolumeListInfo } from '/@/volume-info.js';

import type { IpcChannel, IpcInvokeChannelMap, IpcProxySettings } from './ipc-invoke-channel-map.js';

describe('IpcInvokeChannelMap', () => {
  test('tasks:clear-all has no parameters and returns void', () => {
    expectTypeOf<IpcInvokeChannelMap[typeof IpcChannel.TASKS_CLEAR_ALL]>().toEqualTypeOf<() => Promise<void>>();
  });

  test('tasks:clear takes a taskId string', () => {
    expectTypeOf<IpcInvokeChannelMap[typeof IpcChannel.TASKS_CLEAR]>().toEqualTypeOf<
      (taskId: string) => Promise<void>
    >();
  });

  test('tasks:execute takes a taskId string', () => {
    expectTypeOf<IpcInvokeChannelMap[typeof IpcChannel.TASKS_EXECUTE]>().toEqualTypeOf<
      (taskId: string) => Promise<void>
    >();
  });

  test('proxy:getSettings returns ProxySettings or undefined', () => {
    expectTypeOf<IpcInvokeChannelMap[typeof IpcChannel.PROXY_GET_SETTINGS]>().toEqualTypeOf<
      () => Promise<IpcProxySettings | undefined>
    >();
  });

  test('proxy:getState returns ProxyState', () => {
    expectTypeOf<IpcInvokeChannelMap[typeof IpcChannel.PROXY_GET_STATE]>().toEqualTypeOf<() => Promise<ProxyState>>();
  });

  test('proxy:updateSettings takes ProxySettings', () => {
    expectTypeOf<IpcInvokeChannelMap[typeof IpcChannel.PROXY_UPDATE_SETTINGS]>().toEqualTypeOf<
      (proxySettings: IpcProxySettings) => Promise<void>
    >();
  });

  test('proxy:setState takes ProxyState', () => {
    expectTypeOf<IpcInvokeChannelMap[typeof IpcChannel.PROXY_SET_STATE]>().toEqualTypeOf<
      (state: ProxyState) => Promise<void>
    >();
  });

  test('dashboard:getSystemOverviewStatus returns SystemOverviewStatusInfo', () => {
    expectTypeOf<IpcInvokeChannelMap[typeof IpcChannel.DASHBOARD_GET_SYSTEM_OVERVIEW_STATUS]>().toEqualTypeOf<
      () => Promise<SystemOverviewStatusInfo>
    >();
  });

  test('feature-registry:getRegisteredFeatures returns string[]', () => {
    expectTypeOf<IpcInvokeChannelMap[typeof IpcChannel.FEATURE_REGISTRY_GET_REGISTERED_FEATURES]>().toEqualTypeOf<
      () => Promise<string[]>
    >();
  });

  test('container-provider-registry:listContainers returns ContainerInfo[]', () => {
    expectTypeOf<IpcInvokeChannelMap[typeof IpcChannel.CONTAINER_LIST_CONTAINERS]>().toEqualTypeOf<
      () => Promise<ContainerInfo[]>
    >();
  });

  test('container-provider-registry:listPods returns PodInfo[]', () => {
    expectTypeOf<IpcInvokeChannelMap[typeof IpcChannel.CONTAINER_LIST_PODS]>().toEqualTypeOf<
      () => Promise<PodInfo[]>
    >();
  });

  test('container-provider-registry:listSecrets returns SecretInfo[]', () => {
    expectTypeOf<IpcInvokeChannelMap[typeof IpcChannel.CONTAINER_LIST_SECRETS]>().toEqualTypeOf<
      () => Promise<SecretInfo[]>
    >();
  });

  test('container-provider-registry:listImages accepts optional ListImagesOptions', () => {
    type Fn = IpcInvokeChannelMap[typeof IpcChannel.CONTAINER_LIST_IMAGES];
    expectTypeOf<ReturnType<Fn>>().toEqualTypeOf<Promise<ImageInfo[]>>();
    expectTypeOf<Parameters<Fn>[0]>().toEqualTypeOf<ListImagesOptions | undefined>();
  });

  test('container-provider-registry:listVolumes accepts optional fetchUsage boolean', () => {
    type Fn = IpcInvokeChannelMap[typeof IpcChannel.CONTAINER_LIST_VOLUMES];
    expectTypeOf<ReturnType<Fn>>().toEqualTypeOf<Promise<VolumeListInfo[]>>();
    expectTypeOf<Parameters<Fn>[0]>().toEqualTypeOf<boolean | undefined>();
  });

  test('container-provider-registry:removeSecret takes engineId and secretId', () => {
    expectTypeOf<IpcInvokeChannelMap[typeof IpcChannel.CONTAINER_REMOVE_SECRET]>().toEqualTypeOf<
      (engineId: string, secretId: string) => Promise<void>
    >();
  });
});
