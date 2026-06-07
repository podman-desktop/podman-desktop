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

export interface PrototypeConfig<T> {
  name: string;
  screens: PrototypeScreen[];
  overrides: Record<string, T>;
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

export const currentOverride: Readable<unknown | undefined> = derived(
  [currentScreen, currentPhase, activePrototype],
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

export interface RegisterPrototypeOptions {
  /** Restore a previously selected screen instead of defaulting to the first screen. */
  initialScreen?: string;
}

export function registerPrototype<T>(
  config: PrototypeConfig<T>,
  options?: RegisterPrototypeOptions,
): Readable<T | undefined> {
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
  const initialScreen =
    options?.initialScreen && config.screens.some(screen => screen.value === options.initialScreen)
      ? options.initialScreen
      : (config.screens[0]?.value ?? '');
  currentScreen.set(initialScreen);
  return currentOverride as Readable<T | undefined>;
}

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
