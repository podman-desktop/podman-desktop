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

import type * as containerDesktopAPI from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import {
  CONFIGURATION_DEFAULT_SCOPE,
  CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE,
} from '/@api/configuration/constants.js';

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

test('should return value from configuration when present', () => {
  // Create the "scope" of the configuration
  const map = new Map<string, { [key: string]: unknown }>();
  map.set(CONFIGURATION_DEFAULT_SCOPE, { 'test.section.key': 'testValue' });

  // Should return it fine
  const config = new ConfigurationImpl(
    { send: vi.fn() } as unknown as ApiSenderType,
    vi.fn(),
    map,
    'test.section',
    CONFIGURATION_DEFAULT_SCOPE,
  );

  const result = config.get<string>('key');
  expect(result).toBe('testValue');
});

test('should return default value when configuration value is undefined', () => {
  // Create the scope
  const map = new Map<string, { [key: string]: unknown }>();
  const config = new ConfigurationImpl(
    { send: vi.fn() } as unknown as ApiSenderType,
    vi.fn(),
    map,
    'test.section',
    CONFIGURATION_DEFAULT_SCOPE,
  );

  // Expect the value to be set correctly
  const result = config.get<string>('nonexistent', 'defaultValue');
  expect(result).toBe('defaultValue');
});

test('should return true when value exists', () => {
  // Create the scope
  const map = new Map<string, { [key: string]: unknown }>();
  map.set(CONFIGURATION_DEFAULT_SCOPE, { 'test.section.key': 'testValue' });
  const config = new ConfigurationImpl(
    { send: vi.fn() } as unknown as ApiSenderType,
    vi.fn(),
    map,
    'test.section',
    CONFIGURATION_DEFAULT_SCOPE,
  );

  // Should have the value
  const result = config.has('key');
  expect(result).toBe(true);
});

test('should return false when value does not exist', () => {
  // Create the scope
  const map = new Map<string, { [key: string]: unknown }>();
  const config = new ConfigurationImpl(
    { send: vi.fn() } as unknown as ApiSenderType,
    vi.fn(),
    map,
    'test.section',
    CONFIGURATION_DEFAULT_SCOPE,
  );

  // Should not exist when not set
  const result = config.has('nonexistent');
  expect(result).toBe(false);
});

test('should return admin defaults scope for admin defaults configuration', () => {
  // Return the defaults
  const map = new Map<string, { [key: string]: unknown }>();
  const config = new ConfigurationImpl(
    { send: vi.fn() } as unknown as ApiSenderType,
    vi.fn(),
    map,
    'test.section',
    CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE,
  );
  expect(config.getConfigurationKey()).toBe(CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE);
});

test('should get values from admin defaults scope configuration', () => {
  // The below section makes sure that when retrieving from a separate section (managed defaults scope), it'll work the exact same way.
  // kind of a silly test, but it still makes sure that the constants are set fine at least.
  const map = new Map<string, { [key: string]: unknown }>();
  map.set(CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE, { 'test.section.key': 'adminValue' });

  const config = new ConfigurationImpl(
    { send: vi.fn() } as unknown as ApiSenderType,
    vi.fn(),
    map,
    'test.section',
    CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE,
  );

  const result = config.get<string>('key');
  expect(result).toBe('adminValue');
});

test('if there are multiple scopes with different values, make sure we get the right one', () => {
  // Create the scopes
  const map = new Map<string, { [key: string]: unknown }>();
  map.set(CONFIGURATION_DEFAULT_SCOPE, { 'test.section.key': 'defaultValue' });
  map.set(CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE, { 'test.section.key': 'adminValue' });

  // Should return it fine
  const configDefault = new ConfigurationImpl(
    { send: vi.fn() } as unknown as ApiSenderType,
    vi.fn(),
    map,
    'test.section',
    CONFIGURATION_DEFAULT_SCOPE,
  );
  const configAdmin = new ConfigurationImpl(
    { send: vi.fn() } as unknown as ApiSenderType,
    vi.fn(),
    map,
    'test.section',
    CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE,
  );

  // Expect that we can get the values and that they are correct (we aren't grabbing from the wrong scope)
  const resultDefault = configDefault.get<string>('key');
  expect(resultDefault).toBe('defaultValue');
  const resultAdmin = configAdmin.get<string>('key');
  expect(resultAdmin).toBe('adminValue');
});
