/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import '@testing-library/jest-dom/vitest';

import type { ExtensionInfo } from '@podman-desktop/core-api';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { router } from 'tinro';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import { extensionInfos } from '/@/stores/extensions';

import InstallManuallyExtensionModal from './InstallManuallyExtensionModal.svelte';

vi.mock(import('tinro'));

const { closeCallback, markNewlyInstalledMock, syncExtensionNavigationAfterInstallMock } = vi.hoisted(() => ({
  closeCallback: vi.fn(),
  markNewlyInstalledMock: vi.fn(),
  syncExtensionNavigationAfterInstallMock: vi.fn(async () => true),
}));

vi.mock(import('./extension-catalog-settings.svelte'), () => ({
  markNewlyInstalled: markNewlyInstalledMock,
}));

vi.mock(import('./extension-nav-pointer.svelte'), () => ({
  syncExtensionNavigationAfterInstall: syncExtensionNavigationAfterInstallMock,
}));

beforeAll(() => {
  Object.defineProperty(window, 'extensionInstallFromImage', { value: vi.fn() });
});

beforeEach(() => {
  vi.resetAllMocks();
  extensionInfos.set([]);
  syncExtensionNavigationAfterInstallMock.mockResolvedValue(true);
});

test('expect invalid field', async () => {
  render(InstallManuallyExtensionModal, { closeCallback });

  const input = screen.getByRole('textbox', { name: 'Image name to install custom extension' });
  expect(input).toBeInTheDocument();

  const button = screen.getByRole('button', { name: 'Install' });
  expect(button).toBeInTheDocument();
  expect(button).toBeDisabled();
});

test('closes modal and routes to installed tab after successful install', async () => {
  vi.mocked(window.extensionInstallFromImage).mockImplementation(async () => {
    extensionInfos.set([{ id: 'podman-desktop.quadlet', name: 'Quadlet', path: '/tmp/quadlet' } as ExtensionInfo]);
  });

  render(InstallManuallyExtensionModal, { closeCallback });

  const input = screen.getByRole('textbox', { name: 'Image name to install custom extension' });
  await userEvent.type(input, 'ghcr.io/podman-desktop/pd-extension-quadlet:latest');

  await userEvent.click(screen.getByRole('button', { name: 'Install' }));

  expect(window.extensionInstallFromImage).toBeCalledWith(
    'ghcr.io/podman-desktop/pd-extension-quadlet:latest',
    expect.anything(),
    expect.anything(),
  );
  expect(syncExtensionNavigationAfterInstallMock).toHaveBeenCalledWith('podman-desktop.quadlet');
  expect(markNewlyInstalledMock).toHaveBeenCalledWith('podman-desktop.quadlet');
  expect(router.goto).toHaveBeenCalledWith('/extensions/');
  expect(closeCallback).toHaveBeenCalled();
  expect(screen.queryByRole('button', { name: 'Done' })).not.toBeInTheDocument();
});

function mockExtensionInstallFromImage(): {
  resolve: () => void;
  reject: (error: unknown) => void;
  logCallback: (data: string) => void;
  errorCallback: (data: string) => void;
} {
  const resolve = vi.fn();
  const reject = vi.fn();
  const logCallback = vi.fn<(data: string) => void>();
  const errorCallback = vi.fn<(data: string) => void>();
  vi.mocked(window.extensionInstallFromImage).mockImplementation((_image, mLogCallback, mErrorCallback) => {
    logCallback.mockImplementation((content: string) => mLogCallback(content));
    errorCallback.mockImplementation((content: string) => mErrorCallback(content));
    return new Promise((mResolve, mReject) => {
      resolve.mockImplementation(() => mResolve());
      reject.mockImplementation((err: unknown) => mReject(err));
    });
  });
  return { resolve, reject, logCallback, errorCallback };
}

