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

import { autoUpdate, computePosition } from '@floating-ui/dom';
import { render, screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import TooltipPopup, { nextTooltipId } from './TooltipPopup.svelte';

vi.mock(import('@floating-ui/dom'));

const cleanupAutoUpdate = vi.fn();
let reference: HTMLElement;

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(computePosition).mockResolvedValue({
    middlewareData: {},
    placement: 'top',
    strategy: 'absolute',
    x: 100.4,
    y: 200.6,
  });
  vi.mocked(autoUpdate).mockImplementation((_ref, _tooltip, update) => {
    update();
    return cleanupAutoUpdate;
  });

  reference = document.createElement('button');
  document.body.appendChild(reference);
});

test('renders the tip in an element with role tooltip and the given id', () => {
  render(TooltipPopup, { reference, id: 'my-tooltip', tip: 'hello' });

  const tooltip = screen.getByRole('tooltip');
  expect(tooltip).toHaveTextContent('hello');
  expect(tooltip).toHaveAttribute('id', 'my-tooltip');
});

test('applies the class prop to the inner tooltip element', () => {
  render(TooltipPopup, { reference, id: 'my-tooltip', tip: 'hello', class: 'custom-class' });

  expect(screen.getByRole('tooltip')).toHaveClass('custom-class');
});

test('renders tipSnippet when no tip is given', () => {
  const tipSnippet = createRawSnippet(() => ({ render: (): string => '<span>snippet content</span>' }));
  render(TooltipPopup, { reference, id: 'my-tooltip', tipSnippet });

  expect(screen.getByRole('tooltip')).toHaveTextContent('snippet content');
});

test('tip takes precedence over tipSnippet', () => {
  const tipSnippet = createRawSnippet(() => ({ render: (): string => '<span>snippet content</span>' }));
  render(TooltipPopup, { reference, id: 'my-tooltip', tip: 'hello', tipSnippet });

  const tooltip = screen.getByRole('tooltip');
  expect(tooltip).toHaveTextContent('hello');
  expect(tooltip).not.toHaveTextContent('snippet content');
});

test('positions relative to the reference with top placement by default', async () => {
  render(TooltipPopup, { reference, id: 'my-tooltip', tip: 'hello' });

  await waitFor(() =>
    expect(computePosition).toHaveBeenCalledWith(
      reference,
      screen.getByRole('tooltip').parentElement,
      expect.objectContaining({ placement: 'top' }),
    ),
  );
});

test('positions with the given placement', async () => {
  render(TooltipPopup, { reference, id: 'my-tooltip', tip: 'hello', placement: 'bottom-end' });

  await waitFor(() =>
    expect(computePosition).toHaveBeenCalledWith(
      reference,
      expect.anything(),
      expect.objectContaining({ placement: 'bottom-end' }),
    ),
  );
});

test('is transparent until positioned, then uses rounded coordinates', async () => {
  vi.mocked(autoUpdate).mockReturnValue(cleanupAutoUpdate);
  let resolvePosition: (value: Awaited<ReturnType<typeof computePosition>>) => void = () => {};
  vi.mocked(computePosition).mockReturnValue(new Promise(resolve => (resolvePosition = resolve)));

  render(TooltipPopup, { reference, id: 'my-tooltip', tip: 'hello' });

  const outer = screen.getByRole('tooltip').parentElement;
  expect(outer).toHaveClass('opacity-0');

  resolvePosition({ middlewareData: {}, placement: 'top', strategy: 'absolute', x: 100.4, y: 200.6 });

  await waitFor(() => expect(outer).not.toHaveClass('opacity-0'));
  expect(outer).toHaveStyle({ left: '100px', top: '201px' });
});

test('stops auto-updating the position when unmounted', async () => {
  const { unmount } = render(TooltipPopup, { reference, id: 'my-tooltip', tip: 'hello' });

  await waitFor(() => expect(autoUpdate).toHaveBeenCalledWith(reference, expect.anything(), expect.any(Function)));
  expect(cleanupAutoUpdate).not.toHaveBeenCalled();

  unmount();

  expect(cleanupAutoUpdate).toHaveBeenCalled();
});

test('nextTooltipId returns unique prefixed ids', () => {
  const first = nextTooltipId();
  const second = nextTooltipId();

  expect(first).toMatch(/^pd-tooltip-\d+$/);
  expect(second).toMatch(/^pd-tooltip-\d+$/);
  expect(first).not.toBe(second);
});
