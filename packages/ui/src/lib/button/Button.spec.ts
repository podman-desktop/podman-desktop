/**********************************************************************
 * Copyright (C) 2023-2026 Red Hat, Inc.
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

/* eslint-disable @typescript-eslint/no-explicit-any */

import '@testing-library/jest-dom/vitest';

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { expect, test, vi } from 'vitest';

import Button from './Button.svelte';

interface CommonClassOptions {
  hasBorder?: boolean;
  hasShadow?: boolean;
  hasRounded?: boolean;
  verticalPadding?: string;
}

function expectCommonButtonClasses(button: HTMLElement, options: CommonClassOptions = {}): void {
  const { hasBorder = true, hasShadow = false, hasRounded = true, verticalPadding = 'py-[5px]' } = options;
  expect(button).toHaveClass('px-[16px]');
  expect(button).toHaveClass(verticalPadding);
  expect(button).toHaveClass('min-h-[28px]');
  expect(button).toHaveClass('min-w-[28px]');
  if (hasBorder) {
    expect(button).toHaveClass('border');
  }
  if (hasShadow) {
    expect(button).toHaveClass('shadow-[0px_1px_4px_0px_var(--pd-shadow-color)]');
  }
  if (hasRounded) {
    expect(button).toHaveClass('rounded-[6px]');
  } else {
    expect(button).not.toHaveClass('rounded-[6px]');
  }
}

test('Check primary button styling', async () => {
  render(Button, { type: 'primary' });

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expectCommonButtonClasses(button, { hasShadow: true });
  expect(button).toHaveClass('bg-[var(--pd-button-primary-bg)]');
  expect(button).toHaveClass('text-[var(--pd-button-primary-text)]');
  expect(button).toHaveClass('border-[var(--pd-button-primary-border)]');
  expect(button).toHaveClass('hover:bg-[var(--pd-button-primary-hover-bg)]');
});

test('Check disabled/in-progress primary button styling', async () => {
  render(Button, { type: 'primary', inProgress: true });

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expectCommonButtonClasses(button);
  expect(button).toHaveClass('bg-[var(--pd-button-disabled-bg)]');
  expect(button).toHaveClass('text-[var(--pd-button-disabled-text)]');
});

test('Check primary button is the default', async () => {
  render(Button);

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expect(button).toHaveClass('bg-[var(--pd-button-primary-bg)]');
  expect(button).toHaveClass('text-[var(--pd-button-primary-text)]');
});

test('Check secondary button styling', async () => {
  render(Button, { type: 'secondary' });

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expectCommonButtonClasses(button, { hasShadow: true });
  expect(button).toHaveClass('bg-[var(--pd-button-secondary-bg)]');
  expect(button).toHaveClass('border-[var(--pd-button-secondary-border)]');
  expect(button).toHaveClass('text-[var(--pd-button-secondary-text)]');
  expect(button).toHaveClass('hover:bg-[var(--pd-button-secondary-hover-bg)]');
});

test('Check danger button styling', async () => {
  render(Button, { type: 'danger' });

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expectCommonButtonClasses(button, { hasShadow: true });
  expect(button).toHaveClass('bg-[var(--pd-button-danger-bg)]');
  expect(button).toHaveClass('border-[var(--pd-button-danger-border)]');
  expect(button).toHaveClass('text-[var(--pd-button-danger-text)]');
  expect(button).toHaveClass('hover:bg-[var(--pd-button-danger-hover-bg)]');
});

test('Check disabled/in-progress secondary button styling', async () => {
  render(Button, { type: 'secondary', inProgress: true });

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expectCommonButtonClasses(button);
  expect(button).toHaveClass('bg-[var(--pd-button-disabled-bg)]');
  expect(button).toHaveClass('text-[var(--pd-button-disabled-text)]');
});

test('Check link button styling', async () => {
  render(Button, { type: 'link' });

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expectCommonButtonClasses(button);
  expect(button).toHaveClass('border-transparent');
  expect(button).toHaveClass('text-[var(--pd-button-link-text)]');
  expect(button).toHaveClass('hover:bg-[var(--pd-button-link-hover-bg)]');
});

test('Check disabled/in-progress link button styling', async () => {
  render(Button, { type: 'link', inProgress: true });

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expectCommonButtonClasses(button);
  expect(button).toHaveClass('text-[var(--pd-button-disabled-text)]');
});

