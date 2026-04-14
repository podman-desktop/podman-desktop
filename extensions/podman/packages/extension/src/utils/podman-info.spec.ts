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
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { PodmanInfoImpl } from './podman-info';

const STORAGE_PATH_MOCK = '/mock/storage/path';

// mock filesystem
vi.mock(import('node:fs/promises'));

let podmanInfo: PodmanInfoImpl;

beforeEach(() => {
  vi.clearAllMocks();

  podmanInfo = new PodmanInfoImpl(undefined, STORAGE_PATH_MOCK);
});

describe('constructor', () => {
  test('should initialize with default values when no podmanInfoValue provided', () => {
    podmanInfo = new PodmanInfoImpl(undefined, STORAGE_PATH_MOCK);
    expect(podmanInfo.lastUpdateCheck).toBe(0);
    expect(podmanInfo.podmanVersion).toBeUndefined();
    expect(podmanInfo.ignoreVersionUpdate).toBeUndefined();
  });

  test('should initialize with provided values', () => {
    const initialValues = {
      podmanVersion: '4.0.0',
      lastUpdateCheck: 123456789,
      ignoreVersionUpdate: '4.1.0',
    };
    podmanInfo = new PodmanInfoImpl(initialValues, STORAGE_PATH_MOCK);
    expect(podmanInfo.podmanVersion).toBe('4.0.0');
    expect(podmanInfo.lastUpdateCheck).toBe(123456789);
    expect(podmanInfo.ignoreVersionUpdate).toBe('4.1.0');
  });
});

describe('podmanVersion', () => {
  test('should update podmanVersion and write to file when changed', async () => {
    podmanInfo.podmanVersion = '4.0.0';

    expect(writeFile).toHaveBeenCalledWith(
      path.resolve(STORAGE_PATH_MOCK, 'podman-ext.json'),
      JSON.stringify({ lastUpdateCheck: 0, podmanVersion: '4.0.0' }),
    );
  });

  test('should not write to file when setting same podmanVersion', () => {
    podmanInfo.podmanVersion = '4.0.0';
    vi.mocked(writeFile).mockClear();

    podmanInfo.podmanVersion = '4.0.0';
    expect(writeFile).not.toHaveBeenCalled();
  });
});

describe('lastUpdateCheck', () => {
  test('should update lastUpdateCheck and write to file when changed', async () => {
    podmanInfo.lastUpdateCheck = 123456789;

    expect(writeFile).toHaveBeenCalledWith(
      path.resolve(STORAGE_PATH_MOCK, 'podman-ext.json'),
      JSON.stringify({ lastUpdateCheck: 123456789 }),
    );
  });

  test('should not write to file when setting same lastUpdateCheck', () => {
    podmanInfo.lastUpdateCheck = 123456789;
    vi.mocked(writeFile).mockClear();

    podmanInfo.lastUpdateCheck = 123456789;
    expect(writeFile).not.toHaveBeenCalled();
  });
});

describe('ignoreVersionUpdate', () => {
  test('should update ignoreVersionUpdate and write to file when changed', async () => {
    podmanInfo.ignoreVersionUpdate = '4.1.0';

    expect(writeFile).toHaveBeenCalledWith(
      path.resolve(STORAGE_PATH_MOCK, 'podman-ext.json'),
      JSON.stringify({ lastUpdateCheck: 0, ignoreVersionUpdate: '4.1.0' }),
    );
  });

  test('should not write to file when setting same ignoreVersionUpdate', () => {
    podmanInfo.ignoreVersionUpdate = '4.1.0';
    vi.mocked(writeFile).mockClear();

    podmanInfo.ignoreVersionUpdate = '4.1.0';
    expect(writeFile).not.toHaveBeenCalled();
  });
});
