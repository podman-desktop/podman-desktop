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

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

/**
 * Computes how long to wait before a displayed duration needs to be refreshed.
 *
 * @param uptimeInMs the elapsed time, in milliseconds
 * @returns the delay, in milliseconds, before the next refresh
 */
export function computeInterval(uptimeInMs: number): number {
  // if less than a minute, refresh every 2s
  if (uptimeInMs < MINUTE - 2 * SECOND) {
    return 2 * SECOND;
  }

  // if less than an hour, refresh on the next minute
  if (uptimeInMs < HOUR) {
    return Math.ceil((uptimeInMs + 1) / MINUTE) * MINUTE - uptimeInMs;
  }

  // if less than a day, refresh on the next hour
  if (uptimeInMs < DAY) {
    return Math.ceil((uptimeInMs + 1) / HOUR) * HOUR - uptimeInMs;
  }

  // otherwise, refresh on the next day
  return Math.ceil((uptimeInMs + 1) / DAY) * DAY - uptimeInMs;
}

/**
 * Calls a callback with the current time, now and then, so that a duration
 * computed from a start time stays up to date without refreshing more often than needed.
 */
export class DurationRefresher {
  #timeout: number | undefined;

  /**
   * Calls onTick right away, then again each time the displayed duration changes.
   * Starting again replaces the previous schedule.
   *
   * @param startedAt the start time, in milliseconds since the epoch
   * @param onTick called with the current time, in milliseconds since the epoch
   */
  start(startedAt: number, onTick: (now: number) => void): void {
    this.stop();
    const tick = (): void => {
      const now = Date.now();
      onTick(now);
      this.#timeout = setTimeout(tick, computeInterval(now - startedAt));
    };
    tick();
  }

  stop(): void {
    if (this.#timeout !== undefined) {
      clearTimeout(this.#timeout);
      this.#timeout = undefined;
    }
  }
}