test('Check tab button styling', async () => {
  render(Button, { type: 'tab' });

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expectCommonButtonClasses(button, { hasBorder: false, hasRounded: false, verticalPadding: 'pb-1' });
  expect(button).toHaveClass('border-b-[3px]');
  expect(button).toHaveClass('border-[var(--pd-button-tab-border)]');
  expect(button).toHaveClass('text-[var(--pd-button-tab-text)]');
});

test('Check selected tab button styling', async () => {
  render(Button, { type: 'tab', selected: true });

  // check for a few elements of the styling
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expect(button).toHaveClass('text-[var(--pd-button-tab-text-selected)]');
  expect(button).toHaveClass('border-[var(--pd-button-tab-border-selected)]');
});

test('Check icon button with fas prefix is visible', async () => {
  render(Button, { icon: faTrash, 'aria-label': 'Delete' });

  // check for a few elements of the styling
  const img = screen.getByRole('img', { hidden: true });
  expect(img).toBeInTheDocument();
});

test('Check icon button with fab prefix is visible', async () => {
  render(Button, { icon: faGithub, 'aria-label': 'GitHub' });

  // check for a few elements of the styling
  const img = screen.getByRole('img', { hidden: true });
  expect(img).toBeInTheDocument();
});

test('Button inProgress must have a spinner', async () => {
  // render the component
  render(Button, { inProgress: true });

  const spinner = screen.getByRole('status', { name: 'Loading' });
  expect(spinner).toBeDefined();
});

test('Button no progress no icon do not have spinner', async () => {
  // render the component
  render(Button, { inProgress: false });

  const spinner = screen.queryByRole('status', { name: 'Loading' });
  expect(spinner).toBeNull();
});

test('Button hidden should be hidden', async () => {
  render(Button, { hidden: true });
  const button = screen.queryByRole('button');
  expect(button).not.toBeInTheDocument();
});

test('Unknown button type falls back to primary styling', () => {
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  // Force an invalid type to exercise the else fallback branch
  render(Button, { type: 'unknown-type' as never });

  const button = screen.getByRole('button');
  expect(button).toHaveClass('bg-[var(--pd-button-primary-bg)]');
  expect(button).toHaveClass('text-[var(--pd-button-primary-text)]');

  expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown button type: unknown-type, falling back to primary');

  consoleWarnSpy.mockRestore();
});

test('Button should have aria-disabled when disabled', async () => {
  render(Button, { disabled: true });
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-disabled', 'true');
});

test('Button should have aria-disabled when inProgress', async () => {
  render(Button, { inProgress: true });
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-disabled', 'true');
});

test('Button should have aria-busy when inProgress', async () => {
  render(Button, { inProgress: true });
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-busy', 'true');
});

test('Button should not have aria-busy when not inProgress', async () => {
  render(Button, { inProgress: false });
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-busy', 'false');
});

test.each(['cursor-pointer', 'motion-reduce:transition-none', 'min-w-[28px]', 'min-h-[28px]'])(
  'Button should have %s class',
  async className => {
    render(Button);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(className);
  },
);

test('Button should have cursor-not-allowed class when disabled', async () => {
  render(Button, { disabled: true });
  const button = screen.getByRole('button');
  expect(button).toHaveClass('cursor-not-allowed');
  expect(button).not.toHaveClass('cursor-pointer');
});

test('Button should have cursor-wait class when inProgress', async () => {
  render(Button, { inProgress: true });
  const button = screen.getByRole('button');
  expect(button).toHaveClass('cursor-wait');
  expect(button).not.toHaveClass('cursor-pointer');
});

test('Icon-only button without aria-label should throw an error', () => {
  expect(() => render(Button, { icon: faTrash })).toThrow(
    'Icon-only buttons must have an aria-label for accessibility',
  );
});

test('Icon-only button with aria-label should not throw', () => {
  expect(() => render(Button, { icon: faTrash, 'aria-label': 'Delete' })).not.toThrow();
  expect(screen.getByRole('button')).toBeInTheDocument();
});

test('Icon button with title should not throw', () => {
  expect(() => render(Button, { icon: faTrash, title: 'Delete' })).not.toThrow();
  expect(screen.getByRole('button')).toBeInTheDocument();
});

test('Button without pressed prop should not have aria-pressed attribute', async () => {
  render(Button, { type: 'primary' });
  const button = screen.getByRole('button');
  expect(button).not.toHaveAttribute('aria-pressed');
});

test('Button with pressed true should have aria-pressed true and pressed styling', async () => {
  render(Button, { type: 'primary', pressed: true });
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(button).toHaveClass('bg-[var(--pd-button-primary-hover-bg)]');
  expect(button).toHaveClass('border-[var(--pd-button-tab-border-selected)]');
});

