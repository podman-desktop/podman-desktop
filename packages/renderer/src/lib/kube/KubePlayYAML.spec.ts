/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import type { ProviderStatus } from '@podman-desktop/api';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { router } from 'tinro';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import type { ProviderContainerConnectionInfo, ProviderInfo } from '/@api/provider-info';

import type { PlayKubeInfo } from '../../../../main/src/plugin/dockerode/libpod-dockerode';
import { providerInfos } from '../../stores/providers';
import KubePlayYAML from './KubePlayYAML.svelte';

const mockedErroredPlayKubeInfo: PlayKubeInfo = {
  Pods: [
    {
      ContainerErrors: ['error 1', 'error 2'],
      Containers: ['container 1', 'container 2'],
      Id: 'pod-id',
      InitContainers: ['init-container 1', 'init-container 2'],
      Logs: ['log 1', 'log 2'],
    },
  ],
  RmReport: [
    {
      Err: 'rm error',
      Id: 'rm-id',
    },
  ],
  Secrets: [
    {
      CreateReport: {
        ID: 'secret-id',
      },
    },
  ],
  StopReport: [
    {
      Err: 'stop error',
      Id: 'stop-id',
    },
  ],
  Volumes: [
    {
      Name: 'volume 1',
    },
    {
      Name: 'volume 2',
    },
  ],
};

// mock the router
vi.mock('tinro', () => {
  return {
    router: {
      goto: vi.fn(),
    },
  };
});

const playKubeMock = vi.fn();

// fake the window.events object
const createTempKubeFileMock = vi.fn();
const removeTempFileMock = vi.fn();

beforeAll(() => {
  (window.events as unknown) = {
    receive: (_channel: string, func: () => void): void => {
      func();
    },
  };
  Object.defineProperty(window, 'getConfigurationValue', { value: vi.fn().mockResolvedValue(undefined) });
  Object.defineProperty(window, 'matchMedia', {
    value: vi.fn().mockReturnValue({
      addListener: vi.fn(),
    }),
  });
  Object.defineProperty(window, 'openDialog', { value: vi.fn().mockResolvedValue(['Containerfile']) });
  Object.defineProperty(window, 'telemetryPage', { value: vi.fn().mockResolvedValue(undefined) });
  Object.defineProperty(window, 'playKube', { value: playKubeMock });
  Object.defineProperty(window, 'createTempKubeFile', { value: createTempKubeFileMock });
  Object.defineProperty(window, 'removeTempFile', { value: removeTempFileMock });
});

function setup(): void {
  const pStatus: ProviderStatus = 'started';
  const pInfo: ProviderContainerConnectionInfo = {
    name: 'test',
    displayName: 'test',
    status: 'started',
    endpoint: {
      socketPath: '',
    },
    type: 'podman',
  };
  const providerInfo = {
    id: 'test',
    internalId: 'id',
    name: '',
    containerConnections: [pInfo],
    kubernetesConnections: undefined,
    status: pStatus,
    containerProviderConnectionCreation: false,
    containerProviderConnectionInitialization: false,
    kubernetesProviderConnectionCreation: false,
    kubernetesProviderConnectionInitialization: false,
    links: undefined,
    detectionChecks: undefined,
    warnings: undefined,
    images: undefined,
    installationSupport: undefined,
  } as unknown as ProviderInfo;
  providerInfos.set([providerInfo]);
}

test('error: When pressing the Play button, expect us to show the errors to the user', async () => {
  playKubeMock.mockResolvedValue(mockedErroredPlayKubeInfo);

  // Render the component
  setup();
  render(KubePlayYAML, {});

  // Simulate selecting a file
  const fileInput = screen.getByRole('textbox', { name: 'Kubernetes YAML file' });
  expect(fileInput).toBeInTheDocument();

  const browseButton = screen.getByLabelText('browse');
  expect(browseButton).toBeInTheDocument();
  await userEvent.click(browseButton);

  // Simulate clicking the "Play" button
  const playButton = screen.getByRole('button', { name: 'Play' });
  expect(playButton).toBeInTheDocument();
  await userEvent.click(playButton);

  // Since we error out with the mocked kubePlay function (see very top of tests)
  // Expect the following error to be in in the document.
  const error = screen.getByText('The following pods were created but failed to start: error 1, error 2');
  expect(error).toBeInTheDocument();
});

test('expect done button is there at the end and redirects to pods', async () => {
  playKubeMock.mockResolvedValue({
    Pods: [],
  });

  // Render the component
  setup();
  render(KubePlayYAML, {});

  // Simulate selecting a file
  const fileInput = screen.getByRole('textbox', { name: 'Kubernetes YAML file' });
  expect(fileInput).toBeInTheDocument();

  const browseButton = screen.getByLabelText('browse');
  expect(browseButton).toBeInTheDocument();
  await userEvent.click(browseButton);

  // Simulate clicking the "Play" button
  const playButton = screen.getByRole('button', { name: 'Play' });
  expect(playButton).toBeInTheDocument();
  await userEvent.click(playButton);

  // search the done button
  const doneButton = screen.getByRole('button', { name: 'Done' });
  expect(doneButton).toBeInTheDocument();
  // check that text value is also 'Done'
  expect(doneButton).toHaveTextContent('Done');

  // check that clicking redirects to the pods page
  expect(router.goto).not.toHaveBeenCalled();
  await userEvent.click(doneButton);

  expect(router.goto).toHaveBeenCalledWith(`/pods`);
});

