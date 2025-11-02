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
import { expect, test, vi } from 'vitest';

import type { NetworkInfoUI } from './NetworkInfoUI';
import UpdateNetworkDialog from './UpdateNetworkDialog.svelte';

const network: NetworkInfoUI = {
  engineId: 'podman1',
  engineName: 'Podman 1',
  engineType: 'podman',
  name: 'Network 1',
  id: '123456789123456',
  created: '',
  shortId: '123456789',
  driver: '',
  selected: false,
  status: 'USED',
};

const closeDialog = vi.fn();

test('Expect podman used network to have edit option but not delete', async () => {
  render(UpdateNetworkDialog, { network: network, onClose: closeDialog });

  await tick();

  expect(screen.getByText('Edit Network Network 1')).toBeInTheDocument();

  const addField = screen.getAllByPlaceholderText('8.8.8.8 1.1.1.1')?.[0];
  const removeField = screen.getAllByPlaceholderText('8.8.8.8 1.1.1.1')?.[1];

  expect(addField).toBeDefined();
  expect(removeField).toBeDefined();

  await userEvent.type(addField, '0.0.0.1 2.1.1.2 ');
  await userEvent.type(removeField, '1.1.1.1 ');

  const submitButton = screen.getByText('Update');
  expect(submitButton).toBeDefined();

  await fireEvent.click(submitButton);

  expect(window.updateNetwork).toBeCalledWith('podman1', '123456789123456', ['0.0.0.1', '2.1.1.2'], ['1.1.1.1']);
  expect(closeDialog).toHaveBeenCalled();
});
