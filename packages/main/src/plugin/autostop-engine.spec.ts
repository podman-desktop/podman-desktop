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

test('Toggling autostop after disposing one of two providers still updates the remaining provider', async () => {
  // Always return true initially
  vi.spyOn(configurationRegistry, 'getConfiguration').mockImplementation(() => {
    return {
      get: (_section: string, _defaultValue: boolean) => true,
    } as Configuration;
  });

  // Capture the onDidChangeConfiguration handler via the getter
  let configChangeHandler: ((e: { key: string; value: unknown }) => Promise<void>) | undefined;
  const fakeEvent = (handler: typeof configChangeHandler): { dispose: () => void } => {
    configChangeHandler = handler;
    // Return a dummy disposable
    return { dispose: (): void => {} };
  };
  // @ts-expect-error - vi.spyOn is not typed correctly
  vi.spyOn(configurationRegistry, 'onDidChangeConfiguration', 'get').mockReturnValue(fakeEvent);

  // Re-instantiate autostopEngine to register the handler
  autostopEngine = new AutostopEngine(configurationRegistry, providerRegistry);

  // Register two providers for the same extension
  const disposable1 = autostopEngine.registerProvider(extensionId, extensionDisplayName, 'internalId1');
  const disposable2 = autostopEngine.registerProvider(extensionId, extensionDisplayName, 'internalId2');

  // Dispose only the first provider
  disposable1.dispose();

  // Simulate toggling the autostop setting to false
  vi.spyOn(configurationRegistry, 'getConfiguration').mockImplementation(() => {
    return {
      get: (_section: string, _defaultValue: boolean) => false,
    } as Configuration;
  });

  // Call the captured handler
  await configChangeHandler?.({
    key: `preferences.${extensionId}.engine.autostop`,
    value: false,
  });

  // Only the remaining provider should receive the update
  expect(mockSetAutostop).toHaveBeenCalledWith('internalId2', false);
  expect(mockSetAutostop).not.toHaveBeenCalledWith('internalId1', false);

  disposable2.dispose();
});
