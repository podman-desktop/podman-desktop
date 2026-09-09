/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import { VirtualizationFirmwareCheck } from './virtualization-firmware-check';

const mockTelemetryLogger = {} as TelemetryLogger;

beforeEach(() => {
  vi.resetAllMocks();
});

test('expect virtualization firmware check to return successful result when firmware virtualization is enabled', async () => {
  vi.mocked(process.exec).mockResolvedValue({
    stdout: 'True',
    stderr: '',
    command: 'command',
  });

  const check = new VirtualizationFirmwareCheck(mockTelemetryLogger);
  const result = await check.execute();
  expect(process.exec).toBeCalledWith(expect.anything(), expect.arrayContaining([expect.anything()]), {
    encoding: 'utf16le',
  });
  expect(result.successful).toBeTruthy();
});

test('expect virtualization firmware check to return successful when firmware reports False but hypervisor is present', async () => {
  vi.mocked(process.exec)
    .mockResolvedValueOnce({ stdout: 'False', stderr: '', command: 'command' })
    .mockResolvedValueOnce({ stdout: 'True', stderr: '', command: 'command' });

  const check = new VirtualizationFirmwareCheck(mockTelemetryLogger);
  const result = await check.execute();
  expect(result.successful).toBeTruthy();
});

test('expect virtualization firmware check to return warning when firmware virtualization is disabled and no hypervisor', async () => {
  vi.mocked(process.exec)
    .mockResolvedValueOnce({ stdout: 'False', stderr: '', command: 'command' })
    .mockResolvedValueOnce({ stdout: 'False', stderr: '', command: 'command' });

  const check = new VirtualizationFirmwareCheck(mockTelemetryLogger);
  const result = await check.execute();
  expect(result.successful).toBeFalsy();
  expect(result.severity).toEqual('warning');
  expect(result.description).toEqual(
    'CPU virtualization (Intel VT-x / AMD-V) is disabled in BIOS/UEFI. Enable it to run Podman machines with WSL2 or Hyper-V.',
  );
  expect(result.docLinksDescription).toEqual(
    'Reboot into BIOS/UEFI settings, enable Virtualization Technology (Intel VT-x) or SVM Mode (AMD-V), save changes, reboot, then re-run checks.',
  );
  expect(result.docLinks?.[0].url).toEqual(
    'https://support.microsoft.com/en-us/windows/experience/enable-virtualization-on-windows',
  );
  expect(result.docLinks?.[0].title).toEqual('Enable Virtualization on Windows');
});

test('expect virtualization firmware check to return warning when checking firmware virtualization fails and no hypervisor', async () => {
  vi.mocked(process.exec)
    .mockRejectedValueOnce(new Error())
    .mockResolvedValueOnce({ stdout: 'False', stderr: '', command: 'command' });

  const check = new VirtualizationFirmwareCheck(mockTelemetryLogger);
  const result = await check.execute();
  expect(result.successful).toBeFalsy();
  expect(result.severity).toEqual('warning');
  expect(result.description).toEqual(
    'CPU virtualization (Intel VT-x / AMD-V) is disabled in BIOS/UEFI. Enable it to run Podman machines with WSL2 or Hyper-V.',
  );
  expect(result.docLinksDescription).toEqual(
    'Reboot into BIOS/UEFI settings, enable Virtualization Technology (Intel VT-x) or SVM Mode (AMD-V), save changes, reboot, then re-run checks.',
  );
  expect(result.docLinks?.[0].url).toEqual(
    'https://support.microsoft.com/en-us/windows/experience/enable-virtualization-on-windows',
  );
  expect(result.docLinks?.[0].title).toEqual('Enable Virtualization on Windows');
});

test('expect virtualization firmware check to be memoized', async () => {
  vi.mocked(process.exec).mockResolvedValue({
    stdout: 'True',
    stderr: '',
    command: 'command',
  });

  const check = new VirtualizationFirmwareCheck(mockTelemetryLogger);
  await check.execute();
  expect(process.exec).toHaveBeenCalledOnce();

  await check.execute();
  expect(process.exec).toHaveBeenCalledOnce();
});
