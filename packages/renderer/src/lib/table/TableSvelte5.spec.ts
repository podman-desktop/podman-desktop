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

/* eslint-disable @typescript-eslint/no-explicit-any */

import '@testing-library/jest-dom/vitest';

import { TableColumn, TableDurationColumn, TableRow, TableSimpleColumn } from '@podman-desktop/ui-svelte';
import { fireEvent, render, within } from '@testing-library/svelte';
import { SvelteSet } from 'svelte/reactivity';
import { assert, describe, expect, test, vi } from 'vitest';

import TableSvelte5 from '/@/lib/table/TableSvelte5.svelte';

type Person = {
  id: number;
  name: string;
  age: number;
  hobby: string;
  duration?: number;
};

const PARENTS: Array<Person> = [
  { id: 1, name: 'John', age: 57, hobby: 'Skydiving' },
  { id: 2, name: 'Henry', age: 27, hobby: 'Cooking' },
  { id: 3, name: 'Charlie', age: 43, hobby: 'Biking', duration: new Date().getTime() - 3600000 },
];

const CHILDREN: Record<number, Array<Person>> = {
  1: [
    { id: 4, name: 'John Junior', age: 12, hobby: 'Eating potatoes' },
    { id: 5, name: 'Johny Junior', age: 14, hobby: 'Eating chicken' },
  ],
  3: [{ id: 6, name: 'Charlie Junior', age: 10, hobby: 'Drinking' }],
};

const ALL_PERSON: Array<Person> = [...PARENTS, ...Object.values(CHILDREN).flat()];

const ID_COLUMN: TableColumn<Person, string> = new TableColumn('Id', {
  align: 'right',
  renderMapping: obj => obj.id.toString(),
  renderer: TableSimpleColumn,
  comparator: (a, b) => a.id - b.id,
});

const NAME_COLUMN: TableColumn<Person, string> = new TableColumn('Name', {
  width: '3fr',
  renderMapping: obj => obj.name,
  renderer: TableSimpleColumn,
  comparator: (a, b) => a.name.localeCompare(b.name),
});

const AGE_COLUMN: TableColumn<Person, string> = new TableColumn('Age', {
  align: 'right',
  renderMapping: obj => obj.age.toString(),
  renderer: TableSimpleColumn,
  comparator: (a, b): number => {
    return a.age - b.age;
  },
  initialOrder: 'descending',
  overflow: true,
});

const HOBBY_COLUMN: TableColumn<Person, string> = new TableColumn('Hobby', {
  renderMapping: obj => obj.hobby,
  renderer: TableSimpleColumn,
  initialOrder: 'ascending',
});

const DURATION_COLUMN = new TableColumn<Person, Date | undefined>('Duration', {
  renderMapping: (obj): Date | undefined => (obj.duration ? new Date(obj.duration) : undefined),
  renderer: TableDurationColumn,
});

const COLUMNS = [ID_COLUMN, NAME_COLUMN, AGE_COLUMN, HOBBY_COLUMN, DURATION_COLUMN];

const SIMPLE_ROW = new TableRow<Person>({});

const ADVANCED_ROW = new TableRow<Person>({
  selectable: (person: Person): boolean => person.age < 50,
  children: (person: Person): Array<Person> => CHILDREN[person.id] || [],
  disabledText: 'People over 50 cannot be deleted',
});

function key(person: Person): string {
  return String(person.id);
}

function label(person: Person): string {
  return person.name;
}

describe('column header', () => {
  test('expect number of column header equal to columns', () => {
    const { getAllByRole } = render(TableSvelte5<Person>, {
      kind: 'persons',
      data: PARENTS,
      row: SIMPLE_ROW,
      columns: COLUMNS,
      key,
      label,
    });

    const columns = getAllByRole('columnheader');
    expect(columns).toHaveLength(COLUMNS.length);
  });

  test.each<TableColumn<any, any>>(COLUMNS)('column header with $title should exists', async column => {
    const { getByRole } = render(TableSvelte5<Person>, {
      kind: 'persons',
      data: PARENTS,
      row: SIMPLE_ROW,
      columns: COLUMNS,
      key,
      label,
    });

    const header = getByRole('columnheader', { name: column.title });
    expect(header).toHaveTextContent(column.title);
  });
});