test('install button should always be disable when extensionInstallFromImage is pending', async () => {
  const { logCallback } = mockExtensionInstallFromImage();

  render(InstallManuallyExtensionModal, { closeCallback });

  const input = screen.getByRole('textbox', { name: 'Image name to install custom extension' });
  await userEvent.type(input, 'my-custom-image.io/foo');

  const installButton = screen.getByRole('button', { name: 'Install' });
  await userEvent.click(installButton);

  logCallback('Downloading sha256:random-sha256.tar - 100% - (521578/521578)');

  const progressBar = screen.getByRole('progressbar', { name: 'Installation progress' });
  await vi.waitFor(() => {
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  expect(installButton).toBeDisabled();
});

test('rejected installation should make the button visible', async () => {
  const { reject } = mockExtensionInstallFromImage();

  render(InstallManuallyExtensionModal, { closeCallback });

  const input = screen.getByRole('textbox', { name: 'Image name to install custom extension' });
  await userEvent.type(input, 'my-custom-image.io/foo');

  const installButton = screen.getByRole('button', { name: 'Install' });
  await userEvent.click(installButton);

  await vi.waitFor(() => {
    expect(installButton).toBeDisabled();
  });

  reject(new Error('random error'));

  await vi.waitFor(() => {
    expect(installButton).toBeEnabled();
  });
});

test('progressbar should match latest log', async () => {
  const { logCallback } = mockExtensionInstallFromImage();

  render(InstallManuallyExtensionModal, { closeCallback });

  const input = screen.getByRole('textbox', { name: 'Image name to install custom extension' });
  await userEvent.type(input, 'my-custom-image.io/foo');

  const installButton = screen.getByRole('button', { name: 'Install' });
  await userEvent.click(installButton);

  const progressBar = screen.getByRole('progressbar', { name: 'Installation progress' });
  for (let i = 0; i < 64; i += 8) {
    logCallback(`Downloading sha256:random-sha256.tar - ${i}% - (${i}/64)`);

    await vi.waitFor(() => {
      expect(progressBar).toHaveStyle({
        width: `${i}%`,
      });
    });
  }
});

test('closes modal after extensionInstallFromImage resolves', async () => {
  const { resolve, logCallback } = mockExtensionInstallFromImage();

  render(InstallManuallyExtensionModal, { closeCallback });

  const input = screen.getByRole('textbox', { name: 'Image name to install custom extension' });
  await userEvent.type(input, 'my-custom-image.io/foo');

  const installButton = screen.getByRole('button', { name: 'Install' });
  await userEvent.click(installButton);

  logCallback('Downloading sha256:random-sha256.tar - 100% - (521578/521578)');
  resolve();

  await vi.waitFor(() => {
    expect(closeCallback).toHaveBeenCalled();
    expect(router.goto).toHaveBeenCalledWith('/extensions/');
  });

  expect(screen.queryByRole('button', { name: 'Done' })).not.toBeInTheDocument();
});

test('form should be in error even if log reached 100%', async () => {
  const { logCallback, errorCallback } = mockExtensionInstallFromImage();

  const { getByRole, queryByRole, getByText } = render(InstallManuallyExtensionModal, { closeCallback });

  const input = getByRole('textbox', { name: 'Image name to install custom extension' });
  await userEvent.type(input, 'my-custom-image.io/foo');

  const installButton = getByRole('button', { name: 'Install' });
  await userEvent.click(installButton);

  logCallback('Downloading sha256:random-sha256.tar - 100% - (521578/521578)');
  const progressBar = getByRole('progressbar', { name: 'Installation progress' });
  await vi.waitFor(() => {
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  errorCallback('Extension is already installed');

  await vi.waitFor(() => {
    expect(installButton).toBeVisible();
    expect(installButton).toBeDisabled();
  });

  expect(queryByRole('progressbar')).not.toBeInTheDocument();
  getByText('Extension is already installed');
  expect(queryByRole('button', { name: 'Done' })).toBeNull();
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(closeCallback).not.toHaveBeenCalled();
});
