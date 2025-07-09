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

import type { Configuration, Disposable } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import * as compatibilityModeLib from './compatibility-mode';
import { NotificationManager } from './notification-manager';
import { isDisguisedPodman } from './warnings';

const config: Configuration = {
  get: () => {
    // not implemented
  },
  has: () => true,
  update: vi.fn(),
};

vi.mock('node:fs');

beforeEach(() => {
  vi.resetAllMocks();
});

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

beforeEach(() => {
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

describe('macOS: tests for notifying if disguised podman socket fails / passes', () => {
  beforeEach(() => {
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

    vi.mock('./warnings');
  });

  test('when isDisguisedPodman is true, error message should NOT be shown', async () => {
    const notificationManager = new NotificationManager();

    // macOS only
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(extensionApi.env).isWindows = false;
    vi.mocked(extensionApi.env).isLinux = false;

    // Mock "isDisguisedPodman" to return true to indicate a failed socket
    vi.mocked(isDisguisedPodman).mockImplementation(async () => true);

    await notificationManager.checkAndNotifyDisguisedPodmanMacHelper();

    // Check that isDisguisedPodman was called
    expect(isDisguisedPodman).toBeCalled();

    // Check that the error message is NOT shown
    expect(extensionApi.window.showNotification).not.toBeCalled();
  });

  test('when isDisguisedPodman is false, error message should be shown', async () => {
    const notificationManager = new NotificationManager();

    // macOS only
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(extensionApi.env).isWindows = false;
    vi.mocked(extensionApi.env).isLinux = false;

    // Mock "isDisguisedPodman" to return false to indicate a failed socket
    vi.mocked(isDisguisedPodman).mockImplementation(async () => false);

    await notificationManager.checkAndNotifyDisguisedPodmanMacHelper();

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
    const notificationManager = new NotificationManager();

    // linux
    vi.mocked(extensionApi.env).isMac = false;
    vi.mocked(extensionApi.env).isWindows = false;
    vi.mocked(extensionApi.env).isLinux = true;

    await notificationManager.checkAndNotifyDisguisedPodmanMacHelper();

    // Expect that isDisguisedPodman was NOT called
    expect(isDisguisedPodman).not.toBeCalled();

    expect(extensionApi.window.showNotification).not.toBeCalled();
  });

  test('do not show error message OR call function if on windows', async () => {
    const notificationManager = new NotificationManager();

    // windows
    vi.mocked(extensionApi.env).isMac = false;
    vi.mocked(extensionApi.env).isWindows = true;
    vi.mocked(extensionApi.env).isLinux = false;

    await notificationManager.checkAndNotifyDisguisedPodmanMacHelper();

    // Expect that isDisguisedPodman was NOT called
    expect(isDisguisedPodman).not.toBeCalled();

    expect(extensionApi.window.showNotification).not.toBeCalled();
  });
});

describe('podman-mac-helper tests', () => {
  beforeEach(() => {
    // Make sure it's macOS only
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(extensionApi.env).isWindows = false;
    vi.mocked(extensionApi.env).isLinux = false;

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
  });

  test('show setup podman mac helper notification if on mac and podman-mac-helper needs running', async () => {
    const notificationManager = new NotificationManager();
    await notificationManager.checkAndNotifyDisguisedPodmanMacHelper();

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
    const notificationManager = new NotificationManager();

    // Set configuration to always be true
    // mimicking the 'doNotShow' setting being true
    const spyGetConfiguration = vi.spyOn(config, 'get');
    spyGetConfiguration.mockReturnValue(true);

    notificationManager.setupNotificationMacPodman();

    await notificationManager.checkAndNotifyDisguisedPodmanMacHelper();

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
