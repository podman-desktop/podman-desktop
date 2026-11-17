/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import type { ProviderInfo } from '@desktop-framework/api';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';

import { initTranslations } from '/@/lib/i18n/translations.svelte';

import PreferencesProviderInstallationModal from './PreferencesProviderInstallationModal.svelte';

const providerInfo: ProviderInfo = {
  id: 'podman',
  name: 'podman',
  images: {
    icon: 'img',
  },
  status: 'started',
  warnings: [],
  containerProviderConnectionCreation: true,
  detectionChecks: [],
  containerConnections: [
    {
      connectionType: 'container',
      name: 'machine',
      displayName: 'podman',
      status: 'started',
      endpoint: {
        socketPath: 'socket',
      },
      lifecycleMethods: ['start', 'stop', 'delete'],
      canStart: false,
      canStop: false,
      canEdit: false,
      canDelete: false,
      type: 'podman',
    },
  ],
  installationSupport: false,
  internalId: '0',
  kubernetesConnections: [],
  kubernetesProviderConnectionCreation: true,
  vmConnections: [],
  vmProviderConnectionCreation: false,
  vmProviderConnectionInitialization: false,
  links: [],
  containerProviderConnectionInitialization: false,
  containerProviderConnectionCreationDisplayName: 'Podman machine',
  kubernetesProviderConnectionInitialization: false,
  extensionId: '',
  cleanupSupport: false,
  canStart: false,
  canStop: false,
};

const closeCallback = vi.fn();
const doCreateNew = vi.fn();

beforeEach(async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({});
  await initTranslations();
});

test('localizes the creation target but retains the original display name when retrying', async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({
    'settings.provider.create': '新しい{name}を作成',
    'settings.provider.podman.creationDisplayName': 'Podmanマシン',
    'settings.retry': '再試行',
  });
  await initTranslations();
  render(PreferencesProviderInstallationModal, {
    providerToBeInstalled: { provider: providerInfo, displayName: 'Podman machine' },
    closeCallback,
    doCreateNew,
    preflightChecks: [],
  });

  screen.getByRole('heading', { name: '新しいPodmanマシンを作成' });
  await userEvent.click(screen.getByRole('button', { name: '再試行' }));
  expect(doCreateNew).toHaveBeenCalledWith(providerInfo, 'Podman machine');
});

test('Expect to call closeCallback if clicking on Close', async () => {
  const { findByRole } = render(PreferencesProviderInstallationModal, {
    providerToBeInstalled: {
      provider: providerInfo,
      displayName: 'provider',
    },
    closeCallback,
    doCreateNew,
    preflightChecks: [],
  });

  const button = await findByRole('button', { name: 'Close' });
  expect(button).toBeInTheDocument();

  await userEvent.click(button);
  expect(closeCallback).toBeCalled();
});

test('Expect to call closeCallback if clicking on Cancel', async () => {
  const { findByRole } = render(PreferencesProviderInstallationModal, {
    providerToBeInstalled: {
      provider: providerInfo,
      displayName: 'provider',
    },
    closeCallback,
    doCreateNew,
    preflightChecks: [],
  });

  const button = await findByRole('button', { name: 'Cancel' });
  expect(button).toBeInTheDocument();

  await userEvent.click(button);
  expect(closeCallback).toBeCalled();
});

test('Expect to call doCreateNew if clicking on Retry', async () => {
  const { findByRole } = render(PreferencesProviderInstallationModal, {
    providerToBeInstalled: {
      provider: providerInfo,
      displayName: 'provider',
    },
    closeCallback,
    doCreateNew,
    preflightChecks: [],
  });

  const button = await findByRole('button', { name: 'Retry' });
  expect(button).toBeInTheDocument();

  await userEvent.click(button);
  expect(doCreateNew).toBeCalled();
});

test('Expect preflight check entry if preflights checks has some value', async () => {
  const { findByLabelText } = render(PreferencesProviderInstallationModal, {
    providerToBeInstalled: {
      provider: providerInfo,
      displayName: 'provider',
    },
    closeCallback,
    doCreateNew,
    preflightChecks: [
      {
        name: 'check',
        description: 'description',
      },
    ],
  });

  const span = await findByLabelText('description');
  expect(span).toBeInTheDocument();
});
