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

import { fireEvent, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { tick } from 'svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import NetworkActions from './NetworkActions.svelte';
import type { NetworkInfoUI } from './NetworkInfoUI';

const network1: NetworkInfoUI = {
  engineId: 'engine1',
  engineName: 'Engine 1',
  engineType: 'docker',
  name: 'Network 1',
  id: '123456789012345',
  created: '',
  shortId: '',
  driver: '',
  selected: false,
  status: 'UNUSED',
};

const network2: NetworkInfoUI = {
  engineId: 'podman2',
  engineName: 'Podman 2',
  engineType: 'podman',
  name: 'Network 2',
  id: '123456789123456',
  created: '',
  shortId: '123456789',
  driver: '',
  selected: false,
  status: 'USED',
};

beforeEach(() => {
  vi.resetAllMocks();
});

test('Expect non-podman unused network to have delete option but not edit', async () => {
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });
  render(NetworkActions, { network: network1 });

  expect(screen.queryByTitle('Delete Network')).toBeInTheDocument();
  expect(screen.queryByTitle('Update Network')).not.toBeInTheDocument();

  const deleteButton = screen.getByTitle('Delete Network');
  await fireEvent.click(deleteButton);
  expect(window.removeNetwork).toHaveBeenCalledWith(network1.engineId, network1.id);
});

test('Expect podman used network to have edit option but not delete', async () => {
  render(NetworkActions, { network: network2 });

  expect(screen.queryByTitle('Delete Network')).not.toBeInTheDocument();
  expect(screen.queryByTitle('Update Network')).toBeInTheDocument();

  const updateButton = screen.getByTitle('Update Network');
  await fireEvent.click(updateButton);

  await tick();

  expect(screen.getByText('Edit Network Network 2')).toBeInTheDocument();

  const addField = screen.getAllByPlaceholderText('8.8.8.8 1.1.1.1')?.[0];
  const removeField = screen.getAllByPlaceholderText('8.8.8.8 1.1.1.1')?.[1];

  expect(addField).toBeDefined();
  expect(removeField).toBeDefined();

  await userEvent.type(addField, '0.0.0.1 2.1.1.2 ');
  await userEvent.type(removeField, '1.1.1.1 ');

  const submitButton = screen.getByText('Update');
  expect(submitButton).toBeDefined();

  await fireEvent.click(submitButton);

  expect(window.updateNetwork).toBeCalledWith('podman2', '123456789123456', ['0.0.0.1', '2.1.1.2'], ['1.1.1.1']);
  expect(screen.queryByText('Edit Network Network 2')).not.toBeInTheDocument();
});
