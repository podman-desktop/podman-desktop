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

import { type Readable, writable } from 'svelte/store';

/**
 * Observes the `dark` class on `document.documentElement` so UI components can
 * react to theme changes without depending on the renderer appearance store.
 */
export function createDarkClassStore(): Readable<boolean> {
  const store = writable(false);
  let observer: MutationObserver | undefined;
  let subscriberCount = 0;

  function sync(): void {
    store.set(document.documentElement.classList.contains('dark'));
  }

  function start(): void {
    sync();
    observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  function stop(): void {
    observer?.disconnect();
    observer = undefined;
  }

  return {
    subscribe(run, invalidate) {
      subscriberCount++;
      if (subscriberCount === 1) {
        start();
      }
      const unsubscribe = store.subscribe(run, invalidate);
      return (): void => {
        unsubscribe();
        subscriberCount--;
        if (subscriberCount === 0) {
          stop();
        }
      };
    },
  };
}

export const isDarkClass = createDarkClassStore();
