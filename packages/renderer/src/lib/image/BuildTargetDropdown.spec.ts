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

import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';

import BuildTargetDropdown from './BuildTargetDropdown.svelte';

beforeEach(() => {
  vi.resetAllMocks();
});

test('Expect Target dropdown to be visible with targets and select a target', async () => {
  vi.mocked(window.containerfileGetInfo).mockResolvedValue({
    targets: ['target1', 'target2', 'custom-target'],
  });

  const { findByRole, getByText, getByRole } = render(BuildTargetDropdown, {
    props: { containerFilePath: '/somepath/Containerfile', target: undefined },
  });

  const targetDropdown = await findByRole('button', { name: 'Target' });

  expect(getByText('default (no target)')).toBeInTheDocument();

  await userEvent.click(targetDropdown);

  const target1Option = getByRole('button', { name: 'target1' });
  expect(target1Option).toBeInTheDocument();
  await userEvent.click(target1Option);

  expect(getByText('target1')).toBeInTheDocument();

  await userEvent.click(targetDropdown);

  const customTargetOption = getByRole('button', { name: 'custom-target' });
  await userEvent.click(customTargetOption);

  expect(getByText('custom-target')).toBeInTheDocument();
});

test('Expect selecting "none" to set target to undefined', async () => {
  vi.mocked(window.containerfileGetInfo).mockResolvedValue({
    targets: ['target1', 'target2'],
  });

  const { findByRole, getByText, getByRole } = render(BuildTargetDropdown, {
    props: { containerFilePath: '/somepath/Containerfile', target: 'target1' },
  });

  const targetDropdown = await findByRole('button', { name: 'Target' });
  expect(targetDropdown).toBeInTheDocument();

  expect(getByText('target1')).toBeInTheDocument();

  await userEvent.click(targetDropdown);

  const noneOption = getByRole('button', { name: 'default (no target)' });
  expect(noneOption).toBeInTheDocument();
  await userEvent.click(noneOption);

  expect(getByText('default (no target)')).toBeInTheDocument();
});
