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

import type { ProviderConnectionInfo } from '@podman-desktop/core-api';

import {
  type ConnectionCallback,
  eventCollect,
  registerConnectionCallback,
} from '/@/lib/preferences/preferences-connection-rendering-task';

function createNoopLogger(): ConnectionCallback {
  return { log: (): void => {}, warn: (): void => {}, error: (): void => {}, onEnd: (): void => {} };
}

export async function startConnection(
  providerInternalId: string,
  connectionSnapshot: ProviderConnectionInfo,
): Promise<void> {
  const loggerHandlerKey = registerConnectionCallback(createNoopLogger());
  await window.startProviderConnectionLifecycle(providerInternalId, connectionSnapshot, loggerHandlerKey, eventCollect);
}
