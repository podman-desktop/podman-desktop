/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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

import { faCircleCheck, faRocket } from '@fortawesome/free-solid-svg-icons';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import { ContextUI } from '/@/lib/context/context';
import { context } from '/@/stores/context';

import ListItemButtonIcon from './ListItemButtonIcon.svelte';

test('Expect the dropDownMenuItem to have classes that display a disabled object if the disabled when clause is evaluated to true', async () => {
  const title = 'title';

  const contextUI = new ContextUI();
  contextUI.setValue('values', ['test']);
  context.set(contextUI);

  render(ListItemButtonIcon, {
    title,
    icon: faRocket,
    disabledWhen: 'test in values',
    menu: true,
    contextUI: contextUI,
  });

  const listItemSpan = screen.getByTitle(title);
  expect(listItemSpan).toBeInTheDocument();
  expect(
    listItemSpan.parentElement!.outerHTML.indexOf(
      'text-[var(--pd-dropdown-disabled-item-text)] bg-[var(--pd-dropdown-disabled-item-bg)]',
    ) > 0,
  ).toBeTruthy();
});

test('Expect the dropDownMenuItem to have classes that display a disabled object if the disabled when clause is true', async () => {
  const title = 'title';

  render(ListItemButtonIcon, {
    title,
    icon: faRocket,
    disabledWhen: 'true',
    menu: true,
  });

  const listItemSpan = screen.getByTitle(title);
  expect(listItemSpan).toBeInTheDocument();
  expect(
    listItemSpan.parentElement!.outerHTML.indexOf(
      'text-[var(--pd-dropdown-disabled-item-text)] bg-[var(--pd-dropdown-disabled-item-bg)]',
    ) > 0,
  ).toBeTruthy();
});

test('Expect the dropDownMenuItem NOT to have classes that display a disabled object if the disabled when clause is evaluated to false', async () => {
  const title = 'title';

  const contextUI = new ContextUI();
  contextUI.setValue('values', ['test']);
  context.set(contextUI);

  render(ListItemButtonIcon, {
    title,
    icon: faRocket,
    disabledWhen: 'unknown in values',
    menu: true,
    contextUI: contextUI,
  });

  const listItemSpan = screen.getByTitle(title);
  expect(listItemSpan).toBeInTheDocument();
  expect(listItemSpan.parentElement!.outerHTML.indexOf('text-gray-900 bg-charcoal-800') === -1).toBeTruthy();
});

test('Expect the dropDownMenuItem NOT to have classes that display a disabled object if the disabled when clause is false', async () => {
  const title = 'title';

  render(ListItemButtonIcon, {
    title,
    icon: faRocket,
    disabledWhen: 'false',
    menu: true,
  });

  const listItemSpan = screen.getByTitle(title);
  expect(listItemSpan).toBeInTheDocument();
  expect(listItemSpan.parentElement!.outerHTML.indexOf('text-gray-900 bg-charcoal-800') === -1).toBeTruthy();
});

test('Expect the dropDownMenuItem NOT to have classes that display a disabled object if the disabled when clause is empty', async () => {
  const title = 'title';

  render(ListItemButtonIcon, {
    title,
    icon: faRocket,
    disabledWhen: '',
    menu: true,
  });

  const listItemSpan = screen.getByTitle(title);
  expect(listItemSpan).toBeInTheDocument();
  expect(listItemSpan.parentElement!.outerHTML.indexOf('text-gray-900 bg-charcoal-800') === -1).toBeTruthy();
});

test('With custom font icon', async () => {
  const title = 'Dummy item';

  render(ListItemButtonIcon, {
    title,
    icon: 'fas fa-podman-desktop-icon-dummyIcon',
    menu: true,
    enabled: true,
    inProgress: false,
  });

  const iconItem = screen.getByRole('img', { hidden: true });
  expect(iconItem).toBeInTheDocument();
  // expect to have the podman desktop icon class
  expect(iconItem).toHaveClass('fas fa-podman-desktop-icon-dummyIcon');
});

test('With custom Fa icon', async () => {
  const title = 'Dummy item';

  render(ListItemButtonIcon, {
    title,
    icon: faCircleCheck,
    menu: true,
    enabled: true,
    inProgress: false,
  });

  // grab the svg element
  const svgElement = screen.getByRole('img', { hidden: true });
  expect(svgElement).toBeInTheDocument();

  // check it is a svelte-fa class
  expect(svgElement).toHaveClass('svelte-fa');
});

test('expect button to not have inline-flex when hidden is true', async () => {
  const title = 'title';

  render(ListItemButtonIcon, {
    title,
    icon: faRocket,
    hidden: true,
    menu: false,
  });

  const listItemButton = screen.getByRole('button', { name: title });
  expect(listItemButton).toBeInTheDocument();
  expect(listItemButton).toHaveClass('hidden');
  expect(listItemButton).not.toHaveClass('inline-flex');
});

test('expect button to have inline-flex when hidden is false', async () => {
  const title = 'title';

  render(ListItemButtonIcon, {
    title,
    icon: faRocket,
    hidden: false,
    menu: false,
  });

  const listItemButton = screen.getByRole('button', { name: title });
  expect(listItemButton).toBeInTheDocument();
  expect(listItemButton).not.toHaveClass('hidden');
  expect(listItemButton).toHaveClass('inline-flex');
});

test('expect button to show the title as tooltip on hover instead of a native title', async () => {
  render(ListItemButtonIcon, {
    title: 'Delete Container',
    icon: faRocket,
    menu: false,
  });

  const listItemButton = screen.getByRole('button', { name: 'Delete Container' });
  expect(listItemButton).not.toHaveAttribute('title');

  await fireEvent.mouseEnter(listItemButton);
  expect(screen.getByRole('tooltip')).toHaveTextContent('Delete Container');
  // the tooltip repeats the aria-label, so it is not referenced as a description
  expect(listItemButton).not.toHaveAttribute('aria-describedby');

  await fireEvent.mouseLeave(listItemButton);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('expect button to show the tooltip prop rather than the title on hover', async () => {
  render(ListItemButtonIcon, {
    title: 'Update Image',
    tooltip: 'Cannot update an image used by a container',
    icon: faRocket,
    menu: false,
    enabled: false,
  });

  const listItemButton = screen.getByRole('button', { name: 'Update Image' });
  await fireEvent.mouseEnter(listItemButton);

  const tooltip = screen.getByRole('tooltip');
  expect(tooltip).toHaveTextContent('Cannot update an image used by a container');
  expect(listItemButton).toHaveAttribute('aria-describedby', tooltip.id);
});

test('expect a visible tooltip to update its text when the tooltip prop changes', async () => {
  const { rerender } = render(ListItemButtonIcon, {
    title: 'Update Image',
    tooltip: 'Update all tags of this image',
    icon: faRocket,
    menu: false,
  });

  const listItemButton = screen.getByRole('button', { name: 'Update Image' });
  await fireEvent.mouseEnter(listItemButton);

  await rerender({ tooltip: 'Updating image' });

  expect(screen.getByRole('tooltip')).toHaveTextContent('Updating image');
});
