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

// Import to access mocked functionionalities such as using vi.mock (we don't want to actually call node:fs methods)
import * as fs from 'node:fs';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { ApiSenderType } from '/@/plugin/api.js';
import {
  CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE,
  CONFIGURATION_SYSTEM_MANAGED_LOCKED_SCOPE,
} from '/@api/configuration/constants.js';
import type { IConfigurationNode } from '/@api/configuration/models.js';
import type { IDisposable } from '/@api/disposable.js';

import { ConfigurationRegistry } from './configuration-registry.js';
import type { DefaultConfiguration } from './default-configuration.js';
import type { Directories } from './directories.js';
import type { LockedConfiguration } from './locked-configuration.js';
import type { NotificationRegistry } from './tasks/notification-registry.js';

// mock the fs module
vi.mock('node:fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  cpSync: vi.fn(),
  promises: {
    access: vi.fn(),
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    readFile: vi.fn(),
    copyFile: vi.fn(),
  },
}));

// mock DefaultConfiguration for the new managed defaults functionality
vi.mock(import('./default-configuration.js'), () => ({
  DefaultConfiguration: vi.fn(),
}));

// mock LockedConfiguration for the new managed locked functionality
vi.mock(import('./locked-configuration.js'), () => ({
  LockedConfiguration: vi.fn(),
}));

let configurationRegistry: ConfigurationRegistry;

const getConfigurationDirectoryMock = vi.fn();
const getManagedDefaultsDirectoryMock = vi.fn();
const directories = {
  getConfigurationDirectory: getConfigurationDirectoryMock,
  getManagedDefaultsDirectory: getManagedDefaultsDirectoryMock,
} as unknown as Directories;
const apiSender = {
  send: vi.fn(),
} as unknown as ApiSenderType;

const notificationRegistry = {
  addNotification: vi.fn(),
} as unknown as NotificationRegistry;

let registerConfigurationsDisposable: IDisposable;

const getContentMock = vi.fn();
const defaultConfiguration = {
  getContent: getContentMock,
} as unknown as DefaultConfiguration;

const getLockedContentMock = vi.fn();
const lockedConfiguration = {
  getContent: getLockedContentMock,
} as unknown as LockedConfiguration;

