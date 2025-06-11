/**********************************************************************
 * Copyright (C) 2023 - 2025 Red Hat, Inc.
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
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import type * as proc from 'node:child_process';
import * as fs from 'node:fs';
import { arch } from 'node:os';

import type { Configuration, ContainerEngineInfo, ContainerProviderConnection } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { Disposable, provider as apiProvider } from '@podman-desktop/api';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  initCheckAndRegisterUpdate,
  registerOnboardingMachineExistsCommand,
  registerOnboardingUnsupportedPodmanMachineCommand,
  setWSLEnabled,
} from './extension';
import * as extension from './extension';
import * as compatibilityModeLib from './utils/compatibility-mode';
import type { InstalledPodman } from './utils/podman-cli';
import * as podmanCli from './utils/podman-cli';
import { PodmanConfiguration } from './utils/podman-configuration';
import type { UpdateCheck } from './utils/podman-install';
import { PodmanInstall } from './utils/podman-install';
import { getAssetsFolder, LIBKRUN_LABEL, LoggerDelegator, VMTYPE } from './utils/util';
import * as util from './utils/util';
import { isDisguisedPodman } from './utils/warnings';

const config: Configuration = {
  get: () => {
    // not implemented
  },
  has: () => true,
  update: vi.fn(),
};

const registerUpdateMock = vi.fn();
const updateWarningsMock = vi.fn();
const provider: extensionApi.Provider = {
  setContainerProviderConnectionFactory: vi.fn(),
  setKubernetesProviderConnectionFactory: vi.fn(),
  setVmProviderConnectionFactory: vi.fn(),
  registerContainerProviderConnection: vi.fn(),
  registerKubernetesProviderConnection: vi.fn(),
  registerVmProviderConnection: vi.fn(),
  registerLifecycle: vi.fn(),
  registerInstallation: vi.fn(),
  registerUpdate: registerUpdateMock,
  registerAutostart: vi.fn(),
  registerCleanup: vi.fn(),
  dispose: vi.fn(),
  name: '',
  id: '',
  status: 'started',
  updateStatus: vi.fn(),
  onDidUpdateStatus: vi.fn(),
  version: '',
  updateVersion: vi.fn(),
  onDidUpdateVersion: vi.fn(),
  images: {},
  links: [],
  detectionChecks: [],
  updateDetectionChecks: vi.fn(),
  warnings: [],
  updateWarnings: updateWarningsMock,
  onDidUpdateDetectionChecks: vi.fn(),
};

// Use 'provider', but just replace status with 'ready'
const providerWithReadyStatus = {
  ...provider,
  status: 'ready' as extensionApi.ProviderStatus,
};

const providerWithStoppedStatus = {
  ...provider,
  status: 'stopped' as extensionApi.ProviderStatus,
};

const machineInfo: extension.MachineInfo = {
  cpus: 1,
  diskSize: 1000000,
  memory: 10000000,
  name: 'name',
  userModeNetworking: false,
  cpuUsage: 0,
  diskUsage: 0,
  memoryUsage: 0,
  vmType: VMTYPE.LIBKRUN,
  port: 1234,
  remoteUsername: 'user',
  identityPath: '/path/to/key',
};

const podmanConfiguration = {
  registryConfiguration: {
    getPlaybookScriptPath: vi.fn(),
  },
} as unknown as PodmanConfiguration;

const machineDefaultName = 'podman-machine-default';
const machine1Name = 'podman-machine-1';

// Create fake of MachineJSON
let fakeMachineJSON: extension.MachineJSON[];
let fakeMachineInfoJSON: unknown;

const telemetryLogger: extensionApi.TelemetryLogger = {
  logUsage: vi.fn(),
  logError: vi.fn(),
} as unknown as extensionApi.TelemetryLogger;

const mocks = vi.hoisted(() => ({
  getPodmanLocationMacMock: vi.fn(),
  getKrunkitVersionMock: vi.fn(),
  getQemuVersionMock: vi.fn(),
}));

vi.mock('node:fs');

// mock ps-list
vi.mock('ps-list', async () => {
  return {
    default: vi.fn(),
  };
});

vi.mock('./compatibility-mode', async () => {
  return {
    getSocketCompatibility: vi.fn(),
  };
});

beforeEach(() => {
  fakeMachineJSON = [
    {
      Name: machineDefaultName,
      CPUs: 2,
      Memory: '1048000000',
      DiskSize: '250000000000',
      Running: true,
      Starting: false,
      Default: false,
      VMType: VMTYPE.LIBKRUN,
      Port: 123,
      RemoteUsername: 'user',
      IdentityPath: '/path/to/key',
    },
    {
      Name: machine1Name,
      CPUs: 2,
      Memory: '1048000000',
      DiskSize: '250000000000',
      Running: false,
      Starting: false,
      Default: true,
      VMType: VMTYPE.LIBKRUN,
      Port: 456,
      RemoteUsername: 'admin',
      IdentityPath: '/path/to/key1',
    },
  ];

  fakeMachineInfoJSON = {
    Host: {
      Arch: 'amd64',
      CurrentMachine: '',
      DefaultMachine: '',
      EventsDir: 'dir1',
      MachineConfigDir: 'dir2',
      MachineImageDir: 'dir3',
      MachineState: '',
      NumberOfMachines: 5,
      OS: 'windows',
      VMType: 'wsl',
    },
  };
  vi.resetAllMocks();
  extension.resetShouldNotifySetup();
  (extensionApi.env.createTelemetryLogger as Mock).mockReturnValue(telemetryLogger);

  extension.initTelemetryLogger();
});

const originalConsoleError = console.error;
const consoleErrorMock = vi.fn();

vi.mock('@podman-desktop/api', async () => {
  return {
    commands: {
      registerCommand: vi.fn(),
    },
    configuration: {
      getConfiguration: (): Configuration => config,
      onDidChangeConfiguration: (): Disposable => {
        return {
          dispose: vi.fn(),
        };
      },
    },
    provider: {
      onDidRegisterContainerConnection: vi.fn(),
      onDidUnregisterContainerConnection: vi.fn(),
      createProvider: (): extensionApi.Provider => provider,
    },
    registry: {
      registerRegistryProvider: vi.fn(),
      onDidRegisterRegistry: vi.fn(),
      onDidUnregisterRegistry: vi.fn(),
      onDidUpdateRegistry: vi.fn(),
    },
    proxy: {
      isEnabled: (): boolean => false,
      onDidUpdateProxy: vi.fn(),
      onDidStateChange: vi.fn(),
      getProxySettings: vi.fn(),
    },
    window: {
      showErrorMessage: vi.fn(),
      showInformationMessage: vi.fn(),
      showWarningMessage: vi.fn(),
      showNotification: vi.fn(),
      createStatusBarItem: () => ({
        show: vi.fn(),
        dispose: vi.fn(),
      }),
    },
    context: {
      setValue: vi.fn(),
    },
    process: {
      exec: vi.fn(),
    },
    env: {
      createTelemetryLogger: vi.fn(),
      isWindows: false,
      isMac: false,
      isLinux: false,
    },
    containerEngine: {
      info: vi.fn(),
    },
    Disposable: {
      from: vi.fn(),
      create: vi.fn(),
    },
    fs: {
      createFileSystemWatcher: vi.fn(),
    },
    EventEmitter: vi.fn().mockImplementation(() => ({
      fire: vi.fn(),
      dispose: vi.fn(),
    })),
  };
});

vi.mock('node:child_process', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const childProcessActual = await vi.importActual<typeof import('node:child_process')>('node:child_process');
  return {
    ...childProcessActual,
    env: vi.fn(),
    spawn: () => {
      return {
        on: vi.fn(),
      } as unknown as proc.ChildProcess;
    },
  };
});

vi.mock('node:os', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const osActual = await vi.importActual<typeof import('node:os')>('node:os');

  return {
    ...osActual,
    release: vi.fn(),
    platform: vi.fn(),
    arch: vi.fn(),
  };
});

vi.mock('./helpers/qemu-helper', () => ({
  QemuHelper: vi.fn().mockReturnValue({
    getQemuVersion: mocks.getQemuVersionMock,
  }),
}));

vi.mock('./helpers/krunkit-helper', async () => {
  return {
    KrunkitHelper: vi.fn().mockImplementation(() => {
      return {
        getKrunkitVersion: mocks.getKrunkitVersionMock,
      };
    }),
  };
});
vi.mock('./helpers/podman-binary-location-helper', async () => {
  return {
    PodmanBinaryLocationHelper: vi.fn().mockImplementation(() => {
      return {
        getPodmanLocationMac: mocks.getPodmanLocationMacMock,
      };
    }),
  };
});
vi.mock('./helpers/podman-info-helper', async () => {
  return {
    PodmanInfoHelper: vi.fn().mockImplementation(() => {
      return {
        updateWithPodmanInfoRecords: vi.fn().mockImplementation(() => {
          return Promise.resolve();
        }),
      };
    }),
  };
});

vi.mock(import('./utils/util'), async importOriginal => {
  const original = await importOriginal();
  return {
    ...original,
    isMac: vi.fn(),
    isWindows: vi.fn(),
    getAssetsFolder: vi.fn(),
  };
});

beforeEach(() => {
  vi.resetAllMocks();
  console.error = consoleErrorMock;

  vi.mocked(extensionApi.env).isMac = false;
  vi.mocked(extensionApi.env).isLinux = false;
  vi.mocked(extensionApi.env).isWindows = false;

  const mock = vi.spyOn(compatibilityModeLib, 'getSocketCompatibility');
  mock.mockReturnValue({
    isEnabled: () => false,
    enable: vi.fn(),
    disable: vi.fn(),
    details: '',
    tooltipText: (): string => {
      return '';
    },
  });
});

afterEach(async () => {
  console.error = originalConsoleError;
  await extension.deactivate();
});

describe.each([
  { os: 'macos', expectedProvider: VMTYPE.APPLEHV },
  { os: 'windows-wsl', expectedProvider: VMTYPE.WSL },
  { os: 'windows-hyperv', expectedProvider: VMTYPE.HYPERV },
])('verify create on %s', ({ os, expectedProvider }) => {
  const provider = expectedProvider;
  beforeEach((): void => {
    vi.mocked(extensionApi.env).isWindows = os !== 'macos';
    vi.mocked(extensionApi.env).isMac = os === 'macos';

    setWSLEnabled(provider === VMTYPE.WSL);
  });

  test.each([
    { version: '6.3.2', image: 'image' },
    { version: '5.0.0', image: 'image' },
    { version: '4.5.0', image: 'image-path' },
  ])(`verify create command called with correct values for %s`, async ({ version, image }) => {
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: `podman version ${version}`,
    } as extensionApi.RunResult);

    await extension.createMachine(
      {
        'podman.factory.machine.cpus': '2',
        'podman.factory.machine.image': 'path',
        'podman.factory.machine.memory': '1048000000', // 1048MB = 999.45MiB
        'podman.factory.machine.diskSize': '250000000000', // 250GB = 232.83GiB
        'podman.factory.machine.provider': provider,
      },
      podmanConfiguration,
    );
    expect(vi.mocked(extensionApi.process.exec)).toBeCalledWith(
      podmanCli.getPodmanCli(),
      expect.arrayContaining([`--${image}`, 'path']),
      {
        logger: undefined,
        token: undefined,
        env: {
          CONTAINERS_MACHINE_PROVIDER: provider,
        },
      },
    );

    // wait a call on telemetryLogger.logUsage
    while ((telemetryLogger.logUsage as Mock).mock.calls.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    expect(telemetryLogger.logUsage).toBeCalledWith(
      'podman.machine.init',
      expect.objectContaining({ cpus: '2', defaultName: true, diskSize: '250000000000', imagePath: 'custom' }),
    );
  });

  test.each([
    { version: '6.1.0', image: 'image' },
    { version: '5.0.0', image: 'image' },
    { version: '4.5.0', image: 'image-path' },
  ])('verify create command called with correct image values with image URL %s', async ({ version, image }) => {
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: `podman version ${version}`,
    } as extensionApi.RunResult);

    await extension.createMachine(
      {
        'podman.factory.machine.cpus': '2',
        'podman.factory.machine.image-uri': 'https://host/file',
        'podman.factory.machine.memory': '1048000000', // 1048MB = 999.45MiB
        'podman.factory.machine.diskSize': '250000000000', // 250GB = 232.83GiB
        'podman.factory.machine.provider': provider,
      },
      podmanConfiguration,
    );
    expect(vi.mocked(extensionApi.process.exec)).toBeCalledWith(
      podmanCli.getPodmanCli(),
      expect.arrayContaining([`--${image}`, 'https://host/file']),
      {
        logger: undefined,
        token: undefined,
        env: {
          CONTAINERS_MACHINE_PROVIDER: provider,
        },
      },
    );

    // wait a call on telemetryLogger.logUsage
    while ((telemetryLogger.logUsage as Mock).mock.calls.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    expect(telemetryLogger.logUsage).toBeCalledWith(
      'podman.machine.init',
      expect.objectContaining({ cpus: '2', defaultName: true, diskSize: '250000000000', imagePath: 'custom-url' }),
    );
  });

  test.each([
    { version: '6.3.2', image: 'image' },
    { version: '5.0.0', image: 'image' },
    { version: '4.5.0', image: 'image-path' },
  ])('verify create command called with correct image values with registry %s', async ({ version, image }) => {
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: `podman version ${version}`,
    } as extensionApi.RunResult);

    await extension.createMachine(
      {
        'podman.factory.machine.cpus': '2',
        'podman.factory.machine.image-uri': 'registry/repo/image:version',
        'podman.factory.machine.memory': '1048000000', // 1048MB = 999.45MiB
        'podman.factory.machine.diskSize': '250000000000', // 250GB = 232.83GiB
        'podman.factory.machine.provider': provider,
      },
      podmanConfiguration,
    );
    expect(vi.mocked(extensionApi.process.exec)).toBeCalledWith(
      podmanCli.getPodmanCli(),
      expect.arrayContaining([`--${image}`, 'docker://registry/repo/image:version']),
      {
        logger: undefined,
        token: undefined,
        env: {
          CONTAINERS_MACHINE_PROVIDER: provider,
        },
      },
    );

    // wait a call on telemetryLogger.logUsage
    while ((telemetryLogger.logUsage as Mock).mock.calls.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    expect(telemetryLogger.logUsage).toBeCalledWith(
      'podman.machine.init',
      expect.objectContaining({ cpus: '2', defaultName: true, diskSize: '250000000000', imagePath: 'custom-registry' }),
    );
  });

  test.each([
    { version: '6.3.2', image: 'image' },
    { version: '5.0.0', image: 'image' },
    { version: '4.5.0', image: 'image-path' },
  ])('verify create command called with correct values with user mode networking %s', async ({ version, image }) => {
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: `podman version ${version}`,
    } as extensionApi.RunResult);

    await extension.createMachine(
      {
        'podman.factory.machine.cpus': '2',
        'podman.factory.machine.image': 'path',
        'podman.factory.machine.memory': '1048000000',
        'podman.factory.machine.diskSize': '250000000000',
        'podman.factory.machine.user-mode-networking': true,
      },
      podmanConfiguration,
    );

    expect(vi.mocked(extensionApi.process.exec)).toBeCalledWith(
      podmanCli.getPodmanCli(),
      expect.arrayContaining([`--${image}`, 'path']),
      {
        logger: undefined,
        env: {
          CONTAINERS_MACHINE_PROVIDER: provider,
        },
        token: undefined,
      },
    );
    expect(console.error).not.toBeCalled();

    // wait a call on telemetryLogger.logUsage
    while ((telemetryLogger.logUsage as Mock).mock.calls.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    expect(telemetryLogger.logUsage).toBeCalledWith(
      'podman.machine.init',
      expect.objectContaining({ cpus: '2', defaultName: true, diskSize: '250000000000', imagePath: 'custom' }),
    );
  });

  test.each([
    { version: '6.3.2', image: 'image' },
    { version: '5.0.0', image: 'image' },
    { version: '4.5.0', image: 'image-path' },
  ])(
    'verify create command called with now flag if start machine after creation is enabled %s',
    async ({ version, image }) => {
      vi.mocked(extensionApi.env).isMac = true;

      vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
        stdout: `podman version ${version}`,
      } as extensionApi.RunResult);

      await extension.createMachine(
        {
          'podman.factory.machine.cpus': '2',
          'podman.factory.machine.image': 'path',
          'podman.factory.machine.memory': '1048000000',
          'podman.factory.machine.diskSize': '250000000000',
          'podman.factory.machine.now': true,
        },
        podmanConfiguration,
      );

      expect(vi.mocked(extensionApi.process.exec)).toBeCalledWith(
        podmanCli.getPodmanCli(),
        expect.arrayContaining([`--${image}`, 'path']),
        {
          logger: undefined,
          env: {
            CONTAINERS_MACHINE_PROVIDER: provider,
          },
          token: undefined,
        },
      );
      expect(console.error).not.toBeCalled();
    },
  );

  test('verify error contains name, message and stderr if creation fails', async () => {
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as extensionApi.RunResult);
    vi.mocked(extensionApi.process.exec).mockRejectedValueOnce({
      name: 'name',
      message: 'description',
      stderr: 'error',
    });
    await expect(
      extension.createMachine(
        {
          'podman.factory.machine.cpus': '2',
          'podman.factory.machine.image': 'path',
          'podman.factory.machine.memory': '1048000000',
          'podman.factory.machine.diskSize': '250000000000',
          'podman.factory.machine.now': true,
        },
        podmanConfiguration,
      ),
    ).rejects.toThrowError('name\ndescription\nerror\n');
  });

  test('verify create command called with embedded image if using podman v5', async () => {
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(getAssetsFolder).mockReturnValue('fake');
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as extensionApi.RunResult);

    await extension.createMachine(
      {
        'podman.factory.machine.cpus': '2',
        'podman.factory.machine.memory': '1048000000',
        'podman.factory.machine.diskSize': '250000000000',
        'podman.factory.machine.now': true,
      },
      podmanConfiguration,
    );

    // check telemetry is called with telemetryRecords.imagePath
    await vi.waitFor(() => {
      expect(telemetryLogger.logUsage).toBeCalledWith(
        'podman.machine.init',
        expect.objectContaining({ imagePath: 'embedded' }),
      );
    });

    expect(vi.mocked(extensionApi.process.exec)).toHaveBeenNthCalledWith(
      2,
      podmanCli.getPodmanCli(),
      expect.arrayContaining([expect.stringContaining('.zst')]),
      expect.anything(),
    );
  });

  test('verify create command called in airgap mode will try to create image', async () => {
    vi.mocked(extensionApi.env).isWindows = os !== 'macos';
    vi.mocked(extensionApi.env).isMac = os === 'macos';
    vi.mocked(getAssetsFolder).mockReturnValue('fake');
    vi.mocked(fs.existsSync).mockReturnValue(true);

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as extensionApi.RunResult);

    await extension.createMachine(
      {
        'podman.factory.machine.cpus': '2',
        'podman.factory.machine.memory': '1048000000',
        'podman.factory.machine.diskSize': '250000000000',
        'podman.factory.machine.now': true,
        'podman.factory.machine.win.provider': provider,
      },
      podmanConfiguration,
    );

    await vi.waitFor(() => {
      expect(telemetryLogger.logUsage).toBeCalledWith(
        'podman.machine.init',
        expect.objectContaining({ imagePath: provider === VMTYPE.HYPERV ? 'default' : 'embedded' }),
      );
    });
  });

  test('verify create command with playbook', async () => {
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.4.0',
    } as extensionApi.RunResult);

    const fakePlaybookPath = 'myPlaybookPath';
    vi.mocked(podmanConfiguration.registryConfiguration.getPlaybookScriptPath).mockResolvedValue(fakePlaybookPath);

    await extension.createMachine(
      {
        'podman.factory.machine.cpus': '2',
        'podman.factory.machine.image': 'path',
        'podman.factory.machine.memory': '1048000000', // 1048MB = 999.45MiB
        'podman.factory.machine.diskSize': '250000000000', // 250GB = 232.83GiB
        'podman.factory.machine.provider': provider,
      },
      podmanConfiguration,
    );
    expect(vi.mocked(extensionApi.process.exec)).toBeCalledWith(
      podmanCli.getPodmanCli(),
      // check playbook parameter
      [
        'machine',
        'init',
        '--cpus',
        '2',
        '--memory',
        '1000',
        '--disk-size',
        '232',
        '--image',
        'path',
        '--playbook',
        fakePlaybookPath,
        '--rootful',
      ],
      {
        logger: undefined,
        token: undefined,
        env: {
          CONTAINERS_MACHINE_PROVIDER: provider,
        },
      },
    );

    // wait a call on telemetryLogger.logUsage
    while ((telemetryLogger.logUsage as Mock).mock.calls.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    expect(telemetryLogger.logUsage).toBeCalledWith(
      'podman.machine.init',
      expect.objectContaining({ cpus: '2', defaultName: true, diskSize: '250000000000', imagePath: 'custom' }),
    );
  });
});

test('test checkDefaultMachine, if the machine running is not default, the function will prompt', async () => {
  await extension.checkDefaultMachine(fakeMachineJSON);

  expect(extensionApi.window.showInformationMessage).toBeCalledWith(
    `Podman Machine '${machineDefaultName}' is running but not the default machine (default is '${machine1Name}'). This will cause podman CLI errors while trying to connect to '${machineDefaultName}'. Do you want to set it as default?`,
    'Yes',
    'Ignore',
    'Cancel',
  );
});

test('checkDefaultMachine: do not prompt if the running machine is already the default', async () => {
  // Create fake of MachineJSON
  const fakeJSON: extension.MachineJSON[] = [
    {
      Name: 'podman-machine-default',
      CPUs: 2,
      Memory: '1048000000',
      DiskSize: '250000000000',
      Running: true,
      Starting: false,
      Default: true,
      VMType: VMTYPE.LIBKRUN,
      Port: 123,
      RemoteUsername: 'user',
      IdentityPath: '/path/to/key',
    },
    {
      Name: 'podman-machine-1',
      CPUs: 2,
      Memory: '1048000000',
      DiskSize: '250000000000',
      Running: false,
      Starting: false,
      Default: false,
      VMType: VMTYPE.LIBKRUN,
      Port: 456,
      RemoteUsername: 'admin',
      IdentityPath: '/path/to/key`',
    },
  ];

  const fakeConnectionJSON: extension.ConnectionJSON[] = [
    {
      Name: machineDefaultName,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: true,
    },
    {
      Name: `${machineDefaultName}-root`,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: false,
    },
    {
      Name: machine1Name,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: false,
    },
    {
      Name: `${machine1Name}-root`,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: false,
    },
  ];

  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() =>
    Promise.resolve({ stdout: JSON.stringify(fakeConnectionJSON) } as extensionApi.RunResult),
  );

  await extension.checkDefaultMachine(fakeJSON);
  expect(extensionApi.window.showInformationMessage).not.toHaveBeenCalled();
});

test('if a machine is successfully started it changes its state to started', async () => {
  const spyUpdateStatus = vi.spyOn(provider, 'updateStatus');
  spyUpdateStatus.mockImplementation(() => {
    return;
  });

  const spyExecPromise = vi
    .spyOn(extensionApi.process, 'exec')
    .mockImplementation(() => Promise.resolve({} as extensionApi.RunResult));
  await extension.startMachine(provider, podmanConfiguration, machineInfo);

  expect(spyExecPromise).toBeCalledWith(podmanCli.getPodmanCli(), ['machine', 'start', 'name'], {
    env: {
      CONTAINERS_MACHINE_PROVIDER: VMTYPE.LIBKRUN,
    },
    logger: new LoggerDelegator(),
  });

  expect(spyUpdateStatus).toBeCalledWith('started');
});

test('if a machine is successfully reporting telemetry', async () => {
  const spyExecPromise = vi
    .spyOn(extensionApi.process, 'exec')
    .mockImplementation(() => Promise.resolve({} as extensionApi.RunResult));
  await extension.startMachine(provider, podmanConfiguration, machineInfo);

  // wait a call on telemetryLogger.logUsage
  while ((telemetryLogger.logUsage as Mock).mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  expect(telemetryLogger.logUsage).toBeCalledWith(
    'podman.machine.start',
    expect.objectContaining({ hostCpus: expect.anything() }),
  );

  expect(spyExecPromise).toBeCalledWith(podmanCli.getPodmanCli(), ['machine', 'start', 'name'], expect.anything());
});

test('if a machine is successfully reporting an error in telemetry', async () => {
  const customError = new Error('Error while starting podman');

  const spyExecPromise = vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => {
    throw customError;
  });
  await expect(extension.startMachine(provider, podmanConfiguration, machineInfo)).rejects.toThrow(customError.message);

  // wait a call on telemetryLogger.logUsage
  while ((telemetryLogger.logUsage as Mock).mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  expect(telemetryLogger.logUsage).toBeCalledWith(
    'podman.machine.start',
    expect.objectContaining({ hostCpus: expect.anything(), error: customError }),
  );

  expect(spyExecPromise).toBeCalledWith(podmanCli.getPodmanCli(), ['machine', 'start', 'name'], expect.anything());
});

test('if a machine failed to start with a generic error, this is thrown', async () => {
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => {
    throw new Error('generic error');
  });

  await expect(extension.startMachine(provider, podmanConfiguration, machineInfo)).rejects.toThrow('generic error');
  expect(console.error).toBeCalled();
});

test('if a machine failed to start with a wsl distro not found error, the user is asked what to do', async () => {
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => {
    throw new Error('wsl bootstrap script failed: exit status 0xffffffff');
  });

  await expect(extension.startMachine(provider, podmanConfiguration, machineInfo)).rejects.toThrow(
    'wsl bootstrap script failed: exit status 0xffffffff',
  );
  expect(extensionApi.window.showInformationMessage).toBeCalledWith(
    `Error while starting Podman Machine '${machineInfo.name}'. The WSL bootstrap script failed: exist status 0xffffffff. The machine is probably broken and should be deleted and reinitialized. Do you want to recreate it?`,
    'Yes',
    'Cancel',
  );
  expect(console.error).toBeCalled();
});

test('if a machine failed to start with a wsl distro not found error but the skipHandleError is false, the error is thrown', async () => {
  const spyExecPromise = vi.spyOn(extensionApi.process, 'exec');
  spyExecPromise.mockImplementation(() => {
    return Promise.reject(new Error('wsl bootstrap script failed: exit status 0xffffffff'));
  });
  await expect(
    extension.startMachine(provider, podmanConfiguration, machineInfo, undefined, undefined, true),
  ).rejects.toThrow('wsl bootstrap script failed: exit status 0xffffffff');
  expect(extensionApi.window.showInformationMessage).not.toHaveBeenCalled();
  expect(console.error).toBeCalled();
});

test('test checkDefaultMachine - if there is no machine marked as default, take the default system connection to retrieve it. Prompt as it is not running', async () => {
  // Create fake of MachineJSON
  const fakeJSON: extension.MachineJSON[] = fakeMachineJSON;
  fakeJSON[1].Default = false;

  const fakeConnectionJSON: extension.ConnectionJSON[] = [
    {
      Name: machineDefaultName,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: false,
    },
    {
      Name: `${machineDefaultName}-root`,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: false,
    },
    {
      Name: machine1Name,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: false,
    },
    {
      Name: `${machine1Name}-root`,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: true,
    },
  ];

  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() =>
    Promise.resolve({ stdout: JSON.stringify(fakeConnectionJSON) } as extensionApi.RunResult),
  );

  await extension.checkDefaultMachine(fakeJSON);

  expect(extensionApi.window.showInformationMessage).toBeCalledWith(
    `Podman Machine '${machineDefaultName}' is running but not the default machine (default is '${machine1Name}'). This will cause podman CLI errors while trying to connect to '${machineDefaultName}'. Do you want to set it as default?`,
    'Yes',
    'Ignore',
    'Cancel',
  );
});

test('test checkDefaultMachine - if there is no machine marked as default, take the default system connection to retrieve it. Do not prompt as it is running', async () => {
  // Create fake of MachineJSON
  const fakeJSON: extension.MachineJSON[] = fakeMachineJSON;
  fakeJSON[1].Default = false;

  const fakeConnectionJSON: extension.ConnectionJSON[] = [
    {
      Name: machineDefaultName,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: false,
    },
    {
      Name: `${machineDefaultName}-root`,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: true,
    },
    {
      Name: machine1Name,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: false,
    },
    {
      Name: `${machine1Name}-root`,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: false,
    },
  ];

  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() =>
    Promise.resolve({ stdout: JSON.stringify(fakeConnectionJSON) } as extensionApi.RunResult),
  );

  await extension.checkDefaultMachine(fakeJSON);
  expect(extensionApi.window.showInformationMessage).not.toHaveBeenCalled();
});

test('test checkDefaultMachine - if user wants to change default machine, check if it is rootful and update connection', async () => {
  const fakeInspectJSON = [
    {
      Name: 'podman-machine-default',
      Rootful: true,
    },
  ];
  vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
    stdout: JSON.stringify(fakeInspectJSON),
  } as extensionApi.RunResult);
  vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
    stdout: JSON.stringify(fakeMachineInfoJSON),
  } as extensionApi.RunResult);

  vi.mocked(extensionApi.window.showInformationMessage).mockResolvedValue('Yes');

  vi.mocked(fs.existsSync).mockReturnValue(true);

  const infoContentJSON = {
    Rootful: true,
  };
  vi.mocked(fs.promises.readFile).mockResolvedValue(JSON.stringify(infoContentJSON));

  await extension.checkDefaultMachine(fakeMachineJSON);

  expect(vi.mocked(extensionApi.process.exec)).toHaveBeenCalledWith(
    podmanCli.getPodmanCli(),
    ['system', 'connection', 'default', `${machineDefaultName}-root`],
    {
      env: {
        CONTAINERS_MACHINE_PROVIDER: VMTYPE.LIBKRUN,
      },
    },
  );
  expect(vi.mocked(extensionApi.process.exec)).toHaveBeenCalledWith(
    podmanCli.getPodmanCli(),
    ['machine', 'inspect', machineDefaultName],
    {
      env: {
        CONTAINERS_MACHINE_PROVIDER: VMTYPE.LIBKRUN,
      },
    },
  );
});

test('test checkDefaultMachine - if user wants to change machine, check that it only change the connection once if it is rootless', async () => {
  const fakeInspectJSON = [
    {
      Name: 'podman-machine-default',
      Rootful: false,
    },
  ];
  // return as inspect result a rootless machine
  vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
    stdout: JSON.stringify(fakeInspectJSON),
  } as extensionApi.RunResult);

  const spyPrompt = vi.spyOn(extensionApi.window, 'showInformationMessage');
  spyPrompt.mockResolvedValue('Yes');

  vi.mocked(fs.existsSync).mockReturnValue(true);

  const infoContentJSON = {
    Rootful: false,
  };
  const spyReadFile = vi.spyOn(fs.promises, 'readFile');
  spyReadFile.mockResolvedValue(JSON.stringify(infoContentJSON));

  await extension.checkDefaultMachine(fakeMachineJSON);

  expect(vi.mocked(extensionApi.process.exec)).toHaveBeenCalledWith(
    podmanCli.getPodmanCli(),
    ['system', 'connection', 'default', machineDefaultName],
    {
      env: {
        CONTAINERS_MACHINE_PROVIDER: VMTYPE.LIBKRUN,
      },
    },
  );
  expect(vi.mocked(extensionApi.process.exec)).toHaveBeenCalledWith(
    podmanCli.getPodmanCli(),
    ['machine', 'inspect', machineDefaultName],
    {
      env: {
        CONTAINERS_MACHINE_PROVIDER: VMTYPE.LIBKRUN,
      },
    },
  );
});

test('test checkDefaultMachine - if user wants to change machine, check that it only changes to rootless as machine inspect is not returning Rootful field (old versions of podman)', async () => {
  const spyExecPromise = vi.spyOn(extensionApi.process, 'exec').mockResolvedValueOnce({
    stdout: JSON.stringify(fakeMachineInfoJSON),
  } as extensionApi.RunResult);

  const fakeInspectJSON = [
    {
      Name: 'podman-machine-default',
    },
  ];

  // return as inspect result a rootless machine
  const inspectCall = vi.spyOn(extensionApi.process, 'exec').mockResolvedValueOnce({
    stdout: JSON.stringify(fakeInspectJSON),
  } as extensionApi.RunResult);

  const spyPrompt = vi.spyOn(extensionApi.window, 'showInformationMessage');
  spyPrompt.mockResolvedValue('Yes');

  vi.mock('node:fs');

  vi.spyOn(fs, 'existsSync').mockImplementation(() => {
    return false;
  });

  await extension.checkDefaultMachine(fakeMachineJSON);

  expect(spyExecPromise).toHaveBeenCalledWith(
    podmanCli.getPodmanCli(),
    ['system', 'connection', 'default', machineDefaultName],
    {
      env: {
        CONTAINERS_MACHINE_PROVIDER: VMTYPE.LIBKRUN,
      },
    },
  );
  expect(inspectCall).toHaveBeenCalledWith(podmanCli.getPodmanCli(), ['machine', 'inspect', machineDefaultName], {
    env: {
      CONTAINERS_MACHINE_PROVIDER: VMTYPE.LIBKRUN,
    },
  });
});

test('test checkDefaultMachine, if the default connection is not in sync with the default machine, the function will prompt', async () => {
  const fakeConnectionJSON: extension.ConnectionJSON[] = [
    {
      Name: machineDefaultName,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: true,
    },
    {
      Name: `${machineDefaultName}-root`,
      URI: 'uri',
      Identity: 'id',
      IsMachine: true,
      Default: false,
    },
  ];

  const fakeMachineJSON = [
    {
      Name: machineDefaultName,
      CPUs: 2,
      Memory: '1048000000',
      DiskSize: '250000000000',
      Running: true,
      Starting: false,
      Default: true,
      VMType: VMTYPE.LIBKRUN,
      Port: 123,
      RemoteUsername: 'user',
      IdentityPath: '/path/to/key',
    },
  ];

  vi.spyOn(extensionApi.process, 'exec').mockImplementation(
    (_command, args) =>
      new Promise<extensionApi.RunResult>(resolve => {
        if (args?.[0] === 'machine' && args?.[1] === 'list') {
          resolve({ stdout: JSON.stringify([fakeMachineJSON[0]]) } as extensionApi.RunResult);
        } else if (args?.[0] === 'machine' && args?.[1] === 'inspect') {
          resolve({
            stdout: JSON.stringify([{ Name: fakeMachineJSON[0].Name, Rootful: true }]),
          } as extensionApi.RunResult);
        } else if (args?.[0] === 'system' && args?.[1] === 'connection' && args?.[2] === 'list') {
          resolve({
            stdout: JSON.stringify(fakeConnectionJSON),
          } as extensionApi.RunResult);
        }
      }),
  );

  await extension.checkDefaultMachine(fakeMachineJSON);

  expect(extensionApi.window.showInformationMessage).toBeCalledWith(
    `Rootful Podman Machine '${machineDefaultName}' does not match default connection. This will cause podman CLI errors while trying to connect to '${machineDefaultName}'. Do you want to update the default connection?`,
    'Yes',
    'Ignore',
    'Cancel',
  );
});

test('ensure started machine reports default configuration', async () => {
  vi.mocked(extensionApi.env).isLinux = true;
  extension.initExtensionContext({ subscriptions: [] } as unknown as extensionApi.ExtensionContext);
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(
    (_command, args) =>
      new Promise<extensionApi.RunResult>(resolve => {
        if (args?.[0] === 'machine' && args?.[1] === 'list') {
          resolve({ stdout: JSON.stringify([fakeMachineJSON[0]]) } as extensionApi.RunResult);
        } else if (args?.[0] === 'machine' && args?.[1] === 'inspect') {
          resolve({} as extensionApi.RunResult);
        } else if (args?.[0] === 'system' && args?.[1] === 'connection' && args?.[2] === 'list') {
          resolve({
            stdout: JSON.stringify([{ Name: fakeMachineJSON[0].Name, Default: true }]),
          } as extensionApi.RunResult);
        } else if (args?.[0] === '--version') {
          resolve({ stdout: 'podman version 4.9.0' } as extensionApi.RunResult);
        }
      }),
  );

  await extension.updateMachines(provider, podmanConfiguration);
  expect(config.update).toHaveBeenNthCalledWith(1, 'machine.cpus', fakeMachineJSON[0].CPUs);
  expect(config.update).toHaveBeenNthCalledWith(2, 'machine.memory', Number(fakeMachineJSON[0].Memory));
  expect(config.update).toHaveBeenNthCalledWith(3, 'machine.diskSize', Number(fakeMachineJSON[0].DiskSize));
  expect(config.update).toHaveBeenNthCalledWith(4, 'machine.cpusUsage', 0);
  expect(config.update).toHaveBeenNthCalledWith(5, 'machine.memoryUsage', 0);
  expect(config.update).toHaveBeenNthCalledWith(6, 'machine.diskSizeUsage', 0);
});

test('ensure stopped machine reports stopped provider', async () => {
  extension.initExtensionContext({ subscriptions: [] } as unknown as extensionApi.ExtensionContext);
  vi.mocked(extensionApi.env).isLinux = false;
  vi.mocked(extensionApi.env).isMac = true;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(
    (_command, args) =>
      new Promise<extensionApi.RunResult>(resolve => {
        if (args?.[0] === 'machine' && args?.[1] === 'list') {
          const fakeStoppedMachine = JSON.parse(JSON.stringify(fakeMachineJSON[0]));
          fakeStoppedMachine.Running = false;

          resolve({ stdout: JSON.stringify([fakeStoppedMachine]) } as extensionApi.RunResult);
        } else if (args?.[0] === 'machine' && args?.[1] === 'inspect') {
          resolve({} as extensionApi.RunResult);
        } else if (args?.[0] === 'system' && args?.[1] === 'connection' && args?.[2] === 'list') {
          resolve({
            stdout: JSON.stringify([{ Name: fakeMachineJSON[0].Name, Default: true }]),
          } as extensionApi.RunResult);
        } else if (args?.[0] === '--version') {
          resolve({ stdout: 'podman version 4.9.0' } as extensionApi.RunResult);
        }
      }),
  );

  await extension.updateMachines(provider, podmanConfiguration);

  expect(provider.updateStatus).toBeCalledWith('configured');
  expect(extension.podmanMachinesStatuses.get('podman-machine-default')).toBe('stopped');
});

test('ensure running and starting machine reports starting provider', async () => {
  extension.initExtensionContext({ subscriptions: [] } as unknown as extensionApi.ExtensionContext);
  vi.mocked(extensionApi.env).isLinux = false;
  vi.mocked(extensionApi.env).isMac = true;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(
    (_command, args) =>
      new Promise<extensionApi.RunResult>(resolve => {
        if (args?.[0] === 'machine' && args?.[1] === 'list') {
          const fakeStoppedMachine = JSON.parse(JSON.stringify(fakeMachineJSON[0]));
          fakeStoppedMachine.Running = true;
          fakeStoppedMachine.Starting = true;

          resolve({ stdout: JSON.stringify([fakeStoppedMachine]) } as extensionApi.RunResult);
        } else if (args?.[0] === 'machine' && args?.[1] === 'inspect') {
          resolve({} as extensionApi.RunResult);
        } else if (args?.[0] === 'system' && args?.[1] === 'connection' && args?.[2] === 'list') {
          resolve({
            stdout: JSON.stringify([{ Name: fakeMachineJSON[0].Name, Default: true }]),
          } as extensionApi.RunResult);
        } else if (args?.[0] === '--version') {
          resolve({ stdout: 'podman version 4.9.0' } as extensionApi.RunResult);
        }
      }),
  );

  await extension.updateMachines(provider, podmanConfiguration);

  expect(provider.updateStatus).toBeCalledWith('starting');
  expect(extension.podmanMachinesStatuses.get('podman-machine-default')).toBe('starting');
});

test('ensure running and not starting machine reports ready provider', async () => {
  extension.initExtensionContext({ subscriptions: [] } as unknown as extensionApi.ExtensionContext);
  vi.mocked(extensionApi.env).isLinux = false;
  vi.mocked(extensionApi.env).isMac = true;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(
    (_command, args) =>
      new Promise<extensionApi.RunResult>(resolve => {
        if (args?.[0] === 'machine' && args?.[1] === 'list') {
          const fakeStoppedMachine = JSON.parse(JSON.stringify(fakeMachineJSON[0]));
          fakeStoppedMachine.Running = true;
          fakeStoppedMachine.Starting = false;

          resolve({ stdout: JSON.stringify([fakeStoppedMachine]) } as extensionApi.RunResult);
        } else if (args?.[0] === 'machine' && args?.[1] === 'inspect') {
          resolve({} as extensionApi.RunResult);
        } else if (args?.[0] === 'system' && args?.[1] === 'connection' && args?.[2] === 'list') {
          resolve({
            stdout: JSON.stringify([{ Name: fakeMachineJSON[0].Name, Default: true }]),
          } as extensionApi.RunResult);
        } else if (args?.[0] === '--version') {
          resolve({ stdout: 'podman version 4.9.0' } as extensionApi.RunResult);
        }
      }),
  );

  await extension.updateMachines(provider, podmanConfiguration);

  expect(provider.updateStatus).toBeCalledWith('ready');
  expect(extension.podmanMachinesStatuses.get('podman-machine-default')).toBe('started');
});

test('ensure started machine reports configuration', async () => {
  extension.initExtensionContext({ subscriptions: [] } as unknown as extensionApi.ExtensionContext);
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(
    (_command, args) =>
      new Promise<extensionApi.RunResult>(resolve => {
        if (args?.[0] === 'machine' && args?.[1] === 'list') {
          resolve({ stdout: JSON.stringify([fakeMachineJSON[0]]) } as extensionApi.RunResult);
        } else if (args?.[0] === 'machine' && args?.[1] === 'inspect') {
          resolve({ stdout: JSON.stringify([{ Name: fakeMachineJSON[0].Name }]) } as unknown as extensionApi.RunResult);
        } else if (args?.[0] === 'system' && args?.[1] === 'connection' && args?.[2] === 'list') {
          resolve({
            stdout: JSON.stringify([{ Name: fakeMachineJSON[0].Name, Default: true }]),
          } as extensionApi.RunResult);
        } else if (args?.[0] === '--version') {
          resolve({ stdout: 'podman version 4.9.0' } as extensionApi.RunResult);
        }
      }),
  );

  await extension.updateMachines(provider, podmanConfiguration);
  (extensionApi.containerEngine.info as Mock).mockResolvedValue({
    cpus: 2,
    cpuIdle: 99,
    memory: 1048000000,
    memoryUsed: 524000000,
    diskSize: 250000000000,
    diskUsed: 50000000000,
  } as ContainerEngineInfo);
  await extension.updateMachines(provider, podmanConfiguration);
  expect(config.update).toBeCalledWith('machine.cpus', fakeMachineJSON[0].CPUs);
  expect(config.update).toBeCalledWith('machine.memory', Number(fakeMachineJSON[0].Memory));
  expect(config.update).toBeCalledWith('machine.diskSize', Number(fakeMachineJSON[0].DiskSize));
  expect(config.update).toBeCalledWith('machine.cpusUsage', 1);
  expect(config.update).toBeCalledWith('machine.memoryUsage', 50);
  expect(config.update).toBeCalledWith('machine.diskSizeUsage', 20);
});

test('ensure stopped machine reports configuration', async () => {
  extension.initExtensionContext({ subscriptions: [] } as unknown as extensionApi.ExtensionContext);
  vi.mocked(extensionApi.env).isLinux = true;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(
    (_command, args) =>
      new Promise<extensionApi.RunResult>(resolve => {
        if (args?.[0] === 'machine' && args?.[1] === 'list') {
          resolve({ stdout: JSON.stringify([fakeMachineJSON[1]]) } as extensionApi.RunResult);
        } else if (args?.[0] === 'machine' && args?.[1] === 'inspect') {
          resolve({} as extensionApi.RunResult);
        } else if (args?.[0] === 'system' && args?.[1] === 'connection' && args?.[2] === 'list') {
          resolve({
            stdout: JSON.stringify([{ Name: fakeMachineJSON[1].Name, Default: true }]),
          } as extensionApi.RunResult);
        } else if (args?.[0] === '--version') {
          resolve({ stdout: 'podman version 4.9.0' } as extensionApi.RunResult);
        }
      }),
  );

  await extension.updateMachines(provider, podmanConfiguration);
  expect(config.update).toBeCalledWith('machine.cpus', fakeMachineJSON[0].CPUs);
  expect(config.update).toBeCalledWith('machine.memory', Number(fakeMachineJSON[0].Memory));
  expect(config.update).toBeCalledWith('machine.diskSize', Number(fakeMachineJSON[0].DiskSize));
  expect(config.update).toBeCalledWith('machine.cpusUsage', 0);
  expect(config.update).toBeCalledWith('machine.memoryUsage', 0);
  expect(config.update).toBeCalledWith('machine.diskSizeUsage', 0);
});

test('ensure showNotification is not called during update', async () => {
  const showNotificationMock = vi.spyOn(extensionApi.window, 'showNotification');
  extension.initExtensionContext({ subscriptions: [] } as unknown as extensionApi.ExtensionContext);
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(
    (_command, args) =>
      new Promise<extensionApi.RunResult>((resolve, reject) => {
        if (args?.[0] === 'machine' && args?.[1] === 'list') {
          reject(new Error('error'));
        } else if (args?.[0] === '--version') {
          resolve({} as extensionApi.RunResult);
        }
      }),
  );

  const extensionContext = { subscriptions: [], storagePath: '' } as unknown as extensionApi.ExtensionContext;
  const podmanInstall: PodmanInstall = new PodmanInstall(extensionContext);
  vi.spyOn(podmanInstall, 'checkForUpdate').mockImplementation((_installedPodman: InstalledPodman | undefined) => {
    return Promise.resolve({
      hasUpdate: true,
      bundledVersion: 'v1.2',
      installedVersion: 'v1',
    });
  });
  vi.spyOn(podmanInstall, 'performUpdate').mockImplementation(
    async (_provider: extensionApi.Provider, _installedPodman: InstalledPodman | undefined) => {
      await new Promise(resolve => setTimeout(resolve, 500));
    },
  );

  let updater: extensionApi.ProviderUpdate | undefined;
  registerUpdateMock.mockImplementation((update: extensionApi.ProviderUpdate) => {
    updater = update;
  });
  await extension.registerUpdatesIfAny(
    provider,
    {
      version: '1.1',
    },
    podmanInstall,
  );

  // check updater is registered
  expect(updater).toBeDefined();
  expect(updater?.version).equal('v1.2');

  // run the updater (it will sleep for 500ms before returning and resetting the shouldNotifySetup flag
  // run the updateMachine which should not call the showNotification func because shouldNotifySetup is false
  updater?.update({} as extensionApi.Logger).catch(() => {});
  await expect(extension.updateMachines(provider, podmanConfiguration)).rejects.toThrow('error');

  expect(showNotificationMock).not.toBeCalled();

  // wait 500ms so that the updater is complete and shouldNotifySetup reset. Call again the updateMachines func, this time the showNotification is called
  // as there is no update in progress
  await new Promise(resolve => setTimeout(resolve, 500));
  await expect(extension.updateMachines(provider, podmanConfiguration)).rejects.toThrow('error');

  expect(showNotificationMock).toBeCalled();
});

test('provider is registered with edit capabilities on MacOS', async () => {
  // Mock platform to be darwin
  vi.mocked(extensionApi.env).isMac = true;
  extension.initExtensionContext({ subscriptions: [] } as unknown as extensionApi.ExtensionContext);
  const spyExecPromise = vi.spyOn(extensionApi.process, 'exec');
  spyExecPromise.mockImplementation(() => {
    return Promise.reject(new Error('wsl bootstrap script failed: exit status 0xffffffff'));
  });
  let registeredConnection: ContainerProviderConnection | undefined;
  vi.mocked(provider.registerContainerProviderConnection).mockImplementation(connection => {
    registeredConnection = connection;
    return Disposable.from({ dispose: () => {} });
  });
  await extension.registerProviderFor(provider, podmanConfiguration, machineInfo, 'socket');
  expect(registeredConnection).toBeDefined();
  expect(registeredConnection?.lifecycle).toBeDefined();
  expect(registeredConnection?.lifecycle?.edit).toBeDefined();
});

test('display name is beautified version of the name', async () => {
  extension.initExtensionContext({ subscriptions: [] } as unknown as extensionApi.ExtensionContext);
  const spyExecPromise = vi.spyOn(extensionApi.process, 'exec');
  spyExecPromise.mockImplementation(() => {
    return Promise.reject(new Error('wsl bootstrap script failed: exit status 0xffffffff'));
  });
  let registeredConnection: ContainerProviderConnection | undefined;
  vi.mocked(provider.registerContainerProviderConnection).mockImplementation(connection => {
    registeredConnection = connection;
    return Disposable.from({ dispose: () => {} });
  });
  await extension.registerProviderFor(
    provider,
    podmanConfiguration,
    {
      ...machineInfo,
      name: machineDefaultName,
    },
    'socket',
  );
  expect(registeredConnection).toBeDefined();
  expect(registeredConnection?.displayName).toBe('Podman Machine');
  expect(registeredConnection?.name).toBe(machineDefaultName);
});

test('provider is registered without edit capabilities on Windows', async () => {
  vi.mocked(extensionApi.env).isWindows = true;
  extension.initExtensionContext({ subscriptions: [] } as unknown as extensionApi.ExtensionContext);
  const spyExecPromise = vi.spyOn(extensionApi.process, 'exec');
  spyExecPromise.mockImplementation(() => {
    return Promise.reject(new Error('wsl bootstrap script failed: exit status 0xffffffff'));
  });
  let registeredConnection: ContainerProviderConnection | undefined;
  vi.mocked(provider.registerContainerProviderConnection).mockImplementation(connection => {
    registeredConnection = connection;
    return Disposable.from({ dispose: () => {} });
  });
  await extension.registerProviderFor(provider, podmanConfiguration, machineInfo, 'socket');
  expect(registeredConnection).toBeDefined();
  expect(registeredConnection?.lifecycle).toBeDefined();
  expect(registeredConnection?.lifecycle?.edit).toBeUndefined();
});

test('provider is registered without edit capabilities on Linux', async () => {
  vi.mocked(extensionApi.env).isLinux = true;
  extension.initExtensionContext({ subscriptions: [] } as unknown as extensionApi.ExtensionContext);
  const spyExecPromise = vi.spyOn(extensionApi.process, 'exec');
  spyExecPromise.mockImplementation(() => {
    return Promise.reject(new Error('wsl bootstrap script failed: exit status 0xffffffff'));
  });
  let registeredConnection: ContainerProviderConnection | undefined;
  vi.mocked(provider.registerContainerProviderConnection).mockImplementation(connection => {
    registeredConnection = connection;
    return Disposable.from({ dispose: () => {} });
  });
  await extension.registerProviderFor(provider, podmanConfiguration, machineInfo, 'socket');
  expect(registeredConnection).toBeDefined();
  expect(registeredConnection?.lifecycle).toBeDefined();
  expect(registeredConnection?.lifecycle?.edit).toBeUndefined();
});

test('Even with getJSONMachineList erroring, do not show setup notification on Linux', async () => {
  vi.mocked(extensionApi.env).isLinux = true;
  vi.spyOn(extensionApi.process, 'exec').mockRejectedValue({
    name: 'name',
    message: 'description',
    stderr: 'error',
  });
  await expect(extension.updateMachines(provider, podmanConfiguration)).rejects.toThrow('description');
  expect(extensionApi.window.showNotification).not.toBeCalled();
});

test('If machine list is empty, do not show setup notification on Linux', async () => {
  vi.mocked(extensionApi.env).isLinux = true;
  const spyExecPromise = vi.spyOn(extensionApi.process, 'exec');
  spyExecPromise.mockResolvedValue({ stdout: '[]' } as extensionApi.RunResult);
  await extension.updateMachines(provider, podmanConfiguration);
  expect(extensionApi.window.showNotification).not.toBeCalled();
});

test('if there are no machines, make sure checkDefaultMachine is not being ran inside updateMachines', async () => {
  const spyCheckDefaultMachine = vi.spyOn(extension, 'checkDefaultMachine');
  vi.spyOn(extensionApi.process, 'exec').mockResolvedValue({ stdout: '[]' } as extensionApi.RunResult);
  await extension.updateMachines(provider, podmanConfiguration);
  expect(spyCheckDefaultMachine).not.toBeCalled();
});

test('Should notify clean machine if getJSONMachineList is erroring due to an invalid format on mac', async () => {
  vi.mocked(extensionApi.env).isMac = true;
  vi.spyOn(extensionApi.process, 'exec').mockRejectedValue({
    name: 'name',
    message: 'description',
    stderr: 'cannot unmarshal string',
  });
  await expect(extension.updateMachines(provider, podmanConfiguration)).rejects.toThrow('description');
  expect(extensionApi.window.showNotification).toBeCalled();
  expect(extensionApi.context.setValue).toBeCalledWith(extension.CLEANUP_REQUIRED_MACHINE_KEY, true);
});

test('No updates of machines in parallel', async () => {
  vi.mocked(extensionApi.env).isLinux = false;
  vi.mocked(extensionApi.env).isMac = true;
  const spyExecPromise = vi.spyOn(extensionApi.process, 'exec');
  spyExecPromise.mockResolvedValue({ stdout: '[]' } as extensionApi.RunResult);

  const updateMachines1 = extension.updateMachines(provider, podmanConfiguration);
  const updateMachines2 = extension.updateMachines(provider, podmanConfiguration);

  await updateMachines1;

  // only call once as no parallel
  const podmanMachineListCalls = spyExecPromise.mock.calls.filter(
    call => call[0] === 'podman' && JSON.stringify(call[1]) === JSON.stringify(['machine', 'list', '--format', 'json']),
  );
  expect(podmanMachineListCalls.length).toBe(1);

  // wait the second call
  await updateMachines2;
  const podmanMachineListAfterCalls = spyExecPromise.mock.calls.filter(
    call => call[0] === 'podman' && JSON.stringify(call[1]) === JSON.stringify(['machine', 'list', '--format', 'json']),
  );
  expect(podmanMachineListAfterCalls.length).toBe(2);
});

describe('initCheckAndRegisterUpdate', () => {
  test('check there is an update', async () => {
    const podmanInstall = {
      checkForUpdate: vi.fn(),
    } as unknown as PodmanInstall;

    // disposable
    const disposeMock = vi.fn();
    registerUpdateMock.mockReturnValue({
      dispose: disposeMock,
    });

    // First call, installed is 4 and we can bump to v5
    vi.mocked(podmanInstall.checkForUpdate).mockResolvedValueOnce({
      hasUpdate: true,
      installedVersion: '4.0',
      bundledVersion: '5.0',
    });

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 1.0.0',
    } as unknown as extensionApi.RunResult);

    await initCheckAndRegisterUpdate(provider, podmanInstall);

    // check that we call registerUpdate on the provider
    expect(registerUpdateMock).toBeCalledWith({
      preflightChecks: expect.any(Function),
      update: expect.any(Function),
      version: '5.0',
    });

    // check not disposed
    expect(disposeMock).not.toBeCalled();

    // clear mock
    registerUpdateMock.mockClear();

    // ok now we mock the same bundled version (no update)
    vi.mocked(podmanInstall.checkForUpdate).mockResolvedValueOnce({
      hasUpdate: false,
      installedVersion: '5.0',
      bundledVersion: '5.0',
    });

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as unknown as extensionApi.RunResult);

    // check again the update
    await initCheckAndRegisterUpdate(provider, podmanInstall);

    // check that registerUpdateMock is not called as there is no update available from 5.0 to 5.0
    expect(registerUpdateMock).not.toBeCalled();

    // and the previous disposable should have been disposed
    expect(disposeMock).toBeCalled();
  });

  test('check there is no update', async () => {
    const podmanInstall = {
      checkForUpdate: vi.fn(),
    } as unknown as PodmanInstall;

    // First call, installed is 4 and we can bump to v5
    vi.mocked(podmanInstall.checkForUpdate).mockResolvedValueOnce({
      hasUpdate: false,
      installedVersion: '4.0',
      bundledVersion: '5.0',
    });

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 1.1',
    } as unknown as extensionApi.RunResult);

    await initCheckAndRegisterUpdate(provider, podmanInstall);

    // check that we call registerUpdate on the provider
    expect(registerUpdateMock).not.toBeCalled();
  });

  test('check update disappear after creating a podman machine', async () => {
    const podmanInstall = {
      checkForUpdate: vi.fn(),
    } as unknown as PodmanInstall;

    // disposable
    const disposeMock = vi.fn();
    registerUpdateMock.mockReturnValue({
      dispose: disposeMock,
    });

    // First call, installed is 4 and we can bump to v5
    vi.mocked(podmanInstall.checkForUpdate).mockResolvedValueOnce({
      hasUpdate: true,
      installedVersion: '4.0',
      bundledVersion: '5.0',
    });

    // mock the event
    let listener: ((event: extensionApi.RegisterContainerConnectionEvent) => void) | undefined;

    vi.mocked(extensionApi.provider.onDidRegisterContainerConnection).mockImplementation(func => {
      listener = func;
      return { dispose: (): void => {} };
    });

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 1.1',
    } as unknown as extensionApi.RunResult);

    await initCheckAndRegisterUpdate(provider, podmanInstall);

    // check that we call registerUpdate on the provider
    expect(registerUpdateMock).toBeCalledWith({
      preflightChecks: expect.any(Function),
      update: expect.any(Function),
      version: '5.0',
    });

    // check not disposed
    expect(disposeMock).not.toBeCalled();

    // clear mock
    registerUpdateMock.mockClear();

    const event: extensionApi.RegisterContainerConnectionEvent = {
      providerId: provider.id,
    } as unknown as extensionApi.RegisterContainerConnectionEvent;

    // ok now we mock v4 as there is no machine
    vi.mocked(podmanInstall.checkForUpdate).mockResolvedValueOnce({
      hasUpdate: false,
      installedVersion: '4.0',
      bundledVersion: '4.0',
    });

    expect(listener).toBeDefined();
    // call listener
    listener?.(event);

    // check that registerUpdateMock is not called as there is no update available from 4.0 to 5.0 as there is a machine
    expect(registerUpdateMock).not.toBeCalled();

    // and the previous disposable should have been disposed
    expect(disposeMock).toBeCalled();
  });

  test('check update appear after updating the version', async () => {
    const podmanInstall = {
      checkForUpdate: vi
        .fn()
        .mockResolvedValue({ installedVersion: undefined, hasUpdate: false, bundledVersion: undefined }),
    } as unknown as PodmanInstall;

    // disposable
    const disposeMock = vi.fn();
    registerUpdateMock.mockReturnValue({
      dispose: disposeMock,
    });

    let func = async (_s: string): Promise<void> => {};
    vi.mocked(provider.onDidUpdateVersion).mockImplementation((f: (_s: string) => Promise<void>) => {
      func = f;
      return { dispose: (): void => {} };
    });

    // fake missing
    vi.mocked(extensionApi.process.exec).mockRejectedValueOnce('');

    await initCheckAndRegisterUpdate(provider, podmanInstall);

    // check that registerUpdateMock is not called as there is no update available from 4.0 to 5.0 as there is a machine
    expect(registerUpdateMock).not.toBeCalled();

    // installed is 4 and we can bump to v5
    vi.mocked(podmanInstall.checkForUpdate).mockResolvedValueOnce({
      hasUpdate: true,
      installedVersion: '4.0',
      bundledVersion: '5.0',
    });

    // fake external installation of v1.1
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 4.0',
    } as unknown as extensionApi.RunResult);
    // call the updateVersion
    await func('v1');

    // check that we call registerUpdate on the provider
    expect(registerUpdateMock).toBeCalledWith({
      preflightChecks: expect.any(Function),
      update: expect.any(Function),
      version: '5.0',
    });
  });
});

describe('registerOnboardingMachineExistsCommand', () => {
  test('check with error when calling podman machine ls command', async () => {
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue({ dispose: vi.fn() });

    vi.mocked(extensionApi.process.exec).mockRejectedValue(new Error('error'));

    // perform the call
    const disposable = registerOnboardingMachineExistsCommand();

    // checks
    expect(disposable).toBeDefined();

    // check command is called
    expect(extensionApi.commands.registerCommand).toBeCalledWith(
      'podman.onboarding.checkPodmanMachineExistsCommand',
      expect.any(Function),
    );

    const func = vi.mocked(extensionApi.commands.registerCommand).mock.calls[0][1];
    // call the function
    await func();

    // check called with podman machine exists being false
    expect(extensionApi.context.setValue).toBeCalledWith('podmanMachineExists', false, 'onboarding');
  });

  test('check with 2 machines', async () => {
    vi.mocked(extensionApi.env).isMac = true;

    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue({ dispose: vi.fn() });

    // return an empty object for the first call
    vi.spyOn(extensionApi.process, 'exec').mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as extensionApi.RunResult);
    // return 2 empty machines for the second call
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: '[{}, {}]',
    } as unknown as extensionApi.RunResult);

    // perform the call
    const disposable = registerOnboardingMachineExistsCommand();

    // checks
    expect(disposable).toBeDefined();

    // check command is called
    expect(extensionApi.commands.registerCommand).toBeCalledWith(
      'podman.onboarding.checkPodmanMachineExistsCommand',
      expect.any(Function),
    );

    const func = vi.mocked(extensionApi.commands.registerCommand).mock.calls[0][1];
    // call the function
    await func();

    // check called with podman machine exists being true as there are 2 machines
    expect(extensionApi.context.setValue).toBeCalledWith('podmanMachineExists', true, 'onboarding');
  });

  test('check with 0 machine', async () => {
    vi.mocked(extensionApi.env).isMac = true;

    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue({ dispose: vi.fn() });

    // return empty machine array
    vi.mocked(extensionApi.process.exec).mockResolvedValue({ stdout: '[]' } as unknown as extensionApi.RunResult);

    // perform the call
    const disposable = registerOnboardingMachineExistsCommand();

    // checks
    expect(disposable).toBeDefined();

    // check command is called
    expect(extensionApi.commands.registerCommand).toBeCalledWith(
      'podman.onboarding.checkPodmanMachineExistsCommand',
      expect.any(Function),
    );

    const func = vi.mocked(extensionApi.commands.registerCommand).mock.calls[0][1];
    // call the function
    await func();

    // check called with podman machine exists being false as there is no machine
    expect(extensionApi.context.setValue).toBeCalledWith('podmanMachineExists', false, 'onboarding');
  });
});

describe('registerOnboardingUnsupportedPodmanMachineCommand', () => {
  test('check with v5 and previous qemu folders', async () => {
    vi.mocked(extensionApi.env).isMac = true;

    vi.mocked(fs.existsSync).mockReturnValue(true);

    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue({ dispose: vi.fn() });

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as unknown as extensionApi.RunResult);

    // second call to get the machine list
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: '[]',
    } as unknown as extensionApi.RunResult);

    // perform the call
    const disposable = registerOnboardingUnsupportedPodmanMachineCommand();

    // checks
    expect(disposable).toBeDefined();

    // check command is called
    expect(extensionApi.commands.registerCommand).toBeCalledWith(
      'podman.onboarding.checkUnsupportedPodmanMachine',
      expect.any(Function),
    );

    const func = vi.mocked(extensionApi.commands.registerCommand).mock.calls[0][1];
    // call the function
    await func();

    // check called with true as there are qemu folders
    expect(extensionApi.context.setValue).toBeCalledWith('unsupportedPodmanMachine', true, 'onboarding');
  });

  test('check with v5 and no previous qemu folders', async () => {
    vi.mocked(extensionApi.env).isMac = true;

    // no qemu folders
    vi.mocked(fs.existsSync).mockReturnValue(false);

    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue({ dispose: vi.fn() });

    // first call to get the podman version
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as unknown as extensionApi.RunResult);

    // second call to get the machine list
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: '[]',
    } as unknown as extensionApi.RunResult);

    // perform the call
    const disposable = registerOnboardingUnsupportedPodmanMachineCommand();

    // checks
    expect(disposable).toBeDefined();

    // check command is called
    expect(extensionApi.commands.registerCommand).toBeCalledWith(
      'podman.onboarding.checkUnsupportedPodmanMachine',
      expect.any(Function),
    );

    const func = vi.mocked(extensionApi.commands.registerCommand).mock.calls[0][1];
    // call the function
    await func();

    // check it is false as there are no qemu folders
    expect(extensionApi.context.setValue).toBeCalledWith('unsupportedPodmanMachine', false, 'onboarding');
  });

  test('check with v4 and qemu folders', async () => {
    vi.mocked(extensionApi.env).isMac = true;

    vi.mocked(fs.existsSync).mockReturnValue(true);

    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue({ dispose: vi.fn() });

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 4.9.3',
    } as unknown as extensionApi.RunResult);

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 4.9.3',
    } as unknown as extensionApi.RunResult);

    // third call to get the machine list
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: '[]',
    } as unknown as extensionApi.RunResult);

    // perform the call
    const disposable = registerOnboardingUnsupportedPodmanMachineCommand();

    // checks
    expect(disposable).toBeDefined();

    // check command is called
    expect(extensionApi.commands.registerCommand).toBeCalledWith(
      'podman.onboarding.checkUnsupportedPodmanMachine',
      expect.any(Function),
    );

    const func = vi.mocked(extensionApi.commands.registerCommand).mock.calls[0][1];
    // call the function
    await func();

    // check called with false as there are qemu folders but we're with podman v4
    expect(extensionApi.context.setValue).toBeCalledWith('unsupportedPodmanMachine', false, 'onboarding');
  });

  test('check with v5 and error in JSON of machines', async () => {
    vi.mocked(extensionApi.env).isMac = true;

    // no qemu folders
    vi.mocked(fs.existsSync).mockReturnValue(false);

    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue({ dispose: vi.fn() });

    // first call to get the podman version
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as unknown as extensionApi.RunResult);

    // second call to get the machine list
    vi.mocked(extensionApi.process.exec).mockRejectedValue({
      stderr: 'incompatible machine config',
    } as unknown as extensionApi.RunResult);

    // perform the call
    const disposable = registerOnboardingUnsupportedPodmanMachineCommand();

    // checks
    expect(disposable).toBeDefined();

    // check command is called
    expect(extensionApi.commands.registerCommand).toBeCalledWith(
      'podman.onboarding.checkUnsupportedPodmanMachine',
      expect.any(Function),
    );

    const func = vi.mocked(extensionApi.commands.registerCommand).mock.calls[0][1];
    // call the function
    await func();

    // check it is false as there are no qemu folders
    expect(extensionApi.context.setValue).toBeCalledWith('unsupportedPodmanMachine', true, 'onboarding');
  });
});

describe('registerOnboardingRemoveUnsupportedMachinesCommand', () => {
  test('check with previous qemu folders', async () => {
    vi.mocked(extensionApi.env).isMac = true;

    vi.mocked(fs.existsSync).mockReturnValue(true);

    // mock confirmation window message to true
    vi.mocked(extensionApi.window.showWarningMessage).mockResolvedValue('Yes');

    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue({ dispose: vi.fn() });

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as unknown as extensionApi.RunResult);

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: '[]',
    } as unknown as extensionApi.RunResult);

    // perform the call
    const disposable = extension.registerOnboardingRemoveUnsupportedMachinesCommand();

    // checks
    expect(disposable).toBeDefined();

    // check command is called
    expect(extensionApi.commands.registerCommand).toBeCalledWith(
      'podman.onboarding.removeUnsupportedMachines',
      expect.any(Function),
    );

    const func = vi.mocked(extensionApi.commands.registerCommand).mock.calls[0][1];
    // call the function
    await func();

    // expect rm to be called
    expect(fs.promises.rm).toBeCalledWith(expect.stringContaining('qemu'), {
      recursive: true,
      maxRetries: 3,
      retryDelay: 1000,
    });

    // check called with true as there are qemu folders
    expect(extensionApi.context.setValue).toBeCalledWith('unsupportedMachineRemoved', 'ok', 'onboarding');
  });

  test('check with previous podman v4 config files', async () => {
    vi.mocked(extensionApi.env).isMac = true;

    // mock confirmation window message to true
    vi.mocked(extensionApi.window.showWarningMessage).mockResolvedValue('Yes');

    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue({ dispose: vi.fn() });

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as unknown as extensionApi.RunResult);

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as unknown as extensionApi.RunResult);
    // two times false (no qemu folders)
    vi.mocked(fs.existsSync).mockReturnValueOnce(false);
    vi.mocked(fs.existsSync).mockReturnValueOnce(false);

    // return an error when trying to list output
    vi.mocked(fs.existsSync).mockReturnValueOnce(true);
    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: '[]',
      stderr: 'incompatible machine config',
    } as unknown as extensionApi.RunResult);

    vi.mocked(fs.promises.readdir).mockResolvedValue(['foo.json'] as unknown as fs.Dirent<Buffer<ArrayBufferLike>>[]);

    // mock readfile
    vi.mocked(fs.promises.readFile).mockResolvedValueOnce('{"Driver": "podman"}');

    // perform the call
    const disposable = extension.registerOnboardingRemoveUnsupportedMachinesCommand();

    // checks
    expect(disposable).toBeDefined();

    // check command is called
    expect(extensionApi.commands.registerCommand).toBeCalledWith(
      'podman.onboarding.removeUnsupportedMachines',
      expect.any(Function),
    );

    const func = vi.mocked(extensionApi.commands.registerCommand).mock.calls[0][1];
    // call the function
    await func();

    // expect rm to be called
    expect(fs.promises.rm).toBeCalledWith(expect.stringContaining('foo.json'), {
      recursive: true,
      maxRetries: 3,
      retryDelay: 1000,
    });

    // check called with true as there are qemu folders
    expect(extensionApi.context.setValue).toBeCalledWith('unsupportedMachineRemoved', 'ok', 'onboarding');
  });

  test('check with previous podman v4 config files on Windows', async () => {
    vi.mocked(extensionApi.env).isWindows = true;

    // mock confirmation window message to true
    vi.mocked(extensionApi.window.showWarningMessage).mockResolvedValue('Yes');

    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue({ dispose: vi.fn() });

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as unknown as extensionApi.RunResult);

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.0.0',
    } as unknown as extensionApi.RunResult);

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'unknown message: 1.2.5.0',
      stderr: '',
      command: 'command',
    });

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'podman version 5.2.0',
    } as unknown as extensionApi.RunResult);

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'True',
      stderr: '',
      command: 'command',
    });

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'True',
      stderr: '',
      command: 'command',
    });

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'True',
      stderr: '',
      command: 'command',
    });

    vi.mocked(extensionApi.process.exec).mockResolvedValueOnce({
      stdout: 'Running',
      stderr: '',
      command: 'command',
    });

    // return an error when trying to list output
    vi.mocked(fs.existsSync).mockReturnValueOnce(true);
    vi.mocked(extensionApi.process.exec).mockRejectedValueOnce({
      stdout: '[]',
      stderr: 'cannot unmarshal string',
    } as unknown as extensionApi.RunResult);

    vi.mocked(fs.promises.readdir).mockResolvedValue([
      'foo.json',
      'podman-machine-default.json',
    ] as unknown as fs.Dirent<Buffer<ArrayBufferLike>>[]);

    // mock readfile
    vi.mocked(fs.promises.readFile).mockResolvedValueOnce('{"Driver": "podman"}');

    // perform the call
    extension.registerOnboardingRemoveUnsupportedMachinesCommand();

    const func = vi.mocked(extensionApi.commands.registerCommand).mock.calls[0][1];
    // call the function
    await func();

    // check that we called wsl --terminate and wsl --unregister
    expect(extensionApi.process.exec).toBeCalledWith('wsl', ['--terminate', 'podman-foo']);
    expect(extensionApi.process.exec).toBeCalledWith('wsl', ['--unregister', 'podman-foo']);
    expect(extensionApi.process.exec).toBeCalledWith('wsl', ['--terminate', 'podman-machine-default']);
    expect(extensionApi.process.exec).toBeCalledWith('wsl', ['--unregister', 'podman-machine-default']);

    // check called with true
    expect(extensionApi.context.setValue).toBeCalledWith('unsupportedMachineRemoved', 'ok', 'onboarding');
  });
});

test('isIncompatibleMachineOutput', () => {
  const emptyResponse = extension.isIncompatibleMachineOutput(undefined);
  expect(emptyResponse).toBeFalsy();

  const unknownErrorResponse = extension.isIncompatibleMachineOutput('unknown error');
  expect(unknownErrorResponse).toBeFalsy();

  const wslErrorResponse = extension.isIncompatibleMachineOutput('cannot unmarshal string');
  expect(wslErrorResponse).toBeTruthy();

  const applehvErrorResponse = extension.isIncompatibleMachineOutput('incompatible machine config');
  expect(applehvErrorResponse).toBeTruthy();
});

describe('calcPodmanMachineSetting', () => {
  const podmanConfiguration = new PodmanConfiguration({} as unknown as extensionApi.ExtensionContext);
  let originalProvider: string | undefined;
  beforeEach(() => {
    originalProvider = process.env.CONTAINERS_MACHINE_PROVIDER;
  });

  afterEach(() => {
    process.env.CONTAINERS_MACHINE_PROVIDER = originalProvider;
  });

  test('setValue to true if OS is MacOS', async () => {
    vi.mocked(extensionApi.env).isWindows = false;
    await extension.calcPodmanMachineSetting();
    expect(extensionApi.context.setValue).toBeCalledWith(extension.PODMAN_MACHINE_CPU_SUPPORTED_KEY, true);
    expect(extensionApi.context.setValue).toBeCalledWith(extension.PODMAN_MACHINE_MEMORY_SUPPORTED_KEY, true);
    expect(extensionApi.context.setValue).toBeCalledWith(extension.PODMAN_MACHINE_DISK_SUPPORTED_KEY, true);
  });
  test('setValue to true if OS is Windows and uses HyperV', async () => {
    vi.mocked(extensionApi.env).isWindows = true;
    vi.spyOn(podmanCli, 'getPodmanInstallation').mockResolvedValue({
      version: '5.2.1',
    });
    vi.spyOn(extensionApi.process, 'exec').mockImplementation((command, args) => {
      return new Promise<extensionApi.RunResult>(resolve => {
        if (command === 'powershell.exe') {
          resolve({
            stdout: args?.[0] === '@(Get-Service vmms).Status' ? 'Running' : 'True',
            stderr: '',
            command: 'command',
          });
        }
      });
    });
    await extension.calcPodmanMachineSetting();
    expect(extensionApi.context.setValue).toBeCalledWith(extension.PODMAN_MACHINE_CPU_SUPPORTED_KEY, true);
    expect(extensionApi.context.setValue).toBeCalledWith(extension.PODMAN_MACHINE_MEMORY_SUPPORTED_KEY, true);
    expect(extensionApi.context.setValue).toBeCalledWith(extension.PODMAN_MACHINE_DISK_SUPPORTED_KEY, true);
  });
  test('setValue to true if OS is Windows and uses WSL', async () => {
    vi.mocked(extensionApi.env).isWindows = true;
    process.env.CONTAINERS_MACHINE_PROVIDER = 'wsl';
    vi.spyOn(podmanConfiguration, 'matchRegexpInContainersConfig').mockResolvedValue(false);
    await extension.calcPodmanMachineSetting();
    expect(extensionApi.context.setValue).toBeCalledWith(extension.PODMAN_MACHINE_CPU_SUPPORTED_KEY, false);
    expect(extensionApi.context.setValue).toBeCalledWith(extension.PODMAN_MACHINE_MEMORY_SUPPORTED_KEY, false);
    expect(extensionApi.context.setValue).toBeCalledWith(extension.PODMAN_MACHINE_DISK_SUPPORTED_KEY, false);
  });
});

test('checkForUpdate func should be called if there is no podman installed', async () => {
  const extensionContext = { subscriptions: [], storagePath: '' } as unknown as extensionApi.ExtensionContext;
  const podmanInstall: PodmanInstall = new PodmanInstall(extensionContext);

  vi.spyOn(podmanCli, 'getPodmanInstallation').mockResolvedValue(undefined);
  vi.spyOn(podmanInstall, 'checkForUpdate').mockResolvedValue({
    installedVersion: undefined,
    hasUpdate: false,
    bundledVersion: undefined,
  });

  await extension.initCheckAndRegisterUpdate(provider, podmanInstall);
  expect(podmanInstall.checkForUpdate).toBeCalledWith(undefined);
});

describe('checkRosettaMacArm', async () => {
  const podmanConfiguration = {
    isRosettaEnabled: vi.fn(),
  } as unknown as PodmanConfiguration;

  test('check do nothing on non-macOS', async () => {
    await extension.checkRosettaMacArm(podmanConfiguration);
    // not called as not on macOS
    expect(vi.mocked(podmanConfiguration.isRosettaEnabled)).not.toBeCalled();
  });

  test('check do nothing on macOS with intel', async () => {
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(arch).mockReturnValue('x64');
    await extension.checkRosettaMacArm(podmanConfiguration);
    // not called as not on arm64
    expect(vi.mocked(podmanConfiguration.isRosettaEnabled)).not.toBeCalled();
  });

  test('check no dialog on macOS with arm64 if rosetta is working', async () => {
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(arch).mockReturnValue('arm64');
    // rosetta is being enabled per configuration
    vi.mocked(podmanConfiguration.isRosettaEnabled).mockResolvedValue(true);

    // mock rosetta is working when executing commands
    vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);

    await extension.checkRosettaMacArm(podmanConfiguration);
    // check showInformationMessage is not called
    expect(extensionApi.process.exec).toBeCalled();
    expect(podmanConfiguration.isRosettaEnabled).toBeCalled();
    expect(extensionApi.window.showInformationMessage).not.toBeCalled();
  });

  test('check no dialog on macOS with arm64 if rosetta is not enabled', async () => {
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(arch).mockReturnValue('arm64');
    // rosetta is being enabled per configuration
    vi.mocked(podmanConfiguration.isRosettaEnabled).mockResolvedValue(false);

    await extension.checkRosettaMacArm(podmanConfiguration);
    // do not try to execute something as disabled
    expect(extensionApi.process.exec).not.toBeCalled();
    expect(podmanConfiguration.isRosettaEnabled).toBeCalled();
    expect(extensionApi.window.showInformationMessage).not.toBeCalled();
  });

  test('check dialog on macOS with arm64 if rosetta is not working', async () => {
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(arch).mockReturnValue('arm64');
    // rosetta is being enabled per configuration
    vi.mocked(podmanConfiguration.isRosettaEnabled).mockResolvedValue(true);

    // mock rosetta is not working when executing commands
    vi.mocked(extensionApi.process.exec).mockRejectedValue({ stderr: 'Bad CPU' } as extensionApi.RunError);

    await extension.checkRosettaMacArm(podmanConfiguration);
    // check showInformationMessage is not called
    expect(extensionApi.process.exec).toBeCalled();
    expect(podmanConfiguration.isRosettaEnabled).toBeCalled();
    expect(extensionApi.window.showInformationMessage).toBeCalled();
  });
});

test('isLibkrunSupported should return false with 5.3.0 on intel', async () => {
  vi.mocked(extensionApi.env).isMac = true;
  vi.mocked(arch).mockReturnValue('x64');
  const enabled = extension.isLibkrunSupported('5.3.0');
  expect(enabled).toBeFalsy();
});

test('isLibkrunSupported should return true with prelease older than rc1', async () => {
  vi.mocked(arch).mockReturnValue('arm64');
  vi.mocked(extensionApi.env).isMac = true;
  const enabled = extension.isLibkrunSupported('5.2.0-rc2');
  expect(enabled).toBeTruthy();
});

test('isLibkrunSupported should return true with 5.2.0 version', async () => {
  vi.mocked(arch).mockReturnValue('arm64');
  vi.mocked(extensionApi.env).isMac = true;
  const enabled = extension.isLibkrunSupported('5.2.0');
  expect(enabled).toBeTruthy();
});

test('isLibkrunSupported should return false with previous 5.1.2 version', async () => {
  vi.mocked(arch).mockReturnValue('arm64');
  vi.mocked(extensionApi.env).isMac = true;
  const enabled = extension.isLibkrunSupported('5.1.2');
  expect(enabled).toBeFalsy();
});

describe('isPlaybookMachineInitSupported', () => {
  test('isPlaybookMachineInitSupported should return false with 5.3.0', async () => {
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(arch).mockReturnValue('x64');
    const enabled = extension.isPlaybookMachineInitSupported('5.3.0');
    expect(enabled).toBeFalsy();
  });

  test('isPlaybookMachineInitSupported should return true with 5.4.0 version on Windows/amd', async () => {
    vi.mocked(arch).mockReturnValue('amd64');
    vi.mocked(extensionApi.env).isWindows = true;
    const enabled = extension.isPlaybookMachineInitSupported('5.4.0');
    expect(enabled).toBeTruthy();
  });

  test('isPlaybookMachineInitSupported should return true with 5.4.0 version on arm/mac', async () => {
    vi.mocked(arch).mockReturnValue('arm64');
    vi.mocked(extensionApi.env).isMac = true;
    const enabled = extension.isPlaybookMachineInitSupported('5.4.0');
    expect(enabled).toBeTruthy();
  });
});

describe('sendTelemetryRecords', () => {
  test('krunkit found', async () => {
    vi.mocked(extensionApi.env).isMac = true;

    vi.spyOn(podmanCli, 'getPodmanInstallation').mockResolvedValue({
      version: '5.1.2',
    });
    mocks.getPodmanLocationMacMock.mockResolvedValue({ foundPath: '/opt/podman/bin/podman', source: 'installer' });
    mocks.getKrunkitVersionMock.mockResolvedValue('1.2.3');

    extension.sendTelemetryRecords(
      'evt',
      {
        provider: 'libkrun',
      } as Record<string, unknown>,
      false,
    );
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(telemetryLogger.logUsage).toHaveBeenCalledWith(
      'evt',
      expect.objectContaining({
        krunkitPath: '/opt/podman/bin',
        krunkitVersion: '1.2.3',
        podmanCliFoundPath: '/opt/podman/bin/podman',
        podmanCliSource: 'installer',
        podmanCliVersion: '5.1.2',
        provider: 'libkrun',
      }),
    );
  });

  test('krunkit not found', async () => {
    vi.mocked(extensionApi.env).isMac = true;

    vi.spyOn(podmanCli, 'getPodmanInstallation').mockResolvedValue({
      version: '5.1.2',
    });
    mocks.getPodmanLocationMacMock.mockResolvedValue({ foundPath: '/opt/podman/bin/podman', source: 'installer' });
    mocks.getKrunkitVersionMock.mockRejectedValue('command not found');

    extension.sendTelemetryRecords(
      'evt',
      {
        provider: 'libkrun',
      } as Record<string, unknown>,
      false,
    );
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(telemetryLogger.logUsage).toHaveBeenCalledWith(
      'evt',
      expect.objectContaining({
        errorKrunkitVersion: 'command not found',
        podmanCliFoundPath: '/opt/podman/bin/podman',
        podmanCliSource: 'installer',
        podmanCliVersion: '5.1.2',
        provider: 'libkrun',
      }),
    );
  });

  test('qemu found', async () => {
    vi.spyOn(podmanCli, 'getPodmanInstallation').mockResolvedValue({
      version: '5.1.2',
    });
    extension.sendTelemetryRecords(
      'evt',
      {
        provider: 'qemu',
      } as Record<string, unknown>,
      false,
    );
    vi.mocked(extensionApi.env).isLinux = true;
    (extensionApi.env.isMac as boolean) = false;
    vi.mocked(extensionApi.env).isWindows = false;

    mocks.getQemuVersionMock.mockResolvedValue('5.5.5');

    await vi.waitFor(() => {
      expect(telemetryLogger.logUsage).toHaveBeenCalledWith(
        'evt',
        expect.objectContaining({
          provider: 'qemu',
          qemuVersion: '5.5.5',
        }),
      );
    });
  });

  test('qemu not found', async () => {
    vi.spyOn(podmanCli, 'getPodmanInstallation').mockResolvedValue({
      version: '5.1.2',
    });
    extension.sendTelemetryRecords(
      'evt',
      {
        provider: 'qemu',
      } as Record<string, unknown>,
      false,
    );
    (extensionApi.env.isLinux as boolean) = true;
    (extensionApi.env.isMac as boolean) = false;
    vi.mocked(extensionApi.env).isWindows = false;

    mocks.getQemuVersionMock.mockRejectedValue('command not found');

    await vi.waitFor(() => {
      expect(telemetryLogger.logUsage).toHaveBeenCalledWith(
        'evt',
        expect.objectContaining({
          provider: 'qemu',
          errorQemuVersion: 'command not found',
        }),
      );
    });
  });
});

test('if a machine stopped is successfully reporting telemetry', async () => {
  vi.mocked(extensionApi.env).isMac = true;

  const spyExecPromise = vi
    .spyOn(extensionApi.process, 'exec')
    .mockImplementation(() => Promise.resolve({} as extensionApi.RunResult));
  vi.spyOn(podmanCli, 'getPodmanInstallation').mockResolvedValue({
    version: '5.1.2',
  });
  mocks.getPodmanLocationMacMock.mockResolvedValue({ foundPath: '/opt/podman/bin/podman', source: 'installer' });
  mocks.getKrunkitVersionMock.mockResolvedValue('1.2.3');
  await extension.stopMachine(provider, machineInfo);

  // wait a call on telemetryLogger.logUsage
  while ((telemetryLogger.logUsage as Mock).mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  expect(telemetryLogger.logUsage).toBeCalledWith(
    'podman.machine.stop',
    expect.objectContaining({
      krunkitPath: '/opt/podman/bin',
      krunkitVersion: '1.2.3',
      podmanCliFoundPath: '/opt/podman/bin/podman',
      podmanCliSource: 'installer',
      podmanCliVersion: '5.1.2',
      provider: 'libkrun',
    }),
  );
  expect(spyExecPromise).toBeCalledWith(podmanCli.getPodmanCli(), ['machine', 'stop', 'name'], expect.anything());
});

test('if a machine stopped is successfully reporting an error in telemetry', async () => {
  vi.mocked(extensionApi.env).isMac = true;
  const customError = new Error('Error while starting podman');

  const spyExecPromise = vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => {
    throw customError;
  });
  vi.spyOn(podmanCli, 'getPodmanInstallation').mockResolvedValue({
    version: '5.1.2',
  });
  mocks.getPodmanLocationMacMock.mockResolvedValue({ foundPath: '/opt/podman/bin/podman', source: 'installer' });
  mocks.getKrunkitVersionMock.mockResolvedValue('1.2.3');
  await expect(extension.stopMachine(provider, machineInfo)).rejects.toThrow(customError.message);

  // wait a call on telemetryLogger.logUsage
  while ((telemetryLogger.logUsage as Mock).mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  expect(telemetryLogger.logUsage).toBeCalledWith(
    'podman.machine.stop',
    expect.objectContaining({
      krunkitPath: '/opt/podman/bin',
      krunkitVersion: '1.2.3',
      podmanCliFoundPath: '/opt/podman/bin/podman',
      podmanCliSource: 'installer',
      podmanCliVersion: '5.1.2',
      error: customError,
      provider: 'libkrun',
    }),
  );

  expect(spyExecPromise).toBeCalledWith(podmanCli.getPodmanCli(), ['machine', 'stop', 'name'], expect.anything());
});

test('activate function returns an api implementation', async () => {
  vi.spyOn(PodmanInstall.prototype, 'checkForUpdate').mockResolvedValue({
    hasUpdate: false,
  } as unknown as UpdateCheck);
  const contextMock = {
    subscriptions: [],
    secrets: {
      delete: vi.fn(),
      get: vi.fn(),
      onDidChange: vi.fn(),
      store: vi.fn(),
    },
  } as unknown as extensionApi.ExtensionContext;
  const api = await extension.activate(contextMock);
  expect(api).toBeDefined();
  expect(typeof api.exec).toBe('function');
});

function mockExtensionForAuditTests() {
  vi.spyOn(PodmanInstall.prototype, 'checkForUpdate').mockResolvedValue({
    hasUpdate: false,
  } as unknown as UpdateCheck);
  const contextMock = {
    subscriptions: [],
    secrets: {
      delete: vi.fn(),
      get: vi.fn(),
      onDidChange: vi.fn(),
      store: vi.fn(),
    },
  } as unknown as extensionApi.ExtensionContext;
  vi.spyOn(provider, 'setContainerProviderConnectionFactory');
  return contextMock;
}

async function testAudit(path: string, uri: string, condition: typeof expect | typeof expect.not): Promise<void> {
  const contextMock = mockExtensionForAuditTests();
  let auditorInstance: extensionApi.Auditor | undefined;
  vi.mocked(provider.setContainerProviderConnectionFactory).mockImplementation(
    (options: extensionApi.ContainerProviderConnectionFactory, auditor: extensionApi.Auditor | undefined) => {
      auditorInstance = auditor;
      return {
        dispose: () => {},
      };
    },
  );
  await extension.activate(contextMock);
  await vi.waitFor(() => expect(vi.mocked(provider.setContainerProviderConnectionFactory)).toBeCalled());
  expect(auditorInstance).toBeDefined();
  const auditRecords: extensionApi.AuditResult = await auditorInstance!.auditItems({
    'podman.factory.machine.cpus': '2',
    'podman.factory.machine.image': path,
    'podman.factory.machine.image-uri': uri,
    'podman.factory.machine.memory': '1048000000', // 1048MB = 999.45MiB
    'podman.factory.machine.diskSize': '250000000000', // 250GB = 232.83GiB
    'podman.factory.machine.provider': LIBKRUN_LABEL,
  });
  expect(auditRecords.records).toEqual(condition.arrayContaining([expect.objectContaining({ type: 'error' })]));
}

test('activate on mac register commands for setting compatibility moide ', async () => {
  vi.mocked(extensionApi.env).isMac = true;
  vi.mocked(extensionApi.env).isWindows = false;
  vi.mocked(extensionApi.env).isLinux = false;
  vi.spyOn(PodmanInstall.prototype, 'checkForUpdate').mockResolvedValue({
    hasUpdate: false,
  } as unknown as UpdateCheck);
  const contextMock = {
    subscriptions: [],
    secrets: {
      delete: vi.fn(),
      get: vi.fn(),
      onDidChange: vi.fn(),
      store: vi.fn(),
    },
  } as unknown as extensionApi.ExtensionContext;

  // mock getSocketCompatibility
  const disableMock = vi.fn();
  const enableMock = vi.fn();
  const isEnabledMock = vi.fn().mockReturnValue(false);
  const mock = vi.spyOn(compatibilityModeLib, 'getSocketCompatibility');
  mock.mockReturnValue({
    isEnabled: isEnabledMock,
    enable: enableMock,
    disable: disableMock,
    details: '',
    tooltipText: (): string => {
      return '';
    },
  });

  const api = await extension.activate(contextMock);
  expect(api).toBeDefined();

  // expect the command to be registered
  expect(extensionApi.commands.registerCommand).toBeCalledWith('podman.disableCompatibilityMode', expect.any(Function));

  // get the command
  const disableCallcommand = vi
    .mocked(extensionApi.commands.registerCommand)
    .mock.calls?.find(call => call[0] === 'podman.disableCompatibilityMode');
  expect(disableCallcommand).toBeDefined();
  // get the command
  const disableCommand = disableCallcommand?.[1];
  expect(disableCommand).toBeDefined();

  // call the command
  await disableCommand?.();

  // expect the command to be registered
  expect(extensionApi.commands.registerCommand).toBeCalledWith('podman.enableCompatibilityMode', expect.any(Function));

  // expect we have set the context value as well
  expect(extensionApi.context.setValue).toBeCalledWith('podman.podmanDockerCompatibilityEnabled', false);
  expect(disableMock).toBeCalled();

  // now, call the enable command
  const enableCallcommand = vi
    .mocked(extensionApi.commands.registerCommand)
    .mock.calls?.find(call => call[0] === 'podman.enableCompatibilityMode');
  expect(enableCallcommand).toBeDefined();

  // clear the calls
  vi.mocked(extensionApi.context.setValue).mockClear();
  enableMock.mockClear();
  disableMock.mockClear();
  isEnabledMock.mockReturnValue(true);

  // get the command
  const enableCommand = enableCallcommand?.[1];
  expect(enableCommand).toBeDefined();

  // call the command
  await enableCommand?.();

  // expect we have set the context value as well
  expect(extensionApi.context.setValue).toBeCalledWith('podman.podmanDockerCompatibilityEnabled', true);
  expect(enableMock).toBeCalled();
});

describe.each(['windows', 'mac', 'linux'])('podman machine properties audit on %s', os => {
  beforeEach(() => {
    vi.mocked(extensionApi.env).isWindows = os === 'windows';
    vi.mocked(extensionApi.env).isMac = os === 'mac';
    vi.mocked(extensionApi.env).isLinux = os === 'windows';
  });
  if (os === 'linux') {
    test('is not used', async () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((path: fs.PathLike) => {
        if (path.toString().endsWith('/podman/podman.sock')) {
          console.log('========>', path);
          return true;
        }
        return false;
      });
      await extension.activate(mockExtensionForAuditTests());
      await vi.waitFor(() => expect(vi.mocked(provider.setContainerProviderConnectionFactory)).not.toBeCalled());
    });
    return;
  }
  test(`reports error for image path and uri is used at the same time`, async () => {
    await testAudit('path', 'registry/repo/image:version', expect);
  });
  test(`reports no error for image path only is used`, async () => {
    await testAudit('path', '', expect.not);
  });
  test(`reports no error for image uri only is used`, async () => {
    await testAudit('', 'uri', expect.not);
  });
});

test('isHypervEnabled should return false if it is not windows', async () => {
  vi.mocked(extensionApi.env).isWindows = false;
  const hypervEnabled = await extension.isHyperVEnabled();
  expect(hypervEnabled).toBeFalsy();
});

test('isHypervEnabled should return false if hyperv is not enabled', async () => {
  vi.mocked(extensionApi.env).isWindows = true;
  const hypervEnabled = await extension.isHyperVEnabled();
  expect(hypervEnabled).toBeFalsy();
});

test('isHypervEnabled should return true if hyperv is enabled', async () => {
  vi.mocked(extensionApi.env).isWindows = true;
  vi.spyOn(podmanCli, 'getPodmanInstallation').mockResolvedValue({
    version: '5.2.1',
  });
  vi.spyOn(extensionApi.process, 'exec').mockImplementation((command, args) => {
    return new Promise<extensionApi.RunResult>(resolve => {
      if (command === 'powershell.exe') {
        resolve({
          stdout: args?.[0] === '@(Get-Service vmms).Status' ? 'Running' : 'True',
          stderr: '',
          command: 'command',
        });
      }
    });
  });
  const wslHypervEnabled = await extension.isHyperVEnabled();
  expect(wslHypervEnabled).toBeTruthy();
});

test('isWSLEnabled should return false if it is not windows', async () => {
  vi.mocked(extensionApi.env).isWindows = false;
  const wslEnabled = await extension.isWSLEnabled();
  expect(wslEnabled).toBeFalsy();
});

test('isWSLEnabled should return false if wsl is not enabled', async () => {
  vi.mocked(extensionApi.env).isWindows = true;
  vi.spyOn(extensionApi.process, 'exec').mockResolvedValue({
    stdout: 'unknown message: 1.2.5.0',
    stderr: '',
    command: 'command',
  });
  const wslEnabled = await extension.isWSLEnabled();
  expect(wslEnabled).toBeFalsy();
});

test('isWSLEnabled should return true if wsl is enabled', async () => {
  vi.mocked(extensionApi.env).isWindows = true;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(command => {
    return new Promise<extensionApi.RunResult>(resolve => {
      if (command === 'wsl') {
        resolve({
          stdout:
            'WSL version: 2.2.5.0\nKernel version: 5.15.90.1\nWSLg version: 1.0.51\nMSRDC version: 1.2.3770\nDirect3D version: 1.608.2-61064218\nDXCore version: 10.0.25131.1002-220531-1700.rs-onecore-base2-hyp\nWindows version: 10.0.22621.2134',
          stderr: '',
          command: 'command',
        });
      }
      if (command === 'powershell.exe') {
        resolve({
          stdout: 'True',
          stderr: '',
          command: 'command',
        });
      }
    });
  });
  const wslEnabled = await extension.isWSLEnabled();
  expect(wslEnabled).toBeTruthy();
});

test('getJSONMachineList should only get machines from wsl if hyperv is not enabled', async () => {
  vi.mocked(extensionApi.env).isWindows = true;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation((command, args) => {
    return new Promise<extensionApi.RunResult>(resolve => {
      if (command !== 'wsl' && args?.[0] === '--version') {
        resolve({
          stdout: 'podman version 5.1.1',
        } as extensionApi.RunResult);
      }
      if (command === 'wsl') {
        resolve({
          stdout:
            'WSL version: 2.2.5.0\nKernel version: 5.15.90.1\nWSLg version: 1.0.51\nMSRDC version: 1.2.3770\nDirect3D version: 1.608.2-61064218\nDXCore version: 10.0.25131.1002-220531-1700.rs-onecore-base2-hyp\nWindows version: 10.0.22621.2134',
          stderr: '',
          command: 'command',
        });
      }
      if (command === 'powershell.exe') {
        resolve({
          stdout: 'True',
          stderr: '',
          command: 'command',
        });
      }
    });
  });
  const fakeJSON: extension.MachineJSON[] = [
    {
      Name: 'podman-machine-default',
      CPUs: 2,
      Memory: '1048000000',
      DiskSize: '250000000000',
      Running: true,
      Starting: false,
      Default: true,
      VMType: VMTYPE.LIBKRUN,
      Port: 123,
      RemoteUsername: 'user',
      IdentityPath: '/path/to/key',
    },
    {
      Name: 'podman-machine-1',
      CPUs: 2,
      Memory: '1048000000',
      DiskSize: '250000000000',
      Running: false,
      Starting: false,
      Default: false,
      VMType: VMTYPE.LIBKRUN,
      Port: 123,
      RemoteUsername: 'user',
      IdentityPath: '/path/to/key',
    },
  ];
  const execPodmanSpy = vi.spyOn(util, 'execPodman').mockResolvedValue({
    stdout: JSON.stringify(fakeJSON),
    stderr: '',
    command: '',
  });
  await extension.getJSONMachineList();
  expect(execPodmanSpy).toBeCalledWith(['machine', 'list', '--format', 'json'], 'wsl');
});

test('getJSONMachineList should only get machines from hyperv if wsl is not enabled', async () => {
  vi.mocked(extensionApi.env).isWindows = true;
  vi.spyOn(podmanCli, 'getPodmanInstallation').mockResolvedValue({
    version: '5.2.1',
  });
  vi.spyOn(extensionApi.process, 'exec').mockImplementation((command, args) => {
    return new Promise<extensionApi.RunResult>(resolve => {
      if (command !== 'wsl' && args?.[0] === '--version') {
        resolve({
          stdout: 'podman version 5.2.1',
        } as extensionApi.RunResult);
      }
      if (command === 'wsl') {
        resolve({
          stdout: 'WSL version: invalid',
          stderr: '',
          command: 'command',
        });
      }
      if (command === 'powershell.exe') {
        resolve({
          stdout: args?.[0] === '@(Get-Service vmms).Status' ? 'Running' : 'True',
          stderr: '',
          command: 'command',
        });
      }
    });
  });
  const fakeJSON: extension.MachineJSON[] = [
    {
      Name: 'podman-machine-default',
      CPUs: 2,
      Memory: '1048000000',
      DiskSize: '250000000000',
      Running: true,
      Starting: false,
      Default: true,
      VMType: VMTYPE.LIBKRUN,
      Port: 123,
      RemoteUsername: 'user',
      IdentityPath: '/path/to/key',
    },
    {
      Name: 'podman-machine-1',
      CPUs: 2,
      Memory: '1048000000',
      DiskSize: '250000000000',
      Running: false,
      Starting: false,
      Default: false,
      VMType: VMTYPE.LIBKRUN,
      Port: 123,
      RemoteUsername: 'user',
      IdentityPath: '/path/to/key',
    },
  ];
  const execPodmanSpy = vi.spyOn(util, 'execPodman').mockResolvedValue({
    stdout: JSON.stringify(fakeJSON),
    stderr: '',
    command: '',
  });
  await extension.getJSONMachineList();
  expect(execPodmanSpy).toBeCalledWith(['machine', 'list', '--format', 'json'], 'hyperv');
});

test('getJSONMachineList should get machines from hyperv and wsl if both are enabled', async () => {
  vi.mocked(extensionApi.env).isWindows = true;
  vi.spyOn(podmanCli, 'getPodmanInstallation').mockResolvedValue({
    version: '5.2.1',
  });
  vi.spyOn(extensionApi.process, 'exec').mockImplementation((command, args) => {
    return new Promise<extensionApi.RunResult>(resolve => {
      if (command !== 'wsl' && args?.[0] === '--version') {
        resolve({
          stdout: 'podman version 5.2.1',
        } as extensionApi.RunResult);
      }
      if (command === 'wsl') {
        resolve({
          stdout:
            'WSL version: 2.2.5.0\nKernel version: 5.15.90.1\nWSLg version: 1.0.51\nMSRDC version: 1.2.3770\nDirect3D version: 1.608.2-61064218\nDXCore version: 10.0.25131.1002-220531-1700.rs-onecore-base2-hyp\nWindows version: 10.0.22621.2134',
          stderr: '',
          command: 'command',
        });
      }
      if (command === 'powershell.exe') {
        resolve({
          stdout: args?.[0] === '@(Get-Service vmms).Status' ? 'Running' : 'True',
          stderr: '',
          command: 'command',
        });
      }
    });
  });
  const fakeJSON: extension.MachineJSON[] = [
    {
      Name: 'podman-machine-default',
      CPUs: 2,
      Memory: '1048000000',
      DiskSize: '250000000000',
      Running: true,
      Starting: false,
      Default: true,
      VMType: VMTYPE.LIBKRUN,
      Port: 123,
      RemoteUsername: 'user',
      IdentityPath: '/path/to/key',
    },
    {
      Name: 'podman-machine-1',
      CPUs: 2,
      Memory: '1048000000',
      DiskSize: '250000000000',
      Running: false,
      Starting: false,
      Default: false,
      VMType: VMTYPE.LIBKRUN,
      Port: 123,
      RemoteUsername: 'user',
      IdentityPath: '/path/to/key',
    },
  ];
  const execPodmanSpy = vi.spyOn(util, 'execPodman').mockResolvedValue({
    stdout: JSON.stringify(fakeJSON),
    stderr: '',
    command: '',
  });
  await extension.getJSONMachineList();
  expect(execPodmanSpy).toHaveBeenNthCalledWith(1, ['machine', 'list', '--format', 'json'], 'wsl');
  expect(execPodmanSpy).toHaveBeenNthCalledWith(2, ['machine', 'list', '--format', 'json'], 'hyperv');
});

describe('updateWSLHyperVEnabledValue', () => {
  beforeEach(() => {
    extension.updateWSLHyperVEnabledContextValue(true);
    vi.resetAllMocks();
  });
  test('setValue should be called if new value is different than wslAndHypervEnabled', async () => {
    extension.updateWSLHyperVEnabledContextValue(false);
    expect(extensionApi.context.setValue).toBeCalledWith(extension.WSL_HYPERV_ENABLED_KEY, false);
  });
  test('setValue should not be called if new value is equal to wslAndHypervEnabled', async () => {
    extension.updateWSLHyperVEnabledContextValue(true);
    expect(extensionApi.context.setValue).not.toBeCalled();
  });
});

describe('connectionAuditor', () => {
  test('check if podman.isCreateWSLOptionSelected is set to true if podman.factory.machine.win.provider = wsl', async () => {
    // be sure isCreateWSLOptionSelected is set to false
    await extension.connectionAuditor({
      'podman.factory.machine.win.provider': 'hyperv',
    });

    // verify isCreateWSLOptionSelected is set to true
    await extension.connectionAuditor({
      'podman.factory.machine.win.provider': 'wsl',
    });
    expect(extensionApi.context.setValue).toHaveBeenLastCalledWith(
      extension.CREATE_WSL_MACHINE_OPTION_SELECTED_KEY,
      true,
    );
  });
  test('check if podman.isCreateWSLOptionSelected is set to true if podman.factory.machine.win.provider is undefined but wsl is enabled', async () => {
    // be sure isCreateWSLOptionSelected is set to false
    await extension.connectionAuditor({
      'podman.factory.machine.win.provider': 'hyperv',
    });

    // verify isCreateWSLOptionSelected is set to true
    extension.setWSLEnabled(true);

    await extension.connectionAuditor({
      'podman.factory.machine.win.provider': undefined,
    });
    expect(extensionApi.context.setValue).toHaveBeenLastCalledWith(
      extension.CREATE_WSL_MACHINE_OPTION_SELECTED_KEY,
      true,
    );
  });
  test('check if podman.isCreateWSLOptionSelected is set to false if podman.factory.machine.win.provider = hyperv', async () => {
    // be sure isCreateWSLOptionSelected is set to true
    await extension.connectionAuditor({
      'podman.factory.machine.win.provider': 'wsl',
    });

    // verify isCreateWSLOptionSelected is set to false
    await extension.connectionAuditor({
      'podman.factory.machine.win.provider': 'hyperv',
    });
    expect(extensionApi.context.setValue).toHaveBeenLastCalledWith(
      extension.CREATE_WSL_MACHINE_OPTION_SELECTED_KEY,
      false,
    );
  });
  test('check if podman.isCreateWSLOptionSelected is set to false if podman.factory.machine.win.provider is undefined and wsl is NOT enabled', async () => {
    // be sure isCreateWSLOptionSelected is set to true
    await extension.connectionAuditor({
      'podman.factory.machine.win.provider': 'wsl',
    });

    // verify isCreateWSLOptionSelected is set to false
    extension.setWSLEnabled(false);

    await extension.connectionAuditor({
      'podman.factory.machine.win.provider': undefined,
    });
    expect(extensionApi.context.setValue).toHaveBeenLastCalledWith(
      extension.CREATE_WSL_MACHINE_OPTION_SELECTED_KEY,
      false,
    );
  });
});

// https://github.com/podman-desktop/podman-desktop/issues/10173
test('activate and autostart should not duplicate machines ', async () => {
  vi.mocked(extensionApi.env).isMac = true;
  vi.mocked(extensionApi.env).isWindows = false;
  vi.mocked(extensionApi.env).isLinux = false;
  vi.spyOn(PodmanInstall.prototype, 'checkForUpdate').mockResolvedValue({
    hasUpdate: false,
  } as unknown as UpdateCheck);
  const contextMock = {
    subscriptions: [],
    secrets: {
      delete: vi.fn(),
      get: vi.fn(),
      onDidChange: vi.fn(),
      store: vi.fn(),
    },
  } as unknown as extensionApi.ExtensionContext;

  // mock getSocketCompatibility
  const disableMock = vi.fn();
  const enableMock = vi.fn();
  const isEnabledMock = vi.fn().mockReturnValue(false);
  const mock = vi.spyOn(compatibilityModeLib, 'getSocketCompatibility');
  mock.mockReturnValue({
    isEnabled: isEnabledMock,
    enable: enableMock,
    disable: disableMock,
    details: '',
    tooltipText: (): string => {
      return '';
    },
  });

  let podmanMachineListCalls = 0;

  vi.mocked(extensionApi.process.exec).mockImplementation(
    (_command: string, args?: string[], _options?: extensionApi.RunOptions) =>
      new Promise<extensionApi.RunResult>(resolve => {
        if (args?.[0] === '--version') {
          resolve({
            stderr: '',
            stdout: '5.0.0',
            command: '',
          });
          return;
        }

        if (args?.[0] === 'machine' && args?.[1] === 'list') {
          podmanMachineListCalls++;
          resolve({
            stderr: '',
            stdout: '[]',
            command: '',
          });
        }
      }),
  );

  const api = await extension.activate(contextMock);
  expect(api).toBeDefined();

  // check that we've registered a autostart provider
  expect(provider.registerAutostart).toBeCalled();
  const autoStartMethod = vi.mocked(provider.registerAutostart).mock.calls[0][0] as unknown as {
    start: () => Promise<void>;
  };

  // call the autostart method
  const promiseAutoStart = autoStartMethod?.start();

  // call 100 times monitorMachines
  for (let i = 0; i < 100; i++) {
    extension.monitorMachines(provider, podmanConfiguration).catch(() => {});
  }

  await promiseAutoStart;

  // should be only 1 but we allow some more calls (if there is not a check to check during the autostart it would be 100+ calls)
  expect(podmanMachineListCalls).toBeLessThan(5);
  expect(promiseAutoStart).toBeDefined();
});

describe('macOS: tests for notifying if disguised podman socket fails / passes', () => {
  let contextMock: extensionApi.ExtensionContext;

  beforeEach(() => {
    vi.resetAllMocks();

    contextMock = {
      subscriptions: [],
      secrets: {
        delete: vi.fn(),
        get: vi.fn(),
        onDidChange: vi.fn(),
        store: vi.fn(),
      },
    } as unknown as extensionApi.ExtensionContext;

    // Mock the get compatibility functionality.
    // we will always assuming it's "disabled" for the tests
    vi.spyOn(compatibilityModeLib, 'getSocketCompatibility').mockReturnValue({
      isEnabled: vi.fn().mockReturnValue(true),
      enable: vi.fn().mockReturnValue(true),
      disable: vi.fn(),
      details: '',
      tooltipText: (): string => {
        return '';
      },
    });

    vi.mock('./utils/warnings');

    // Change the mock return value to return a provider with a ready status for testing,
    // this uses the original provider, but just replaces the ready status
    vi.spyOn(apiProvider, 'createProvider').mockReturnValue(
      providerWithReadyStatus as unknown as extensionApi.Provider,
    );
  });

  test('when isDisguisedPodman is true, error message should NOT be shown', async () => {
    // macOS only
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(extensionApi.env).isWindows = false;
    vi.mocked(extensionApi.env).isLinux = false;

    // Mock "isDisguisedPodman" to return true to indicate a failed socket
    vi.mocked(isDisguisedPodman).mockImplementation(async () => true);

    const api = await extension.activate(contextMock);
    expect(api).toBeDefined();

    // Check that isDisguisedPodman was called
    expect(isDisguisedPodman).toBeCalled();

    // Check that the error message is NOT shown
    expect(extensionApi.window.showNotification).not.toBeCalled();
  });

  test('when isDisguisedPodman is false, error message should be shown', async () => {
    // macOS only
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(extensionApi.env).isWindows = false;
    vi.mocked(extensionApi.env).isLinux = false;

    // Mock "isDisguisedPodman" to return false to indicate a failed socket
    vi.mocked(isDisguisedPodman).mockImplementation(async () => false);

    const api = await extension.activate(contextMock);
    expect(api).toBeDefined();

    // Check that isDisguisedPodman was called
    expect(isDisguisedPodman).toBeCalled();

    // Check that the error message is shown
    expect(extensionApi.window.showNotification).toBeCalledWith({
      title: 'Docker socket is not disguised correctly',
      body: 'The Docker socket (/var/run/docker.sock) is not being properly disguised by Podman. This could potentially cause docker-compatible tools to fail. Please disable any conflicting tools and re-enable Docker Compatibility.',
      highlight: true,
      markdownActions:
        ':button[Docker compatibility settings]{href=/preferences/docker-compatibility title="Docker Compatibility settings"}',
      silent: true,
      type: 'error',
    });
  });

  test('do not show error message OR call function if on linux', async () => {
    // linux
    vi.mocked(extensionApi.env).isMac = false;
    vi.mocked(extensionApi.env).isWindows = false;
    vi.mocked(extensionApi.env).isLinux = true;

    const api = await extension.activate(contextMock);
    expect(api).toBeDefined();

    // Expect that isDisguisedPodman was NOT called
    expect(isDisguisedPodman).not.toBeCalled();

    expect(extensionApi.window.showNotification).not.toBeCalled();
  });

  test('do not show error message OR call function if on windows', async () => {
    // windows
    vi.mocked(extensionApi.env).isMac = false;
    vi.mocked(extensionApi.env).isWindows = true;
    vi.mocked(extensionApi.env).isLinux = false;

    const api = await extension.activate(contextMock);
    expect(api).toBeDefined();

    // Expect that isDisguisedPodman was NOT called
    expect(isDisguisedPodman).not.toBeCalled();

    expect(extensionApi.window.showNotification).not.toBeCalled();
  });

  test('do not show any notifications / messages if the provider is stopped', async () => {
    // macOS only
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(extensionApi.env).isWindows = false;
    vi.mocked(extensionApi.env).isLinux = false;

    // Mock the provider to be "stopped"
    vi.spyOn(apiProvider, 'createProvider').mockReturnValue(
      providerWithStoppedStatus as unknown as extensionApi.Provider,
    );

    const api = await extension.activate(contextMock);
    expect(api).toBeDefined();

    // Expect that isDisguisedPodman was NOT called
    expect(isDisguisedPodman).not.toBeCalled();

    // Check that the error message is NOT shown
    expect(extensionApi.window.showNotification).not.toBeCalled();
  });
});

describe('podman-mac-helper tests', () => {
  let contextMock: extensionApi.ExtensionContext;

  beforeEach(() => {
    // Make sure it's macOS only
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(extensionApi.env).isWindows = false;
    vi.mocked(extensionApi.env).isLinux = false;

    // Mock the context
    contextMock = {
      subscriptions: [],
      secrets: {
        delete: vi.fn(),
        get: vi.fn(),
        onDidChange: vi.fn(),
        store: vi.fn(),
      },
    } as unknown as extensionApi.ExtensionContext;

    // Mock the get compatibility functionality.
    // we just assume that it's false / not enabled by default to test the functionality.
    vi.spyOn(compatibilityModeLib, 'getSocketCompatibility').mockReturnValue({
      isEnabled: vi.fn(),
      enable: vi.fn().mockReturnValue(false),
      disable: vi.fn(),
      details: '',
      tooltipText: (): string => {
        return '';
      },
    });

    // Change the mock return value to return a provider with a ready status for testing,
    // this uses the original provider, but just replaces the ready status
    vi.spyOn(apiProvider, 'createProvider').mockReturnValue(
      providerWithReadyStatus as unknown as extensionApi.Provider,
    );
  });

  test('show setup podman mac helper notification if on mac and podman-mac-helper needs running', async () => {
    // Activate
    const api = await extension.activate(contextMock);
    expect(api).toBeDefined();

    await vi.waitFor(() => {
      // Make sure showNotification contains "body" as: "The Podman Mac Helper is not set up, some features might not function optimally.", ignore everything else.
      expect(extensionApi.window.showNotification).toBeCalledWith(
        expect.objectContaining({
          body: expect.stringContaining(
            'The Podman Mac Helper is not set up, some features might not function optimally.',
          ),
        }),
      );
    });
  });

  test('set do not show configuration setting to true, make sure notification is NOT shown', async () => {
    // Set configuration to always be true
    // mimicking the 'doNotShow' setting being true
    const spyGetConfiguration = vi.spyOn(config, 'get');
    spyGetConfiguration.mockReturnValue(true);

    // Activate
    const api = await extension.activate(contextMock);
    expect(api).toBeDefined();

    // Make sure showNotification is not shown at all.
    expect(extensionApi.window.showNotification).not.toBeCalledWith(
      expect.objectContaining({
        body: expect.stringContaining(
          'The Podman Mac Helper is not set up, some features might not function optimally.',
        ),
      }),
    );
  });

  test('mock that the provider is "stopped" and make sure that the notification is NOT shown', async () => {
    // Mock the provider to be "stopped"
    vi.spyOn(apiProvider, 'createProvider').mockReturnValue(
      providerWithStoppedStatus as unknown as extensionApi.Provider,
    );

    // Activate
    const api = await extension.activate(contextMock);
    expect(api).toBeDefined();

    // Make sure showNotification is not shown at all.
    expect(extensionApi.window.showNotification).not.toBeCalledWith(
      expect.objectContaining({
        body: expect.stringContaining(
          'The Podman Mac Helper is not set up, some features might not function optimally.',
        ),
      }),
    );
  });
});
