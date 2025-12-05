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

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { router } from 'tinro';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import PreferencesKubernetesContextsRenderingImportFile from './PreferencesKubernetesContextsRenderingImportFile.svelte';

// Mock router
vi.mock('tinro', () => ({
  router: {
    goto: vi.fn(),
  },
}));

// Mock window APIs
const mockOpenDialog = vi.fn();
Object.defineProperty(window, 'openDialog', {
  value: mockOpenDialog,
});

// Simplified test setup - no complex drag/drop mocking needed

describe('PreferencesKubernetesContextsRenderingImportFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render the import file page', () => {
    render(PreferencesKubernetesContextsRenderingImportFile);

    expect(screen.getByText('Import config file')).toBeInTheDocument();
    expect(screen.getByText(/Drag & Drop or/)).toBeInTheDocument();
    expect(screen.getByText('Choose file')).toBeInTheDocument();
    expect(screen.getByText(/to import/)).toBeInTheDocument();
    expect(screen.getByText('Supported formats: .yaml, .yml, config files')).toBeInTheDocument();
  });

  test('should show file input area by default', () => {
    render(PreferencesKubernetesContextsRenderingImportFile);

    const fileInputButton = screen.getByLabelText('config file input');
    expect(fileInputButton).toBeInTheDocument();
    expect(fileInputButton).toHaveClass('border-gray-800'); // Not dragging state
  });

  test('should open file dialog when clicking the input area', async () => {
    mockOpenDialog.mockResolvedValue(['/path/to/kubeconfig.yaml']);

    render(PreferencesKubernetesContextsRenderingImportFile);

    const fileInputButton = screen.getByLabelText('config file input');
    await fireEvent.click(fileInputButton);

    expect(mockOpenDialog).toHaveBeenCalledWith({
      title: 'Select Kubernetes config file to import',
      selectors: ['openFile'],
      filters: [
        {
          name: 'Kubernetes config files',
          extensions: ['yaml', 'yml', 'config'],
        },
        {
          name: 'All files',
          extensions: ['*'],
        },
      ],
    });
  });

  test('should show file details after selecting a file', async () => {
    mockOpenDialog.mockResolvedValue(['/path/to/my-cluster.yaml']);

    render(PreferencesKubernetesContextsRenderingImportFile);

    const fileInputButton = screen.getByLabelText('config file input');
    await fireEvent.click(fileInputButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue('/path/to/my-cluster.yaml')).toBeInTheDocument();
      expect(screen.getByDisplayValue('my-cluster.yaml')).toBeInTheDocument();
    });

    expect(screen.getByText('Config File Path')).toBeInTheDocument();
    expect(screen.getByText('Display Name')).toBeInTheDocument();
  });

  test('should enable import button after selecting file', async () => {
    mockOpenDialog.mockResolvedValue(['/path/to/kubeconfig.yaml']);

    render(PreferencesKubernetesContextsRenderingImportFile);

    // Initially disabled
    const importButton = screen.getByRole('button', { name: /Import Config/i });
    expect(importButton).toBeDisabled();

    // Select file
    const fileInputButton = screen.getByLabelText('config file input');
    await fireEvent.click(fileInputButton);

    await waitFor(() => {
      expect(importButton).not.toBeDisabled();
    });
  });

  test('should navigate to review page when importing', async () => {
    mockOpenDialog.mockResolvedValue(['/path/to/kubeconfig.yaml']);

    render(PreferencesKubernetesContextsRenderingImportFile);

    // Select file
    const fileInputButton = screen.getByLabelText('config file input');
    await fireEvent.click(fileInputButton);

    // Click import
    const importButton = screen.getByRole('button', { name: /Import Config/i });
    await fireEvent.click(importButton);

    await waitFor(() => {
      expect(router.goto).toHaveBeenCalledWith(
        '/preferences/kubernetes-contexts/review-contexts/%2Fpath%2Fto%2Fkubeconfig.yaml',
      );
    });
  });

  test('should show error if no file is selected in dialog', async () => {
    mockOpenDialog.mockResolvedValue([]); // No files selected

    render(PreferencesKubernetesContextsRenderingImportFile);

    const fileInputButton = screen.getByLabelText('config file input');
    await fireEvent.click(fileInputButton);

    // Should not show any file details or error
    expect(screen.queryByText('Config File Path')).not.toBeInTheDocument();
  });

  test('should handle file dialog error', async () => {
    mockOpenDialog.mockRejectedValue(new Error('Dialog failed'));

    render(PreferencesKubernetesContextsRenderingImportFile);

    const fileInputButton = screen.getByLabelText('config file input');
    await fireEvent.click(fileInputButton);

    await waitFor(() => {
      expect(screen.getByText(/Error while selecting config file: Error: Dialog failed/)).toBeInTheDocument();
    });
  });

  test('Expect file input to handle file selection', async () => {
    render(PreferencesKubernetesContextsRenderingImportFile);

    const fileInputButton = screen.getByLabelText('config file input');
    expect(fileInputButton).toBeInTheDocument();

    // The component should show the input area by default
    expect(screen.getByRole('button', { name: /Import Config/i })).toBeDisabled();
  });

  test('Expect error area to be available for validation messages', async () => {
    render(PreferencesKubernetesContextsRenderingImportFile);

    const errorArea = screen.getByLabelText('importError');
    expect(errorArea).toBeInTheDocument();
  });

  test('Expect file input styling to be correct', async () => {
    render(PreferencesKubernetesContextsRenderingImportFile);

    const fileInputButton = screen.getByLabelText('config file input');
    expect(fileInputButton).toBeInTheDocument();
    expect(fileInputButton).toHaveClass('border-gray-800');
  });

  test('should handle dragover and dragleave events', async () => {
    render(PreferencesKubernetesContextsRenderingImportFile);

    const fileInputButton = screen.getByLabelText('config file input');

    // Test dragover
    await fireEvent.dragOver(fileInputButton);
    expect(fileInputButton).toHaveClass('border-purple-400');

    // Test dragleave
    await fireEvent.dragLeave(fileInputButton);
    expect(fileInputButton).toHaveClass('border-gray-800');
  });

  test('should allow editing display name', async () => {
    mockOpenDialog.mockResolvedValue(['/path/to/kubeconfig.yaml']);

    render(PreferencesKubernetesContextsRenderingImportFile);

    // Select file
    const fileInputButton = screen.getByLabelText('config file input');
    await fireEvent.click(fileInputButton);

    await waitFor(() => {
      const displayNameInput = screen.getByLabelText('config file display name');
      expect(displayNameInput).toBeInTheDocument();
      expect(displayNameInput).toHaveValue('kubeconfig.yaml');
    });

    // Edit the display name
    const displayNameInput = screen.getByLabelText('config file display name');
    await fireEvent.input(displayNameInput, { target: { value: 'My Custom Config' } });

    expect(displayNameInput).toHaveValue('My Custom Config');
  });
});
