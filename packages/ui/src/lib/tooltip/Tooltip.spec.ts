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

import { render, screen } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { expect, test } from 'vitest';

import Tooltip from './Tooltip.svelte';
import { tooltipHidden } from './tooltip-store';

const tip = 'test';

test('Expect basic prop styling', async () => {
  render(Tooltip, { tip: tip });

  const element = screen.getByLabelText('tooltip');
  expect(element).toBeInTheDocument();
  expect(element).toHaveClass('bg-[var(--pd-tooltip-bg)]');
  expect(element).toHaveClass('text-[var(--pd-tooltip-text)]');
  expect(element).toHaveClass('border-[var(--pd-tooltip-border)]');
  expect(element).toHaveClass('border-[1px]');
});

test('Expect basic slot styling', async () => {
  render(Tooltip, {
    tip: createRawSnippet(() => {
      return {
        render: (): string => 'test',
      };
    }),
  });

  const element = screen.getByLabelText('tooltip');
  expect(element).toBeInTheDocument();
  expect(element).toHaveClass('bg-[var(--pd-tooltip-bg)]');
  expect(element).toHaveClass('text-[var(--pd-tooltip-text)]');
  expect(element).toHaveClass('border-[var(--pd-tooltip-border)]');
  expect(element).toHaveClass('border-[1px]');
});

test('Expect tooltip is not empty string when tooltipHidden value false', async () => {
  tooltipHidden.set(false);

  render(Tooltip, { tip: 'test 1' });
  expect(screen.queryByText('test 1')).toBeInTheDocument();

  tooltipHidden.set(true);
  await tick();
  expect(screen.queryByText('test 1')).not.toBeInTheDocument();

  tooltipHidden.set(false);
  await tick();
  expect(screen.queryByText('test 1')).toBeInTheDocument();
});

test('Expect tooltip z order', async () => {
  render(Tooltip, { tip: 'my tooltip' });

  // get the tooltip
  const tooltip = screen.getByText('my tooltip');
  expect(tooltip.parentElement).toHaveClass('z-60');
});

test('Expect class styling to apply to tip', async () => {
  render(Tooltip, { class: 'my-[5px] mx-[10px]', tip });

  const slotElement = screen.getByLabelText('tooltip');
  expect(slotElement).toHaveClass('my-[5px] mx-[10px]');
});

test('Expect class styling to apply to tip snippet', async () => {
  render(Tooltip, {
    class: 'my-[5px] mx-[10px]',
    tip: createRawSnippet(() => {
      return {
        render: (): string => 'test',
      };
    }),
  });

  const slotElement = screen.getByLabelText('tooltip');
  expect(slotElement).toHaveClass('my-[5px] mx-[10px]');
});

function createTest(props: Record<string, boolean>, locationName: string, expectedStyle = locationName): void {
  test(`Expect property ${locationName} to add ${expectedStyle} class to parent element`, () => {
    render(Tooltip, { tip, ...props });
    const element = screen.getByLabelText('tooltip');
    expect(element).toBeInTheDocument();
    expect(element.parentElement).toHaveClass(expectedStyle);
  });
}

createTest({ left: true }, 'left');
createTest({ right: true }, 'right');
createTest({ bottom: true }, 'bottom');
createTest({ top: true }, 'top');
createTest({ topLeft: true }, 'topLeft', 'top-left');
createTest({ topRight: true }, 'topRight', 'top-right');
createTest({ bottomLeft: true }, 'bottomLeft', 'bottom-left');
createTest({ bottomRight: true }, 'bottomRight', 'bottom-right');
