/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import { app } from 'electron';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { Main } from './main.js';

vi.mock(import('./main.js'), () => {
  const Main = vi.fn();
  Main.prototype.main = vi.fn();
  return { Main };
});

let originalArgv: string[];
let originalDefaultApp: boolean | undefined;

function setDefaultApp(value: boolean | undefined): void {
  Object.defineProperty(process, 'defaultApp', { value, configurable: true, writable: true });
}

beforeEach(() => {
  vi.resetAllMocks();
  // index.ts runs on import, re-import it in each test
  vi.resetModules();
  originalArgv = process.argv;
  originalDefaultApp = process.defaultApp;
});

afterEach(() => {
  process.argv = originalArgv;
  setDefaultApp(originalDefaultApp);
});

test.each([
  {
    name: 'packaged app',
    defaultApp: undefined,
    argv: ['/usr/bin/podman-desktop', 'podman-desktop:extension/foo.bar'],
  },
  {
    name: 'default app',
    defaultApp: true,
    argv: ['/usr/bin/electron', '.', 'podman-desktop:extension/foo.bar'],
  },
])('$name should start Main with the arguments after the executable', async ({ defaultApp, argv }) => {
  setDefaultApp(defaultApp);
  process.argv = argv;

  await import('./index.js');

  expect(Main).toHaveBeenCalledWith(app);
  expect(Main.prototype.main).toHaveBeenCalledWith(['podman-desktop:extension/foo.bar']);
});