test('Button with pressed false should have aria-pressed false and regular styling', async () => {
  render(Button, { type: 'primary', pressed: false });
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-pressed', 'false');
  expect(button).toHaveClass('bg-[var(--pd-button-primary-bg)]');
  expect(button).toHaveClass('border-[var(--pd-button-primary-border)]');
});

test('Pressed secondary button should have pressed styling', async () => {
  render(Button, { type: 'secondary', pressed: true });
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(button).toHaveClass('bg-[var(--pd-button-secondary-hover-bg)]');
  expect(button).toHaveClass('border-[var(--pd-button-tab-border-selected)]');
});

test('Disabled pressed button should keep aria-pressed but use disabled styling', async () => {
  render(Button, { type: 'primary', pressed: true, disabled: true });
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(button).toHaveClass('bg-[var(--pd-button-disabled-bg)]');
  expect(button).not.toHaveClass('border-[var(--pd-button-tab-border-selected)]');
});

test('Menu item mode renders a div instead of a native button element', () => {
  const { container } = render(Button, { menuItem: true, icon: faTrash, 'aria-label': 'Delete' });
  const row = screen.getByRole('button');
  expect(row.tagName.toLowerCase()).toBe('div');
  expect(container.querySelector('button')).not.toBeInTheDocument();
});

test('Menu item mode row is full width and left aligned', () => {
  render(Button, { menuItem: true, icon: faTrash, 'aria-label': 'Delete' });
  const row = screen.getByRole('button');
  expect(row).toHaveClass('w-full');
  expect(row).toHaveClass('text-left');
});

test('Menu item mode uses row padding by default', () => {
  render(Button, { menuItem: true, icon: faTrash, 'aria-label': 'Delete' });
  const row = screen.getByRole('button');
  expect(row).toHaveClass('p-2.5');
  expect(row).not.toHaveClass('px-[16px]');
});

test('Menu item mode respects explicit padding override', () => {
  render(Button, { menuItem: true, padding: 'p-4', icon: faTrash, 'aria-label': 'Delete' });
  const row = screen.getByRole('button');
  expect(row).toHaveClass('p-4');
  expect(row).not.toHaveClass('p-2.5');
});

test('Menu item mode reuses type-based color classes', () => {
  render(Button, { menuItem: true, type: 'danger', icon: faTrash, 'aria-label': 'Delete' });
  const row = screen.getByRole('button');
  expect(row).toHaveClass('bg-[var(--pd-button-danger-bg)]');
  expect(row).toHaveClass('text-[var(--pd-button-danger-text)]');
});

test('Menu item mode exposes aria-pressed for toggle-style rows, matching the native-button branch', () => {
  render(Button, { menuItem: true, pressed: true, icon: faTrash, 'aria-label': 'Delete' });
  expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
});

test('Menu item mode strips border and shadow classes for a flat row look', () => {
  render(Button, { menuItem: true, type: 'danger', icon: faTrash, 'aria-label': 'Delete' });
  const row = screen.getByRole('button');
  expect(row).not.toHaveClass('border');
  expect(row).not.toHaveClass('border-[var(--pd-button-danger-border)]');
  expect(row).not.toHaveClass('shadow-[0px_1px_4px_0px_var(--pd-shadow-color)]');
});

test('Menu item mode forces off the divider border a DropdownMenu popover imposes between rows', () => {
  render(Button, { menuItem: true, icon: faTrash, 'aria-label': 'Delete' });
  const row = screen.getByRole('button');
  expect(row).toHaveClass('border-b-0!');
});

test('Menu item mode keeps focus-visible outline classes', () => {
  render(Button, { menuItem: true, type: 'danger', icon: faTrash, 'aria-label': 'Delete' });
  const row = screen.getByRole('button');
  expect(row).toHaveClass('focus-visible:outline-[var(--pd-button-focus-ring-danger)]');
});

test('Menu item mode click fires onclick when enabled', async () => {
  const onclick = vi.fn();
  render(Button, { menuItem: true, icon: faTrash, 'aria-label': 'Delete', onclick });
  await fireEvent.click(screen.getByRole('button'));
  expect(onclick).toHaveBeenCalledOnce();
});

