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

import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, expect, test } from 'vitest';

import SlotWrapper from './TestTooltipSlotWrapper.svelte';
import Tooltip from './Tooltip.svelte';
import { tooltipHidden } from './tooltip-store';

async function hoverReveals(trigger: HTMLElement, outer: HTMLElement): Promise<boolean> {
  await fireEvent.mouseEnter(trigger);
  await tick();
  const visible = !outer.classList.contains('opacity-0');
  await fireEvent.mouseLeave(trigger);
  await tick();
  return visible;
}

function mockRect({ top, left, width, height }: { top: number; left: number; width: number; height: number }): DOMRect {
  return {
    top,
    left,
    right: left + width,
    bottom: top + height,
    width,
    height,
  } as DOMRect;
}

const WRAPPER_RECT = mockRect({ top: 100, left: 100, width: 50, height: 50 });
const TIP_RECT = mockRect({ top: 0, left: 0, width: 80, height: 40 });

async function computePos(directionProps: Record<string, boolean>): Promise<{ top: number; left: number }> {
  const { container } = render(Tooltip, { props: { tip: 'pos', ...directionProps } });

  const wrapper = container.firstElementChild as HTMLElement;
  const outer = screen.getByText('pos').parentElement as HTMLElement;

  // Complain because we overwrite readonly method – this is intentional for the unit test.
  wrapper.getBoundingClientRect = (): DOMRect => WRAPPER_RECT;
  outer.getBoundingClientRect = (): DOMRect => TIP_RECT;

  await fireEvent.mouseEnter(wrapper);
  await tick();

  return {
    top: parseFloat(outer.style.top),
    left: parseFloat(outer.style.left),
  };
}

afterEach(() => tooltipHidden.set(false));

test('tooltip is not empty string when tooltipHidden value false', async () => {
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

test('tooltip z order', async () => {
  render(Tooltip, { tip: 'my tooltip' });

  // get the tooltip
  const tooltip = screen.getByText('my tooltip');
  expect(tooltip.parentElement).toHaveClass('z-60');
});

test('hover shows and hides tooltip', async () => {
  const { container } = render(Tooltip, { props: { tip: 'my tooltip' } });

  const trigger = container.firstElementChild as HTMLElement;
  const outer = screen.getByText('my tooltip').parentElement as HTMLElement;

  expect(outer).toHaveClass('opacity-0');

  await fireEvent.mouseEnter(trigger);
  await tick();
  expect(outer).not.toHaveClass('opacity-0');

  await fireEvent.mouseLeave(trigger);
  await tick();
  expect(outer).toHaveClass('opacity-0');
});

test('renders content from named slot', () => {
  render(SlotWrapper);
  expect(screen.getByText('slot-tip-content')).toBeInTheDocument();
});

test('updates tooltip text when `tip` prop changes', async () => {
  const { rerender } = render(Tooltip, { props: { tip: 'my tooltip' } });

  expect(screen.getByText('my tooltip')).toBeInTheDocument();

  await rerender({ tip: 'updated' });
  await tick();

  expect(screen.queryByText('my tooltip')).not.toBeInTheDocument();
  expect(screen.getByText('updated')).toBeInTheDocument();
});

test('should test contentAvailable: non-empty tip prop', async () => {
  const { container } = render(Tooltip, { props: { tip: 'my tooltip' } });

  const trigger = container.firstElementChild as HTMLElement;
  const outer = screen.getByText('my tooltip').parentElement as HTMLElement;

  expect(await hoverReveals(trigger, outer)).toBe(true);
});

test('should test contentAvailable: slot content present', async () => {
  render(SlotWrapper);

  const trigger = screen.getByTestId('trigger');
  const outer = screen.getByText('slot-tip-content').parentElement as HTMLElement;

  expect(await hoverReveals(trigger, outer)).toBe(true);
});

test('should test contentAvailable: no tip and no slot', async () => {
  const { container } = render(Tooltip, { props: { tip: '' } });

  const trigger = container.firstElementChild as HTMLElement;
  const outer = document.body.querySelector('.tooltip') as HTMLElement;

  expect(await hoverReveals(trigger, outer)).toBe(false);
});

test('should test calculatePosition: top', async () => {
  const pos = await computePos({ top: true });

  // tp = 100 - 40 - 8 = 52
  // lp = 100 + 25 - 40 = 85
  expect(pos).toEqual({ top: 52, left: 85 });
});

test('should test calculatePosition: bottom', async () => {
  const pos = await computePos({ bottom: true });

  // tp = 150 + 8 = 158
  // lp = 100 + 25 - 40 = 85
  expect(pos).toEqual({ top: 158, left: 85 });
});

test('should test calculatePosition: left', async () => {
  const pos = await computePos({ left: true });

  // tp = 100 + 25 - 20 = 105
  // lp = 100 - 80 - 8  = 12
  expect(pos).toEqual({ top: 105, left: 12 });
});

test('should test calculatePosition: right', async () => {
  const pos = await computePos({ right: true });

  // tp = 100 + 25 - 20 - 10 = 95
  // lp = 150 + 8 = 158
  expect(pos).toEqual({ top: 95, left: 158 });
});

test('should test calculatePosition: topLeft', async () => {
  const pos = await computePos({ topLeft: true });

  // tp = 100 - 40 - 8 = 52
  // lp = 100 - 80 * 0.8 = 36
  expect(pos).toEqual({ top: 52, left: 36 });
});

test('should test calculatePosition: topRight', async () => {
  const pos = await computePos({ topRight: true });

  // tp = 52
  // lp = 100
  expect(pos).toEqual({ top: 52, left: 100 });
});

test('should test calculatePosition: bottomLeft', async () => {
  const pos = await computePos({ bottomLeft: true });

  // tp = 150 + 8 = 158
  // lp = 36
  expect(pos).toEqual({ top: 158, left: 36 });
});

test('should test calculatePosition: bottomRight', async () => {
  const pos = await computePos({ bottomRight: true });

  // tp = 158
  // lp = 100
  expect(pos).toEqual({ top: 158, left: 100 });
});

test('tooltipHidden subscribe detaches and re-attaches tooltipOuter', async () => {
  render(Tooltip, { props: { tip: 'my tooltip' } });

  const outer = screen.getByText('my tooltip').parentElement as HTMLElement;
  expect(document.body.contains(outer)).toBe(true);

  tooltipHidden.set(true);
  await tick();
  expect(document.body.contains(outer)).toBe(false);

  tooltipHidden.set(false);
  await tick();
  expect(document.body.contains(outer)).toBe(true);
  expect(outer).toHaveClass('opacity-0');
});

test('click hides tooltip and listeners removed on destroy', async () => {
  const utils = render(Tooltip, { props: { tip: 'my tooltip' } });

  const trigger = utils.container.firstElementChild as HTMLElement;
  const outer = screen.getByText('my tooltip').parentElement as HTMLElement;

  await fireEvent.mouseEnter(trigger);
  await tick();
  expect(outer).not.toHaveClass('opacity-0');

  await fireEvent.click(trigger);
  await tick();
  expect(outer).toHaveClass('opacity-0');

  utils.unmount();
  await fireEvent.mouseEnter(trigger);
  await tick();

  expect(document.body.contains(outer)).toBe(false);
});

test('adds extra classes from `class` prop', () => {
  render(Tooltip, {
    props: {
      tip: 'my tooltip',
      class: '  bg-red-500  shadow-lg  ',
    },
  });

  const outer = screen.getByText('my tooltip') as HTMLElement;

  expect(outer).toHaveClass('bg-red-500');
  expect(outer).toHaveClass('shadow-lg');
});
