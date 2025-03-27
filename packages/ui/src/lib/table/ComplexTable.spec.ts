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
import { expect, test, vi } from 'vitest';

import ComplexTable from '/@/lib/table/ComplexTable.svelte';

test('complex table should have expected number of rows', async () => {
  const { getAllByRole } = render(ComplexTable, {
    people: [
      {
        name: 'Charlie',
        children: [
          {
            name: 'Charlie Junior',
            children: [],
          },
        ],
      },
    ],
  });

  const rows = await vi.waitFor(() => {
    // include row header
    const items = getAllByRole('row');
    expect(items).toHaveLength(3);
    return items;
  });

  expect(rows[1]).toHaveTextContent('Charlie');
  expect(rows[2]).toHaveTextContent('Charlie Junior');
});

test('expect rounded class to be used for children-less row', async () => {
  const { getAllByRole } = render(ComplexTable, {
    people: [
      {
        name: 'Charlie',
        // no child
        children: [],
      },
    ],
  });

  const rows = await vi.waitFor(() => {
    // include row header
    const items = getAllByRole('row');
    expect(items).toHaveLength(2);
    return items;
  });

  expect(rows[1]).toHaveClass('rounded-lg');
});

test('expect rounded TOP class to be used for row with children', async () => {
  const { getAllByRole } = render(ComplexTable, {
    people: [
      {
        name: 'Charlie',
        children: [
          {
            name: 'Charlie Junior',
            children: [],
          },
        ],
      },
    ],
  });

  const rows = await vi.waitFor(() => {
    // include row header
    const items = getAllByRole('row');
    expect(items).toHaveLength(3);
    return items;
  });

  expect(rows[1]).toHaveClass('rounded-t-lg');
});

test('expect rounded BOTTOM class to be used for the last children of a row', async () => {
  const { getAllByRole } = render(ComplexTable, {
    people: [
      {
        name: 'Charlie',
        children: [
          {
            name: 'Charlie Junior 1',
            children: [],
          },
          {
            name: 'Charlie Junior 2',
            children: [],
          },
        ],
      },
    ],
  });

  const rows = await vi.waitFor(() => {
    // include row header
    const items = getAllByRole('row');
    expect(items).toHaveLength(4);
    return items;
  });

  // Ensure the children has proper rounding
  expect(rows[2]).not.toHaveClass('rounded-b-lg');
  expect(rows[3]).toHaveClass('rounded-b-lg');
});
