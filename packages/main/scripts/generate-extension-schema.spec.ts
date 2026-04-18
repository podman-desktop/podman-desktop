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

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { generateExtensionManifestJsonSchema } from '/@/plugin/extension/extension-manifest-json-schema.js';

import { main, parseArgs } from './generate-extension-schema.js';

vi.mock(import('node:fs/promises'));
vi.mock(import('/@/plugin/extension/extension-manifest-json-schema.js'));

beforeEach(() => {
  vi.resetAllMocks();
});

describe('parseArgs', () => {
  test('returns default output path when no --output is provided', () => {
    const { output } = parseArgs([]);
    expect(output).toBe(resolve(process.cwd(), 'schemas', 'extension-schema.json'));
  });

  test('returns provided absolute output path', () => {
    const { output } = parseArgs(['--output', '/tmp/my-schema.json']);
    expect(output).toBe('/tmp/my-schema.json');
  });

  test('throws when output path is relative', () => {
    expect(() => parseArgs(['--output', 'relative/path.json'])).toThrow('the output path should be absolute');
  });
});

describe('main', () => {
  test('writes generated schema to output path', async () => {
    const fakeSchema = { $schema: 'http://json-schema.org/draft-07/schema#', title: 'test' };
    vi.mocked(generateExtensionManifestJsonSchema).mockReturnValue(fakeSchema);
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(writeFile).mockResolvedValue();

    await main(['--output', '/tmp/test-schema.json']);

    expect(generateExtensionManifestJsonSchema).toHaveBeenCalled();
    expect(mkdir).toHaveBeenCalledWith('/tmp', { recursive: true });
    expect(writeFile).toHaveBeenCalledWith('/tmp/test-schema.json', `${JSON.stringify(fakeSchema, undefined, 2)}\n`, {
      encoding: 'utf-8',
    });
  });

  test('uses default output when no args provided', async () => {
    const fakeSchema = { test: true };
    vi.mocked(generateExtensionManifestJsonSchema).mockReturnValue(fakeSchema);
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(writeFile).mockResolvedValue();

    await main([]);

    const expectedPath = resolve(process.cwd(), 'schemas', 'extension-schema.json');
    expect(writeFile).toHaveBeenCalledWith(expectedPath, expect.any(String), { encoding: 'utf-8' });
  });
});
