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

import type { V1NamespaceList } from '@kubernetes/client-node';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import NamespaceDropdown from './NamespaceDropdown.svelte';

const firstNS = 'ns1';
const secondNS = 'ns2';

beforeAll(() => {
  vi.mocked(window.kubernetesListNamespaces).mockResolvedValue({
    items: [
      {
        metadata: {
          name: firstNS,
        },
      },
      {
        metadata: {
          name: secondNS,
        },
      },
    ],
  } as V1NamespaceList);
  vi.mocked(window.kubernetesGetCurrentNamespace).mockResolvedValue(firstNS);
  vi.mocked(window.kubernetesSetCurrentNamespace).mockResolvedValue();
});

beforeEach(() => {
  vi.clearAllMocks();
});

test('Expect basic styling', async () => {
  render(NamespaceDropdown);

  const dropdown = screen.getByLabelText('Kubernetes Namespace');
  expect(dropdown).toBeInTheDocument();
  expect(dropdown).toHaveClass('w-48 max-w-48');
});

test('Expect namespaces are in the dropdown', async () => {
  render(NamespaceDropdown);

  await waitFor(() => expect(screen.queryByText(firstNS)).toBeInTheDocument());

  const dropdown = screen.getByRole('button');
  expect(dropdown).toBeInTheDocument();
  expect(dropdown.textContent).toContain(firstNS);

  // open the dropdown
  await fireEvent.click(dropdown);

  // first namespace is in the original button and in the dropdown
  const item1 = screen.getAllByRole('button', { name: firstNS });
  expect(item1.length).toEqual(2);

  // second namespace is also clickable
  const item2 = screen.getByRole('button', { name: secondNS });
  expect(item2).toBeInTheDocument();
});

test('Expect clicking works', async () => {
  render(NamespaceDropdown);

  await waitFor(() => expect(screen.queryByText(firstNS)).toBeInTheDocument());

  const dropdown = screen.getByRole('button');
  expect(dropdown).toBeInTheDocument();
  expect(dropdown.textContent).toContain(firstNS);

  // open the dropdown
  await fireEvent.click(dropdown);

  const item = screen.getByRole('button', { name: secondNS });
  expect(item).toBeInTheDocument();

  // select the new namspace
  await fireEvent.click(item);

  await waitFor(() => expect(window.kubernetesSetCurrentNamespace).toHaveBeenCalledWith(secondNS));
});
