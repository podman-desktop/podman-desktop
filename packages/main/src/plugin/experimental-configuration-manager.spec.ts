/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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

import type { Configuration } from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { ConfigurationRegistry } from './configuration-registry.js';
import { ExperimentalConfigurationManager } from './experimental-configuration-manager.js';

const mockedConfigurationRegistry = {
  updateConfigurationValue: vi.fn(),
  getConfiguration: vi.fn(),
} as unknown as ConfigurationRegistry;

let experimentalConfigurationManager: ExperimentalConfigurationManager;

beforeEach(() => {
  vi.resetAllMocks();
  experimentalConfigurationManager = new ExperimentalConfigurationManager(mockedConfigurationRegistry);
});

describe('ExperimentalConfigurationManager', () => {
  describe('parseKey', () => {
    test('should parse valid configuration key with section and property', () => {
      const result = experimentalConfigurationManager.parseKey('kubernetes.statesExperimental');
      expect(result).toEqual({
        section: 'kubernetes',
        property: 'statesExperimental',
      });
    });

    test('should parse key with multiple dots correctly', () => {
      const result = experimentalConfigurationManager.parseKey('kubernetes.nested.property');
      expect(result).toEqual({
        section: 'kubernetes',
        property: 'nested.property',
      });
    });

    test('should return empty strings for key without dot', () => {
      const result = experimentalConfigurationManager.parseKey('kubernetes');
      expect(result).toEqual({
        section: '',
        property: '',
      });
    });

    test('should return empty strings for key starting with dot', () => {
      const result = experimentalConfigurationManager.parseKey('.kubernetes');
      expect(result).toEqual({
        section: '',
        property: '',
      });
    });

    test('should return empty strings for key ending with dot', () => {
      const result = experimentalConfigurationManager.parseKey('kubernetes.');
      expect(result).toEqual({
        section: '',
        property: '',
      });
    });

    test('should return empty strings for empty string', () => {
      const result = experimentalConfigurationManager.parseKey('');
      expect(result).toEqual({
        section: '',
        property: '',
      });
    });
  });

  describe('updateExperimentalConfigurationValue', () => {
    test('should update configuration with object value by stringifying and parsing', async () => {
      const config = { enabled: true };
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';

      await experimentalConfigurationManager.updateExperimentalConfigurationValue(key, config, scope);

      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(key, { enabled: true }, scope);
    });

    test('should update configuration with non-object value directly', async () => {
      const config = 'string-value';
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';

      await experimentalConfigurationManager.updateExperimentalConfigurationValue(key, config, scope);

      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(key, config, scope);
    });

    test('should update configuration without scope', async () => {
      const config = { enabled: true };
      const key = 'kubernetes.statesExperimental';

      await experimentalConfigurationManager.updateExperimentalConfigurationValue(key, config);

      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
        key,
        { enabled: true },
        undefined,
      );
    });

    test('should handle undefined config value', async () => {
      const config = undefined;
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';

      await experimentalConfigurationManager.updateExperimentalConfigurationValue(key, config, scope);

      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(key, undefined, scope);
    });
  });

  describe('enableExperimentalConfiguration', () => {
    test('should enable configuration with single scope', async () => {
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';
      const mockConfig = { get: vi.fn().mockReturnValue(undefined) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      await experimentalConfigurationManager.enableExperimentalConfiguration(key, scope);

      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(key, { enabled: true }, scope);
    });

    test('should enable configuration with array of scopes', async () => {
      const key = 'kubernetes.statesExperimental';
      const scopes = ['DEFAULT', 'ContainerConnection'];
      const mockConfig = { get: vi.fn().mockReturnValue(undefined) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      await experimentalConfigurationManager.enableExperimentalConfiguration(key, scopes);

      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledTimes(2);
      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenNthCalledWith(
        1,
        key,
        { enabled: true },
        scopes[0],
      );
      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenNthCalledWith(
        2,
        key,
        { enabled: true },
        scopes[1],
      );
    });

    test('should enable configuration without scope', async () => {
      const key = 'kubernetes.statesExperimental';
      const mockConfig = { get: vi.fn().mockReturnValue(undefined) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      await experimentalConfigurationManager.enableExperimentalConfiguration(key);

      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
        key,
        { enabled: true },
        undefined,
      );
    });

    test('should preserve existing properties when enabling', async () => {
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';
      const existingConfig = { remindAt: 123456, dialogDisabled: false };
      const mockConfig = { get: vi.fn().mockReturnValue(existingConfig) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      await experimentalConfigurationManager.enableExperimentalConfiguration(key, scope);

      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
        key,
        { remindAt: 123456, dialogDisabled: false, enabled: true },
        scope,
      );
    });
  });

  describe('disableExperimentalConfiguration', () => {
    test('should disable configuration with single scope', async () => {
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';
      const mockConfig = { get: vi.fn().mockReturnValue(undefined) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      await experimentalConfigurationManager.disableExperimentalConfiguration(key, scope);

      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(key, { enabled: false }, scope);
    });

    test('should disable configuration with array of scopes', async () => {
      const key = 'kubernetes.statesExperimental';
      const scopes = ['DEFAULT', 'ContainerConnection'];
      const mockConfig = { get: vi.fn().mockReturnValue(undefined) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      await experimentalConfigurationManager.disableExperimentalConfiguration(key, scopes);

      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledTimes(2);
      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenNthCalledWith(
        1,
        key,
        { enabled: false },
        scopes[0],
      );
      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenNthCalledWith(
        2,
        key,
        { enabled: false },
        scopes[1],
      );
    });

    test('should disable configuration without scope', async () => {
      const key = 'kubernetes.statesExperimental';
      const mockConfig = { get: vi.fn().mockReturnValue(undefined) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      await experimentalConfigurationManager.disableExperimentalConfiguration(key);

      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
        key,
        { enabled: false },
        undefined,
      );
    });

    test('should preserve existing properties when disabling', async () => {
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';
      const existingConfig = { remindAt: 123456, dialogDisabled: false, enabled: true };
      const mockConfig = { get: vi.fn().mockReturnValue(existingConfig) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      await experimentalConfigurationManager.disableExperimentalConfiguration(key, scope);

      expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
        key,
        { remindAt: 123456, dialogDisabled: false, enabled: false },
        scope,
      );
    });
  });

  describe('isExperimentalConfigurationEnabled', () => {
    test('should return true when configuration has enabled: true', () => {
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';
      const mockConfig = { get: vi.fn().mockReturnValue({ enabled: true }) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      const result = experimentalConfigurationManager.isExperimentalConfigurationEnabled(key, scope);

      expect(result).toBe(true);
      expect(mockedConfigurationRegistry.getConfiguration).toHaveBeenCalledWith('kubernetes', scope);
      expect(mockConfig.get).toHaveBeenCalledWith('statesExperimental');
    });

    test('should return false when configuration has enabled: false', () => {
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';
      const mockConfig = { get: vi.fn().mockReturnValue({ enabled: false }) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      const result = experimentalConfigurationManager.isExperimentalConfigurationEnabled(key, scope);

      expect(result).toBe(false);
    });

    test('should return true for backward compatibility when object has no enabled property', () => {
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';
      const mockConfig = { get: vi.fn().mockReturnValue({ remindAt: 123456, dialogDisabled: false }) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      const result = experimentalConfigurationManager.isExperimentalConfigurationEnabled(key, scope);

      expect(result).toBe(true);
    });

    test('should return false when configuration is not an object', () => {
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';
      const mockConfig = { get: vi.fn().mockReturnValue('string-value') };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      const result = experimentalConfigurationManager.isExperimentalConfigurationEnabled(key, scope);

      expect(result).toBe(false);
    });

    test('should return false when configuration is undefined', () => {
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';
      const mockConfig = { get: vi.fn().mockReturnValue(undefined) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      const result = experimentalConfigurationManager.isExperimentalConfigurationEnabled(key, scope);

      expect(result).toBe(false);
    });

    test('should return value when configuration is boolean true', () => {
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';
      const mockConfig = { get: vi.fn().mockReturnValue(true) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      const result = experimentalConfigurationManager.isExperimentalConfigurationEnabled(key, scope);

      expect(result).toBe(true);
    });

    test('should return value when configuration is boolean false', () => {
      const key = 'kubernetes.statesExperimental';
      const scope = 'DEFAULT';
      const mockConfig = { get: vi.fn().mockReturnValue(false) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      const result = experimentalConfigurationManager.isExperimentalConfigurationEnabled(key, scope);

      expect(result).toBe(false);
    });

    test('should return false for invalid key without section or property', () => {
      const key = 'invalid-key';

      const result = experimentalConfigurationManager.isExperimentalConfigurationEnabled(key);

      expect(result).toBe(false);
      expect(mockedConfigurationRegistry.getConfiguration).not.toHaveBeenCalled();
    });

    test('should work without scope', () => {
      const key = 'kubernetes.statesExperimental';
      const mockConfig = { get: vi.fn().mockReturnValue({ enabled: true }) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      const result = experimentalConfigurationManager.isExperimentalConfigurationEnabled(key);

      expect(result).toBe(true);
      expect(mockedConfigurationRegistry.getConfiguration).toHaveBeenCalledWith('kubernetes', undefined);
    });

    test('should check array of scopes and return true if any scope has object value', () => {
      const key = 'kubernetes.statesExperimental';
      const scopes = ['DEFAULT', 'ContainerConnection'];

      const mockConfig1 = { get: vi.fn().mockReturnValue(undefined) };
      const mockConfig2 = { get: vi.fn().mockReturnValue({ enabled: true }) };

      vi.mocked(mockedConfigurationRegistry.getConfiguration)
        .mockReturnValueOnce(mockConfig1 as unknown as Configuration)
        .mockReturnValueOnce(mockConfig2 as unknown as Configuration);

      const result = experimentalConfigurationManager.isExperimentalConfigurationEnabled(key, scopes);

      expect(result).toBe(true);
      expect(mockedConfigurationRegistry.getConfiguration).toHaveBeenCalledTimes(2);
      expect(mockedConfigurationRegistry.getConfiguration).toHaveBeenNthCalledWith(1, 'kubernetes', scopes[0]);
      expect(mockedConfigurationRegistry.getConfiguration).toHaveBeenNthCalledWith(2, 'kubernetes', scopes[1]);
    });

    test('should check array of scopes and return false if no scope has object value', () => {
      const key = 'kubernetes.statesExperimental';
      const scopes = ['DEFAULT', 'ContainerConnection'];

      const mockConfig1 = { get: vi.fn().mockReturnValue(undefined) };
      const mockConfig2 = { get: vi.fn().mockReturnValue('string') };

      vi.mocked(mockedConfigurationRegistry.getConfiguration)
        .mockReturnValueOnce(mockConfig1 as unknown as Configuration)
        .mockReturnValueOnce(mockConfig2 as unknown as Configuration);

      const result = experimentalConfigurationManager.isExperimentalConfigurationEnabled(key, scopes);

      expect(result).toBe(false);
      expect(mockedConfigurationRegistry.getConfiguration).toHaveBeenCalledTimes(2);
    });

    test.each([
      {
        name: 'config not in settings (undefined)',
        configValue: undefined,
        expected: false,
      },
      {
        name: 'enabled with true',
        configValue: { enabled: true },
        expected: true,
      },
      {
        name: 'disabled with false',
        configValue: { enabled: false },
        expected: false,
      },
      {
        name: 'enabled with {}',
        configValue: {},
        expected: true,
      },
      {
        name: 'enabled by having some data in object',
        configValue: { remindAt: 123456, dialogDisabled: false },
        expected: true,
      },
      {
        name: 'with both disabled and dialogDisabled props',
        configValue: { disabled: false, dialogDisabled: true, remindAt: 123456 },
        expected: true,
      },
      {
        name: 'with enabled: true, disabled and dialogDisabled props',
        configValue: { enabled: true, disabled: false, dialogDisabled: true, remindAt: 123456 },
        expected: true,
      },
      {
        name: 'with enabled: false, disabled and dialogDisabled props',
        configValue: { enabled: false, disabled: false, dialogDisabled: true, remindAt: 123456 },
        expected: false,
      },
    ])('should handle $name correctly', ({ configValue, expected }) => {
      const key = 'kubernetes.statesExperimental';
      const mockConfig = { get: vi.fn().mockReturnValue(configValue) };
      vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

      const result = experimentalConfigurationManager.isExperimentalConfigurationEnabled(key);

      expect(result).toBe(expected);
    });
  });

  test.each([
    {
      name: 'enable when config not in settings (undefined)',
      currentConfig: undefined,
      expectedSettings: { enabled: true },
    },
    {
      name: 'enable when config is {}',
      currentConfig: {},
      expectedSettings: { enabled: true },
    },
    {
      name: 'enable when config has some data',
      currentConfig: { remindAt: 123456, dialogDisabled: false },
      expectedSettings: { remindAt: 123456, dialogDisabled: false, enabled: true },
    },
    {
      name: 'enable when config has enabled: false',
      currentConfig: { enabled: false, dialogDisabled: false, remindAt: 123456 },
      expectedSettings: { enabled: true, dialogDisabled: false, remindAt: 123456 },
    },
  ])('should $name', async ({ currentConfig, expectedSettings }) => {
    const key = 'kubernetes.statesExperimental';
    const scope = 'DEFAULT';
    const mockConfig = { get: vi.fn().mockReturnValue(currentConfig) };
    vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

    await experimentalConfigurationManager.enableExperimentalConfiguration(key, scope);

    expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(key, expectedSettings, scope);
  });

  test.each([
    {
      name: 'disable when config not in settings (undefined)',
      currentConfig: undefined,
      expectedSettings: { enabled: false },
    },
    {
      name: 'disable when config is {}',
      currentConfig: {},
      expectedSettings: { enabled: false },
    },
    {
      name: 'disable when config has some data',
      currentConfig: { remindAt: 123456, dialogDisabled: false },
      expectedSettings: { remindAt: 123456, dialogDisabled: false, enabled: false },
    },
    {
      name: 'disable when config has enabled: true',
      currentConfig: { enabled: true, dialogDisabled: false, remindAt: 123456 },
      expectedSettings: { enabled: false, dialogDisabled: false, remindAt: 123456 },
    },
  ])('should $name', async ({ currentConfig, expectedSettings }) => {
    const key = 'kubernetes.statesExperimental';
    const scope = 'DEFAULT';
    const mockConfig = { get: vi.fn().mockReturnValue(currentConfig) };
    vi.mocked(mockedConfigurationRegistry.getConfiguration).mockReturnValue(mockConfig as unknown as Configuration);

    await experimentalConfigurationManager.disableExperimentalConfiguration(key, scope);

    expect(mockedConfigurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(key, expectedSettings, scope);
  });
});
