/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import type * as containerDesktopAPI from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import type { ApiSenderType } from './api.js';
import { ConfigurationImpl } from './configuration-impl.js';

let configurationImpl: TestConfigurationImpl;

class TestConfigurationImpl extends ConfigurationImpl {
  getUpdateCallback(): (sectionName: string, scope: containerDesktopAPI.ConfigurationScope) => void {
    return this.updateCallback;
  }

  async originalUpdate(section: string, value: unknown): Promise<void> {
    const localKey = this.getLocalKey(section);
    // now look if we have this value
    const localView = this.getLocalView();

    // remove the value if undefined
    if (value === undefined) {
      if (localView[localKey]) {
        delete localView[section];
        delete this[localKey];
      }
    } else {
      localView[localKey] = value;
      this[section] = value;
    }
  }
}

beforeEach(() => {
  vi.resetAllMocks();
  const map = new Map<string, { [key: string]: unknown }>();
  configurationImpl = new TestConfigurationImpl(
    {
      send: vi.fn(),
    } as unknown as ApiSenderType,
    vi.fn(),
    map,
  );
});

test('Should callback on update with configuration key', async () => {
  await configurationImpl.update('key', 'value');
  expect(configurationImpl.getUpdateCallback()).toBeCalledWith('key', 'DEFAULT');
});

test('Uses localKey when deleting values', async () => {
  // Test with globalSection to ensure localKey != section
  const sendMock = vi.fn();
  const map = new Map<string, { [key: string]: unknown }>();
  const config = new TestConfigurationImpl({ send: sendMock } as unknown as ApiSenderType, vi.fn(), map, 'prefix');

  // Set value
  await config.update('key', 'value');
  // stored with section
  expect(config['key']).toBe('value');
  // NOT stored with localKey
  expect(config['prefix.key']).toBeUndefined();
  expect(config.get('key')).toBe('value');
  expect(sendMock).toHaveBeenCalledWith('configuration-changed', {
    key: 'prefix.key',
    value: 'value',
  });

  // Delete value
  await config.update('key', undefined);
  // deleted using localKey
  expect(config['prefix.key']).toBeUndefined();
  expect(config.get('key')).toBeUndefined();
  expect(sendMock).toHaveBeenCalledWith('configuration-changed', {
    key: 'prefix.key',
    value: undefined,
  });
});
