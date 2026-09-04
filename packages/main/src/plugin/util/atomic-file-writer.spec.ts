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

import { rename, writeFile } from 'node:fs/promises';

import { beforeEach, expect, test, vi } from 'vitest';

import { AtomicFileWriter } from './atomic-file-writer.js';

vi.mock(import('node:fs/promises'));
vi.mock(import('node:crypto'), () => ({
  randomUUID: vi.fn().mockReturnValue('test-uuid'),
}));

let writer: AtomicFileWriter;
const filePath = '/fake/data.json';
let data: Record<string, string>;

beforeEach(() => {
  vi.clearAllMocks();
  data = {};
  writer = new AtomicFileWriter(filePath, () => JSON.stringify(data));
});

test('should write to a unique tmp file then rename into place', async () => {
  data = { key: 'value' };

  writer.schedule();
  await writer.flush();

  expect(vi.mocked(writeFile)).toHaveBeenCalledWith('/fake/data.json.tmp-test-uuid', JSON.stringify(data), 'utf-8');
  expect(vi.mocked(rename)).toHaveBeenCalledWith('/fake/data.json.tmp-test-uuid', filePath);
});

test('should serialize concurrent writes and persist latest data', async () => {
  const writeOrder: string[] = [];
  const payloads: string[] = [];
  vi.mocked(writeFile).mockImplementation(async (filePath, content) => {
    writeOrder.push(`write:${String(filePath)}`);
    payloads.push(String(content));
  });
  vi.mocked(rename).mockImplementation(async (src, _dest) => {
    writeOrder.push(`rename:${String(src)}`);
  });

  // Mutate data between schedules to simulate real usage
  data = { a: '1' };
  writer.schedule();
  data = { a: '1', b: '2' };
  writer.schedule();
  data = { a: '1', b: '2', c: '3' };
  writer.schedule();

  await writer.flush();

  // Each write+rename pair must complete before the next starts
  expect(writeOrder).toHaveLength(6);
  expect(writeOrder).toEqual([
    expect.stringContaining('write:'),
    expect.stringContaining('rename:'),
    expect.stringContaining('write:'),
    expect.stringContaining('rename:'),
    expect.stringContaining('write:'),
    expect.stringContaining('rename:'),
  ]);

  // The final persisted snapshot must contain all keys
  expect(JSON.parse(payloads.at(-1)!)).toEqual({ a: '1', b: '2', c: '3' });
});

test('should recover after a write failure', async () => {
  vi.mocked(writeFile).mockRejectedValueOnce(new Error('disk full'));
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  writer.schedule();
  await writer.flush();

  expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Unable to persist'), expect.any(Error));

  vi.mocked(writeFile).mockResolvedValue(undefined);
  vi.mocked(rename).mockResolvedValue(undefined);

  writer.schedule();
  await writer.flush();

  expect(vi.mocked(rename)).toHaveBeenCalled();
  consoleSpy.mockRestore();
});

test('flush should resolve immediately when no writes are pending', async () => {
  await expect(writer.flush()).resolves.toBeUndefined();
});
