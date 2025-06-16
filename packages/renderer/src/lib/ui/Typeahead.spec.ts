/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { render, screen, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { tick } from 'svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import type { TypeaheadItem } from './Typeahead';
import Typeahead from './Typeahead.svelte';

window.HTMLElement.prototype.scrollIntoView = function (): void {};

function assertIsListVisible(visible: boolean): void {
  // eslint-disable-next-line sonarjs/no-selector-parameter
  if (visible) {
    const list = screen.getByRole('row');
    expect(list).toBeDefined();
  } else {
    const list = screen.queryByRole('row');
    expect(list).toBeNull();
  }
}

function assertItemSelected(items: HTMLElement[], r: number): void {
  for (let i = 0; i < items.length; i++) {
    if (i === r) {
      expect(items[i]).toHaveClass('bg-[var(--pd-content-card-hover-bg)]');
    } else {
      expect(items[i]).not.toHaveClass('bg-[var(--pd-content-card-hover-bg)]');
    }
  }
}

beforeEach(() => {
  vi.resetAllMocks();
});

test('a textbox is created', async () => {
  render(Typeahead);

  const input = screen.getByRole('textbox');
  expect(input).toBeDefined();
});

test('placeholder is set', async () => {
  render(Typeahead, {
    placeholder: 'a placeholder',
  });

  const input = screen.getByPlaceholderText('a placeholder');
  expect(input).toBeDefined();
});

test('initial focus is not set by default', async () => {
  render(Typeahead);

  const input = screen.getByRole('textbox');
  expect(input).not.toHaveFocus();
});

test('initial focus is set with option', async () => {
  render(Typeahead, {
    initialFocus: true,
  });

  const input = screen.getByRole('textbox');
  expect(input).toHaveFocus();
});

test('should list the result after the delay, and display spinner during loading', async () => {
  let searchResult: TypeaheadItem[] = [];
  const searchFunction = async (s: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    searchResult = s ? [{ value: s + '01' }, { value: s + '02' }, { value: s + '03' }] : [];
  };
  const { rerender } = render(Typeahead, {
    onInputChange: searchFunction,
    resultItems: searchResult,
    delay: 10,
  });

  const input = screen.getByRole('textbox');
  assertIsListVisible(false);

  await userEvent.type(input, 'aze');
  await waitFor(async () => {
    // multiple tick() call is required because
    // typing in the input triggers multiple async state updates
    // and setTimeout is used to process input with delay
    await tick();
    assertIsListVisible(false);
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(searchResult.length > 0).toBeTruthy();
  });

  await rerender({ resultItems: searchResult });

  assertIsListVisible(true);
  const list = screen.getByRole('row');
  const items = within(list).getAllByRole('button');
  expect(items.length).toBe(3);
  within(list).getByText('aze01');
  within(list).getByText('aze02');
  within(list).getByText('aze03');
});

test('should list items started with search term on top if no compare function is provided', async () => {
  let searchResult: TypeaheadItem[] = [];
  const searchFunction = async (s: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    searchResult = s ? ['z1' + s, s + '01', 'z0', s + '02', 'z2', s + '03'].map(value => ({ value: value })) : [];
  };
  const { rerender } = render(Typeahead, {
    onInputChange: searchFunction,
    resultItems: searchResult,
    delay: 10,
  });

  const input = screen.getByRole('textbox');

  await userEvent.type(input, 'aze');
  await waitFor(() => expect(searchResult.length > 0).toBeTruthy());
  await rerender({ resultItems: searchResult });

  await waitFor(async () => {
    await tick();
    const list = screen.getByRole('row');
    const items = within(list).getAllByRole('button');
    expect(items.length).toBe(6);
    expect(items[0].textContent).toBe('aze01');
    expect(items[1].textContent).toBe('aze02');
    expect(items[2].textContent).toBe('aze03');
    expect(items[3].textContent).toBe('z0');
  });
});

test('should list items in order based on compare function if provided', async () => {
  const compareFunction = (a: string, b: string): number => {
    if (a.startsWith('first') === b.startsWith('first')) {
      return a.localeCompare(b);
    } else if (a.startsWith('first') && !b.startsWith('first')) {
      return -1;
    } else {
      return 1;
    }
  };

  let searchResult: TypeaheadItem[] = [];
  const searchFunction = async (s: string): Promise<void> => {
    searchResult = s
      ? ['first01', 'second01', 'first03', 'athird01', 'second02', 'first02'].map(value => ({
          value: value,
        }))
      : [];
  };

  const { rerender } = render(Typeahead, {
    onInputChange: searchFunction,
    resultItems: searchResult,
    delay: 10,
    compare: compareFunction,
  });

  const input = screen.getByRole('textbox');
  await userEvent.type(input, 'a');
  await waitFor(() => expect(searchResult.length > 0).toBeTruthy());
  await rerender({ resultItems: searchResult });

  await waitFor(() => {
    const list = screen.getByRole('row');
    const items = within(list).getAllByRole('button');
    expect(items.length).toBe(6);
    expect(items[0].textContent).toBe('first01');
    expect(items[1].textContent).toBe('first02');
    expect(items[2].textContent).toBe('first03');
    expect(items[3].textContent).toBe('athird01');
    expect(items[4].textContent).toBe('second01');
    expect(items[5].textContent).toBe('second02');
  });
});

test('should navigate in list with keys', async () => {
  let searchResult: TypeaheadItem[] = [];
  const searchFunction = async (s: string): Promise<void> => {
    const result: TypeaheadItem[] = [];
    for (let i = 1; i <= 15; i++) {
      result.push({ value: s + `${i}`.padStart(2, '0') });
    }
    searchResult = s ? result : [];
  };
  const { rerender } = render(Typeahead, {
    onInputChange: searchFunction,
    resultItems: searchResult,
    delay: 10,
  });
  const input = screen.getByRole('textbox');
  await userEvent.type(input, 'term');

  await waitFor(() => expect(searchResult.length > 0).toBeTruthy());
  await rerender({ resultItems: searchResult });

  await waitFor(() => {
    const items = within(screen.getByRole('row')).getAllByRole('button');
    expect(items.length).toBe(15);

    // No item is selected first
    assertItemSelected(items, -1);
    screen.getByDisplayValue('term');
  });

  await userEvent.keyboard('[ArrowDown]');

  await waitFor(async () => {
    const items = within(screen.getByRole('row')).getAllByRole('button');
    await tick();
    assertItemSelected(items, 0);
    screen.getByDisplayValue('term01');
  });

  await userEvent.keyboard('[ArrowDown]');

  await waitFor(async () => {
    await tick();
    const items = within(screen.getByRole('row')).getAllByRole('button');
    assertItemSelected(items, 1);
    screen.getByDisplayValue('term02');
  });

  await userEvent.keyboard('[PageDown]');

  await waitFor(async () => {
    await tick();
    const items = within(screen.getByRole('row')).getAllByRole('button');
    assertItemSelected(items, 11);
    screen.getByDisplayValue('term12');
  });

  await userEvent.keyboard('[PageDown]');

  await waitFor(async () => {
    await tick();
    const items = within(screen.getByRole('row')).getAllByRole('button');
    assertItemSelected(items, 14);
    screen.getByDisplayValue('term15');
  });

  await userEvent.keyboard('[ArrowUp]');
  await userEvent.keyboard('[ArrowUp]');
  await userEvent.keyboard('[ArrowUp]');
  await userEvent.keyboard('[ArrowUp]');
  await userEvent.keyboard('[ArrowUp]');

  await waitFor(async () => {
    await tick();
    const items = within(screen.getByRole('row')).getAllByRole('button');
    assertItemSelected(items, 9);
    screen.getByDisplayValue('term10');
  });

  await userEvent.keyboard('[PageUp]');

  await waitFor(async () => {
    await tick();
    const items = within(screen.getByRole('row')).getAllByRole('button');
    assertItemSelected(items, 0);
    screen.getByDisplayValue('term01');
  });

  // Close the list when pressing Up at top of the list
  await userEvent.keyboard('[ArrowUp]');

  await waitFor(async () => {
    await tick();
    assertIsListVisible(false);
    screen.getByDisplayValue('term');
  });

  // Down opens the list again, no item selected
  await userEvent.keyboard('[ArrowDown]');

  await waitFor(async () => {
    await tick();
    const items = within(screen.getByRole('row')).getAllByRole('button');
    assertIsListVisible(true);
    assertItemSelected(items, -1);
    screen.getByDisplayValue('term');
  });

  await userEvent.keyboard('[ArrowDown]');

  await waitFor(async () => {
    await tick();
    const items = within(screen.getByRole('row')).getAllByRole('button');
    assertItemSelected(items, 0);
    screen.getByDisplayValue('term01');
  });

  await userEvent.keyboard('[ArrowDown]');
  await userEvent.keyboard('[ArrowDown]');

  await waitFor(async () => {
    await tick();
    const items = within(screen.getByRole('row')).getAllByRole('button');
    assertItemSelected(items, 2);
    screen.getByDisplayValue('term03');
  });

  // Select an item by pressing Enter
  await userEvent.keyboard('[Enter]');

  await waitFor(async () => {
    await tick();
    // closes the list
    assertIsListVisible(false);
    // copies the item in the input
    screen.getByDisplayValue('term03');
  });
});

test('should show classic border', async () => {
  render(Typeahead, {
    initialFocus: true,
    error: false,
    delay: 10,
  });

  const cellOutsideInput = screen.getByRole('textbox');
  const parentInput = cellOutsideInput.parentElement;
  expect(parentInput).not.toHaveClass('border-b-[var(--pd-input-field-stroke-error)]');
  expect(parentInput).not.toHaveClass('focus-within:border-[var(--pd-input-field-stroke-error)]');
  expect(parentInput).toHaveClass('hover:border-b-[var(--pd-input-field-hover-stroke)]');
});

test('should show error border', async () => {
  render(Typeahead, {
    initialFocus: true,
    error: true,
    delay: 10,
  });

  const cellOutsideInput = screen.getByRole('textbox');
  const parentInput = cellOutsideInput.parentElement;
  expect(parentInput).toHaveClass('border-b-[var(--pd-input-field-stroke-error)]');
  expect(parentInput).toHaveClass('focus-within:border-[var(--pd-input-field-stroke-error)]');
  expect(parentInput).not.toHaveClass('hover:border-b-[var(--pd-input-field-hover-stroke)]');
});

test('should include heading based on given order and searchFunctions order', async () => {
  let searchResult: TypeaheadItem[] = [];
  const searchFunction = async (s: string): Promise<void> => {
    const result1: TypeaheadItem[] = [s + '11', s + '12', s + '13', s + '14'].map(value => ({
      value: value,
      group: 'searchFunction1 results',
    }));

    const result2: TypeaheadItem[] = [s + '21', s + '22', s + '23', s + '24'].map(value => ({
      value: value,
      group: 'searchFunction2 results',
    }));

    const result3: TypeaheadItem[] = [s + '31', s + '32', s + '33'].map(value => ({
      value: value,
      group: 'searchFunction3 results',
    }));

    const result4: TypeaheadItem[] = [s + '41', s + '42', s + '43', s + '44'].map(value => ({ value: value }));

    searchResult = s ? [...result1, ...result2, ...result3, ...result4] : [];
  };

  const { rerender, getByRole } = render(Typeahead, {
    onInputChange: searchFunction,
    resultItems: searchResult,
    delay: 10,
  });

  const input = screen.getByRole('textbox');

  await userEvent.type(input, 'test');
  await waitFor(() => expect(searchResult.length > 0).toBeTruthy());
  await rerender({ resultItems: searchResult });

  await waitFor(async () => {
    await tick();
    const list = getByRole('row');
    const items = within(list).getAllByRole('button');
    expect(items.length).toBe(18);
    expect(items[0].textContent).toBe('searchFunction1 results');
    expect(items[0]).toBeDisabled();
    expect(items[1].textContent).toBe('test11');
    expect(items[5].textContent).toBe('searchFunction2 results');
    expect(items[5]).toBeDisabled();
    expect(items[6].textContent).toBe('test21');
    expect(items[10].textContent).toBe('searchFunction3 results');
    expect(items[10]).toBeDisabled();
    expect(items[11].textContent).toBe('test31');
    expect(items[14].textContent).toBe('test41');
  });
});

test('list opens on focus', async () => {
  let searchResult: TypeaheadItem[] = [];
  const searchFunction = async (): Promise<void> => {
    searchResult = ['text1', 'text2', 'text3', 'text4'].map(value => ({ value: value }));
  };

  const { rerender } = render(Typeahead, {
    onInputChange: searchFunction,
    resultItems: searchResult,
    delay: 10,
  });

  const input = screen.getByRole('textbox');
  await userEvent.click(input);

  await waitFor(() => expect(searchResult.length > 0).toBeTruthy());
  await rerender({ resultItems: searchResult });

  await waitFor(() => {
    const list = screen.getByRole('row');
    const items = within(list).getAllByRole('button');
    expect(items.length).toBe(4);
    expect(items[0].textContent).toBe('text1');
    expect(items[1].textContent).toBe('text2');
    expect(items[2].textContent).toBe('text3');
    expect(items[3].textContent).toBe('text4');
  });
});
