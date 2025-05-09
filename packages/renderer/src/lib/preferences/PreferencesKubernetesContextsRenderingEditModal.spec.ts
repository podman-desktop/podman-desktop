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

import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { KubeContext } from '/@api/kubernetes-context';

import PreferencesKubernetesContextsRenderingEditModal from './PreferencesKubernetesContextsRenderingEditModal.svelte';

const mockContext1: KubeContext = {
  name: 'context-name',
  cluster: 'cluster-name',
  namespace: 'context-namespace',
  user: 'user-name',
  clusterInfo: {
    name: 'cluster-name',
    server: 'https://server-name',
  },
};
const closeCallback = (): void => {};

const kubernetesUpdateContextMock = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
  Object.defineProperty(window, 'kubernetesUpdateContext', { value: kubernetesUpdateContextMock });
});

describe('UpdateContext', () => {
  test('Expect that modal has and save button displays', async () => {
    render(PreferencesKubernetesContextsRenderingEditModal, {
      contextToEdit: mockContext1,
      closeCallback: closeCallback,
    });

    const contextNameEntry = screen.getByLabelText('Name');
    expect(contextNameEntry).toBeInTheDocument();
    const contextNamespaceEntry = screen.getByLabelText('Namespace');
    expect(contextNamespaceEntry).toBeInTheDocument();
    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeInTheDocument();
  });

  test('Expect that save button is disabled by default', async () => {
    render(PreferencesKubernetesContextsRenderingEditModal, {
      contextToEdit: mockContext1,
      closeCallback: closeCallback,
    });

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  test('Expect that empty context name disables save button', async () => {
    render(PreferencesKubernetesContextsRenderingEditModal, {
      contextToEdit: mockContext1,
      closeCallback: closeCallback,
    });

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    const contextName = screen.getByLabelText('Name');
    await userEvent.click(contextName);
    await userEvent.paste('');

    expect(saveButton).toBeDisabled();
  });

  test('Expect that empty context namespace disables save button', async () => {
    render(PreferencesKubernetesContextsRenderingEditModal, {
      contextToEdit: mockContext1,
      closeCallback: closeCallback,
    });

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    const contextNamespace = screen.getByLabelText('Namespace');
    await userEvent.click(contextNamespace);
    await userEvent.paste('');

    expect(saveButton).toBeDisabled();
  });

  test('Expect that valid context name enables save button', async () => {
    render(PreferencesKubernetesContextsRenderingEditModal, {
      contextToEdit: mockContext1,
      closeCallback: closeCallback,
    });

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    const contextName = screen.getByLabelText('Name');
    await userEvent.click(contextName);
    await userEvent.paste('some-valid-name');

    expect(saveButton).toBeEnabled();
  });

  test('basic contexts should have inputs prefill', async () => {
    render(PreferencesKubernetesContextsRenderingEditModal, {
      contextToEdit: mockContext1,
      closeCallback: closeCallback,
    });

    const contextName: HTMLInputElement = screen.getByRole('textbox', {
      name: 'contextName',
    });
    expect(contextName.value).toBe(mockContext1.name);

    const contextNamespace: HTMLInputElement = screen.getByRole('textbox', {
      name: 'contextNamespace',
    });
    expect(contextNamespace.value).toBe(mockContext1.namespace);
  });

  test('Expect error message if context name is cleared after it was initially prefilled', async () => {
    render(PreferencesKubernetesContextsRenderingEditModal, {
      contextToEdit: mockContext1,
      closeCallback: closeCallback,
    });

    expect(screen.queryByText('Please enter a value')).not.toBeInTheDocument();

    const contextName = screen.getByLabelText('Name');
    expect((contextName as HTMLInputElement).value).toBe(mockContext1.name);

    await userEvent.clear(contextName);

    expect(await screen.findByText('Please enter a value')).toBeInTheDocument();
  });
});