test.each(['disabled', 'inProgress'] as const)(
  'Menu item mode click is ignored and does not bubble to window while %s',
  async prop => {
    const onclick = vi.fn();
    const onWindowClick = vi.fn();
    window.addEventListener('click', onWindowClick);
    render(Button, { menuItem: true, [prop]: true, icon: faTrash, 'aria-label': 'Delete', onclick });
    await fireEvent.click(screen.getByRole('button'));
    window.removeEventListener('click', onWindowClick);
    expect(onclick).not.toHaveBeenCalled();
    expect(onWindowClick).not.toHaveBeenCalled();
  },
);

test('Menu item mode is keyboard activatable with Enter on keydown', async () => {
  const onclick = vi.fn();
  render(Button, { menuItem: true, icon: faTrash, 'aria-label': 'Delete', onclick });
  await fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
  expect(onclick).toHaveBeenCalledOnce();
});

test('Menu item mode keyboard activation dispatches a real bubbling click, so a DropdownMenu listening on window can close itself', async () => {
  const onWindowClick = vi.fn();
  window.addEventListener('click', onWindowClick);
  render(Button, { menuItem: true, icon: faTrash, 'aria-label': 'Delete' });
  await fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
  window.removeEventListener('click', onWindowClick);
  expect(onWindowClick).toHaveBeenCalledOnce();
});

test('Menu item mode ignores repeated Space keydown while held, activating only once on keyup', async () => {
  const onclick = vi.fn();
  const onWindowClick = vi.fn();
  window.addEventListener('click', onWindowClick);
  render(Button, { menuItem: true, icon: faTrash, 'aria-label': 'Delete', onclick });
  const row = screen.getByRole('button');
  // Simulates OS key-repeat firing multiple keydown events while Space is held
  await fireEvent.keyDown(row, { key: ' ' });
  await fireEvent.keyDown(row, { key: ' ' });
  await fireEvent.keyDown(row, { key: ' ' });
  expect(onclick).not.toHaveBeenCalled();
  expect(onWindowClick).not.toHaveBeenCalled();
  await fireEvent.keyUp(row, { key: ' ' });
  window.removeEventListener('click', onWindowClick);
  expect(onclick).toHaveBeenCalledOnce();
  expect(onWindowClick).toHaveBeenCalledOnce();
});

test('Menu item mode ignores a bare Space keyup with no preceding keydown on the same row', async () => {
  const onclick = vi.fn();
  render(Button, { menuItem: true, icon: faTrash, 'aria-label': 'Delete', onclick });
  await fireEvent.keyUp(screen.getByRole('button'), { key: ' ' });
  expect(onclick).not.toHaveBeenCalled();
});

test('Menu item mode clears pending Space activation on blur, so a later keyup does not activate', async () => {
  const onclick = vi.fn();
  render(Button, { menuItem: true, icon: faTrash, 'aria-label': 'Delete', onclick });
  const row = screen.getByRole('button');
  await fireEvent.keyDown(row, { key: ' ' });
  await fireEvent.blur(row);
  await fireEvent.keyUp(row, { key: ' ' });
  expect(onclick).not.toHaveBeenCalled();
});

test.each([
  ['Enter', 'disabled'],
  ['Enter', 'inProgress'],
  ['Space', 'disabled'],
  ['Space', 'inProgress'],
] as const)('Menu item mode does not dispatch a bubbling click via %s when %s', async (key, prop) => {
  const onWindowClick = vi.fn();
  window.addEventListener('click', onWindowClick);
  render(Button, { menuItem: true, [prop]: true, icon: faTrash, 'aria-label': 'Delete' });
  const row = screen.getByRole('button');
  await fireEvent.keyDown(row, { key: key === 'Enter' ? 'Enter' : ' ' });
  if (key === 'Space') await fireEvent.keyUp(row, { key: ' ' });
  window.removeEventListener('click', onWindowClick);
  expect(onWindowClick).not.toHaveBeenCalled();
});

test('Menu item mode disabled row is removed from tab order', () => {
  render(Button, { menuItem: true, disabled: true, icon: faTrash, 'aria-label': 'Delete' });
  expect(screen.getByRole('button')).toHaveAttribute('tabindex', '-1');
});

test('Menu item mode enabled row is focusable', () => {
  render(Button, { menuItem: true, icon: faTrash, 'aria-label': 'Delete' });
  expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0');
});

test('Menu item mode hidden should be hidden', () => {
  render(Button, { menuItem: true, hidden: true, icon: faTrash, 'aria-label': 'Delete' });
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('Icon-only menu item row without aria-label should throw an error', () => {
  expect(() => render(Button, { menuItem: true, icon: faTrash })).toThrow(
    'Icon-only buttons must have an aria-label for accessibility',
  );
});
