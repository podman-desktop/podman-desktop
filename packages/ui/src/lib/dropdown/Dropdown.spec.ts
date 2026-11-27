/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import { faCube } from '@fortawesome/free-solid-svg-icons';
import { createEvent, fireEvent, render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import Dropdown from './Dropdown.svelte';
import DropdownTest from './DropdownTest.svelte';

test('a button is created', async () => {
  render(Dropdown);

  const input = screen.getByRole('button');
  expect(input).toBeInTheDocument();
});

test('initial value is visible', async () => {
  render(Dropdown, {
    value: 'a value',
  });

  const input = screen.getByRole('button');
  expect(input).toBeInTheDocument();
  expect(input).toHaveTextContent('a value');
});

test('opening dropdown does not submit forms (prevents default button action)', async () => {
  render(Dropdown);

  const input = screen.getByRole('button');
  expect(input).toBeInTheDocument();

  const event = createEvent.click(input);
  event.preventDefault = vi.fn();
  await fireEvent(input, event);
  expect(event.preventDefault).toHaveBeenCalled();
});

test('disabling changes state and styling', async () => {
  render(Dropdown, {
    disabled: true,
  });

  const input = screen.getByRole('button');
  expect(input).toBeInTheDocument();
  expect(input).toBeDisabled();
  expect(input).toHaveClass('text-[color:var(--pd-input-field-disabled-text)]');
  expect(input.parentElement).toHaveClass('border-b-[var(--pd-input-field-stroke-readonly)]');
});

test('initial focus is not set by default', async () => {
  render(Dropdown);

  const input = screen.getByRole('button');
  expect(input).not.toHaveFocus();
});

test('value sets the initial option', async () => {
  render(Dropdown, {
    value: 'b',
    options: [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ],
  });

  const input = screen.getByRole('button');
  expect(input).not.toHaveFocus();
  expect(input).toHaveTextContent('B');
});

test('first option is picked by default', async () => {
  render(Dropdown, { options: [{ label: 'A', value: 'a' }] });

  const input = screen.getByRole('button');
  expect(input).not.toHaveFocus();
  expect(input).toHaveTextContent('A');
});

test('should be able to navigate with keys', async () => {
  render(DropdownTest);
  const input = screen.getByRole('button');
  expect(input).toBeInTheDocument();
  expect(input).toHaveTextContent('initial value');
  input.focus();

  let item = screen.queryByRole('button', { name: 'A' });
  expect(item).toBeNull();

  // open dropdown (selects A)
  await userEvent.keyboard('[ArrowDown]');
  item = screen.queryByRole('button', { name: 'A' });
  expect(item).not.toBeNull();

  // confirm A is highlighted
  expect(item).toHaveClass('bg-[var(--pd-dropdown-item-hover-bg)]');
  expect(item).toHaveClass('text-[var(--pd-dropdown-item-hover-text)]');

  // and B is not
  item = screen.queryByRole('button', { name: 'B' });
  expect(item).not.toBeNull();

  // confirm A is highlighted
  expect(item).not.toHaveClass('bg-[var(--pd-dropdown-item-hover-bg)]');
  expect(item).not.toHaveClass('text-[var(--pd-dropdown-item-hover-text)]');

  // select A, closes dropdown and updates selection
  await userEvent.keyboard('[Enter]');

  item = screen.queryByRole('button', { name: 'B' });
  expect(item).toBeNull();
  expect(input).toHaveTextContent('A');

  // reopen and page down to select the last option (C)
  await userEvent.keyboard('[ArrowDown]');
  await userEvent.keyboard('[PageDown]');

  // confirm C is now highlighted
  item = screen.queryByRole('button', { name: 'C' });
  expect(item).not.toBeNull();
  expect(item).toHaveClass('bg-[var(--pd-dropdown-item-hover-bg)]');
  expect(item).toHaveClass('text-[var(--pd-dropdown-item-hover-text)]');

  await userEvent.keyboard('[Enter]');

  // dropdown is closed and we now have value C
  item = screen.queryByRole('button', { name: 'B' });
  expect(item).toBeNull();
  expect(input).toHaveTextContent('C');
});

test('value of hidden select component is updated based on Dropdown value', async () => {
  render(Dropdown, {
    value: 'b',
    options: [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
      { label: 'C', value: 'c' },
    ],
    name: 'testDropdown',
  });

  const input = screen.getByRole('button');
  expect(input).toBeInTheDocument();
  input.focus();

  let hiddenInput = screen.getByLabelText('hidden input');
  expect(hiddenInput).toBeInTheDocument();
  expect(hiddenInput).toHaveValue('b');

  // open dropdown (selects A)
  await userEvent.keyboard('[ArrowDown]');
  const item = screen.queryByRole('button', { name: 'A' });
  expect(item).not.toBeNull();

  // select A, closes dropdown and updates selection
  await userEvent.keyboard('[Enter]');

  hiddenInput = screen.getByLabelText('hidden input');
  expect(hiddenInput).toBeInTheDocument();
  expect(hiddenInput).toHaveValue('a');
});

test('Left snippet is renderered', async () => {
  render(DropdownTest);

  const left = screen.getByText('Left:');
  expect(left).toBeInTheDocument();
  expect(left.parentElement).toHaveClass('bg-[var(--pd-input-field-bg)]');
});

describe('label truncation', () => {
  const options = [
    { value: 'first', label: 'A very long selected label that exceeds the available dropdown width' },
    {
      value: 'second',
      label: 'Another very long option label that exceeds the available dropdown width',
      icon: faCube,
    },
  ];

  test.each([undefined, false, true])('truncation is opt-in (truncate=%s)', async truncate => {
    render(Dropdown, { options, truncate });

    const trigger = screen.getByRole('button', { name: options[0].label });
    const selectedLabel = within(trigger).getByText(options[0].label);
    expect(selectedLabel.classList.contains('truncate')).toBe(truncate === true);
    expect(trigger.classList.contains('min-w-0')).toBe(truncate === true);
    expect(trigger.parentElement).toHaveClass('grow');
    if (truncate) {
      expect(selectedLabel).toHaveAttribute('title', options[0].label);
    } else {
      expect(selectedLabel).not.toHaveAttribute('title');
    }
    await userEvent.click(trigger);

    const buttons = screen.getAllByRole('button').filter(button => button !== trigger);
    expect(buttons).toHaveLength(options.length);
    for (const [index, button] of buttons.entries()) {
      const label = within(button).getByText(options[index].label);
      expect(label.classList.contains('truncate')).toBe(truncate === true);
      expect(button).toHaveAccessibleName(options[index].label);
      if (truncate) {
        expect(label).toHaveAttribute('title', options[index].label);
      } else {
        expect(label).not.toHaveAttribute('title');
      }
    }
  });

  test.each([false, true])('does not style the left snippet or hidden options (hiddenLeft=%s)', async hiddenLeft => {
    const { container } = render(DropdownTest, { truncate: true, hiddenLeft });

    const trigger = screen.getByRole('button', { name: 'Left: initial value' });
    expect(screen.getByText('Left:')).not.toHaveClass('truncate');
    expect(within(trigger).getByText('initial value')).toHaveClass('truncate');
    expect(container.querySelector('select')).not.toHaveClass('truncate');
    await userEvent.click(trigger);
    expect(container.querySelector('select option')).not.toHaveClass('truncate');
  });

  test('preserves full labels and values when selecting with the keyboard', async () => {
    const onChange = vi.fn();
    render(Dropdown, { options, truncate: true, onChange });

    const trigger = screen.getByRole('button', { name: options[0].label });
    trigger.focus();
    await userEvent.keyboard('[ArrowDown][ArrowDown]');
    expect(screen.getByRole('button', { name: options[1].label })).toHaveClass('bg-[var(--pd-dropdown-item-hover-bg)]');
    await userEvent.keyboard('[Enter]');

    expect(onChange).toHaveBeenCalledExactlyOnceWith('second');
    expect(trigger).toHaveAccessibleName(options[1].label);
    expect(within(trigger).getByText(options[1].label)).toHaveAttribute('title', options[1].label);
    expect(screen.getByLabelText('hidden input')).toHaveValue('second');
    expect(screen.getAllByRole('button')).toHaveLength(1);

    await userEvent.keyboard('[ArrowDown][Escape]');
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(trigger).toHaveAccessibleName(options[1].label);
  });

  test('preserves full labels and values when selecting with the mouse', async () => {
    const onChange = vi.fn();
    render(Dropdown, { options, truncate: true, onChange });

    const trigger = screen.getByRole('button', { name: options[0].label });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: options[1].label }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith('second');
    expect(trigger).toHaveAccessibleName(options[1].label);
    expect(screen.getByLabelText('hidden input')).toHaveValue('second');
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  test.each([undefined, false, true])(
    'supports triggerless labels without changing selection behavior (truncate=%s)',
    async truncate => {
      const onChange = vi.fn();
      render(Dropdown, { options, truncate, triggerless: true, opened: true, selectOnMouseUp: true, onChange });

      const option = screen.getByRole('button', { name: options[1].label });
      expect(within(option).getByText(options[1].label).classList.contains('truncate')).toBe(truncate === true);
      expect(option).toHaveAccessibleName(options[1].label);
      await fireEvent.mouseUp(option);

      expect(onChange).toHaveBeenCalledExactlyOnceWith('second');
      expect(option).toBeInTheDocument();
      expect(screen.queryByLabelText('hidden input')).not.toBeInTheDocument();
    },
  );
});

describe('triggerless mode', () => {
  test('should not render when opened is false', () => {
    render(Dropdown, {
      triggerless: true,
      opened: false,
      options: [{ value: '0', label: 'Containers' }],
    });

    expect(screen.queryByText('Containers')).not.toBeInTheDocument();
  });

  test('should not render when options are empty', () => {
    render(Dropdown, {
      triggerless: true,
      opened: true,
      options: [],
    });

    expect(screen.queryByLabelText('dropdown')).not.toBeInTheDocument();
  });

  test('should render entries when opened and options exist', () => {
    render(Dropdown, {
      triggerless: true,
      opened: true,
      options: [
        { value: '0', label: 'Containers' },
        { value: '1', label: 'Images' },
      ],
    });

    expect(screen.getByText('Containers')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
  });

  test('should not render trigger button or form inputs', () => {
    render(Dropdown, {
      triggerless: true,
      opened: true,
      options: [{ value: '0', label: 'Containers' }],
    });

    expect(screen.queryByLabelText('hidden input')).not.toBeInTheDocument();
  });

  test('mouseup on entry should call onChange with selectOnMouseUp', async () => {
    const onChangeMock = vi.fn();
    render(Dropdown, {
      triggerless: true,
      opened: true,
      selectOnMouseUp: true,
      options: [
        { value: '5', label: 'Containers' },
        { value: '3', label: 'Images' },
      ],
      onChange: onChangeMock,
    });

    const imagesEntry = screen.getByLabelText('Images');
    await fireEvent.mouseUp(imagesEntry);

    expect(onChangeMock).toHaveBeenCalledWith('3');
  });

  test('click on entry should call onChange without selectOnMouseUp', async () => {
    const onChangeMock = vi.fn();
    render(Dropdown, {
      triggerless: true,
      opened: true,
      selectOnMouseUp: false,
      options: [
        { value: '0', label: 'Containers' },
        { value: '1', label: 'Images' },
      ],
      onChange: onChangeMock,
    });

    const containersEntry = screen.getByLabelText('Containers');
    await fireEvent.click(containersEntry);

    expect(onChangeMock).toHaveBeenCalledWith('0');
  });

  test('should use custom ariaLabel', () => {
    render(Dropdown, {
      triggerless: true,
      opened: true,
      ariaLabel: 'History dropdown',
      options: [{ value: '0', label: 'Containers' }],
    });

    expect(screen.getByLabelText('History dropdown')).toBeInTheDocument();
  });
});
