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

import * as path from 'node:path';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { ApiSenderType } from '/@/plugin/api.js';
import { CONFIGURATION_MANAGED_DEFAULTS_SCOPE } from '/@api/configuration/constants.js';
import type { IConfigurationNode } from '/@api/configuration/models.js';
import type { IDisposable } from '/@api/disposable.js';

import { ConfigurationRegistry } from './configuration-registry.js';
import type { Directories } from './directories.js';
import type { NotificationRegistry } from './tasks/notification-registry.js';

vi.mock('node:fs', () => ({
  readFileSync: vi.fn(),
  cpSync: vi.fn(),
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

const { readFileSync, cpSync, existsSync, mkdirSync, writeFileSync } = await import('node:fs');

let configurationRegistry: ConfigurationRegistry;

// mock util functions
vi.mock('../util.js', () => ({
  isMac: vi.fn(),
  isWindows: vi.fn(),
  isLinux: vi.fn(),
}));

const { isMac, isWindows, isLinux } = await import('../util.js');

const getConfigurationDirectoryMock = vi.fn();
const directories = {
  getConfigurationDirectory: getConfigurationDirectoryMock,
} as unknown as Directories;
const apiSender = {
  send: vi.fn(),
} as unknown as ApiSenderType;

const notificationRegistry = {
  addNotification: vi.fn(),
} as unknown as NotificationRegistry;

let registerConfigurationsDisposable: IDisposable;

beforeEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
  getConfigurationDirectoryMock.mockReturnValue('/my-config-dir');
  vi.mocked(existsSync).mockReturnValue(true);
  vi.mocked(mkdirSync).mockReturnValue(undefined);
  vi.mocked(writeFileSync).mockReturnValue(undefined);

  configurationRegistry = new ConfigurationRegistry(apiSender, directories);
  vi.mocked(readFileSync).mockReturnValue(JSON.stringify({}));

  vi.mocked(cpSync).mockReturnValue(undefined);
  configurationRegistry.init();

  const node: IConfigurationNode = {
    id: 'my.fake.property',
    title: 'Fake Property',
    type: 'object',
    properties: {
      ['my.fake.property']: {
        description: 'Autostart container engine when launching Podman Desktop',
        type: 'string',
        default: 'myDefault',
      },
    },
  };

  registerConfigurationsDisposable = configurationRegistry.registerConfigurations([node]);
});

describe('should be notified when a configuration is changed', async () => {
  test('affectsConfiguration exact name', async () => {
    let expectAffectsConfiguration;
    let called = false;
    let updatedValue;
    configurationRegistry.onDidChangeConfigurationAPI(e => {
      called = true;
      expectAffectsConfiguration = e.affectsConfiguration('my.fake.property');
      if (expectAffectsConfiguration) {
        updatedValue = configurationRegistry.getConfiguration('my.fake')?.get<string>('property');
      }
    });
    await configurationRegistry.updateConfigurationValue('my.fake.property', 'myValue');

    expect(called).toBeTruthy();
    expect(expectAffectsConfiguration).toBeTruthy();
    expect(updatedValue).toEqual('myValue');
  });

  test('affectsConfiguration partial name', async () => {
    let expectAffectsConfiguration;
    let called = false;
    let updatedValue;
    configurationRegistry.onDidChangeConfigurationAPI(e => {
      called = true;
      // use a parent property name
      expectAffectsConfiguration = e.affectsConfiguration('my.fake');
      if (expectAffectsConfiguration) {
        updatedValue = configurationRegistry.getConfiguration('my.fake')?.get<string>('property');
      }
    });
    await configurationRegistry.updateConfigurationValue('my.fake.property', 'myValue');

    expect(called).toBeTruthy();
    expect(expectAffectsConfiguration).toBeTruthy();
    expect(updatedValue).toEqual('myValue');
  });

  test('affectsConfiguration different name', async () => {
    let expectAffectsConfiguration;
    let called = false;

    configurationRegistry.onDidChangeConfigurationAPI(e => {
      called = true;
      // should not match
      expectAffectsConfiguration = e.affectsConfiguration('my.other.property');
    });
    await configurationRegistry.updateConfigurationValue('my.fake.property', 'myValue');

    expect(called).toBeTruthy();
    expect(expectAffectsConfiguration).toBeFalsy();
  });

  test('affectsConfiguration called twice when updating value with two scopes', async () => {
    let expectAffectsConfiguration: boolean;
    let called = false;
    let callNumber = 0;
    let updatedValue: unknown;
    configurationRegistry.onDidChangeConfiguration(() => {
      callNumber += 1;
    });
    configurationRegistry.onDidChangeConfigurationAPI(e => {
      called = true;
      // use a parent property name
      expectAffectsConfiguration = e.affectsConfiguration('my.fake');
      if (expectAffectsConfiguration) {
        updatedValue = configurationRegistry.getConfiguration('my.fake')?.get<string>('property');
      }
    });

    await configurationRegistry.updateConfigurationValue('my.fake.property', 'myValue', ['DEFAULT', 'scope']);

    expect(called).toBeTruthy();
    expect(callNumber).toBe(2);
    expect(updatedValue).toEqual('myValue');
  });
});

test('Should not find configuration after dispose', async () => {
  let records = configurationRegistry.getConfigurationProperties();
  const record = records['my.fake.property'];
  expect(record).toBeDefined();
  registerConfigurationsDisposable.dispose();

  // should be removed after disposable
  records = configurationRegistry.getConfigurationProperties();
  const afterDisposeRecord = records['my.fake.property'];
  expect(afterDisposeRecord).toBeUndefined();
});

test('should work with an invalid configuration file', async () => {
  getConfigurationDirectoryMock.mockReturnValue('/my-config-dir');

  configurationRegistry = new ConfigurationRegistry(apiSender, directories);
  vi.mocked(readFileSync).mockReturnValue('invalid JSON content');

  // configuration is broken but it should not throw any error, just that config is empty
  const originalConsoleError = console.error;
  const mockedConsoleLog = vi.fn();
  console.error = mockedConsoleLog;
  try {
    configurationRegistry.init().forEach(notification => notificationRegistry.addNotification(notification));
  } finally {
    console.error = originalConsoleError;
  }

  expect(configurationRegistry.getConfigurationProperties()).toEqual({});
  expect(mockedConsoleLog).toBeCalledWith(expect.stringContaining('Unable to parse'), expect.anything());

  // check we added a notification
  expect(notificationRegistry.addNotification).toBeCalledWith(
    expect.objectContaining({ highlight: true, type: 'warn', title: 'Corrupted configuration file' }),
  );

  // check we did a backup of the file
  expect(cpSync).toBeCalledWith(
    expect.stringContaining('settings.json'),
    expect.stringContaining('settings.json.backup'),
  );
});

test('addConfigurationEnum', async () => {
  const enumNode: IConfigurationNode = {
    id: 'my.enum.property',
    title: 'Fake Enum Property',
    type: 'object',
    properties: {
      ['my.fake.enum.property']: {
        description: 'Autostart container engine when launching Podman Desktop',
        type: 'string',
        default: 'myDefault',
        enum: ['myValue1', 'myValue2'],
      },
    },
  };

  configurationRegistry.registerConfigurations([enumNode]);

  // now call the addConfigurationEnum
  const disposable = configurationRegistry.addConfigurationEnum('my.fake.enum.property', ['myValue3'], 'myDefault');

  const records = configurationRegistry.getConfigurationProperties();
  const record = records['my.fake.enum.property'];
  expect(record).toBeDefined();
  expect(record?.enum).toEqual(['myValue1', 'myValue2', 'myValue3']);

  // now call the dispose
  disposable.dispose();

  // should be removed after disposable

  const afterDisposeRecord = records['my.fake.enum.property'];
  expect(afterDisposeRecord).toBeDefined();
  expect(afterDisposeRecord?.enum).toEqual(['myValue1', 'myValue2']);
});

test('addConfigurationEnum with a previous default value', async () => {
  const enumNode: IConfigurationNode = {
    id: 'my.enum.property',
    title: 'Fake Enum Property',
    type: 'object',
    properties: {
      ['my.fake.enum.property']: {
        description: 'Autostart container engine when launching Podman Desktop',
        type: 'string',
        default: 'myDefault',
        enum: ['myValue1', 'myValue2'],
      },
    },
  };

  configurationRegistry.registerConfigurations([enumNode]);

  // now call the addConfigurationEnum
  const disposable = configurationRegistry.addConfigurationEnum('my.fake.enum.property', ['myValue3'], 'myValue1');

  // set value to myValue3
  await configurationRegistry.updateConfigurationValue('my.fake.enum.property', 'myValue3');

  const records = configurationRegistry.getConfigurationProperties();
  const record = records['my.fake.enum.property'];
  expect(record).toBeDefined();
  expect(record?.enum).toEqual(['myValue1', 'myValue2', 'myValue3']);

  // now call the dispose
  disposable.dispose();

  // check default property is no longer 'myValue3' but it is defaulted to myValue1
  const val = configurationRegistry.getConfiguration('my.fake')?.get<string>('enum.property');
  expect(val).toEqual('myValue1');
});

test('check to be able to register a property with a group', async () => {
  const node: IConfigurationNode = {
    id: 'custom',
    title: 'Fake Property',
    properties: {
      'my.fake.property': {
        description: 'property being part of a group',
        type: 'string',
        group: 'myGroup',
        default: 'myDefault',
      },
    },
  };

  configurationRegistry.registerConfigurations([node]);

  const records = configurationRegistry.getConfigurationProperties();
  const record = records['my.fake.property'];
  expect(record).toBeDefined();
  expect(record?.group).toEqual('myGroup');
});

test('check to be able to register a property with DockerCompatibility scope', async () => {
  const node: IConfigurationNode = {
    id: 'custom',
    title: 'Fake Property',
    properties: {
      'my.fake.property': {
        description: 'property being part of a group',
        type: 'string',
        scope: 'DockerCompatibility',
        default: 'myDefault',
      },
    },
  };

  configurationRegistry.registerConfigurations([node]);

  const records = configurationRegistry.getConfigurationProperties();
  const record = records['my.fake.property'];
  expect(record).toBeDefined();
  expect(record?.scope).toEqual('DockerCompatibility');
});

describe('should be notified when a configuration is updated', async () => {
  test('expect correct properties', async () => {
    const listener = vi.fn();
    configurationRegistry.onDidUpdateConfiguration(listener);
    const config = configurationRegistry.getConfiguration('my.fake.property', 'myValue');
    await config.update('myKey', 'myValue');

    expect(listener).toBeTruthy();
    expect(listener).toBeCalledWith({ properties: ['myKey'] });
    expect(config.get('myKey')).toBe('myValue');
  });
});

test('should remove the object configuration if value is equal to default one', async () => {
  const node: IConfigurationNode = {
    id: 'custom',
    title: 'Test Object Property',
    properties: {
      'test.prop': {
        description: 'test property',
        type: 'array',
        default: [
          { label: 'foo', value: 1 },
          { label: 'bar', value: 2 },
        ],
      },
    },
  };

  configurationRegistry.registerConfigurations([node]);

  await configurationRegistry.updateConfigurationValue('test.prop', [
    { label: 'bar', value: 1 },
    { label: 'foo', value: 2 },
  ]);
  let value = configurationRegistry.getConfiguration('test').get('prop');
  expect(value).toEqual([
    { label: 'bar', value: 1 },
    { label: 'foo', value: 2 },
  ]);

  // Should remove the value from config file
  await configurationRegistry.updateConfigurationValue('test.prop', [
    { label: 'foo', value: 1 },
    { label: 'bar', value: 2 },
  ]);
  value = configurationRegistry.getConfiguration('test').get('prop');
  expect(value).toEqual([
    { label: 'foo', value: 1 },
    { label: 'bar', value: 2 },
  ]);

  expect(writeFileSync).toHaveBeenNthCalledWith(
    2,
    expect.anything(),
    expect.stringContaining(JSON.stringify({}, undefined, 2)),
  );
});

describe('Managed Defaults', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();

    // Fake the configuration directory + values first writing / reading to file
    getConfigurationDirectoryMock.mockReturnValue('/my-config-dir');
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(mkdirSync).mockReturnValue(undefined);
    vi.mocked(writeFileSync).mockReturnValue(undefined);
    vi.mocked(cpSync).mockReturnValue(undefined);
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify({}));
  });

  test('should get correct managed defaults file path for Mac', () => {
    vi.mocked(isMac).mockReturnValue(true);
    vi.mocked(isWindows).mockReturnValue(false);
    vi.mocked(isLinux).mockReturnValue(false);

    const registry = new ConfigurationRegistry(apiSender, directories);
    const managedDefaultsFile = registry['getManagedDefaultsFile']();
    expect(managedDefaultsFile).toBe('/Library/Application Support/com.podman.desktop/default-settings.json');
  });

  test('should get correct managed defaults file path for Windows', () => {
    vi.mocked(isMac).mockReturnValue(false);
    vi.mocked(isWindows).mockReturnValue(true);
    vi.mocked(isLinux).mockReturnValue(false);

    process.env['PROGRAMDATA'] = 'C:\\ProgramData';
    const registry = new ConfigurationRegistry(apiSender, directories);
    const managedDefaultsFile = registry['getManagedDefaultsFile']();
    expect(managedDefaultsFile).toBe(path.join('C:\\ProgramData', 'PodmanDesktop', 'default-settings.json'));
  });

  test('should get correct managed defaults file path for Linux', () => {
    vi.mocked(isMac).mockReturnValue(false);
    vi.mocked(isWindows).mockReturnValue(false);
    vi.mocked(isLinux).mockReturnValue(true);

    const registry = new ConfigurationRegistry(apiSender, directories);
    const managedDefaultsFile = registry['getManagedDefaultsFile']();
    expect(managedDefaultsFile).toBe('/usr/share/podman-desktop/default-settings.json');
  });

  // If all else fails, fallback to Linux (since sometimes there are unknown platforms such as FreeBSD which are unix-like which try to run Podman Desktop)
  test('should fallback to Linux path for unknown platforms', () => {
    vi.mocked(isMac).mockReturnValue(false);
    vi.mocked(isWindows).mockReturnValue(false);
    vi.mocked(isLinux).mockReturnValue(false);

    const registry = new ConfigurationRegistry(apiSender, directories);
    const managedDefaultsFile = registry['getManagedDefaultsFile']();
    expect(managedDefaultsFile).toBe('/usr/share/podman-desktop/default-settings.json');
  });

  test('should load managed defaults when file exists', () => {
    const managedDefaults = { 'managed.setting': 'managedValue' };
    vi.mocked(existsSync).mockImplementation(filePath => {
      return (typeof filePath === 'string' && filePath.includes('default-settings.json')) || true;
    });
    vi.mocked(readFileSync).mockImplementation(filePath => {
      if (typeof filePath === 'string' && filePath.includes('default-settings.json')) {
        return JSON.stringify(managedDefaults);
      }
      return JSON.stringify({});
    });

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const registry = new ConfigurationRegistry(apiSender, directories);
    registry.init();

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Loaded managed defaults from:'));
    consoleSpy.mockRestore();
  });

  test('should handle missing managed defaults file gracefully', () => {
    vi.mocked(existsSync).mockImplementation(filePath => {
      return !(typeof filePath === 'string' && filePath.includes('default-settings.json'));
    });

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const registry = new ConfigurationRegistry(apiSender, directories);
    registry.init();

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Managed defaults file not found at:'));
    consoleSpy.mockRestore();
  });

  test('should handle corrupted managed defaults file gracefully', () => {
    vi.mocked(existsSync).mockImplementation(filePath => {
      return (typeof filePath === 'string' && filePath.includes('default-settings.json')) || true;
    });

    // Purposely return invalid JSON
    vi.mocked(readFileSync).mockImplementation(filePath => {
      if (typeof filePath === 'string' && filePath.includes('default-settings.json')) {
        return 'invalid json';
      }
      return JSON.stringify({});
    });

    // Expect us to "fail" well
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const registry = new ConfigurationRegistry(apiSender, directories);
    registry.init();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to parse managed defaults from'),
      expect.anything(),
    );
  });

  test('should load managed defaults configuration with valid JSON', () => {
    // "test" values
    const managedDefaults = { 'managed.setting': 'managedValue', 'another.setting': 'anotherValue' };

    // Mock the file system loading the files (JSON too)
    vi.mocked(existsSync).mockImplementation(filePath => {
      return (typeof filePath === 'string' && filePath.includes('default-settings.json')) || true;
    });
    vi.mocked(readFileSync).mockImplementation(filePath => {
      if (typeof filePath === 'string' && filePath.includes('default-settings.json')) {
        return JSON.stringify(managedDefaults);
      }
      return JSON.stringify({});
    });

    const registry = new ConfigurationRegistry(apiSender, directories);
    registry.init();

    // We expect the file loaded to be the same from the const managedDefaults vs configurationValues.get()
    const configurationValues = registry['configurationValues'];
    const managedConfig = configurationValues.get(CONFIGURATION_MANAGED_DEFAULTS_SCOPE);
    expect(managedConfig).toEqual(managedDefaults);
  });
});
