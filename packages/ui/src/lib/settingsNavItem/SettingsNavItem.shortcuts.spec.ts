/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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
import { beforeAll, expect, test, vi } from 'vitest';

import SettingsNavItem from './SettingsNavItem.svelte';

beforeAll(() => {
  HTMLElement.prototype.animate = vi.fn().mockReturnValue({
    finished: Promise.resolve(),
    cancel: vi.fn(),
  });
});

test.each([false, true])('keeps shortcut metadata on the title link with section=%s', section => {
  render(SettingsNavItem, {
    title: 'Preferences',
    href: '/preferences',
    section,
    ariaKeyShortcuts: 'Control+ArrowLeft Meta+ArrowLeft',
  });

  const link = screen.getByRole('link', { name: 'Preferences' });
  expect(link).toHaveAttribute('aria-keyshortcuts', 'Control+ArrowLeft Meta+ArrowLeft');
  expect(link).not.toHaveAttribute('aria-expanded');
  expect(link).not.toHaveAttribute('aria-controls');
  if (section) {
    expect(screen.getByRole('button', { name: 'Toggle Preferences' })).not.toHaveAttribute('aria-keyshortcuts');
  } else {
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  }
});

test('does not route disclosure key events through the navigation shortcut handler', async () => {
  const onKeyDown = vi.fn();
  const onClick = vi.fn();
  const onToggle = vi.fn();
  render(SettingsNavItem, {
    title: 'Preferences',
    href: '/preferences',
    section: true,
    expanded: false,
    ariaControls: 'preference-sections',
    ariaKeyShortcuts: 'Control+ArrowLeft',
    onKeyDown,
    onClick,
    onToggle,
  });

  const link = screen.getByRole('link', { name: 'Preferences' });
  const button = screen.getByRole('button', { name: 'Toggle Preferences' });
  await fireEvent.keyDown(link, { key: 'ArrowLeft', ctrlKey: true });
  expect(onKeyDown).toHaveBeenCalledTimes(1);
  expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'ArrowLeft', ctrlKey: true }));
  expect(onToggle).not.toHaveBeenCalled();
  expect(button).toHaveAttribute('aria-expanded', 'false');

  await fireEvent.keyDown(button, { key: 'ArrowLeft', ctrlKey: true });
  expect(onKeyDown).toHaveBeenCalledTimes(1);
  await fireEvent.click(button);
  expect(onClick).not.toHaveBeenCalled();
  expect(onToggle).toHaveBeenCalledTimes(1);
  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(button).toHaveAttribute('aria-controls', 'preference-sections');

  await fireEvent.click(link);
  expect(onClick).toHaveBeenCalledTimes(1);
  expect(onToggle).toHaveBeenCalledTimes(1);
  expect(button).toHaveAttribute('aria-expanded', 'true');
});
