/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import type { IDisposable } from './disposable.js';
import type { DisposableGroup } from './disposable-group.js';

/**
 * Represents a typed event.
 *
 * @param listener The listener function will be called when the event happens.
 * @param thisArgs The 'this' which will be used when calling the event listener.
 * @param disposables An array to which a {{IDisposable}} will be added.
 * @return a disposable to remove the listener again.
 */
export type Event<T> = (listener: (e: T) => unknown, thisArgs?: unknown, disposables?: DisposableGroup) => IDisposable;
