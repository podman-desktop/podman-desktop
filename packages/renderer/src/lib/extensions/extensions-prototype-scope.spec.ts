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
import { beforeEach, describe, expect, test } from 'vitest';

import { activePrototype, currentScreen, unregisterPrototype } from '/@/stores/prototype';

import { arePrototypeUseCasesEnabled } from './extension-prototype-use-cases';
import { arePrototypeVersionChangesEnabled } from './extension-version-update.svelte';
import {
  areExtensionsImprovementsSuggested,
  getExtensionsPrototypeScope,
  initExtensionsPrototypeScope,
  teardownExtensionsPrototypeScopeForTests,
} from './extensions-prototype-scope';

describe('extensions-prototype-scope', () => {
  beforeEach(() => {
    teardownExtensionsPrototypeScopeForTests();
    unregisterPrototype();
    localStorage.clear();
  });

  test('registers prototype scope switcher with Current and Suggestion screens', () => {
    initExtensionsPrototypeScope();

    expect(get(activePrototype)?.name).toBe('Extensions improvements');
    expect(get(activePrototype)?.screens).toEqual([
      { value: 'current', label: 'Current' },
      { value: 'suggestion', label: 'Suggestion' },
    ]);
  });

  test('Suggestion scope enables prototype helpers', () => {
    initExtensionsPrototypeScope();
    currentScreen.set('suggestion');

    expect(getExtensionsPrototypeScope()).toBe('suggestion');
    expect(areExtensionsImprovementsSuggested()).toBe(true);
    expect(arePrototypeUseCasesEnabled()).toBe(true);
    expect(arePrototypeVersionChangesEnabled()).toBe(true);
  });

  test('Current scope disables prototype helpers', () => {
    initExtensionsPrototypeScope();
    currentScreen.set('current');

    expect(getExtensionsPrototypeScope()).toBe('current');
    expect(areExtensionsImprovementsSuggested()).toBe(false);
    expect(arePrototypeUseCasesEnabled()).toBe(false);
    expect(arePrototypeVersionChangesEnabled()).toBe(false);
  });
});
