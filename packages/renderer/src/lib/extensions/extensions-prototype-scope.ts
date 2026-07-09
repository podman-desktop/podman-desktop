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

import { get } from 'svelte/store';

import { currentOverride, currentScreen, registerPrototype } from '/@/stores/prototype';

import { setPrototypeUseCasesEnabled } from './extension-prototype-use-cases';
import { setPrototypeVersionChangesEnabled } from './extension-version-update.svelte';

export const EXTENSIONS_PROTOTYPE_SCOPE_CHANGE_EVENT = 'extensions-prototype-scope-change';

export const EXTENSIONS_IMPROVEMENTS_PROTOTYPE_NAME = 'Extensions improvements';

export type ExtensionsPrototypeScopeId = 'current' | 'suggestion';

export interface ExtensionsPrototypeScopeOverride {
  mode: ExtensionsPrototypeScopeId;
}

const STORAGE_KEY = 'extensions-improvements-prototype-scope';

const SCOPE_SCREEN_OPTIONS = [
  { value: 'current', label: 'Current' },
  { value: 'suggestion', label: 'Suggestion' },
] as const;

function readStoredScope(): ExtensionsPrototypeScopeId {
  if (typeof localStorage === 'undefined') {
    return 'suggestion';
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'current' || stored === 'suggestion') {
    return stored;
  }

  return 'suggestion';
}

function persistScope(scope: string): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, scope);
}

function applyExtensionsPrototypeScope(mode: ExtensionsPrototypeScopeId): void {
  const isSuggestion = mode === 'suggestion';
  setPrototypeUseCasesEnabled(isSuggestion);
  setPrototypeVersionChangesEnabled(isSuggestion);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EXTENSIONS_PROTOTYPE_SCOPE_CHANGE_EVENT));
  }
}

let scopeSubscription: (() => void) | undefined;

export function initExtensionsPrototypeScope(): void {
  scopeSubscription?.();
  scopeSubscription = undefined;

  registerPrototype<ExtensionsPrototypeScopeOverride>({
    name: EXTENSIONS_IMPROVEMENTS_PROTOTYPE_NAME,
    screens: [...SCOPE_SCREEN_OPTIONS],
    overrides: {
      current: { mode: 'current' },
      suggestion: { mode: 'suggestion' },
    },
  });

  const initialScope = readStoredScope();
  currentScreen.set(initialScope);
  applyExtensionsPrototypeScope(initialScope);

  scopeSubscription = currentScreen.subscribe(screen => {
    const mode: ExtensionsPrototypeScopeId = screen === 'current' ? 'current' : 'suggestion';
    persistScope(mode);
    applyExtensionsPrototypeScope(mode);
  });
}

export function getExtensionsPrototypeScope(): ExtensionsPrototypeScopeId {
  const override = get(currentOverride) as ExtensionsPrototypeScopeOverride | undefined;
  return override?.mode ?? 'suggestion';
}

export function areExtensionsImprovementsSuggested(): boolean {
  return getExtensionsPrototypeScope() === 'suggestion';
}

export function teardownExtensionsPrototypeScopeForTests(): void {
  scopeSubscription?.();
  scopeSubscription = undefined;
}