describe('sorting', () => {
  test.each<TableColumn<any, any>>(COLUMNS)('should default sort by column $title', async column => {
    const { getByRole } = render(TableSvelte5<Person>, {
      kind: 'persons',
      data: PARENTS,
      row: SIMPLE_ROW,
      columns: COLUMNS,
      key,
      label,
      // Specify default sort column
      defaultSortColumn: column.title,
    });

    const header = getByRole('columnheader', { name: column.title });
    if (!column.info.comparator) {
      expect(header).not.toHaveClass('cursor-pointer');
      return; // test stop here as no comparator provided
    }

    expect(header).toHaveClass('cursor-pointer');
    const image = within(header).getByRole('img');

    // sort icon should not be visible
    expect(image).not.toHaveClass('fa-sort');

    switch (column.info.initialOrder) {
      case 'ascending':
        expect(image).toHaveClass('fa-sort-up');
        expect(image).not.toHaveClass('fa-sort-down');
        break;
      case 'descending':
      case undefined:
        expect(image).toHaveClass('fa-sort-down');
        expect(image).not.toHaveClass('fa-sort-up');
        break;
      default:
        throw new Error(`Unexpected initial order: ${column.info.initialOrder}`);
    }
  });

  test.each<TableColumn<any, any>>(COLUMNS.filter(column => column.info.comparator))(
    'column $title should be sortable',
    async column => {
      assert(column.info.comparator, 'column should have comparator');

      const { getByRole } = render(TableSvelte5<Person>, {
        kind: 'persons',
        data: PARENTS,
        row: SIMPLE_ROW,
        columns: COLUMNS,
        key,
        label,
      });

      // Get corresponding header
      const header = getByRole('columnheader', { name: column.title });

      // Get icon
      const image = within(header).getByRole('img');
      expect(image).toHaveClass('fa-sort');

      // click on sort
      await fireEvent.click(header);

      // wait for icon to change
      await vi.waitFor(() => {
        switch (column.info.initialOrder) {
          case 'ascending':
          case undefined:
            expect(image).toHaveClass('fa-sort-up');
            expect(image).not.toHaveClass('fa-sort-down');
            break;
          case 'descending':
            expect(image).toHaveClass('fa-sort-down');
            expect(image).not.toHaveClass('fa-sort-up');
            break;
          default:
            throw new Error(`Unexpected initial order: ${column.info.initialOrder}`);
        }
      });

      // click to invert sorting order
      await fireEvent.click(header);

      // wait for icon to be inverted
      await vi.waitFor(() => {
        switch (column.info.initialOrder) {
          case 'ascending':
          case undefined:
            expect(image).toHaveClass('fa-sort-down');
            expect(image).not.toHaveClass('fa-sort-up');
            break;
          case 'descending':
            expect(image).toHaveClass('fa-sort-up');
            expect(image).not.toHaveClass('fa-sort-down');
            break;
          default:
            throw new Error(`Unexpected initial order: ${column.info.initialOrder}`);
        }
      });
    },
  );
});

describe('collapsed', () => {
  test.each<Person>(PARENTS)('row $id should have proper corner', person => {
    const { getByRole } = render(TableSvelte5<Person>, {
      kind: 'persons',
      data: PARENTS,
      row: ADVANCED_ROW,
      columns: COLUMNS,
      key,
      label,
    });

    const row = getByRole('row', { name: label(person) });

    const hasChildren = (ADVANCED_ROW.info.children?.(person) ?? []).length > 0;
    if (hasChildren) {
      // with children expect no bottom corner
      expect(row).toHaveClass('rounded-t-lg');
    } else {
      // without children expect bottom corner
      expect(row).toHaveClass('rounded-lg');
    }
  });

  test.each<Person>(PARENTS.filter(person => (ADVANCED_ROW.info.children?.(person) ?? []).length > 0))(
    'collapsed row $id should have proper aria',
    person => {
      const { getByRole } = render(TableSvelte5<Person>, {
        kind: 'persons',
        data: PARENTS,
        row: ADVANCED_ROW,
        columns: COLUMNS,
        key,
        label,
        // Specify collapsed set
        collapsed: new SvelteSet([key(person)]),
      });

      const row = getByRole('row', { name: label(person) });

      // Ensure the button has aria-expanded="false"
      const collapseBtn = within(row).getByRole('button', { name: 'Expand Row' });
      expect(collapseBtn).toHaveAttribute('aria-expanded', 'false');
    },
  );

  test.each<Person>(PARENTS.filter(person => (ADVANCED_ROW.info.children?.(person) ?? []).length > 0))(
    'collapsed and expand row $id should properly update collapsed prop',
    async person => {
      const collapsed = new SvelteSet<string>();
      assert(collapsed.size === 0, 'collapsed set should be empty');

      const { getByRole } = render(TableSvelte5<Person>, {
        kind: 'persons',
        data: PARENTS,
        row: ADVANCED_ROW,
        columns: COLUMNS,
        key,
        label,
        // Specify collapsed set
        collapsed: collapsed,
      });

      const row = getByRole('row', { name: label(person) });
      const collapseBtn = within(row).getByRole('button', { name: 'Collapse Row' });

      await fireEvent.click(collapseBtn);

      // wait until store update
      await vi.waitUntil(() => {
        return collapsed.has(key(person));
      });

      await fireEvent.click(collapseBtn);

      // wait until store update
      await vi.waitUntil(() => {
        return !collapsed.has(key(person));
      });
    },
  );
});

