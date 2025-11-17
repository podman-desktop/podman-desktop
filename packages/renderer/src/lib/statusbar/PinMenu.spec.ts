/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import '@testing-library/jest-dom/vitest';

import { render } from '@testing-library/svelte';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import PinMenu from '/@/lib/statusbar/PinMenu.svelte';

beforeAll(() => {
  Object.defineProperty(window, 'addEventListener', { value: vi.fn() });
  Object.defineProperty(window, 'removeEventListener', { value: vi.fn() });
});

beforeEach(() => {
  vi.resetAllMocks();
});

test('component on mount should resize listener', () => {
  render(PinMenu);
  expect(window.addEventListener).toHaveBeenCalledOnce();
  expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
});
