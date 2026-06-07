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

import type { ProviderInfo } from '@podman-desktop/core-api';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { writable } from 'svelte/store';
import { router } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import { extensionInfos } from '/@/stores/extensions';
import { providerInfos } from '/@/stores/providers';

import DeveloperSandboxPrompt from './DeveloperSandboxPrompt.svelte';

vi.mock(import('tinro'));

vi.mock(import('/@/stores/prototype'), () => ({
  activePrototype: writable(),
  currentOverride: writable(),
  registerPrototype: vi.fn(),
  unregisterPrototype: vi.fn(),
}));

const { activePrototype, currentOverride } = await import('/@/stores/prototype');

Object.defineProperty(window, 'telemetryTrack', { value: vi.fn() });
Object.defineProperty(window, 'openExternal', { value: vi.fn() });

beforeEach(() => {
  activePrototype.set(undefined);
  currentOverride.set(undefined);
  providerInfos.set([]);
  extensionInfos.set([]);
  vi.mocked(router.goto).mockClear();
  vi.mocked(window.telemetryTrack).mockClear();
  vi.mocked(window.openExternal).mockClear();
});

test('expect Developer Sandbox prompt to be visible without an existing sandbox connection', async () => {
  providerInfos.set([]);
  extensionInfos.set([]);

  render(DeveloperSandboxPrompt);

  expect(await screen.findByLabelText('Start your sandbox for free')).not.toBeNull();
  expect(screen.getByLabelText('Install Developer Sandbox extension')).not.toBeNull();
});

test('expect Developer Sandbox prompt to be hidden when a sandbox connection exists', async () => {
  providerInfos.set([
    {
      id: 'developer-sandbox',
      name: 'Developer Sandbox',
      kubernetesConnections: [{ name: 'sandbox-context' }],
    } as unknown as ProviderInfo,
  ]);

  render(DeveloperSandboxPrompt);
  await tick();

  expect(screen.queryByLabelText('Start your sandbox for free')).toBeNull();
});

test('expect Developer Sandbox prompt to be hidden in Current prototype state', async () => {
  activePrototype.set({ name: 'Developer Sandbox prompt', screens: [] });
  currentOverride.set({ useLiveState: true });
  providerInfos.set([]);
  extensionInfos.set([]);

  render(DeveloperSandboxPrompt);
  await tick();

  expect(screen.queryByLabelText('Start your sandbox for free')).toBeNull();
});

test('expect start sandbox action to open external website and track telemetry', async () => {
  providerInfos.set([]);
  extensionInfos.set([]);

  render(DeveloperSandboxPrompt);

  const startButton = await screen.findByLabelText('Start your sandbox for free');
  await fireEvent.click(startButton);

  expect(window.openExternal).toHaveBeenCalledWith('https://developers.redhat.com/developer-sandbox');
  expect(vi.mocked(window.telemetryTrack)).toHaveBeenCalledWith('kubernetes.nocontext.developerSandbox.startFree');
});

test('expect install extension action to navigate to extension details', async () => {
  providerInfos.set([]);
  extensionInfos.set([]);

  render(DeveloperSandboxPrompt);

  const installButton = await screen.findByLabelText('Install Developer Sandbox extension');
  await fireEvent.click(installButton);

  expect(router.goto).toHaveBeenCalledWith('/extensions/details/redhat.redhat-sandbox/');
  expect(vi.mocked(window.telemetryTrack)).toHaveBeenCalledWith(
    'kubernetes.nocontext.developerSandbox.installExtension',
  );
});

test('expect connect action to navigate to Resources when extension is installed', async () => {
  providerInfos.set([
    {
      id: 'redhat.sandbox',
      internalId: 'internal-redhat-sandbox',
      name: 'Developer Sandbox',
      kubernetesConnections: [],
    } as unknown as ProviderInfo,
  ]);
  extensionInfos.set([{ id: 'redhat.redhat-sandbox' } as never]);

  render(DeveloperSandboxPrompt);

  const connectButton = await screen.findByLabelText('Connect Developer Sandbox');
  await fireEvent.click(connectButton);

  expect(router.goto).toHaveBeenCalledWith('/preferences/resources?focus=redhat.sandbox');
  expect(vi.mocked(window.telemetryTrack)).toHaveBeenCalledWith(
    'kubernetes.nocontext.developerSandbox.connectFromResources',
    { providerId: 'redhat.sandbox' },
  );
});

test('expect connect action to navigate to Resources when extension is installed but provider is not registered yet', async () => {
  providerInfos.set([]);
  extensionInfos.set([{ id: 'redhat.redhat-sandbox' } as never]);

  render(DeveloperSandboxPrompt);

  const connectButton = await screen.findByLabelText('Connect Developer Sandbox');
  await fireEvent.click(connectButton);

  expect(router.goto).toHaveBeenCalledWith('/preferences/resources?focus=redhat.sandbox');
  expect(vi.mocked(window.telemetryTrack)).toHaveBeenCalledWith(
    'kubernetes.nocontext.developerSandbox.connectFromResources',
    { providerId: 'redhat.sandbox' },
  );
  expect(router.goto).not.toHaveBeenCalledWith('/extensions/details/redhat.redhat-sandbox/');
});

test('expect connect action in prototype to navigate to Resources when extension is not live installed', async () => {
  activePrototype.set({ name: 'Developer Sandbox prompt', screens: [] });
  currentOverride.set({ showPrompt: true, extensionInstalled: true });
  providerInfos.set([]);
  extensionInfos.set([]);

  render(DeveloperSandboxPrompt);

  const connectButton = await screen.findByLabelText('Connect Developer Sandbox');
  await fireEvent.click(connectButton);

  expect(router.goto).toHaveBeenCalledWith('/preferences/resources?focus=redhat.sandbox');
  expect(vi.mocked(window.telemetryTrack)).toHaveBeenCalledWith(
    'kubernetes.nocontext.developerSandbox.connectFromResources',
    { providerId: 'redhat.sandbox' },
  );
});
