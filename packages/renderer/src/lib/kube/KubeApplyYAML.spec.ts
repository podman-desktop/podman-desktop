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
import { fireEvent, render } from '@testing-library/svelte';
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

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(window.kubernetesGetContexts).mockResolvedValue(contexts);
  vi.mocked(window.kubernetesGetCurrentContextName).mockResolvedValue(contexts[0].name);
});

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

describe.each([
  {
    name: 'Apply',
    enabled: false,
  },
  {
    name: 'Done',
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
  vi.mocked(window.openDialog).mockResolvedValue(['kube.yaml']);
  const { getByRole } = render(KubeApplyYAML);
  const applyButton = getByRole('button', { name: 'Apply' });
  const browseButton = getByRole('button', { name: 'browse' });
  await fireEvent.click(browseButton);
  expect(applyButton).toBeEnabled();
});

test(`'Apply' button stay disabled and change to 'Apply Custom YAML' after 'Create custom YAML' option is selected`, async () => {
  const { getByRole } = render(KubeApplyYAML);
  const option = getByRole('button', { name: 'Custom yaml to play' });
  expect(option).toBeInTheDocument();
  const button = getByRole('button', { name: 'Apply' });
  expect(button).toBeDisabled();
  await fireEvent.click(option);
  expect(button).toHaveAccessibleName('Apply Custom YAML');
  expect(button).toBeDisabled();
});

test(`'Apply Custom YAML' button gets enabled when custom YAML editor content changed and not empty`, async () => {
  const { getByRole } = render(KubeApplyYAML);
  const option = getByRole('button', { name: 'Custom yaml to play' });
  expect(option).toBeInTheDocument();
  await fireEvent.click(option);
  const button = getByRole('button', { name: 'Apply Custom YAML' });
  const changeContentButton = getByRole('button', { name: 'fireContentChange' });
  await fireEvent.click(changeContentButton);
  expect(button).toBeEnabled();
});

test(`'No Kubernetes contexts available' error is shown when there are no contexts defined`, () => {
  vi.mocked(window.kubernetesGetContexts).mockResolvedValue([]);

  const { getByRole } = render(KubeApplyYAML);
  const tooltip = getByRole('tooltip', { name: 'No Kubernetes contexts available' });
  expect(tooltip).toBeInTheDocument();
});
