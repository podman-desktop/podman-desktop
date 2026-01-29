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

/* eslint-disable @typescript-eslint/no-explicit-any */

import '@testing-library/jest-dom/vitest';

import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import MyIcon from './IconTest.svelte';
import SettingsNavItem from './SettingsNavItem.svelte';

function renderIt(title: string, href: string, selected?: boolean, section?: boolean, child?: boolean): void {
  render(SettingsNavItem, { title: title, href: href, selected: selected, section: section, child: child });
}

beforeAll(() => {
  // Mock the animate function
  HTMLElement.prototype.animate = vi.fn().mockReturnValue({
    finished: Promise.resolve(),
    cancel: vi.fn(),
  });
});

test('Expect correct role and href', async () => {
  const title = 'Resources';
  const href = '/test';
  renderIt(title, href, true);

  const element = screen.getByLabelText(title);
  expect(element).toBeInTheDocument();
  expect(element).toHaveAttribute('href', href);
});

test('Expect selection styling', async () => {
  const title = 'Resources';
  const href = '/test';
  renderIt(title, href, true);

  const element = screen.getByLabelText(title);
  expect(element).toBeInTheDocument();
  expect(element.firstChild).toBeInTheDocument();
  expect(element.firstChild).toHaveClass('border-[var(--pd-secondary-nav-selected-highlight)]');
});

test('Expect not to have selection styling', async () => {
  const title = 'Resources';
  renderIt(title, '/test', false);

  const element = screen.getByLabelText(title);
  expect(element).toBeInTheDocument();
  expect(element.firstChild).toBeInTheDocument();
  expect(element.firstChild).not.toHaveClass('border-[var(--pd-secondary-nav-selected-highlight)]');
  expect(element.firstChild).toHaveClass('border-[var(--pd-secondary-nav-bg)]');
});

test('Expect child styling', async () => {
  const title = 'Resources';
  const href = '/test';
  renderIt(title, href, true, false, true);

  const element = screen.getByLabelText(title);
  expect(element).toBeInTheDocument();
  expect(element.firstChild).toBeInTheDocument();
  expect(element.firstChild).toHaveClass('leading-none');
});

test('Expect section styling', async () => {
  const title = 'Extensions';
  const href = '/test';
  renderIt(title, href, true, true, false);

  const element = screen.getByLabelText(title);
  expect(element).toBeInTheDocument();
  expect(element.firstChild).toBeInTheDocument();
  const chevronContainer = element.firstChild?.childNodes[2] as HTMLElement;
  expect(chevronContainer).toBeInTheDocument();
  expect(chevronContainer.querySelector('svg')).toBeInTheDocument();
});

test('Expect sections expand', async () => {
  const title = 'Extensions';
  const href = '/test';
  renderIt(title, href, true, true, false);

  const element = screen.getByLabelText(title);
  expect(element).toBeInTheDocument();

  const chevronContainer = element.firstChild?.childNodes[2] as HTMLElement;
  expect(chevronContainer).toBeInTheDocument();

  const chevronIcon = chevronContainer.querySelector('svg') as SVGElement;
  expect(chevronIcon).toBeInTheDocument();
  expect(chevronIcon).toHaveClass('rotate-0');

  // expand section
  await fireEvent.click(element);
  expect(chevronIcon).toHaveClass('rotate-90');
});

test('fa icon should be visible', () => {
  render(SettingsNavItem, {
    title: 'DummyTitle',
    href: '/dummy/path',
    selected: false,
    icon: faBookOpen,
  });
  const svg = screen.getByRole('img', { hidden: true });
  expect(svg).toBeInTheDocument();
});

test('svg icon should be visible', () => {
  render(SettingsNavItem, {
    title: 'DummyTitle',
    href: '/dummy/path',
    selected: false,
    icon: MyIcon,
  });
  const svg = screen.getByRole('img', { hidden: true });
  expect(svg).toBeInTheDocument();
});

describe('icon', () => {
  test('icon should be displayed on the left', () => {
    const { getByRole } = render(SettingsNavItem, {
      title: 'DummyTitle',
      href: '/dummy/path',
      selected: false,
      icon: MyIcon,
    });
    const svg = getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
    expect(svg.parentElement).toHaveClass('flex-row');
  });
});

describe('iconRight', () => {
  test('iconRight with align end should be at far right', () => {
    const { getAllByRole } = render(SettingsNavItem, {
      title: 'DummyTitle',
      href: '/dummy/path',
      selected: false,
      icon: MyIcon,
      iconRight: MyIcon,
      iconRightAlign: 'end',
    });
    const svgs = getAllByRole('img', { hidden: true });
    expect(svgs).toHaveLength(2);
    // First icon (left) should be in the title span
    expect(svgs[0].parentElement).toHaveClass('flex-row');
    // Second icon (right) should be in the end container with px-2
    expect(svgs[1].parentElement).toHaveClass('px-2');
  });

  test('iconRight with align inline should be next to title', () => {
    const { getAllByRole } = render(SettingsNavItem, {
      title: 'DummyTitle',
      href: '/dummy/path',
      selected: false,
      icon: MyIcon,
      iconRight: MyIcon,
      iconRightAlign: 'inline',
    });
    const svgs = getAllByRole('img', { hidden: true });
    expect(svgs).toHaveLength(2);
    // Both icons should be in the same flex-row container
    expect(svgs[0].parentElement).toHaveClass('flex-row');
    expect(svgs[1].parentElement).toHaveClass('flex-row');
  });

  test('iconRight defaults to end alignment', () => {
    const { getAllByRole } = render(SettingsNavItem, {
      title: 'DummyTitle',
      href: '/dummy/path',
      selected: false,
      iconRight: MyIcon,
    });
    const svgs = getAllByRole('img', { hidden: true });
    expect(svgs).toHaveLength(1);
    // Icon should be in the end container with px-2
    expect(svgs[0].parentElement).toHaveClass('px-2');
  });
});