test('expect workflow selection boxes have the correct selection borders', async () => {
  playKubeMock.mockResolvedValue({
    Pods: [],
  });

  setup();
  render(KubePlayYAML, {});

  const customOption = screen.getByText('Create file from scratch');
  expect(customOption).toBeInTheDocument();
  expect(customOption.parentElement?.parentElement).not.toHaveClass('border-[var(--pd-content-card-border-selected)]');
  expect(customOption.parentElement?.parentElement).toHaveClass('border-[var(--pd-content-card-border)]');

  // now switch selection to Create file from scratch
  await userEvent.click(customOption);

  expect(customOption.parentElement?.parentElement).toHaveClass('border-[var(--pd-content-card-border-selected)]');
  expect(customOption.parentElement?.parentElement).not.toHaveClass('border-[var(--pd-content-card-border)]');
});

describe('Build options', () => {
  test('checkbox should be disabled by default', async () => {
    setup();
    const { getByRole } = render(KubePlayYAML, {});

    const checkbox = await vi.waitFor(() => {
      const element = getByRole('checkbox', { name: 'Enable build' });
      expect(element).toBeInstanceOf(HTMLInputElement);
      return element;
    });

    expect(checkbox).not.toBeChecked();
  });

  test('enabled build option propagates to playKube call', async () => {
    setup();
    const { getByRole, getByLabelText } = render(KubePlayYAML, {});

    // Enable build
    const checkbox = getByRole('checkbox', { name: 'Enable build' });
    await userEvent.click(checkbox);

    // Select file and play
    const browseButton = getByLabelText('browse');
    await userEvent.click(browseButton);

    const playButton = screen.getByRole('button', { name: 'Play' });
    await userEvent.click(playButton);

    expect(window.playKube).toHaveBeenCalledWith(
      'Containerfile',
      expect.anything(),
      expect.objectContaining({ build: true }),
    );
  });
});

describe('Custom YAML mode', () => {
  test('shows Monaco editor when selected', async () => {
    setup();
    render(KubePlayYAML, {});

    // Initially, Monaco editor should not be visible
    expect(screen.queryByLabelText('Custom Kubernetes YAML Content')).not.toBeInTheDocument();

    // Click on "Create file from scratch" option
    const customOption = screen.getByText('Create file from scratch');
    await userEvent.click(customOption);

    // Now Monaco editor should be visible
    expect(screen.getByText('Custom Kubernetes YAML Content')).toBeInTheDocument();
  });

  test('play button is disabled when no content provided', async () => {
    setup();
    render(KubePlayYAML, {});

    const customOption = screen.getByText('Create file from scratch');
    await userEvent.click(customOption);

    const playButton = screen.getByRole('button', { name: 'Play Custom YAML' });
    expect(playButton).toBeDisabled();
  });

  test('button text changes to "Play Custom YAML"', async () => {
    setup();
    render(KubePlayYAML, {});

    // Initially should show "Play"
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();

    // Switch to custom mode
    const customOption = screen.getByText('Create file from scratch');
    await userEvent.click(customOption);

    // Button text should change
    expect(screen.getByRole('button', { name: 'Play Custom YAML' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Play' })).not.toBeInTheDocument();
  });

  test('editor content clears when switching back to file mode', async () => {
    setup();
    render(KubePlayYAML, {});

    // Switch to custom mode
    const customOption = screen.getByText('Create file from scratch');
    await userEvent.click(customOption);

    // Monaco editor should be visible
    expect(screen.getByText('Custom Kubernetes YAML Content')).toBeInTheDocument();

    // Monaco editor should be hidden again
    expect(screen.queryByLabelText('Custom Kubernetes YAML Content')).not.toBeInTheDocument();
  });
});

test('file mode: does not attempt temp file cleanup', async () => {
  playKubeMock.mockResolvedValue({ Pods: [] });

  setup();
  render(KubePlayYAML, {});

  // Stay in file mode and select a file
  const browseButton = screen.getByLabelText('browse');
  await userEvent.click(browseButton);

  // Click play button
  const playButton = screen.getByRole('button', { name: 'Play' });
  await userEvent.click(playButton);

  // Verify playKube was called with the selected file
  expect(playKubeMock).toHaveBeenCalledWith('Containerfile', expect.anything(), expect.anything());

  // Verify no temp file operations occurred
  expect(createTempKubeFileMock).not.toHaveBeenCalled();
  expect(removeTempFileMock).not.toHaveBeenCalled();
});

test('custom YAML mode: button text changes to "Play Custom YAML"', async () => {
  setup();
  render(KubePlayYAML, {});

  // Initially should show "Play"
  expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();

  // Switch to custom mode
  const customOption = screen.getByText('Create file from scratch');
  await userEvent.click(customOption);

  // Button text should change
  expect(screen.getByRole('button', { name: 'Play Custom YAML' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Play' })).not.toBeInTheDocument();
});

test('switching between modes clears custom content', async () => {
  setup();
  render(KubePlayYAML, {});

  // Switch to custom mode
  const customOption = screen.getByText('Create file from scratch');
  await userEvent.click(customOption);

  // Monaco editor should be visible
  expect(screen.getByText('Custom Kubernetes YAML Content')).toBeInTheDocument();

  // Monaco editor should be hidden again
  expect(screen.queryByLabelText('Custom Kubernetes YAML Content')).not.toBeInTheDocument();
});

test('validation: play button disabled when no file selected in file mode', async () => {
  setup();
  render(KubePlayYAML, {});

  // In file mode with no file selected, button should be disabled
  const playButton = screen.getByRole('button', { name: 'Play' });
  expect(playButton).toBeDisabled();
});

test('validation: play button enabled when file is selected in file mode', async () => {
  setup();
  render(KubePlayYAML, {});

  // Simulate selecting a file
  const browseButton = screen.getByLabelText('browse');
  await userEvent.click(browseButton);

  // Play button should now be enabled
  const playButton = screen.getByRole('button', { name: 'Play' });
  expect(playButton).not.toBeDisabled();
});
