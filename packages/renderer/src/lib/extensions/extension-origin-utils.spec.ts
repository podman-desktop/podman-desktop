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

import { expect, test } from 'vitest';

import { isBundledExtension } from './extension-origin-utils';

test('isBundledExtension is true only for non-removable, non-dd, non-devMode extensions', () => {
  // bundled: shipped inside the app, not removable
  expect(isBundledExtension({ type: 'pd', removable: false, devMode: false })).toBe(true);

  // user-installed (removable) extension is not bundled
  expect(isBundledExtension({ type: 'pd', removable: true, devMode: false })).toBe(false);

  // Docker Desktop extensions are never bundled
  expect(isBundledExtension({ type: 'dd', removable: false, devMode: false })).toBe(false);

  // extensions in development mode are never bundled
  expect(isBundledExtension({ type: 'pd', removable: false, devMode: true })).toBe(false);

  // no matching installed extension
  expect(isBundledExtension()).toBe(false);
});
