import type { Configuration } from '@podman-desktop/api';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import type { ApiSenderType } from '/@/plugin/api.js';
import { CONFIGURATION_DEFAULT_SCOPE, CONFIGURATION_ONBOARDING_SCOPE } from '/@api/configuration/constants.js';
import type { IConfigurationNode } from '/@api/configuration/models.js';

import { AutostopEngine } from './autostop-engine.js';
import { ConfigurationRegistry } from './configuration-registry.js';
import type { Directories } from './directories.js';
import type { ProviderRegistry } from './provider-registry.js';

let configurationRegistry: ConfigurationRegistry;
let providerRegistry: ProviderRegistry;
let autostopEngine: AutostopEngine;

const extensionId = 'id';
const extensionDisplayName = 'name';

const mockRegisterConfiguration = vi.fn();
const mockSetAutostop = vi.fn().mockResolvedValue('');

beforeEach(() => {
  vi.clearAllMocks();
});

/* eslint-disable @typescript-eslint/no-empty-function */
beforeAll(() => {
  configurationRegistry = new ConfigurationRegistry({} as ApiSenderType, {} as Directories);
  providerRegistry = {} as unknown as ProviderRegistry;
  autostopEngine = new AutostopEngine(configurationRegistry, providerRegistry);
  configurationRegistry.registerConfigurations = mockRegisterConfiguration;
  configurationRegistry.deregisterConfigurations = vi.fn();
  providerRegistry.setAutostop = mockSetAutostop;
});

test('Check that default value is false if provider autostop setting is not set', async () => {
  vi.spyOn(configurationRegistry, 'getConfiguration').mockImplementation(() => {
    return {
      get: (_section: string, defaultValue: boolean) => defaultValue,
    } as Configuration;
  });

  const autostopConfigurationNode: IConfigurationNode = {
    id: `preferences.${extensionId}.engine.autostop`,
    title: `Autostop ${extensionDisplayName} engine`,
    type: 'object',
    extension: {
      id: extensionId,
    },
    properties: {
      [`preferences.${extensionId}.engine.autostop`]: {
        description: `Automatically stop ${extensionDisplayName} engine when exiting Podman Desktop, even if it was started manually`,
        type: 'boolean',
        default: false,
        scope: [CONFIGURATION_DEFAULT_SCOPE, CONFIGURATION_ONBOARDING_SCOPE],
      },
    },
  };

  const disposable = autostopEngine.registerProvider(extensionId, extensionDisplayName, 'internalId');
  disposable.dispose();

  expect(mockRegisterConfiguration).toBeCalledWith([autostopConfigurationNode]);
});

test('Disposing the provider should not delete the configuration', async () => {
  vi.spyOn(configurationRegistry, 'getConfiguration').mockImplementation(() => {
    return {
      get: (_section: string, defaultValue: boolean) => defaultValue,
    } as Configuration;
  });

  const disposable = autostopEngine.registerProvider(extensionId, extensionDisplayName, 'internalId');
  disposable.dispose();

  expect(configurationRegistry.deregisterConfigurations).not.toHaveBeenCalled();
});

test('Check that setAutostop is called once if only one provider has registered autostop process and its setting is true', async () => {
  vi.spyOn(configurationRegistry, 'getConfiguration').mockImplementation(() => {
    return {
      get: (_section: string, _defaultValue: boolean) => true,
    } as Configuration;
  });

  const disposable = autostopEngine.registerProvider(extensionId, extensionDisplayName, 'internalId');

  disposable.dispose();
  expect(mockSetAutostop).toBeCalledTimes(1);
  expect(mockSetAutostop).toBeCalledWith('internalId', true);
});

test('Check that setAutostop is called once if only one provider has registered autostart process and its setting is false', async () => {
  vi.spyOn(configurationRegistry, 'getConfiguration').mockImplementation(() => {
    return {
      get: (_section: string, _defaultValue: boolean) => false,
    } as Configuration;
  });

  const disposable = autostopEngine.registerProvider(extensionId, extensionDisplayName, 'internalId');

  disposable.dispose();
  expect(mockSetAutostop).toBeCalledTimes(1);
  expect(mockSetAutostop).toBeCalledWith('internalId', false);
});

test('Check that setAutostop is called twice if only two providers has registered autstop process', async () => {
  vi.spyOn(configurationRegistry, 'getConfiguration').mockImplementation(() => {
    return {
      get: (_section: string, _defaultValue: boolean) => true,
    } as Configuration;
  });

  const disposable1 = autostopEngine.registerProvider(extensionId, extensionDisplayName, 'internalId1');
  const disposable2 = autostopEngine.registerProvider(extensionId, extensionDisplayName, 'internalId2');

  disposable1.dispose();
  disposable2.dispose();
  expect(mockSetAutostop).toBeCalledTimes(2);
  expect(mockSetAutostop).toHaveBeenNthCalledWith(1, 'internalId1', true);
  expect(mockSetAutostop).toHaveBeenLastCalledWith('internalId2', true);
});
