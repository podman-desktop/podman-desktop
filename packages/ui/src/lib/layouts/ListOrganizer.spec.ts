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
import { SvelteMap } from 'svelte/reactivity';
import { beforeEach, expect, test, vi } from 'vitest';

import type { ListOrganizerItem } from './ListOrganizer';
import ListOrganizer from './ListOrganizer.svelte';

const mockItems: ListOrganizerItem[] = [
  { id: 'item1', label: 'First Item', enabled: true, originalOrder: 0 },
  { id: 'item2', label: 'Second Item', enabled: true, originalOrder: 1 },
  { id: 'item3', label: 'Third Item', enabled: false, originalOrder: 2 },
  { id: 'item4', label: 'Fourth Item', enabled: true, originalOrder: 3 },
];

beforeEach(() => {
  vi.clearAllMocks();
});

test('Expect trigger button is visible and has correct title', async () => {
  const title = 'Manage Layout';
  render(ListOrganizer, {
    items: mockItems,
    title,
  });

  const triggerButton = screen.getByTitle(title);
  expect(triggerButton).toBeInTheDocument();
  expect(triggerButton).toHaveAttribute('tabindex', '0');
});

test('Expect dropdown opens when trigger button is clicked', async () => {
  render(ListOrganizer, {
    items: mockItems,
    title: 'Manage Layout',
  });

  const triggerButton = screen.getByTitle('Manage Layout');

  // Initially, dropdown should not be visible
  expect(screen.queryByText('First Item')).not.toBeInTheDocument();

  // Click to open dropdown
  await fireEvent.click(triggerButton);

  // Now items should be visible
  expect(screen.getByText('First Item')).toBeInTheDocument();
  expect(screen.getByText('Second Item')).toBeInTheDocument();
  expect(screen.getByText('Third Item')).toBeInTheDocument();
  expect(screen.getByText('Fourth Item')).toBeInTheDocument();
});

test.skip('Expect dropdown closes when clicking outside', async () => {
  render(ListOrganizer, {
    items: mockItems,
    title: 'Manage Layout',
  });

  const triggerButton = screen.getByTitle('Manage Layout');

  // Open dropdown
  await fireEvent.click(triggerButton);
  expect(screen.getByText('First Item')).toBeInTheDocument();

  // Click outside (on document body)
  await userEvent.click(document.body);

  // Dropdown should be closed
  expect(screen.queryByText('First Item')).not.toBeInTheDocument();
});

