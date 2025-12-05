/*********************************************************************
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
 ********************************************************************/

import '@testing-library/jest-dom/vitest';

import type { Context } from '@kubernetes/client-node';
import { fireEvent, type queries, render, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import KubeApplyYAML from './KubeApplyYAML.svelte';

// Mock the router
vi.mock('tinro', () => ({
  router: {
    goto: vi.fn(),
  },
}));

vi.mock('../editor/MonacoEditor.svelte', async () => ({
  default: (await import('../editor/MonacoEditorTestDouble.svelte')).default,
}));

const contexts: Context[] = [
  {
    cluster: 'cluster1',
    user: 'user1',
    name: 'context1',
    namespace: 'ns1',
  },
  {
    cluster: 'cluster2',
    user: 'user2',
    name: 'context2',
    namespace: 'ns2',
  },
];

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.kubernetesGetContexts).mockResolvedValue(contexts);
  vi.mocked(window.kubernetesGetCurrentContextName).mockResolvedValue(contexts[0].name);
  vi.mocked(window.openDialog).mockResolvedValue(['kube.yaml']);
});

describe.each([
  {
    name: 'Apply',
    enabled: false,
  },
  {
    name: 'Cancel',
    enabled: true,
  },
])(`$name button`, ({ name, enabled }) => {
  test(`is visible and ${enabled ? 'enabled' : 'disabled'} after page is opened`, async () => {
    const { getByRole } = render(KubeApplyYAML);
    const button = getByRole('button', { name });
    expect(button).toBeInTheDocument();
    if (enabled) {
      expect(button).toBeEnabled();
    } else {
      expect(button).toBeDisabled();
    }
  });
});

test(`'Apply' button gets enabled after yaml file is selected`, async () => {
  const { getByRole } = render(KubeApplyYAML);
  const applyButton = getByRole('button', { name: 'Apply' });
  const browseButton = getByRole('button', { name: 'browse' });
  await fireEvent.click(browseButton);
  expect(applyButton).toBeEnabled();
});

test(`'Apply' button stay disabled and change to 'Apply Custom YAML' after 'Create custom YAML' option is selected`, async () => {
  const { getByRole } = render(KubeApplyYAML);
  const option = getByRole('button', { name: 'Custom yaml to apply' });
  expect(option).toBeInTheDocument();
  const button = getByRole('button', { name: 'Apply' });
  expect(button).toBeDisabled();
  await fireEvent.click(option);
  expect(button).toHaveAccessibleName('Apply Custom YAML');
  expect(button).toBeDisabled();
});

test(`'Apply Custom YAML' button gets enabled when custom YAML editor content changed and not empty`, async () => {
  const { getByRole } = render(KubeApplyYAML);
  const option = getByRole('button', { name: 'Custom yaml to apply' });
  expect(option).toBeInTheDocument();
  await fireEvent.click(option);
  const button = getByRole('button', { name: 'Apply Custom YAML' });
  const changeContentButton = getByRole('button', { name: 'fireContentChange' });
  await fireEvent.click(changeContentButton);
  expect(button).toBeEnabled();
});

test(`'No Kubernetes contexts available' error is shown when there are no contexts defined`, async () => {
  vi.mocked(window.kubernetesGetContexts).mockResolvedValue([]);

  const { getByRole, getByText } = render(KubeApplyYAML);
  const contextsCombo = getByRole('button', { name: 'Kubernetes Context' });
  expect(contextsCombo).toBeInTheDocument();
  const hoverTrigger = within(contextsCombo).getByRole('none');
  expect(hoverTrigger).toBeInTheDocument();
  await userEvent.hover(hoverTrigger);
  await waitFor(() => {
    const errorTooltip = getByText('No Kubernetes contexts available');
    expect(errorTooltip).toBeVisible();
  });
});

type RenderReturnType = ReturnType<typeof render<typeof KubeApplyYAML, typeof queries>>;

