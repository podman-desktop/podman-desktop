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

import { type Writable, writable } from 'svelte/store';

import type { TablePersistenceCallbacks } from './table';

export const tablePersistenceCallbacks = setup();

export function setup(): Writable<TablePersistenceCallbacks | undefined> {
  const store = writable<TablePersistenceCallbacks | undefined>();

  window.addEventListener('table-persistence:setup', (event: Event) => {
    const customEvent = event as CustomEvent;
    tablePersistenceCallbacks.set(customEvent.detail as TablePersistenceCallbacks);
  });

  return store;
}
