/*********************************************************************
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
 ********************************************************************/
import type { App } from 'electron';
import { app } from 'electron';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { ExtensionApiVersion } from '/@/plugin/extension/extension-api-version.js';
import product from '/@product.json' with { type: 'json' };

const APP_VERSION_MOCK = '1.2.3';

vi.mock(import('electron'), () => ({
  app: {
    getVersion: vi.fn(),
  } as unknown as App,
}));
vi.mock(import('/@product.json'));

interface PartialProductJson {
  apiVersion?: string;
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(product as PartialProductJson).apiVersion = undefined;

  vi.mocked(app.getVersion).mockReturnValue(APP_VERSION_MOCK);
});

describe('ExtensionApiVersion#getApiVersion', () => {
  interface TestCase {
    name: string;
    apiVersion: string | undefined;
    expected: string;
  }

  test.each<TestCase>([
    {
      name: 'expect to use app#getVersion when product#apiVersion is undefined',
      apiVersion: undefined,
      expected: APP_VERSION_MOCK,
    },
    {
      name: 'expect to use app#getVersion when product#apiVersion is empty string',
      apiVersion: '',
      expected: APP_VERSION_MOCK,
    },
    {
      name: 'expect to use app#getVersion when product#apiVersion is not a string',
      apiVersion: {} as unknown as string,
      expected: APP_VERSION_MOCK,
    },
    {
      name: 'expect to use app#getVersion when product#apiVersion is not a valid semantic version',
      apiVersion: 'a.b.c',
      expected: APP_VERSION_MOCK,
    },
    {
      name: 'expect to use product#apiVersion it is a valid semantic version',
      apiVersion: '9.9.9',
      expected: '9.9.9',
    },
  ])('$name', ({ apiVersion, expected }) => {
    vi.mocked(product as PartialProductJson).apiVersion = apiVersion;

    const extensionApiVersion = new ExtensionApiVersion();
    const result = extensionApiVersion.getApiVersion();
    expect(result).toEqual(expected);
  });
});
