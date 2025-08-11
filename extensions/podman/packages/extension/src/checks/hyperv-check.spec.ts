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
import * as extensionApi from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import { HyperVCheck } from './hyperv-check';

vi.mock('@podman-desktop/api', async () => {
  return {
    commands: {
      registerCommand: vi.fn(),
    },
    env: {
      isMac: true,
      openExternal: vi.fn(),
    },
    window: {
      withProgress: vi.fn(),
      showNotification: vi.fn(),
      showErrorMessage: vi.fn(),
      showInformationMessage: vi.fn(),
      showWarningMessage: vi.fn(),
    },
    ProgressLocation: {},
    process: {
      exec: vi.fn(),
    },
    configuration: {
      getConfiguration: vi.fn(),
    },
    Uri: {
      parse: vi.fn(),
    },
    context: {
      setValue: vi.fn(),
    },
  };
});

vi.mock(import('../utils/util'), async () => {
  return {
    getAssetsFolder: vi.fn().mockReturnValue(''),
    runCliCommand: vi.fn(),
    appHomeDir: vi.fn().mockReturnValue(''),
    normalizeWSLOutput: vi.fn().mockImplementation((s: string) => s),
    isLinux: vi.fn(),
    isWindows: vi.fn(),
    isMac: vi.fn(),
    execPodman: vi.fn(),
  };
});

const mockTelemetryLogger = {} as extensionApi.TelemetryLogger;

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: () => '',
    has: vi.fn(),
    update: vi.fn(),
  });
});

test('expect HyperV preflight check return failure result if podman is older than 5.2.0', async () => {
  let index = 0;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => {
    if (index++ < 1) {
      return Promise.resolve({
        stdout: 'podman version 5.1.0',
        stderr: '',
        command: 'command',
      });
    }
    throw new Error();
  });

  const hyperVCheck = new HyperVCheck(mockTelemetryLogger);
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('Hyper-V is only supported with podman version >= 5.2.0.');
});

test('expect HyperV preflight skips podman version check if installationPreflightMode is true', async () => {
  const execSpy = vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => {
    throw new Error();
  });

  const hyperVCheck = new HyperVCheck(mockTelemetryLogger, true);
  const result = await hyperVCheck.execute();
  // exec should only be called once inside the isUserAdmin function, if so the podman check has been skipped as expected
  expect(execSpy).toBeCalledTimes(1);
  expect(execSpy).toBeCalledWith('powershell.exe', [
    '$null -ne (whoami /groups /fo csv | ConvertFrom-Csv | Where-Object {$_.SID -eq "S-1-5-32-544"})',
  ]);
  expect(result.successful).toBeFalsy();
});

test('expect HyperV preflight check return failure result if it fails when checking admin user', async () => {
  let index = 0;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => {
    if (index++ < 1) {
      return Promise.resolve({
        stdout: 'podman version 5.2.0',
        stderr: '',
        command: 'command',
      });
    } else {
      throw new Error();
    }
  });

  const hyperVCheck = new HyperVCheck(mockTelemetryLogger);
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('You must have administrative rights to run Hyper-V Podman machines');
  expect(result.docLinks?.[0].url).equal(
    'https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v',
  );
  expect(result.docLinks?.[0].title).equal('Hyper-V Manual Installation Steps');
});

test('expect HyperV preflight check return failure result if non admin user', async () => {
  let index = 0;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => {
    if (index++ < 1) {
      return Promise.resolve({
        stdout: 'podman version 5.2.0',
        stderr: '',
        command: 'command',
      });
    } else {
      return Promise.resolve({
        stdout: 'False',
        stderr: '',
        command: 'command',
      });
    }
  });

  const hyperVCheck = new HyperVCheck(mockTelemetryLogger);
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('You must have administrative rights to run Hyper-V Podman machines');
  expect(result.docLinks?.[0].url).equal(
    'https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v',
  );
  expect(result.docLinks?.[0].title).equal('Hyper-V Manual Installation Steps');
});

test('expect HyperV preflight check return failure result if Podman Desktop is not run with elevated privileges', async () => {
  let index = 0;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => {
    if (index++ <= 1) {
      return Promise.resolve({
        stdout: index === 1 ? 'podman version 5.2.0' : 'True',
        stderr: '',
        command: 'command',
      });
    } else {
      throw new Error();
    }
  });

  const hyperVCheck = new HyperVCheck(mockTelemetryLogger);
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal(
    'You must run Podman Desktop with administrative rights to run Hyper-V Podman machines.',
  );
  expect(result.docLinks).toBeUndefined();
});

test('expect HyperV preflight check return failure result if HyperV not installed', async () => {
  let index = 0;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => {
    if (index++ <= 2) {
      return Promise.resolve({
        stdout: index === 1 ? 'podman version 5.2.0' : 'True',
        stderr: '',
        command: 'command',
      });
    } else {
      throw new Error();
    }
  });

  const hyperVCheck = new HyperVCheck(mockTelemetryLogger);
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('Hyper-V is not installed on your system.');
  expect(result.docLinks?.[0].url).equal(
    'https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v',
  );
  expect(result.docLinks?.[0].title).equal('Hyper-V Manual Installation Steps');
});

test('expect HyperV preflight check return failure result if HyperV not running', async () => {
  let index = 0;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => {
    if (index++ <= 3) {
      return Promise.resolve({
        stdout: index === 1 ? 'podman version 5.2.0' : 'True',
        stderr: '',
        command: 'command',
      });
    } else {
      throw new Error();
    }
  });

  const hyperVCheck = new HyperVCheck(mockTelemetryLogger);
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('Hyper-V is not running on your system.');
  expect(result.docLinks?.[0].url).equal(
    'https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v',
  );
  expect(result.docLinks?.[0].title).equal('Hyper-V Manual Installation Steps');
});

test('expect HyperV preflight check return OK', async () => {
  let index = 0;
  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => {
    if (index++ <= 4) {
      return Promise.resolve({
        stdout: index === 1 ? 'podman version 5.2.0' : index === 5 ? 'Running' : 'True',
        stderr: '',
        command: 'command',
      });
    } else {
      throw new Error();
    }
  });

  const hyperVCheck = new HyperVCheck(mockTelemetryLogger);
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeTruthy();
  expect(result.description).toBeUndefined();
  expect(result.docLinks?.[0].url).toBeUndefined();
  expect(result.docLinks?.[0].title).toBeUndefined();
});