describe('selected', () => {
  test('check boxes should not appear when row has not selectable', async () => {
    const { queryByRole } = render(TableSvelte5<Person>, {
      kind: 'persons',
      data: PARENTS,
      row: SIMPLE_ROW,
      columns: COLUMNS,
      key,
      label,
    });

    const checkbox = queryByRole('checkbox');
    expect(checkbox).toBeNull();
  });

  test.each<Person>(ALL_PERSON)('row $id should not be selected by default', person => {
    const { getByRole } = render(TableSvelte5<Person>, {
      kind: 'persons',
      data: PARENTS,
      row: ADVANCED_ROW,
      columns: COLUMNS,
      key,
      label,
    });

    const row = getByRole('row', { name: label(person) });
    const checkbox = within(row).getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
  });

  test.each<Person>(ALL_PERSON)('row $id should have appropriate check value on toggle all', async person => {
    const { getByRole } = render(TableSvelte5<Person>, {
      kind: 'persons',
      data: PARENTS,
      row: ADVANCED_ROW,
      columns: COLUMNS,
      key,
      label,
    });

    const toggleAll = getByRole('checkbox', { name: 'Toggle all' });
    await fireEvent.click(toggleAll);

    await vi.waitFor(() => {
      const row = getByRole('row', { name: label(person) });
      const checkbox = within(row).getByRole('checkbox');

      if (ADVANCED_ROW.info.selectable?.(person)) {
        expect(checkbox).toBeChecked();
      } else {
        expect(checkbox).not.toBeChecked();
      }
    });
  });

  test.each<Person>(PARENTS.filter(person => ADVANCED_ROW.info.selectable?.(person)))(
    'select and unselect row $id should properly update selected prop',
    async person => {
      const selected = new SvelteSet<string>();
      assert(selected.size === 0, 'selected set should be empty');

      const { getByRole } = render(TableSvelte5<Person>, {
        kind: 'persons',
        data: PARENTS,
        row: ADVANCED_ROW,
        columns: COLUMNS,
        key,
        label,
        selected: selected,
      });

      const row = getByRole('row', { name: label(person) });
      const checkbox = within(row).getByRole('checkbox');

      await fireEvent.click(checkbox);

      // wait until store update
      await vi.waitUntil(() => {
        // ensure EACH children is selected
        return selected.has(key(person)) && (CHILDREN[person.id] ?? []).every(child => selected.has(key(child)));
      });

      await fireEvent.click(checkbox);

      // wait until store update
      await vi.waitUntil(() => {
        // ensure EACH children is unselected
        return !selected.has(key(person)) && (CHILDREN[person.id] ?? []).every(child => !selected.has(key(child)));
      });
    },
  );
});

describe('grid', () => {
  test.each<{
    row: TableRow<Person>;
    gridTemplateColumns: string;
    name: string;
  }>([
    {
      row: SIMPLE_ROW,
      gridTemplateColumns: '20px 1fr 3fr 1fr 1fr 1fr 5px',
      name: 'row with no selectable should not include space for checkbox',
    },
    {
      row: ADVANCED_ROW,
      gridTemplateColumns: '20px 32px 1fr 3fr 1fr 1fr 1fr 5px',
      name: 'row with selectable should include space for checkbox',
    },
  ])('$name', async ({ row, gridTemplateColumns }) => {
    const { getAllByRole, getByRole } = render(TableSvelte5<Person>, {
      kind: 'persons',
      data: PARENTS,
      row: row,
      columns: COLUMNS,
      key,
      label,
    });

    const container = getByRole('table');
    expect(container).toHaveStyle({
      '--table-grid-table-columns': gridTemplateColumns,
    });

    const rows = getAllByRole('row');
    for (const row of rows) {
      expect(row).toHaveClass('grid-table');
    }
  });
});