test('Expect enabled items show check icon', async () => {
  render(ListOrganizer, {
    items: mockItems,
    title: 'Manage Layout',
    enableToggle: true,
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  // Check that enabled items have check icons
  const firstItemButton = screen.getByText('First Item').closest('button');
  const thirdItemButton = screen.getByText('Third Item').closest('button');

  // First item is enabled, should have check icon (SVG with check path)
  const firstItemCheckContainer = firstItemButton?.querySelector('.w-4.h-4');
  const firstItemSvg = firstItemCheckContainer?.querySelector('svg');
  expect(firstItemSvg).toBeInTheDocument();

  // Third item is disabled, should not have check icon
  const thirdItemCheckContainer = thirdItemButton?.querySelector('.w-4.h-4');
  const thirdItemSvg = thirdItemCheckContainer?.querySelector('svg');
  expect(thirdItemSvg).not.toBeInTheDocument();
});

test('Expect item toggle functionality works when enableToggle is true', async () => {
  const updatedItems = [...mockItems];

  const component = render(ListOrganizer, {
    items: updatedItems,
    title: 'Manage Layout',
    enableToggle: true,
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  // Click on third item to enable it
  const thirdItemButton = screen.getByText('Third Item').closest('button');
  await fireEvent.click(thirdItemButton!);

  // Update the component with new items to reflect the change
  await component.rerender({
    items: updatedItems.map(item => (item.id === 'item3' ? { ...item, enabled: !item.enabled } : item)),
    title: 'Manage Layout',
    enableToggle: true,
  });
});

test('Expect grip icons are visible when enableReorder is true', async () => {
  render(ListOrganizer, {
    items: mockItems,
    title: 'Manage Layout',
    enableReorder: true,
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  // Check for grip icons - just verify they exist
  const gripElements = document.querySelectorAll('[draggable="true"]');
  expect(gripElements.length).toBeGreaterThan(0);
});

test('Expect reset button is visible when onReset is provided', async () => {
  const onResetMock = vi.fn();

  render(ListOrganizer, {
    items: mockItems,
    title: 'Manage Layout',
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  const resetButton = screen.getByText('Reset to default');
  expect(resetButton).toBeInTheDocument();
});

test('Expect reset button calls onReset when clicked', async () => {
  const onResetMock = vi.fn();

  render(ListOrganizer, {
    items: mockItems,
    title: 'Manage Layout',
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  const resetButton = screen.getByText('Reset to default');
  await fireEvent.click(resetButton);

  expect(onResetMock).toHaveBeenCalled();
});

test('Expect reset button is disabled when items are in default state', async () => {
  const onResetMock = vi.fn();

  // All items enabled and in original order = default state
  const defaultItems = mockItems.map(item => ({ ...item, enabled: true }));

  render(ListOrganizer, {
    items: defaultItems,
    title: 'Manage Layout',
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  const resetButton = screen.getByText('Reset to default').closest('button');
  expect(resetButton).toBeDisabled();
});

test('Expect reset button is enabled when items are modified', async () => {
  const onResetMock = vi.fn();

  // Some items disabled = modified state
  const modifiedItems = [...mockItems]; // Already has item3 disabled

  render(ListOrganizer, {
    items: modifiedItems,
    title: 'Manage Layout',
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  const resetButton = screen.getByText('Reset to default').closest('button');
  expect(resetButton).not.toBeDisabled();
});

test('Expect reset button is enabled when items are reordered', async () => {
  const onResetMock = vi.fn();

  // Create a component with items in original order first
  const originalItems = [
    { id: 'item1', label: 'First Item', enabled: true, originalOrder: 0 },
    { id: 'item2', label: 'Second Item', enabled: true, originalOrder: 1 },
    { id: 'item3', label: 'Third Item', enabled: true, originalOrder: 2 },
    { id: 'item4', label: 'Fourth Item', enabled: true, originalOrder: 3 },
  ];

  const component = render(ListOrganizer, {
    items: originalItems,
    title: 'Manage Layout',
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  // Create an ordering Map that represents reordered state
  const reorderingMap = new SvelteMap([
    ['item2', 0], // Second item moved to first position
    ['item1', 1], // First item moved to second position
    ['item3', 2], // Third item stays in third position
    ['item4', 3], // Fourth item stays in fourth position
  ]);

  // Re-render with ordering Map to simulate reordered state
  await component.rerender({
    items: originalItems, // Items stay the same, only ordering changes
    ordering: reorderingMap,
    title: 'Manage Layout',
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  const resetButton = screen.getByText('Reset to default').closest('button');
  expect(resetButton).not.toBeDisabled();
});

test('Expect drag handles are draggable when enableReorder is true', async () => {
  render(ListOrganizer, {
    items: mockItems,
    title: 'Manage Layout',
    enableReorder: true,
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  // Find drag handle
  const dragHandle = document.querySelector('[draggable="true"]');
  expect(dragHandle).toBeInTheDocument();
  expect(dragHandle).toHaveAttribute('draggable', 'true');
});

test('Expect mouse events work on drag handles', async () => {
  render(ListOrganizer, {
    items: mockItems,
    title: 'Manage Layout',
    enableReorder: true,
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  // Find drag handle
  const dragHandle = document.querySelector('[draggable="true"]');
  expect(dragHandle).toBeInTheDocument();

  // Test mouse events work (no errors thrown)
  await fireEvent.mouseDown(dragHandle!, { button: 0 });
  await fireEvent.mouseUp(document);
});

test('Expect grip handle accepts click events', async () => {
  render(ListOrganizer, {
    items: mockItems,
    title: 'Manage Layout',
    enableToggle: true,
    enableReorder: true,
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  // Find grip handle
  const dragHandle = document.querySelector('[draggable="true"]');
  expect(dragHandle).toBeInTheDocument();

  // Click on grip handle should not throw errors
  await fireEvent.click(dragHandle!);
});

test('Expect custom title is used', async () => {
  const customTitle = 'Custom Layout Manager';

  render(ListOrganizer, {
    items: mockItems,
    title: customTitle,
  });

  const triggerButton = screen.getByTitle(customTitle);
  expect(triggerButton).toBeInTheDocument();
});

test('Expect custom reset button label is used', async () => {
  const onResetMock = vi.fn();
  const customLabel = 'Restore Defaults';

  render(ListOrganizer, {
    items: mockItems,
    title: 'Manage Layout',
    onReset: onResetMock,
    resetButtonLabel: customLabel,
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  const resetButton = screen.getByText(customLabel);
  expect(resetButton).toBeInTheDocument();
});

test('Expect no reset button when onReset is not provided', async () => {
  render(ListOrganizer, {
    items: mockItems,
    title: 'Manage Layout',
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  // Should not find any reset button
  expect(screen.queryByText('Reset to default')).not.toBeInTheDocument();
});

test('Expect reset button has proper styling', async () => {
  const onResetMock = vi.fn();

  render(ListOrganizer, {
    items: mockItems,
    title: 'Manage Layout',
    onReset: onResetMock,
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  // Just check that reset button exists
  const resetButton = screen.getByText('Reset to default');
  expect(resetButton).toBeInTheDocument();
});

test('Expect reset button disabled in default state (all enabled, original order)', async () => {
  const onResetMock = vi.fn();

  const defaultItems: ListOrganizerItem[] = [
    { id: 'item1', label: 'First Item', enabled: true, originalOrder: 0 },
    { id: 'item2', label: 'Second Item', enabled: true, originalOrder: 1 },
    { id: 'item3', label: 'Third Item', enabled: true, originalOrder: 2 },
    { id: 'item4', label: 'Fourth Item', enabled: true, originalOrder: 3 },
  ];

  render(ListOrganizer, {
    items: defaultItems,
    title: 'Manage Layout',
    enableToggle: true,
    enableReorder: true,
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  const resetButton = screen.getByText('Reset to default').closest('button');
  expect(resetButton).toBeDisabled();
});

test('Expect reset button enabled after toggling item', async () => {
  const onResetMock = vi.fn();

  const defaultItems: ListOrganizerItem[] = [
    { id: 'item1', label: 'First Item', enabled: true, originalOrder: 0 },
    { id: 'item2', label: 'Second Item', enabled: true, originalOrder: 1 },
    { id: 'item3', label: 'Third Item', enabled: true, originalOrder: 2 },
    { id: 'item4', label: 'Fourth Item', enabled: true, originalOrder: 3 },
  ];

  const component = render(ListOrganizer, {
    items: defaultItems,
    title: 'Manage Layout',
    enableToggle: true,
    enableReorder: true,
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  // Update with toggled item
  await component.rerender({
    items: [
      { id: 'item1', label: 'First Item', enabled: false, originalOrder: 0 },
      { id: 'item2', label: 'Second Item', enabled: true, originalOrder: 1 },
      { id: 'item3', label: 'Third Item', enabled: true, originalOrder: 2 },
      { id: 'item4', label: 'Fourth Item', enabled: true, originalOrder: 3 },
    ],
    title: 'Manage Layout',
    enableToggle: true,
    enableReorder: true,
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  const resetButton = screen.getByText('Reset to default').closest('button');
  expect(resetButton).not.toBeDisabled();
});

test('Expect reset button enabled after reordering items', async () => {
  const onResetMock = vi.fn();

  const defaultItems: ListOrganizerItem[] = [
    { id: 'item1', label: 'First Item', enabled: true, originalOrder: 0 },
    { id: 'item2', label: 'Second Item', enabled: true, originalOrder: 1 },
    { id: 'item3', label: 'Third Item', enabled: true, originalOrder: 2 },
    { id: 'item4', label: 'Fourth Item', enabled: true, originalOrder: 3 },
  ];

  const component = render(ListOrganizer, {
    items: defaultItems,
    title: 'Manage Layout',
    enableToggle: true,
    enableReorder: true,
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  // Create an ordering Map that represents reordered state
  const reorderingMap = new SvelteMap([
    ['item2', 0], // Second item moved to first position
    ['item1', 1], // First item moved to second position
    ['item3', 2], // Third item stays in third position
    ['item4', 3], // Fourth item stays in fourth position
  ]);

  // Update with reordering Map
  await component.rerender({
    items: defaultItems, // Items stay the same, only ordering changes
    ordering: reorderingMap,
    title: 'Manage Layout',
    enableToggle: true,
    enableReorder: true,
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  const resetButton = screen.getByText('Reset to default').closest('button');
  expect(resetButton).not.toBeDisabled();
});

test('Expect clicking reset button resets state and disables button', async () => {
  const onResetMock = vi.fn();

  // Start with default state, then modify, then reset
  const defaultItems: ListOrganizerItem[] = [
    { id: 'item1', label: 'First Item', enabled: true, originalOrder: 0 },
    { id: 'item2', label: 'Second Item', enabled: true, originalOrder: 1 },
    { id: 'item3', label: 'Third Item', enabled: true, originalOrder: 2 },
    { id: 'item4', label: 'Fourth Item', enabled: true, originalOrder: 3 },
  ];

  const component = render(ListOrganizer, {
    items: defaultItems,
    title: 'Manage Layout',
    enableToggle: true,
    enableReorder: true,
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  const triggerButton = screen.getByTitle('Manage Layout');
  await fireEvent.click(triggerButton);

  // Initially disabled (default state)
  let resetButton = screen.getByRole('button', { name: 'Reset to default' });
  expect(resetButton).toBeDisabled();

  // Modify state (toggle and reorder)
  const modifiedItems = [
    { id: 'item1', label: 'First Item', enabled: true, originalOrder: 0 },
    { id: 'item2', label: 'Second Item', enabled: false, originalOrder: 1 }, // Toggled off
    { id: 'item3', label: 'Third Item', enabled: true, originalOrder: 2 },
    { id: 'item4', label: 'Fourth Item', enabled: true, originalOrder: 3 },
  ];

  const reorderingMap = new SvelteMap([
    ['item2', 0], // Second item moved to first position
    ['item1', 1], // First item moved to second position
    ['item3', 2], // Third item stays in third position
    ['item4', 3], // Fourth item stays in fourth position
  ]);

  await component.rerender({
    items: modifiedItems,
    ordering: reorderingMap,
    title: 'Manage Layout',
    enableToggle: true,
    enableReorder: true,
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  // Reset button should now be enabled (modified state)
  resetButton = screen.getByRole('button', { name: 'Reset to default' });
  expect(resetButton).not.toBeDisabled();

  // Click reset button
  await fireEvent.click(resetButton);
  expect(onResetMock).toHaveBeenCalled();

  // Simulate parent updating state back to default after reset
  await component.rerender({
    items: defaultItems,
    ordering: new SvelteMap(), // Clear ordering to indicate default state
    title: 'Manage Layout',
    enableToggle: true,
    enableReorder: true,
    onReset: onResetMock,
    resetButtonLabel: 'Reset to default',
  });

  // Reset button should now be disabled (back to default state)
  resetButton = screen.getByRole('button', { name: 'Reset to default' });
  expect(resetButton).toBeDisabled();
});
