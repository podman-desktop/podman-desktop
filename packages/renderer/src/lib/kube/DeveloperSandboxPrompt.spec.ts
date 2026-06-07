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
import { router } from 'tinro';
import { expect, test, vi } from 'vitest';

import { extensionInfos } from '/@/stores/extensions';
import { providerInfos } from '/@/stores/providers';

import DeveloperSandboxPrompt from './DeveloperSandboxPrompt.svelte';

vi.mock(import('tinro'));

Object.defineProperty(window, 'telemetryTrack', { value: vi.fn() });
Object.defineProperty(window, 'openExternal', { value: vi.fn() });

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
