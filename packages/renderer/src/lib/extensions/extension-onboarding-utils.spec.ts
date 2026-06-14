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

import { extensionHasVersionUpdate } from './extension-onboarding-utils';

describe('extensionHasVersionUpdate', () => {
  test('returns true when catalog versions differ even without hasUpdate flag', () => {
    expect(extensionHasVersionUpdate(true, '0.4.0', '0.4.1', false)).toBe(true);
  });

  test('returns true when versions differ with v prefix', () => {
    expect(extensionHasVersionUpdate(true, 'v0.4.0', 'v0.4.1', false)).toBe(true);
  });

  test('returns false when installed version matches catalog version', () => {
    expect(extensionHasVersionUpdate(true, '0.4.0', '0.4.0', false)).toBe(false);
  });
});
