/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import type { KubeContext } from '@podman-desktop/core-api';
import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import { kubernetesContexts } from '/@/stores/kubernetes-contexts';

import PreferencesKubernetesContextsRendering from './PreferencesKubernetesContextsRendering.svelte';

// Create a fake KubeContextUI
const mockContext1: KubeContext = {
  name: 'context-name',
  cluster: 'cluster-name',
  user: 'user-name',
  clusterInfo: {
    name: 'cluster-name',
    server: 'https://server-name',
  },
};

const mockContext2: KubeContext = {
  name: 'context-name2',
  cluster: 'cluster-name2',
  user: 'user-name2',
  clusterInfo: {
    name: 'cluster-name2',
    server: 'https://server-name2',
  },
  currentContext: true,
};

const mockContext3: KubeContext = {
  name: 'context-name3',
  cluster: 'cluster-name3',
  user: 'user-name3',
  namespace: 'namespace-name3',
  clusterInfo: {
    name: 'cluster-name3',
    server: 'https://server-name3',
  },
};

const mockContext4: KubeContext = {
  name: 'context-name4',
  cluster: 'cluster-name4',
  user: 'user-name4',
  namespace: 'namespace-name4',
  clusterInfo: {
    name: 'cluster-name4',
    server: 'https://server-name4',
  },
};

const mockContext5: KubeContext = {
  name: 'context-name5',
  cluster: 'cluster-name5',
  user: 'user-name5',
  namespace: 'namespace-name5',
  clusterInfo: {
    name: 'cluster-name5',
    server: 'https://server-name5',
  },
};

const kubernetesGetCurrentContextNameMock = vi.fn();

const kubernetesDuplicateContextMock = vi.fn();

beforeAll(() => {
  Object.defineProperty(window, 'kubernetesGetCurrentContextName', { value: kubernetesGetCurrentContextNameMock });
  Object.defineProperty(window, 'kubernetesDuplicateContext', { value: kubernetesDuplicateContextMock });
});

beforeEach(() => {
  kubernetesContexts.set([mockContext1, mockContext2, mockContext3, mockContext4, mockContext5]);
  vi.resetAllMocks();
});

test('Expect context detail div to use invert-content-divider token', async () => {
  kubernetesGetCurrentContextNameMock.mockResolvedValue('my-current-context');
  render(PreferencesKubernetesContextsRendering, {});
  const contextRow = await screen.findByRole('row', { name: 'context-name' });
  const detailDiv = contextRow.querySelector('[class*="divide-"]');
  expect(detailDiv).not.toBeNull();
  expect(detailDiv!.className).toContain('pd-invert-content-divider');
});

test('test that name, cluster and the server is displayed when rendering', async () => {
  kubernetesGetCurrentContextNameMock.mockResolvedValue('my-current-context');
  render(PreferencesKubernetesContextsRendering, {});
  expect(await screen.findByText('context-name')).toBeInTheDocument();
  expect(await screen.findByText('cluster-name')).toBeInTheDocument();
  expect(await screen.findByText('user-name')).toBeInTheDocument();
  expect(await screen.findByText('https://server-name')).toBeInTheDocument();
});

test('Test that namespace is displayed when available in the context', async () => {
  render(PreferencesKubernetesContextsRendering, {});
  expect(await screen.findByText('namespace-name3')).toBeInTheDocument();
});

test('If nothing is returned for contexts, expect that the page shows a message', async () => {
  kubernetesContexts.set([]);
  render(PreferencesKubernetesContextsRendering, {});
  expect(await screen.findByText('No Kubernetes contexts found')).toBeInTheDocument();
});

test('Test that context-name2 is the current context', async () => {
  kubernetesGetCurrentContextNameMock.mockResolvedValue('context-name2');
  render(PreferencesKubernetesContextsRendering, {});

  // Get current-context by aria label
  // find "context-name" which is located within the same parent div as current-context
  // make sure the content is context-name2
  const currentContext = await screen.findByLabelText('Current Context');
  expect(currentContext).toBeInTheDocument();

  // Make sure that the span with the text "context-name2" is within the same parent div as current-context (to make sure that it is the current context)
  const spanContextName = await screen.findByText('context-name2');
  expect(spanContextName).toBeInTheDocument();
  expect(spanContextName.parentElement).toEqual(currentContext.parentElement);
});

test('when deleting the current context, a popup should ask confirmation', async () => {
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 'Cancel' });

  render(PreferencesKubernetesContextsRendering, {});
  const currentContext = screen.getAllByRole('row')[1];
  expect(currentContext).toBeInTheDocument();

  const label = within(currentContext).queryByLabelText('Current Context');
  expect(label).toBeInTheDocument();

  const deleteBtn = within(currentContext).getByRole('button', { name: 'Delete Context' });
  expect(deleteBtn).toBeInTheDocument();
  await fireEvent.click(deleteBtn);
  expect(window.showMessageBox).toHaveBeenCalledOnce();
});

test('when deleting the non current context, no popup should ask confirmation', async () => {
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 'Cancel' });

  render(PreferencesKubernetesContextsRendering, {});
  const currentContext = screen.getAllByRole('row')[0];
  expect(currentContext).toBeInTheDocument();

  const label = within(currentContext).queryByLabelText('Current Context');
  expect(label).not.toBeInTheDocument();

  const deleteBtn = within(currentContext).getByRole('button', { name: 'Delete Context' });
  expect(deleteBtn).toBeInTheDocument();
  await fireEvent.click(deleteBtn);
  expect(window.showMessageBox).not.toHaveBeenCalled();
});

test('when editing context a modal dialog should be oppened', async () => {
  render(PreferencesKubernetesContextsRendering, {});
  // Get first context
  const currentContext = screen.getAllByRole('row')[0];
  expect(currentContext).toBeInTheDocument();

  const editBtn = within(currentContext).getByRole('button', { name: 'Edit Context' });
  expect(editBtn).toBeInTheDocument();
  await fireEvent.click(editBtn);

  expect(screen.getByRole('dialog', { name: 'Edit Context' })).toBeVisible();
});
