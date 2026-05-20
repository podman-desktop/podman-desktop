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

import { derived, type Readable, writable } from 'svelte/store';

export interface PrototypeScreen {
  value: string;
  label: string;
}

export interface PhaseSchedule {
  delay: number;
  phase: number;
}

/**
 * Configuration for a prototype. The generic `T` is your override shape -
 * each screen (and optional phase) maps to one `T` instance.
 *
 * @example
 * ```ts
 * interface MyOverride { color: string; showBadge: boolean }
 *
 * const override = registerPrototype<MyOverride>({
 *   name: 'Badge experiment',
 *   screens: [
 *     { value: 'off', label: 'Badge hidden' },
 *     { value: 'on', label: 'Badge visible' },
 *     { value: 'animated', label: 'Badge animated (3s timeline)' },
 *   ],
 *   overrides: {
 *     off: { color: 'gray', showBadge: false },
 *     on: { color: 'red', showBadge: true },
 *     animated: { color: 'red', showBadge: true },
 *     'animated:1': { color: 'green', showBadge: false },
 *   },
 *   timelines: {
 *     animated: [{ delay: 3000, phase: 1 }],
 *   },
 * });
 * ```
 */
export interface PrototypeConfig<T> {
  name: string;
  screens: PrototypeScreen[];
  overrides: Record<string, T>;
  /** Optional timed phase transitions. Key = screen value, value = array of `{ delay, phase }`. */
  timelines?: Record<string, PhaseSchedule[]>;
}

interface PrototypeState {
  name: string;
  screens: PrototypeScreen[];
}

export const activePrototype = writable<PrototypeState | undefined>();
export const currentScreen = writable<string>('');

const currentPhase = writable<number>(0);
let phaseTimers: ReturnType<typeof setTimeout>[] = [];
let currentTimelines: Record<string, PhaseSchedule[]> = {};
let currentOverrides: Record<string, unknown> = {};
let screenUnsubscribe: (() => void) | undefined;

// Typed as unknown at the module level; callers get proper typing via registerPrototype<T>().
export const currentOverride: Readable<unknown | undefined> = derived(
  [currentScreen, currentPhase],
  ([$screen, $phase]) => {
    const key = $phase > 0 ? `${$screen}:${$phase}` : $screen;
    return currentOverrides[key];
  },
);

function clearPhaseTimers(): void {
  phaseTimers.forEach(clearTimeout);
  phaseTimers = [];
}

function startScreenSubscription(): void {
  screenUnsubscribe?.();
  screenUnsubscribe = currentScreen.subscribe(screen => {
    clearPhaseTimers();
    currentPhase.set(0);

    const timeline = currentTimelines[screen];
    if (timeline) {
      for (const entry of timeline) {
        phaseTimers.push(setTimeout(() => currentPhase.set(entry.phase), entry.delay));
      }
    }
  });
}

/**
 * Register a prototype. Activates the titlebar screen switcher and returns
 * a typed readable store that emits the current override for the selected
 * screen and phase. Call {@link unregisterPrototype} to tear down.
 */
export function registerPrototype<T>(config: PrototypeConfig<T>): Readable<T | undefined> {
  if (!config.name?.trim()) {
    throw new Error('registerPrototype: name must be a non-empty string');
  }
  if (!config.screens?.length) {
    throw new Error('registerPrototype: screens must be a non-empty array');
  }
  if (config.timelines) {
    for (const [screen, phases] of Object.entries(config.timelines)) {
      for (const entry of phases) {
        if (entry.delay <= 0) {
          throw new Error(
            `registerPrototype: timeline delay must be positive (screen "${screen}", got ${String(entry.delay)})`,
          );
        }
      }
    }
  }
  currentOverrides = config.overrides as Record<string, unknown>;
  currentTimelines = config.timelines ?? {};
  activePrototype.set({ name: config.name, screens: config.screens });
  startScreenSubscription();
  currentScreen.set(config.screens[0]?.value ?? '');
  return currentOverride as Readable<T | undefined>;
}

/** Tear down the active prototype. Clears timers, overrides, and hides the titlebar selector. */
export function unregisterPrototype(): void {
  screenUnsubscribe?.();
  screenUnsubscribe = undefined;
  clearPhaseTimers();
  currentOverrides = {};
  currentTimelines = {};
  activePrototype.set(undefined);
  currentScreen.set('');
  currentPhase.set(0);
}
