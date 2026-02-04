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

import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { SplitButtonOption } from './SplitButton.svelte';
import SplitButton from './SplitButton.svelte';

const mockOptions: SplitButtonOption[] = [
  { id: 'merge', label: 'Merge', description: 'Merge all commits' },
  { id: 'squash', label: 'Squash and merge', description: 'Squash commits into one' },
  { id: 'rebase', label: 'Rebase and merge', description: 'Rebase commits onto base' },
];

describe('SplitButton', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders with first option as default selected option', () => {
    render(SplitButton, { props: { options: mockOptions, noSelectionLabel: 'Select...' } });
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  test('renders with specified selected option', () => {
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['squash'], noSelectionLabel: 'Select...' },
    });
    expect(screen.getByRole('button', { name: /squash and merge/i })).toBeInTheDocument();
  });

  test('opens dropdown when chevron button is clicked', async () => {
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...' },
    });
    const dropdownButton = screen.getByLabelText('Select action');
    await fireEvent.click(dropdownButton);

    expect(screen.getByText('Squash and merge')).toBeInTheDocument();
    expect(screen.getByText('Rebase and merge')).toBeInTheDocument();
  });

  test('shows option descriptions in dropdown', async () => {
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...' },
    });
    const dropdownButton = screen.getByLabelText('Select action');
    await fireEvent.click(dropdownButton);

    expect(screen.getByText('Merge all commits')).toBeInTheDocument();
    expect(screen.getByText('Squash commits into one')).toBeInTheDocument();
  });

  test('calls onAction with all selected options when main button is clicked', async () => {
    const onAction = vi.fn();
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...', onAction },
    });

    const mainButton = screen.getByText('Merge');
    await fireEvent.click(mainButton);

    expect(onAction).toHaveBeenCalledWith([mockOptions[0]]);
  });

  test('selects option without triggering action when dropdown item is clicked', async () => {
    const onAction = vi.fn();
    const onSelect = vi.fn();
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...', onAction, onSelect },
    });

    // Open dropdown
    await fireEvent.click(screen.getByLabelText('Select action'));

    // Select squash option
    await fireEvent.click(screen.getByRole('option', { name: /squash and merge/i }));

    // Action should NOT be called - only selection changes
    expect(onAction).not.toHaveBeenCalled();
    // But onSelect should be called with all selected options (squash replaces merge in single-select)
    expect(onSelect).toHaveBeenCalledWith([mockOptions[1]]);
  });

  test('shows checkmark icon for selected option', async () => {
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...' },
    });

    // Open dropdown
    await fireEvent.click(screen.getByLabelText('Select action'));

    // The first option (Merge) should have the checkmark
    const mergeOption = screen.getByRole('option', { name: /^merge\s/i });
    expect(mergeOption.querySelector('svg')).toBeInTheDocument();
  });

  test('triggers action with all selected options when main button is clicked after selection', async () => {
    const onAction = vi.fn();
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...', onAction },
    });

    // Open dropdown and select squash option
    await fireEvent.click(screen.getByLabelText('Select action'));
    await fireEvent.click(screen.getByRole('option', { name: /squash and merge/i }));

    // Now click main button
    await fireEvent.click(screen.getByRole('button', { name: /squash and merge/i }));

    expect(onAction).toHaveBeenCalledWith([mockOptions[1]]);
  });

  test('closes dropdown when option is selected', async () => {
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...' },
    });

    // Open dropdown
    await fireEvent.click(screen.getByLabelText('Select action'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Select an option
    await fireEvent.click(screen.getByRole('option', { name: /rebase and merge/i }));

    // Dropdown should be closed
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('closes dropdown when Escape is pressed', async () => {
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...' },
    });

    // Open dropdown
    await fireEvent.click(screen.getByLabelText('Select action'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Press Escape
    await fireEvent.keyUp(window, { key: 'Escape' });

    // Dropdown should be closed
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('closes dropdown when clicking outside', async () => {
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...' },
    });

    // Open dropdown
    await fireEvent.click(screen.getByLabelText('Select action'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Click outside
    await fireEvent.click(document.body);

    // Dropdown should be closed
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('disables button when disabled prop is true', () => {
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...', disabled: true },
    });

    expect(screen.getByText('Merge').closest('button')).toBeDisabled();
    expect(screen.getByLabelText('Select action')).toBeDisabled();
  });

  test('does not open dropdown when disabled', async () => {
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...', disabled: true },
    });

    await fireEvent.click(screen.getByLabelText('Select action'));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('does not call onAction when disabled', async () => {
    const onAction = vi.fn();
    render(SplitButton, {
      props: {
        options: mockOptions,
        selectedOptionIds: ['merge'],
        noSelectionLabel: 'Select...',
        disabled: true,
        onAction,
      },
    });

    await fireEvent.click(screen.getByText('Merge'));

    expect(onAction).not.toHaveBeenCalled();
  });

  test('shows spinner when inProgress', () => {
    const { container } = render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...', inProgress: true },
    });

    // Spinner component should be present
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  test('disables buttons when inProgress', () => {
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...', inProgress: true },
    });

    expect(screen.getByText('Merge').closest('button')).toBeDisabled();
    expect(screen.getByLabelText('Select action')).toBeDisabled();
  });

  test('applies secondary type styling', () => {
    const { container } = render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...', type: 'secondary' },
    });

    const mainButton = container.querySelector('button');
    expect(mainButton?.className).toContain('border-[var(--pd-button-secondary)]');
  });

  test('applies danger type styling', () => {
    const { container } = render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...', type: 'danger' },
    });

    const mainButton = container.querySelector('button');
    expect(mainButton?.className).toContain('border-[var(--pd-button-danger-border)]');
  });

  test('renders with custom aria-label', () => {
    render(SplitButton, {
      props: {
        options: mockOptions,
        selectedOptionIds: ['merge'],
        noSelectionLabel: 'Select...',
        'aria-label': 'Merge options',
      },
    });

    expect(screen.getByLabelText('Merge options')).toBeInTheDocument();
  });

  test('renders with title tooltip', () => {
    render(SplitButton, {
      props: {
        options: mockOptions,
        selectedOptionIds: ['merge'],
        noSelectionLabel: 'Select...',
        title: 'Choose merge strategy',
      },
    });

    expect(screen.getByTitle('Choose merge strategy')).toBeInTheDocument();
  });

  test('sets aria-expanded correctly on dropdown toggle', async () => {
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...' },
    });

    const dropdownButton = screen.getByLabelText('Select action');

    expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');

    await fireEvent.click(dropdownButton);

    expect(dropdownButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('marks selected option with aria-selected', async () => {
    render(SplitButton, {
      props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select...' },
    });

    await fireEvent.click(screen.getByLabelText('Select action'));

    const mergeOption = screen.getByRole('option', { name: /^merge\s/i });
    expect(mergeOption).toHaveAttribute('aria-selected', 'true');

    const squashOption = screen.getByRole('option', { name: /squash and merge/i });
    expect(squashOption).toHaveAttribute('aria-selected', 'false');
  });

  test('shows emptyLabel and disables button when options array is empty', () => {
    render(SplitButton, { props: { options: [], noSelectionLabel: 'Select...', emptyLabel: 'No items available' } });

    expect(screen.getByText('No items available')).toBeInTheDocument();
    expect(screen.getByText('No items available').closest('button')).toBeDisabled();
    expect(screen.getByLabelText('Select action')).toBeDisabled();
  });

  test('uses default emptyLabel when not provided', () => {
    render(SplitButton, { props: { options: [], noSelectionLabel: 'Select...' } });

    expect(screen.getByText('No options available')).toBeInTheDocument();
  });

  test('does not open dropdown when options are empty', async () => {
    render(SplitButton, { props: { options: [], noSelectionLabel: 'Select...' } });

    await fireEvent.click(screen.getByLabelText('Select action'));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  describe('noActionLabel mode (all options disabled)', () => {
    const allDisabledOptions: SplitButtonOption[] = [
      { id: 'opt1', label: 'Option 1', disabled: true, description: 'Not available' },
      { id: 'opt2', label: 'Option 2', disabled: true, description: 'Also not available' },
    ];

    test('shows noActionLabel when all options are disabled', () => {
      render(SplitButton, {
        props: { options: allDisabledOptions, noSelectionLabel: 'Select...', noActionLabel: 'Show options...' },
      });

      expect(screen.getByText('Show options...')).toBeInTheDocument();
    });

    test('uses default noActionLabel when not provided', () => {
      render(SplitButton, { props: { options: allDisabledOptions, noSelectionLabel: 'Select...' } });

      expect(screen.getByText('Show options...')).toBeInTheDocument();
    });

    test('main button is enabled in noAction mode', () => {
      render(SplitButton, {
        props: { options: allDisabledOptions, noSelectionLabel: 'Select...', noActionLabel: 'Show options...' },
      });

      const mainButton = screen.getByText('Show options...').closest('button');
      expect(mainButton).toBeEnabled();
    });

    test('clicking main button opens dropdown instead of calling onAction', async () => {
      const onAction = vi.fn();
      render(SplitButton, {
        props: {
          options: allDisabledOptions,
          noSelectionLabel: 'Select...',
          noActionLabel: 'Show options...',
          onAction,
        },
      });

      await fireEvent.click(screen.getByText('Show options...'));

      // Should open dropdown
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      // Should NOT call onAction
      expect(onAction).not.toHaveBeenCalled();
    });

    test('dropdown shows all disabled options with descriptions', async () => {
      render(SplitButton, {
        props: { options: allDisabledOptions, noSelectionLabel: 'Select...', noActionLabel: 'Show options...' },
      });

      await fireEvent.click(screen.getByText('Show options...'));

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Not available')).toBeInTheDocument();
      expect(screen.getByText('Also not available')).toBeInTheDocument();
    });

    test('disabled options cannot be selected', async () => {
      const onSelect = vi.fn();
      render(SplitButton, {
        props: {
          options: allDisabledOptions,
          noSelectionLabel: 'Select...',
          noActionLabel: 'Show options...',
          onSelect,
        },
      });

      // Open dropdown
      await fireEvent.click(screen.getByText('Show options...'));

      // Try to select a disabled option
      await fireEvent.click(screen.getByRole('option', { name: /option 1/i }));

      // onSelect should NOT be called
      expect(onSelect).not.toHaveBeenCalled();
    });

    test('dropdown toggle (chevron) also works in noAction mode', async () => {
      render(SplitButton, {
        props: { options: allDisabledOptions, noSelectionLabel: 'Select...', noActionLabel: 'Show options...' },
      });

      await fireEvent.click(screen.getByLabelText('Select action'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('noSelectionLabel mode (no option selected)', () => {
    test('shows noSelectionLabel when no option is selected', () => {
      render(SplitButton, {
        props: { options: mockOptions, selectedOptionIds: [], noSelectionLabel: 'Select an option...' },
      });

      expect(screen.getByText('Select an option...')).toBeInTheDocument();
    });

    test('main button is enabled in noSelection mode', () => {
      render(SplitButton, {
        props: { options: mockOptions, selectedOptionIds: [], noSelectionLabel: 'Select an option...' },
      });

      const mainButton = screen.getByText('Select an option...').closest('button');
      expect(mainButton).toBeEnabled();
    });

    test('clicking main button opens dropdown instead of calling onAction', async () => {
      const onAction = vi.fn();
      render(SplitButton, {
        props: { options: mockOptions, selectedOptionIds: [], noSelectionLabel: 'Select an option...', onAction },
      });

      await fireEvent.click(screen.getByText('Select an option...'));

      // Should open dropdown
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      // Should NOT call onAction
      expect(onAction).not.toHaveBeenCalled();
    });

    test('dropdown shows all options when in noSelection mode', async () => {
      render(SplitButton, {
        props: { options: mockOptions, selectedOptionIds: [], noSelectionLabel: 'Select an option...' },
      });

      await fireEvent.click(screen.getByText('Select an option...'));

      expect(screen.getByText('Merge')).toBeInTheDocument();
      expect(screen.getByText('Squash and merge')).toBeInTheDocument();
      expect(screen.getByText('Rebase and merge')).toBeInTheDocument();
    });

    test('selecting an option calls onSelect and updates button label', async () => {
      const onSelect = vi.fn();
      render(SplitButton, {
        props: { options: mockOptions, selectedOptionIds: [], noSelectionLabel: 'Select an option...', onSelect },
      });

      // Open dropdown
      await fireEvent.click(screen.getByText('Select an option...'));

      // Select an option
      await fireEvent.click(screen.getByRole('option', { name: /squash and merge/i }));

      // onSelect should be called with all selected options
      expect(onSelect).toHaveBeenCalledWith([mockOptions[1]]);
    });

    test('does not show noSelectionLabel when option is selected', () => {
      render(SplitButton, {
        props: { options: mockOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Select an option...' },
      });

      expect(screen.queryByText('Select an option...')).not.toBeInTheDocument();
      expect(screen.getByText('Merge')).toBeInTheDocument();
    });

    test('dropdown toggle (chevron) works in noSelection mode', async () => {
      render(SplitButton, {
        props: { options: mockOptions, selectedOptionIds: [], noSelectionLabel: 'Select an option...' },
      });

      await fireEvent.click(screen.getByLabelText('Select action'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('multipleSelection mode', () => {
    test('allows selecting multiple options', async () => {
      const onSelect = vi.fn();
      render(SplitButton, {
        props: {
          options: mockOptions,
          multipleSelection: true,
          selectedOptionIds: [],
          noSelectionLabel: 'Select options...',
          onSelect,
        },
      });

      // Open dropdown
      await fireEvent.click(screen.getByLabelText('Select action'));

      // Select first option
      await fireEvent.click(screen.getByRole('option', { name: /^merge\s/i }));
      expect(onSelect).toHaveBeenCalledWith([mockOptions[0]]);

      // Select second option
      await fireEvent.click(screen.getByRole('option', { name: /squash and merge/i }));
      expect(onSelect).toHaveBeenCalledWith([mockOptions[0], mockOptions[1]]);
    });

    test('dropdown stays open after selection in multipleSelection mode', async () => {
      render(SplitButton, {
        props: {
          options: mockOptions,
          multipleSelection: true,
          selectedOptionIds: [],
          noSelectionLabel: 'Select options...',
        },
      });

      // Open dropdown
      await fireEvent.click(screen.getByLabelText('Select action'));

      // Select an option
      await fireEvent.click(screen.getByRole('option', { name: /^merge\s/i }));

      // Dropdown should still be open
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    test('shows checkmark for all selected options', async () => {
      render(SplitButton, {
        props: {
          options: mockOptions,
          multipleSelection: true,
          selectedOptionIds: ['merge', 'squash'],
          noSelectionLabel: 'Select options...',
        },
      });

      // Open dropdown
      await fireEvent.click(screen.getByLabelText('Select action'));

      // Both selected options should have checkmarks
      const mergeOption = screen.getByRole('option', { name: /^merge\s/i });
      const squashOption = screen.getByRole('option', { name: /squash and merge/i });
      const rebaseOption = screen.getByRole('option', { name: /rebase and merge/i });

      expect(mergeOption.querySelector('svg')).toBeInTheDocument();
      expect(squashOption.querySelector('svg')).toBeInTheDocument();
      expect(rebaseOption.querySelector('svg')).not.toBeInTheDocument();
    });

    test('can deselect an option by clicking again', async () => {
      const onSelect = vi.fn();
      render(SplitButton, {
        props: {
          options: mockOptions,
          multipleSelection: true,
          selectedOptionIds: ['merge', 'squash'],
          noSelectionLabel: 'Select options...',
          onSelect,
        },
      });

      // Open dropdown
      await fireEvent.click(screen.getByLabelText('Select action'));

      // Deselect merge option
      await fireEvent.click(screen.getByRole('option', { name: /^merge\s/i }));

      // Should only have squash selected
      expect(onSelect).toHaveBeenCalledWith([mockOptions[1]]);
    });

    test('button appearance unchanged with 0 selections', () => {
      render(SplitButton, {
        props: {
          options: mockOptions,
          multipleSelection: true,
          selectedOptionIds: [],
          noSelectionLabel: 'Select options...',
        },
      });

      // Should show noSelectionLabel
      expect(screen.getByText('Select options...')).toBeInTheDocument();
    });

    test('button appearance unchanged with 1 selection', () => {
      render(SplitButton, {
        props: {
          options: mockOptions,
          multipleSelection: true,
          selectedOptionIds: ['merge'],
          noSelectionLabel: 'Select options...',
        },
      });

      // Should show the selected option's label (first selected is used for display)
      expect(screen.getByText('Merge')).toBeInTheDocument();
    });

    test('listbox has aria-multiselectable attribute in multipleSelection mode', async () => {
      render(SplitButton, {
        props: {
          options: mockOptions,
          multipleSelection: true,
          selectedOptionIds: [],
          noSelectionLabel: 'Select options...',
        },
      });

      // Open dropdown
      await fireEvent.click(screen.getByLabelText('Select action'));

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    });

    test('calls onSelect with all selected options', async () => {
      const onSelect = vi.fn();
      render(SplitButton, {
        props: {
          options: mockOptions,
          multipleSelection: true,
          selectedOptionIds: [],
          noSelectionLabel: 'Select options...',
          onSelect,
        },
      });

      // Open dropdown
      await fireEvent.click(screen.getByLabelText('Select action'));

      // Select an option
      await fireEvent.click(screen.getByRole('option', { name: /squash and merge/i }));

      // onSelect should be called with all selected options
      expect(onSelect).toHaveBeenCalledWith([mockOptions[1]]);
    });
  });
});