async function applyFileScenario(result: { kind?: string }[] | Error): Promise<RenderReturnType> {
  const applyMock = vi.mocked(window.kubernetesApplyResourcesFromFile);
  if (result instanceof Error) {
    applyMock.mockRejectedValue(result);
  } else {
    applyMock.mockResolvedValue(result);
  }
  const page = render(KubeApplyYAML);
  const browseButton = page.getByRole('button', { name: 'browse' });
  await fireEvent.click(browseButton);
  const applyButton = page.getByRole('button', { name: 'Apply' });
  await fireEvent.click(applyButton);
  return page;
}

test('`Apply` button sends selected file content w/o resources and shows result message', async () => {
  const { getByText } = await applyFileScenario([]);
  const successMessage = getByText('No resource(s) were applied.');
  expect(successMessage).toBeVisible();
});

test('`Apply` button sends selected file content for single resource and shows result message', async () => {
  const { getByText } = await applyFileScenario([{ kind: 'pod' }]);
  const successMessage = getByText('Successfully applied 1 pod.');
  expect(successMessage).toBeVisible();
});

test('`Apply` button sends selected file content for single unknown resource and shows result message', async () => {
  const { getByText } = await applyFileScenario([{}]);
  const successMessage = getByText('Successfully applied 1 unknown resource.');
  expect(successMessage).toBeVisible();
});

test('`Apply` button sends selected file content for multiple resources and shows result message', async () => {
  const { getByText } = await applyFileScenario([{ kind: 'pod' }, { kind: 'pod' }, { kind: 'secret' }]);
  const successMessage = getByText('Successfully applied 3 resources (2 pod, 1 secret).');
  expect(successMessage).toBeVisible();
});

test('`Apply` button sends selected file content for multiple unknown resources and shows result message', async () => {
  const { getByText } = await applyFileScenario([{}, {}]);
  const successMessage = getByText('Successfully applied 2 resources (2 unknown).');
  expect(successMessage).toBeVisible();
});

test('`Apply` button sends selected file content and show error message in case of error', async () => {
  const error = new Error('Something went wrong.');
  const { getByText } = await applyFileScenario(error);
  const errorMessage = getByText('Could not apply Kubernetes YAML: ' + error);
  expect(errorMessage).toBeVisible();
});

test('`Apply custom YAML` saves custom YAML to file and deletes file after successful execution', async () => {
  const createTempFileMock = vi.mocked(window.createTempFile);
  createTempFileMock.mockResolvedValue('tempfile1');
  const { getByRole } = render(KubeApplyYAML);
  const option = getByRole('button', { name: 'Custom yaml to apply' });
  await fireEvent.click(option);
  const changeContentButton = getByRole('button', { name: 'fireContentChange' });
  await fireEvent.click(changeContentButton);
  const button = getByRole('button', { name: 'Apply Custom YAML' });
  await fireEvent.click(button);
  expect(createTempFileMock).toBeCalledWith('content');
  expect(vi.mocked(window.kubernetesApplyResourcesFromFile)).toBeCalledWith(
    contexts[0].name,
    ['tempfile1'],
    contexts[0].namespace,
  );
  expect(vi.mocked(window.removeTempFile)).toBeCalledWith('tempfile1');
});

test('`Apply custom YAML` saves custom YAML to file and deletes file after failed execution', async () => {
  const applyFromFileMock = vi.mocked(window.kubernetesApplyResourcesFromFile);
  applyFromFileMock.mockRejectedValue(new Error('Failed to apply resources.'));
  const createTempFileMock = vi.mocked(window.createTempFile);
  createTempFileMock.mockResolvedValue('tempfile1');
  const { getByRole } = render(KubeApplyYAML);
  const option = getByRole('button', { name: 'Custom yaml to apply' });
  await fireEvent.click(option);
  const changeContentButton = getByRole('button', { name: 'fireContentChange' });
  await fireEvent.click(changeContentButton);
  const button = getByRole('button', { name: 'Apply Custom YAML' });
  await fireEvent.click(button);
  expect(createTempFileMock).toBeCalledWith('content');
  expect(applyFromFileMock).toBeCalledWith(contexts[0].name, ['tempfile1'], contexts[0].namespace);
  expect(vi.mocked(window.removeTempFile)).toBeCalledWith('tempfile1');
});
