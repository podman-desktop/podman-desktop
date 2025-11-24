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

import { process, type TelemetryLogger } from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import { VirtualMachinePlatformCheck } from './virtual-machine-platform-check';

const mockTelemetryLogger = {} as TelemetryLogger;

beforeEach(() => {
  vi.resetAllMocks();
});

test('expect winVirtualMachine preflight check return successful result if the virtual machine platform feature is enabled', async () => {
  vi.mocked(process.exec).mockResolvedValue({
    stdout: 'VirtualMachinePlatform',
    stderr: '',
    command: 'command',
  });

  const winVirtualMachinePlatformCheck = new VirtualMachinePlatformCheck(mockTelemetryLogger);
  const result = await winVirtualMachinePlatformCheck.execute();
  expect(process.exec).toBeCalledWith(expect.anything(), expect.arrayContaining([expect.anything()]), {
    encoding: 'utf16le',
  });
  expect(result.successful).toBeTruthy();
});

test('expect winVirtualMachine preflight check return successful result if the virtual machine platform feature is disabled', async () => {
  vi.mocked(process.exec).mockResolvedValue({
    stdout: 'some message',
    stderr: '',
    command: 'command',
  });

  const winVirtualMachinePlatformCheck = new VirtualMachinePlatformCheck(mockTelemetryLogger);
  const result = await winVirtualMachinePlatformCheck.execute();
  expect(result.description).equal('Virtual Machine Platform should be enabled to be able to run Podman.');
  expect(result.docLinksDescription).equal('Learn about how to enable the Virtual Machine Platform feature:');
  expect(result.docLinks?.[0].url).equal(
    'https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-3---enable-virtual-machine-feature',
  );
  expect(result.docLinks?.[0].title).equal('Enable Virtual Machine Platform');
});

test('expect winVirtualMachine preflight check return successful result if there is an error when checking if virtual machine platform feature is enabled', async () => {
  vi.mocked(process.exec).mockRejectedValue(new Error());

  const winVirtualMachinePlatformCheck = new VirtualMachinePlatformCheck(mockTelemetryLogger);
  const result = await winVirtualMachinePlatformCheck.execute();
  expect(result.description).equal('Virtual Machine Platform should be enabled to be able to run Podman.');
  expect(result.docLinksDescription).equal('Learn about how to enable the Virtual Machine Platform feature:');
  expect(result.docLinks?.[0].url).equal(
    'https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-3---enable-virtual-machine-feature',
  );
  expect(result.docLinks?.[0].title).equal('Enable Virtual Machine Platform');
});

test('expect winVirtualMachine preflight check to be memoized', async () => {
  vi.mocked(process.exec).mockResolvedValue({
    stdout: 'VirtualMachinePlatform',
    stderr: '',
    command: 'command',
  });

  const winVirtualMachinePlatformCheck = new VirtualMachinePlatformCheck(mockTelemetryLogger);
  await winVirtualMachinePlatformCheck.execute();
  expect(process.exec).toHaveBeenCalledOnce();

  await winVirtualMachinePlatformCheck.execute();
  expect(process.exec).toHaveBeenCalledOnce();
});
