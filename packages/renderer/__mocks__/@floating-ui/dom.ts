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

import { vi } from 'vitest';

export const computePosition = vi.fn((): Promise<{ x: number; y: number }> => Promise.resolve({ x: 100, y: 200 }));
export const flip = vi.fn(() => ({}));
export const shift = vi.fn(() => ({}));
export const offset = vi.fn(() => ({}));
export const autoUpdate = vi.fn((_ref: unknown, _tooltip: unknown, update: () => void): (() => void) => {
  update();
  return (): void => {};
});
