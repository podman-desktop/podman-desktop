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

import type { Configuration } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import * as compatibilityModeLib from '/@/compatibility-mode/compatibility-mode';

import { ExtensionNotifications } from './notifications';
import { isDisguisedPodman } from './warnings';

const config: Configuration = {
  get: vi.fn(),
  has: () => true,
  update: vi.fn(),
};

vi.mock('node:fs');

const mockTelemetryLogger: extensionApi.TelemetryLogger = {
  logUsage: vi.fn(),
  logError: vi.fn(),
} as unknown as extensionApi.TelemetryLogger;

beforeEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  vi.mocked(extensionApi.env).isMac = false;
  vi.mocked(extensionApi.env).isLinux = false;
  vi.mocked(extensionApi.env).isWindows = false;

  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue(config);

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
    const extensionNotifications = new ExtensionNotifications(mockTelemetryLogger);

    // macOS only
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(extensionApi.env).isWindows = false;
    vi.mocked(extensionApi.env).isLinux = false;

    // Mock "isDisguisedPodman" to return true to indicate a failed socket
    vi.mocked(isDisguisedPodman).mockResolvedValue(true);

    await extensionNotifications.checkMacSocket();

    // Check that isDisguisedPodman was called
    expect(isDisguisedPodman).toBeCalled();

    // Check that the error message is NOT shown
    expect(extensionApi.window.showNotification).not.toBeCalled();
  });

  test('when isDisguisedPodman is false, error message should be shown', async () => {
    const extensionNotifications = new ExtensionNotifications(mockTelemetryLogger);

    // macOS only
    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(extensionApi.env).isWindows = false;
    vi.mocked(extensionApi.env).isLinux = false;

    // Mock "isDisguisedPodman" to return false to indicate a failed socket
    vi.mocked(isDisguisedPodman).mockResolvedValue(false);

    await extensionNotifications.checkMacSocket();

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

  test('when isDisguisedPodman throws an error, telemetryLogUsageMock should be called with error', async () => {
    const extensionNotifications = new ExtensionNotifications(mockTelemetryLogger);

    vi.mocked(extensionApi.env).isMac = true;
    vi.mocked(extensionApi.env).isWindows = false;
    vi.mocked(extensionApi.env).isLinux = false;

    const error = new Error('test error');
    vi.mocked(isDisguisedPodman).mockRejectedValue(error);

    await extensionNotifications.checkMacSocket();

    expect(isDisguisedPodman).toBeCalled();

    expect(mockTelemetryLogger.logError).toBeCalledWith(
      'checkIfSocketDisguisedFailed',
      expect.objectContaining({ error }),
    );
    expect(mockTelemetryLogger.logUsage).not.toBeCalled();
  });

  test('do not show error message OR call function if on linux', async () => {
    const extensionNotifications = new ExtensionNotifications(mockTelemetryLogger);

    // linux
    vi.mocked(extensionApi.env).isMac = false;
    vi.mocked(extensionApi.env).isWindows = false;
    vi.mocked(extensionApi.env).isLinux = true;

    await extensionNotifications.checkMacSocket();

    // Expect that isDisguisedPodman was NOT called
    expect(isDisguisedPodman).not.toBeCalled();

    expect(extensionApi.window.showNotification).not.toBeCalled();
  });

  test('do not show error message OR call function if on windows', async () => {
    const extensionNotifications = new ExtensionNotifications(mockTelemetryLogger);

    // windows
    vi.mocked(extensionApi.env).isMac = false;
    vi.mocked(extensionApi.env).isWindows = true;
    vi.mocked(extensionApi.env).isLinux = false;

    await extensionNotifications.checkMacSocket();

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
    const extensionNotifications = new ExtensionNotifications(mockTelemetryLogger);
    vi.mocked(isDisguisedPodman).mockResolvedValue(false);
    await extensionNotifications.checkMacSocket();

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
    const extensionNotifications = new ExtensionNotifications(mockTelemetryLogger);

    // Set configuration to always be true
    // mimicking the 'doNotShow' setting being true
    const spyGetConfiguration = vi.spyOn(config, 'get');
    spyGetConfiguration.mockReturnValue(true);

    extensionNotifications.setupNotificationMacPodman();

    await extensionNotifications.checkMacSocket();

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
