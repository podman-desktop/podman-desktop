import type { IConfigurationRegistry } from '@podman-desktop/core-api/configuration';
import { beforeEach, expect, test, vi } from 'vitest';

import { TrayToggleMacOS } from './tray-toggle-macos.js';

let trayToggleMacOS: TrayToggleMacOS;
let configurationRegistryMock: IConfigurationRegistry;

beforeEach(() => {
  vi.clearAllMocks();

  // Mock the IConfigurationRegistry
  configurationRegistryMock = {
    registerConfigurations: vi.fn(),
  } as unknown as IConfigurationRegistry;

  // Create instance with mocked dependency
  trayToggleMacOS = new TrayToggleMacOS(configurationRegistryMock);
});

test('Should register tray toggle configuration on init', async () => {
  await trayToggleMacOS.init();

  // Verify registerConfigurations was called
  expect(configurationRegistryMock.registerConfigurations).toHaveBeenCalled();
  expect(configurationRegistryMock.registerConfigurations).toHaveBeenCalledTimes(1);
});

test('Should register configuration with correct properties', async () => {
  await trayToggleMacOS.init();

  const calls = vi.mocked(configurationRegistryMock.registerConfigurations).mock.calls;
  expect(calls).toHaveLength(1);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const configArray = calls[0]![0];
  expect(configArray).toHaveLength(1);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const configNode = configArray[0]!;
  expect(configNode.id).toBe('preferences.traytoggle');
  expect(configNode.title).toBe('MenuBar Icon');
  expect(configNode.type).toBe('object');

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const properties = configNode.properties!;
  expect(properties['preferences.TrayToggle']).toBeDefined();
  const trayToggleProp = properties['preferences.TrayToggle']!;
  expect(trayToggleProp).toBeDefined();
  expect(trayToggleProp.description).toContain('Hide or show the menubar icon on MacOS');
  expect(trayToggleProp.type).toBe('string');
  expect(trayToggleProp.enum).toEqual(['show', 'hide']);
  expect(trayToggleProp.default).toBe('show');
});
