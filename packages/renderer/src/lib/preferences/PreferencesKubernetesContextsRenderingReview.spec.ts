/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { readable } from 'svelte/store';
import { router } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import { kubernetesContexts } from '/@/stores/kubernetes-contexts';

import PreferencesKubernetesContextsRenderingReview from './PreferencesKubernetesContextsRenderingReview.svelte';

vi.mock('tinro', () => ({
  router: {
    goto: vi.fn(),
  },
}));

vi.mock('/@/stores/kubernetes-contexts', async () => {
  return {
    kubernetesContexts: readable([]),
  };
});

const mockParseKubeconfigFile = vi.fn();
const mockImportContextsFromFile = vi.fn();
const mockHasCertificateChanged = vi.fn();
const mockShowMessageBox = vi.fn();

Object.defineProperty(window, 'kubernetesParseKubeconfigFile', {
  value: mockParseKubeconfigFile,
});

Object.defineProperty(window, 'kubernetesImportContextsFromFile', {
  value: mockImportContextsFromFile,
});

Object.defineProperty(window, 'kubernetesHasCertificateChanged', {
  value: mockHasCertificateChanged,
});

Object.defineProperty(window, 'showMessageBox', {
  value: mockShowMessageBox,
});

beforeEach(() => {
  vi.clearAllMocks();
  // Mock default responses
  mockShowMessageBox.mockResolvedValue({ response: 0 });
  mockParseKubeconfigFile.mockResolvedValue([
    {
      name: 'new-context',
      cluster: 'new-cluster',
      user: 'new-user',
      namespace: 'production',
      currentContext: false,
      clusterInfo: {
        name: 'new-cluster',
        server: 'https://new-cluster:6443',
      },
    },
    {
      name: 'existing-context',
      cluster: 'conflict-cluster',
      user: 'conflict-user',
      namespace: 'staging',
      currentContext: false,
      clusterInfo: {
        name: 'conflict-cluster',
        server: 'https://conflict:6443',
      },
    },
  ]);
  mockImportContextsFromFile.mockResolvedValue(undefined);
  mockHasCertificateChanged.mockResolvedValue(false);

  // Mock the store with existing contexts
  vi.mocked(kubernetesContexts).subscribe = vi.fn(callback => {
    callback([
      {
        name: 'existing-context',
        cluster: 'existing-cluster',
        user: 'existing-user',
        namespace: 'default',
        currentContext: true,
        clusterInfo: {
          name: 'existing-cluster',
          server: 'https://existing:6443',
        },
      },
    ]);
    return (): void => {};
  });
});

test('Expect import button to show correct text', async () => {
  render(PreferencesKubernetesContextsRenderingReview, {
    props: { filePath: 'path%2Fto%2Fkubeconfig.yaml' },
  });

  await vi.waitFor(() => {
    const importButton = screen.getByRole('button', { name: /Import 2 contexts/ });
    expect(importButton).toBeInTheDocument();
    expect(importButton).not.toBeDisabled(); // Contexts are selected by default now
  });
});

test('Expect review page to render with title', async () => {
  render(PreferencesKubernetesContextsRenderingReview, {
    props: { filePath: 'path%2Fto%2Fkubeconfig.yaml' },
  });

  expect(screen.getByText('Review contexts to import')).toBeInTheDocument();
  expect(mockParseKubeconfigFile).toHaveBeenCalledWith('path/to/kubeconfig.yaml');
});

test('Expect error dialog when no file path provided', async () => {
  render(PreferencesKubernetesContextsRenderingReview, {
    props: { filePath: '' },
  });

  await vi.waitFor(() => {
    expect(mockShowMessageBox).toHaveBeenCalledWith({
      title: 'Error',
      message: 'No kubeconfig file path found. Please go back and select a file.',
      type: 'error',
      buttons: ['OK'],
    });
  });
});

test('Expect error dialog when no contexts found in file', async () => {
  mockParseKubeconfigFile.mockResolvedValue([]);

  render(PreferencesKubernetesContextsRenderingReview, {
    props: { filePath: 'path%2Fto%2Fkubeconfig.yaml' },
  });

  await vi.waitFor(() => {
    expect(mockShowMessageBox).toHaveBeenCalledWith({
      title: 'Error',
      message: 'No valid contexts found in the config file',
      type: 'error',
      buttons: ['OK'],
    });
  });
});

test('Expect cancel button to navigate to import file page', async () => {
  render(PreferencesKubernetesContextsRenderingReview, {
    props: { filePath: 'path%2Fto%2Fkubeconfig.yaml' },
  });

  const cancelButton = screen.getByRole('button', { name: /Cancel/ });
  expect(cancelButton).toBeInTheDocument();

  await userEvent.click(cancelButton);

  expect(router.goto).toHaveBeenCalledWith('/preferences/kubernetes-contexts/import-file');
});

test('Expect certificate changed to be called for each context', async () => {
  mockHasCertificateChanged.mockResolvedValue(true);

  render(PreferencesKubernetesContextsRenderingReview, {
    props: { filePath: 'path%2Fto%2Fkubeconfig.yaml' },
  });

  await vi.waitFor(() => {
    expect(mockHasCertificateChanged).toHaveBeenCalledWith('path/to/kubeconfig.yaml', 'new-context');
    expect(mockHasCertificateChanged).toHaveBeenCalledWith('path/to/kubeconfig.yaml', 'existing-context');
  });
});

test('Expect error dialog when import operation fails', async () => {
  const importError = new Error('Import failed');
  mockImportContextsFromFile.mockRejectedValue(importError);

  render(PreferencesKubernetesContextsRenderingReview, {
    props: { filePath: 'path%2Fto%2Fkubeconfig.yaml' },
  });

  // Wait for contexts to load
  await vi.waitFor(() => {
    expect(screen.getByRole('button', { name: /Import 2 contexts/ })).toBeInTheDocument();
  });

  // Click import button
  const importButton = screen.getByRole('button', { name: /Import 2 contexts/ });
  await userEvent.click(importButton);

  await vi.waitFor(() => {
    expect(mockShowMessageBox).toHaveBeenCalledWith({
      title: 'Error',
      message: `Failed to import contexts: ${importError}`,
      type: 'error',
      buttons: ['OK'],
    });
  });
});