beforeEach(async () => {
  vi.resetAllMocks();
  vi.clearAllMocks();
  getConfigurationDirectoryMock.mockReturnValue('/my-config-dir');
  getManagedDefaultsDirectoryMock.mockReturnValue('/usr/share/podman-desktop');

  // Mock basic fs functions needed for initialization
  const readFileSync = vi.mocked(fs.readFileSync);
  const accessMock = vi.mocked(fs.promises.access);
  const mkdirMock = vi.mocked(fs.promises.mkdir);
  const writeFileMock = vi.mocked(fs.promises.writeFile);
  const readFileMock = vi.mocked(fs.promises.readFile);
  const cpSync = vi.mocked(fs.cpSync);

  readFileSync.mockReturnValue(JSON.stringify({}));
  accessMock.mockResolvedValue(undefined);
  mkdirMock.mockResolvedValue(undefined);
  writeFileMock.mockResolvedValue(undefined);
  readFileMock.mockResolvedValue(JSON.stringify({}));
  cpSync.mockReturnValue(undefined);

  // Setup DefaultConfiguration mock for the new functionality
  getContentMock.mockResolvedValue({});

  // Setup LockedConfiguration mock for the new functionality
  getLockedContentMock.mockResolvedValue({});

  configurationRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
  await configurationRegistry.init();

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
  // Mock fs functions needed for this specific test
  const readFileSync = vi.mocked(fs.readFileSync);
  const accessMock = vi.mocked(fs.promises.access);
  const readFileMock = vi.mocked(fs.promises.readFile);
  const copyFileMock = vi.mocked(fs.promises.copyFile);

  getConfigurationDirectoryMock.mockReturnValue('/my-config-dir');

  configurationRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
  readFileSync.mockReturnValue('invalid JSON content');

  // Mock fs.promises methods for this test
  accessMock.mockResolvedValue(undefined);
  readFileMock.mockResolvedValue('invalid JSON content');
  copyFileMock.mockResolvedValue(undefined);

  // configuration is broken but it should not throw any error, just that config is empty
  const originalConsoleError = console.error;
  const mockedConsoleLog = vi.fn();
  console.error = mockedConsoleLog;
  try {
    (await configurationRegistry.init()).forEach(notification => notificationRegistry.addNotification(notification));
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
  expect(copyFileMock).toBeCalledWith(
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
  // Mock fs function needed for this specific test
  const writeFileSync = vi.mocked(fs.writeFileSync);

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

// Tests for applyManagedDefaults method
describe('applyManagedDefaults function tests', () => {
  let writeFileSync: ReturnType<typeof vi.mocked<typeof fs.writeFileSync>>;

  beforeEach(() => {
    writeFileSync = vi.mocked(fs.writeFileSync);
    writeFileSync.mockClear();
  });

  test('apply default-config.json values to undefined keys in config', async () => {
    // "Default" user config
    const managedDefaults = {
      'setting.foo': 'defaultValue1',
      'setting.bar': 'defaultValue2',
    };

    getContentMock.mockResolvedValue(managedDefaults);

    // Create the test registry
    const testRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
    await testRegistry.init();

    // Setup the values
    const configurationValues = (
      testRegistry as unknown as { configurationValues: Map<string, { [key: string]: unknown }> }
    ).configurationValues;
    const userConfig = configurationValues.get('DEFAULT');

    expect(userConfig?.['setting.foo']).toEqual('defaultValue1');
    expect(userConfig?.['setting.bar']).toEqual('defaultValue2');
  });

  test('do not overwrite existing user settings with defaults', async () => {
    const userSettings = {
      'setting.foo': 'userValue',
    };
    const managedDefaults = {
      'setting.foo': 'defaultValue1',
      'setting.bar': 'defaultValue2',
    };

    // Mock fs.promises.readFile to return user settings.json
    const readFileMock = vi.mocked(fs.promises.readFile);
    readFileMock.mockResolvedValue(JSON.stringify(userSettings));

    getContentMock.mockResolvedValue(managedDefaults);

    const testRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
    await testRegistry.init();

    const configurationValues = (
      testRegistry as unknown as { configurationValues: Map<string, { [key: string]: unknown }> }
    ).configurationValues;
    const userConfig = configurationValues.get('DEFAULT');

    // User's existing value should be preserved
    expect(userConfig?.['setting.foo']).toEqual('userValue');
    // Default should be applied for undefined key
    expect(userConfig?.['setting.bar']).toEqual('defaultValue2');
  });

  test('make sure that the user config remains unchanged when defaults are empty', async () => {
    getContentMock.mockResolvedValue({});

    const testRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
    await testRegistry.init();

    const configurationValues = (
      testRegistry as unknown as { configurationValues: Map<string, { [key: string]: unknown }> }
    ).configurationValues;
    const userConfig = configurationValues.get('DEFAULT');

    // Make sure it's still blank.. (nothing was added / changes, etc.)
    expect(userConfig).toEqual({});
  });

  test('handle any nested values / make sure entire object is copied', async () => {
    const managedDefaults = {
      'nested.setting': {
        nested: {
          value: 'nested',
        },
        array: [1, 2, 3],
      },
    };
    getContentMock.mockResolvedValue(managedDefaults);

    const testRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
    await testRegistry.init();
    const configurationValues = (
      testRegistry as unknown as { configurationValues: Map<string, { [key: string]: unknown }> }
    ).configurationValues;
    const userConfig = configurationValues.get('DEFAULT');

    // Make sure it matches the managedDefaults config
    expect(userConfig?.['nested.setting']).toEqual({
      nested: {
        value: 'nested',
      },
      array: [1, 2, 3],
    });
  });

  test('logs are shown to console', async () => {
    const managedDefaults = {
      'setting.foo': 'defaultValue1',
      'setting.bar': 'defaultValue2',
    };

    getContentMock.mockResolvedValue(managedDefaults);

    const originalConsoleLog = console.log;
    const mockedConsoleLog = vi.fn();
    console.log = mockedConsoleLog;

    // Make sure that the console log is called when the settings are applied on each run
    try {
      const testRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
      await testRegistry.init();

      expect(mockedConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[Managed-by]: Applied default settings for:'),
      );
      expect(mockedConsoleLog).toHaveBeenCalledWith(expect.stringContaining('setting.foo'));
      expect(mockedConsoleLog).toHaveBeenCalledWith(expect.stringContaining('setting.bar'));
    } finally {
      console.log = originalConsoleLog;
    }
  });

  test('check the applyManagedDefaults returns array of applied keys', async () => {
    const testRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
    await testRegistry.init();

    const configData: Record<string, unknown> = { existingKey: 'existingValue' };
    const defaults: Record<string, unknown> = {
      existingKey: 'defaultValue',
      newKey1: 'newValue1',
      newKey2: 'newValue2',
    };

    // Kindof hacky, but use applyManagedDefaults directly to test the return value, but gives
    // you a good return of what keys were applied
    const appliedKeys = (
      testRegistry as unknown as {
        applyManagedDefaults: (c: Record<string, unknown>, d: Record<string, unknown>) => string[];
      }
    ).applyManagedDefaults(configData, defaults);

    // Make sure all the keys were applied correctly!
    expect(appliedKeys).toEqual(['newKey1', 'newKey2']);
    expect(configData['existingKey']).toEqual('existingValue');
    expect(configData['newKey1']).toEqual('newValue1');
    expect(configData['newKey2']).toEqual('newValue2');
  });

  test('should call write to file (calls saveDefault) when managed defaults are applied', async () => {
    const managedDefaults = {
      'setting.foo': 'defaultValue1',
    };

    getContentMock.mockResolvedValue(managedDefaults);

    const testRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
    await testRegistry.init();

    // saveDefault should have been called (via writeFileSync)
    expect(writeFileSync).toHaveBeenCalled();
  });

  test('should NOT write to file when no managed defaults are applied', async () => {
    // No managed defaults
    getContentMock.mockResolvedValue({});

    const testRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
    await testRegistry.init();

    // saveDefault should NOT have been called
    expect(writeFileSync).not.toHaveBeenCalled();
  });

  test('should not persist managed default to settings.json if it matches schema default', async () => {
    // Managed default that matches the schema default
    const managedDefaults = {
      'my.fake.property': 'myDefault',
    };

    getContentMock.mockResolvedValue(managedDefaults);

    const testRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
    await testRegistry.init();

    // Register the configuration with schema default 'myDefault' (same as managed default)
    const node: IConfigurationNode = {
      id: 'my.fake.property',
      title: 'Fake Property',
      type: 'object',
      properties: {
        ['my.fake.property']: {
          description: 'Test property',
          type: 'string',
          default: 'myDefault',
        },
      },
    };
    testRegistry.registerConfigurations([node]);

    // Clear previous calls and trigger saveDefault to check what would be written
    // now that configurations are registered
    writeFileSync.mockClear();
    testRegistry.saveDefault();

    // The value should NOT be in the settings.json since it matches the schema default
    expect(writeFileSync).toHaveBeenCalled();
    const writtenContent = JSON.parse(writeFileSync.mock.calls[0]?.[1] as string);
    expect(writtenContent['my.fake.property']).toBeUndefined();
  });

  test('should persist managed default to settings.json if it differs from schema default', async () => {
    // Managed default that differs from schema default
    const managedDefaults = {
      'my.fake.property': 'customValue',
    };

    getContentMock.mockResolvedValue(managedDefaults);

    const testRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
    await testRegistry.init();

    // Register the configuration with schema default 'myDefault' (different from managed default)
    const node: IConfigurationNode = {
      id: 'my.fake.property',
      title: 'Fake Property',
      type: 'object',
      properties: {
        ['my.fake.property']: {
          description: 'Test property',
          type: 'string',
          default: 'myDefault',
        },
      },
    };
    testRegistry.registerConfigurations([node]);

    // Clear previous calls and trigger saveDefault to check what would be written
    writeFileSync.mockClear();
    testRegistry.saveDefault();

    // The value SHOULD be in the settings.json since it differs from schema default
    expect(writeFileSync).toHaveBeenCalled();
    const writtenContent = JSON.parse(writeFileSync.mock.calls[0]?.[1] as string);
    expect(writtenContent['my.fake.property']).toEqual('customValue');
  });
});

// Tests for the new managed defaults functionality
describe('Managed Defaults', () => {
  test('should load managed defaults configuration', async () => {
    const managedDefaults = { 'managed.setting': 'managedValue' };

    // Setup DefaultConfiguration mock to return specific defaults
    getContentMock.mockResolvedValue(managedDefaults);

    // Create new registry instance to test the managed defaults loading
    const testRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
    await testRegistry.init();

    // Access private configurationValues to verify managed defaults were loaded
    const configurationValues = (
      testRegistry as unknown as { configurationValues: Map<string, { [key: string]: unknown }> }
    ).configurationValues;
    const managedConfig = configurationValues.get(CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE);

    expect(managedConfig).toEqual(managedDefaults);
  });

  test('should handle empty managed defaults', async () => {
    // Setup DefaultConfiguration mock to return empty defaults
    getContentMock.mockResolvedValue({});

    // Create new registry instance
    const testRegistry = new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
    await testRegistry.init();

    // Access private configurationValues to verify empty managed defaults
    const configurationValues = (
      testRegistry as unknown as { configurationValues: Map<string, { [key: string]: unknown }> }
    ).configurationValues;
    const managedConfig = configurationValues.get(CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE);

    expect(managedConfig).toEqual({});
  });
});

// Tests for the new managed locked functionality
describe('Managed Locked', () => {
  test('should load managed locked configuration', async () => {
    const managedLocked = { locked: ['telemetry.enabled', 'some.other.setting'] };

    // Setup LockedConfiguration mock to return specific locked settings
    const testLockedConfiguration = {
      getContent: vi.fn().mockResolvedValue(managedLocked),
    } as unknown as LockedConfiguration;

    // Create new registry instance to test the managed locked loading
    const testRegistry = new ConfigurationRegistry(
      apiSender,
      directories,
      defaultConfiguration,
      testLockedConfiguration,
    );
    await testRegistry.init();

    // Access private configurationValues to verify managed locked were loaded
    const configurationValues = (
      testRegistry as unknown as { configurationValues: Map<string, { [key: string]: unknown }> }
    ).configurationValues;
    const managedConfig = configurationValues.get(CONFIGURATION_SYSTEM_MANAGED_LOCKED_SCOPE);

    expect(managedConfig).toEqual(managedLocked);
  });

  test('should handle empty managed locked', async () => {
    // Setup LockedConfiguration mock to return empty locked
    const testLockedConfiguration = {
      getContent: vi.fn().mockResolvedValue({}),
    } as unknown as LockedConfiguration;

    // Create new registry instance
    const testRegistry = new ConfigurationRegistry(
      apiSender,
      directories,
      defaultConfiguration,
      testLockedConfiguration,
    );
    await testRegistry.init();

    // Access private configurationValues to verify empty managed locked
    const configurationValues = (
      testRegistry as unknown as { configurationValues: Map<string, { [key: string]: unknown }> }
    ).configurationValues;
    const managedConfig = configurationValues.get(CONFIGURATION_SYSTEM_MANAGED_LOCKED_SCOPE);

    expect(managedConfig).toEqual({});
  });

  test('should mark configuration properties as locked when they appear in locked.json', async () => {
    // We'll use foo.enabled and security.setting as locked properties for this test
    const managedLocked = { locked: ['foo.enabled', 'security.setting'] };
    const testLockedConfiguration = {
      getContent: vi.fn().mockResolvedValue(managedLocked),
    } as unknown as LockedConfiguration;

    const testRegistry = new ConfigurationRegistry(
      apiSender,
      directories,
      defaultConfiguration,
      testLockedConfiguration,
    );
    await testRegistry.init();

    // Two settings to register
    const nodes: IConfigurationNode[] = [
      {
        id: 'foo',
        title: 'This Foobar Setting',
        type: 'object',
        properties: {
          'foo.enabled': {
            description: 'Enable foo',
            type: 'boolean',
            default: false,
          },
        },
      },
      {
        id: 'other',
        title: 'Some Other Settings',
        type: 'object',
        properties: {
          'other.setting': {
            description: 'Some other setting',
            type: 'string',
            default: 'value',
          },
        },
      },
    ];

    testRegistry.registerConfigurations(nodes);

    const properties = testRegistry.getConfigurationProperties();

    // telemetry.enabled should be marked as locked
    expect(properties['foo.enabled']).toBeDefined();
    expect(properties['foo.enabled']?.locked).toBe(true);

    // other.setting should NOT be marked as locked
    expect(properties['other.setting']).toBeDefined();
    expect(properties['other.setting']?.locked).toBe(false);
  });
});
