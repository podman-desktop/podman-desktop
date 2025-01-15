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

import { existsSync } from 'node:fs';
import { sep } from 'node:path';

import type { FileMatcher, TsConfigResult } from 'get-tsconfig';
import { createFilesMatcher, getTsconfig } from 'get-tsconfig';
import { beforeEach, expect, test, vi } from 'vitest';

import { ExtensionTypeScriptConfigParser } from './extension-tsconfig-parser.js';

vi.mock('node:fs');
vi.mock('get-tsconfig');

beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetAllMocks();
});

test('no tsconfig.json file means it returns undefined', async () => {
  const fakePath = 'fakePath';
  const extensionTypeScriptConfigParser = new ExtensionTypeScriptConfigParser(fakePath);

  const result = await extensionTypeScriptConfigParser.analyze();

  expect(existsSync).toHaveBeenCalledWith(expect.stringContaining(`fakePath${sep}tsconfig.json`));
  expect(vi.mocked(getTsconfig)).not.toHaveBeenCalled();
  expect(result).toBe(undefined);
});

test('with a tsconfig.json file means it returns undefined', async () => {
  vi.mocked(existsSync).mockReturnValue(true);
  const fakePath = 'fakePath';
  const extensionTypeScriptConfigParser = new ExtensionTypeScriptConfigParser(fakePath);

  const fakeTsConfig = {} as unknown as TsConfigResult;
  const fakeFilesMatcher = {} as unknown as FileMatcher;
  vi.mocked(getTsconfig).mockReturnValue(fakeTsConfig);
  vi.mocked(createFilesMatcher).mockReturnValue(fakeFilesMatcher);

  const result = await extensionTypeScriptConfigParser.analyze();
  expect(existsSync).toHaveBeenCalledWith(expect.stringContaining(`fakePath${sep}tsconfig.json`));

  // check we called the getTsconfig function
  expect(vi.mocked(getTsconfig)).toHaveBeenCalled();

  // check we called the createFilesMatcher function
  expect(vi.mocked(createFilesMatcher)).toHaveBeenCalledWith(fakeTsConfig);

  // check we have a valid file matcher in that case
  expect(result).toBe(fakeFilesMatcher);
});
