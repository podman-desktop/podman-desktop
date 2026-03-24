/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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

import type { IDisposable } from '/@/disposable.js';

import type { ApiSenderChannelMap } from './api-sender-channel-map.js';

export const ApiSenderType = Symbol.for('ApiSenderType');
export type ApiSenderType = {
  send<K extends keyof ApiSenderChannelMap>(
    channel: K,
    ...args: ApiSenderChannelMap[K] extends never ? [] : [data: ApiSenderChannelMap[K]]
  ): void;
  send(channel: string, data?: unknown): void;

  receive<K extends keyof ApiSenderChannelMap>(
    channel: K,
    func: ApiSenderChannelMap[K] extends never ? () => void : (data: ApiSenderChannelMap[K]) => void,
  ): IDisposable;
  receive(channel: string, func: (...args: unknown[]) => void): IDisposable;
};
