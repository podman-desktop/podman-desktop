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

import { describe, expect, test } from 'vitest';

import {
  extensionStatusPresentations,
  getExtensionStatusPresentation,
  toExtensionLifecycleState,
} from './extension-status';

test.each([
  ['started', 'installed'],
  ['starting', 'enabling'],
  ['stopped', 'disabled'],
  ['stopping', 'disabling'],
  ['failed', 'failed'],
] as const)('maps extension state %s to lifecycle state %s', (extensionState, lifecycleState) => {
  expect(toExtensionLifecycleState(extensionState)).toBe(lifecycleState);
});

test.each(Object.keys(extensionStatusPresentations))('preserves lifecycle state %s', status => {
  expect(toExtensionLifecycleState(status)).toBe(status);
});

test.each(['unsupported', 'constructor', 'toString', '__proto__'])(
  'returns undefined for unsupported extension state %s',
  status => {
    expect(toExtensionLifecycleState(status)).toBeUndefined();
  },
);

describe('non-lifecycle presentations', () => {
  test('preserves the downloadable presentation', () => {
    expect(getExtensionStatusPresentation('downloadable')).toEqual({
      icon: 'downloadable',
      textClass: 'text-(--pd-status-ready)',
      label: 'Downloadable',
    });
  });

  test('uses the unknown presentation and original state label for unsupported states', () => {
    expect(getExtensionStatusPresentation('unexpected')).toEqual({
      icon: 'unknown',
      textClass: 'text-(--pd-status-unknown)',
      label: 'UNEXPECTED',
    });
  });
});
