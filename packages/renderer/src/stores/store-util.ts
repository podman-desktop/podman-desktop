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

import type { Readable } from 'svelte/store';

export class StoreUtil {
  static readonly DEFAULT_WAIT_FOR_TIMEOUT = 5000;

  /**
   * Resolve as soon as the store holds a value matching the predicate, and reject when it does
   * not within the given timeout. Also covers the case where the store already matches when this method is called.
   *
   * The subscription is always released, including on timeout and when the predicate throws.
   */
  static waitFor<T>(
    store: Readable<T>,
    predicate: (value: T) => boolean,
    timeout = StoreUtil.DEFAULT_WAIT_FOR_TIMEOUT,
  ): Promise<T> {
    const { promise, resolve, reject } = Promise.withResolvers<T>();

    const timer = setTimeout(() => reject(new Error(`Timeout waiting for store after ${timeout}ms`)), timeout);

    // throwing predicate has to become a rejection, otherwise it escapes as a synchronous throw
    // and leaves the timeout running against a promise nobody holds
    const unsubscribe = store.subscribe(value => {
      try {
        if (predicate(value)) {
          resolve(value);
        }
      } catch (error: unknown) {
        reject(error);
      }
    });

    // the derived promise is the one returned, so its rejection is handled by the caller
    return promise.finally(() => {
      clearTimeout(timer);
      unsubscribe();
    });
  }
}
