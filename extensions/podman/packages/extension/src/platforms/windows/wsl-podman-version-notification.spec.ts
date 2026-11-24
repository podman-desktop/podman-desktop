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

import type { Provider } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { Container } from 'inversify';
import { beforeEach, expect, test, vi } from 'vitest';

import { WSLPodmanVersionCheck } from '/@/checks/windows/wsl-podman-version-check';
import { PodmanProvider } from '/@/providers/podman-provider';
import { PodmanBinary } from '/@/utils/podman-binary';

import { WSLPodmanVersionNotification } from './wsl-podman-version-notification';

vi.mock(import('@podman-desktop/api'));
vi.mock(import('/@/utils/podman-binary'));
vi.mock(import('/@/checks/windows/wsl-podman-version-check'));

const podmanBinaryMock = new PodmanBinary();
const wslPodmanVersionCheckMock = new WSLPodmanVersionCheck();

const providerMock = {
  onDidUpdateVersion: vi.fn(),
} as unknown as Provider;

const podmanProviderMock = {
  provider: providerMock,
} as unknown as PodmanProvider;

const FAILED_RESULT = { successful: false, description: 'WSL is too old.', docLinksDescription: 'Update WSL.' };

const notificationDisposable = { dispose: vi.fn() };
const updateVersionListenerDisposable = { dispose: vi.fn() };

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(PodmanBinary.prototype.getBinaryInfo).mockResolvedValue({ version: '6.1.4' });
  vi.mocked(WSLPodmanVersionCheck.prototype.executeFor).mockResolvedValue(FAILED_RESULT);
  vi.mocked(providerMock.onDidUpdateVersion).mockReturnValue(updateVersionListenerDisposable);
  vi.mocked(extensionApi.window.showNotification).mockReturnValue(notificationDisposable);
});

async function createNotification(): Promise<WSLPodmanVersionNotification> {
  const container = new Container();
  container.bind(PodmanBinary).toConstantValue(podmanBinaryMock);
  container.bind(WSLPodmanVersionCheck).toConstantValue(wslPodmanVersionCheckMock);
  container.bind(PodmanProvider).toConstantValue(podmanProviderMock);
  container.bind(WSLPodmanVersionNotification).toSelf();

  return container.getAsync(WSLPodmanVersionNotification);
}

test('shows a notification on startup when WSL is too old for the installed Podman', async () => {
  await createNotification();

  await vi.waitFor(() =>
    expect(extensionApi.window.showNotification).toHaveBeenCalledWith({
      title: 'WSL update required for Podman 6.1.4',
      body: 'WSL is too old. Update WSL.',
      type: 'warn',
      highlight: true,
      silent: true,
    }),
  );
  expect(WSLPodmanVersionCheck.prototype.executeFor).toHaveBeenCalledWith('6.1.4');
});

test('does not show a notification if Podman is not installed', async () => {
  vi.mocked(PodmanBinary.prototype.getBinaryInfo).mockResolvedValue(undefined);

  const notification = await createNotification();
  await notification.refresh();

  expect(WSLPodmanVersionCheck.prototype.executeFor).not.toHaveBeenCalled();
  expect(extensionApi.window.showNotification).not.toHaveBeenCalled();
});

test('does not show a notification if WSL is supported', async () => {
  vi.mocked(WSLPodmanVersionCheck.prototype.executeFor).mockResolvedValue({ successful: true });

  const notification = await createNotification();
  await notification.refresh();

  expect(extensionApi.window.showNotification).not.toHaveBeenCalled();
});

test('re-checks when the Podman version is updated', async () => {
  vi.mocked(PodmanBinary.prototype.getBinaryInfo).mockResolvedValue({ version: '5.8.9' });
  vi.mocked(WSLPodmanVersionCheck.prototype.executeFor).mockResolvedValue({ successful: true });
  await createNotification();
  await vi.waitFor(() => expect(WSLPodmanVersionCheck.prototype.executeFor).toHaveBeenCalledWith('5.8.9'));
  expect(extensionApi.window.showNotification).not.toHaveBeenCalled();

  // update from Podman 5 to Podman 6
  vi.mocked(PodmanBinary.prototype.getBinaryInfo).mockResolvedValue({ version: '6.1.4' });
  vi.mocked(WSLPodmanVersionCheck.prototype.executeFor).mockResolvedValue(FAILED_RESULT);
  const listener = vi.mocked(providerMock.onDidUpdateVersion).mock.calls[0][0];
  listener('6.1.4');

  expect(PodmanBinary.prototype.invalidate).toHaveBeenCalled();
  await vi.waitFor(() => expect(extensionApi.window.showNotification).toHaveBeenCalled());
  expect(WSLPodmanVersionCheck.prototype.executeFor).toHaveBeenCalledWith('6.1.4');
});

test('disposes the previous notification on refresh', async () => {
  const notification = await createNotification();
  await vi.waitFor(() => expect(extensionApi.window.showNotification).toHaveBeenCalledOnce());

  vi.mocked(WSLPodmanVersionCheck.prototype.executeFor).mockResolvedValue({ successful: true });
  await notification.refresh();

  expect(notificationDisposable.dispose).toHaveBeenCalled();
  expect(extensionApi.window.showNotification).toHaveBeenCalledOnce();
});

test('dispose removes the listener and the notification', async () => {
  const notification = await createNotification();
  await vi.waitFor(() => expect(extensionApi.window.showNotification).toHaveBeenCalledOnce());

  notification.dispose();

  expect(updateVersionListenerDisposable.dispose).toHaveBeenCalled();
  expect(notificationDisposable.dispose).toHaveBeenCalled();
});
