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

import { autoUpdate, computePosition } from '@floating-ui/dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { tooltipHidden } from './tooltip-store';
import TooltipTestComponent from './TooltipTestComponent.svelte';
import TooltipTestWithSnippet from './TooltipTestWithSnippet.svelte';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn((): Promise<{ x: number; y: number }> => Promise.resolve({ x: 100, y: 200 })),
  flip: vi.fn(() => ({})),
  shift: vi.fn(() => ({})),
  offset: vi.fn(() => ({})),
  autoUpdate: vi.fn((_ref, _tooltip, update): (() => void) => {
    update();
    return (): void => {};
  }),
}));

describe('Tooltip', () => {
  beforeEach(() => {
    tooltipHidden.set(false);
    vi.clearAllMocks();
  });

  test('tooltip is hidden when tooltipHidden is true', async () => {
    tooltipHidden.set(false);

    render(TooltipTestComponent, { tip: 'test 1' });

    const slot = screen.getByTestId('tooltip-trigger');
    expect(slot).toBeInTheDocument();
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      expect(screen.queryByText('test 1')).toBeInTheDocument();
    });

    tooltipHidden.set(true);

    await waitFor(() => {
      expect(screen.queryByText('test 1')).not.toBeInTheDocument();
    });

    tooltipHidden.set(false);
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      expect(screen.queryByText('test 1')).toBeInTheDocument();
    });
  });

  test('tooltip z-index is correctly set', async () => {
    const { container } = render(TooltipTestComponent, { tip: 'my tooltip' });

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      const tooltipContainer = container.querySelector('.tooltip-content');
      expect(tooltipContainer).toHaveClass('z-[9999]');
    });
  });

  test('tooltip shows on mouse enter and hides on mouse leave', async () => {
    render(TooltipTestComponent, { tip: 'hover text' });

    const slot = screen.getByTestId('tooltip-trigger');

    expect(screen.queryByText('hover text')).not.toBeInTheDocument();

    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      expect(screen.queryByText('hover text')).toBeInTheDocument();
    });

    await fireEvent.mouseLeave(slot);

    await waitFor(() => {
      expect(screen.queryByText('hover text')).not.toBeInTheDocument();
    });
  });

  test('tooltip respects top placement prop', async () => {
    render(TooltipTestComponent, { tip: 'top tooltip', top: true });

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      expect(computePosition).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ placement: 'top' }),
      );
    });
  });

  test('tooltip respects bottom placement prop', async () => {
    render(TooltipTestComponent, { tip: 'bottom tooltip', bottom: true });

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      expect(computePosition).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ placement: 'bottom' }),
      );
    });
  });

  test('tooltip respects left placement prop', async () => {
    render(TooltipTestComponent, { tip: 'left tooltip', left: true });

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      expect(computePosition).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ placement: 'left' }),
      );
    });
  });

  test('tooltip respects right placement prop', async () => {
    render(TooltipTestComponent, { tip: 'right tooltip', right: true });

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      expect(computePosition).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ placement: 'right' }),
      );
    });
  });

  test('tooltip respects topLeft placement prop', async () => {
    render(TooltipTestComponent, { tip: 'top-left tooltip', topLeft: true });

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      expect(computePosition).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ placement: 'top-start' }),
      );
    });
  });

  test('tooltip respects bottomRight placement prop', async () => {
    render(TooltipTestComponent, { tip: 'bottom-right tooltip', bottomRight: true });

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      expect(computePosition).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ placement: 'bottom-end' }),
      );
    });
  });

  test('tooltip defaults to top placement when no placement prop is provided', async () => {
    render(TooltipTestComponent, { tip: 'default tooltip' });

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      expect(computePosition).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ placement: 'top' }),
      );
    });
  });

  test('tooltip calls autoUpdate on mouse enter', async () => {
    render(TooltipTestComponent, { tip: 'auto update test' });

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      expect(autoUpdate).toHaveBeenCalled();
    });
  });

  test('tooltip applies max-width styling', async () => {
    const { container } = render(TooltipTestComponent, { tip: 'long text tooltip' });

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      const tooltipContainer = container.querySelector('.tooltip-content');
      expect(tooltipContainer).toHaveClass('tooltip-content');
    });
  });

  test('tooltip handles tipSnippet prop', async () => {
    render(TooltipTestWithSnippet);

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      expect(screen.queryByText('Custom snippet content')).toBeInTheDocument();
    });
  });

  test('tooltip is initially hidden with opacity-0', async () => {
    const { container } = render(TooltipTestComponent, { tip: 'opacity test' });

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    const tooltipContainer = container.querySelector('.tooltip-content');
    expect(tooltipContainer).toBeInTheDocument();
  });

  async function renderAndHoverTooltip(props: Record<string, unknown>): Promise<HTMLElement> {
    render(TooltipTestComponent, props);

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      expect(screen.getByLabelText('tooltip')).toBeInTheDocument();
    });

    return screen.getByLabelText('tooltip');
  }

  function expectTooltipStyling(element: HTMLElement): void {
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('bg-[var(--pd-tooltip-bg)]');
    expect(element).toHaveClass('text-[var(--pd-tooltip-text)]');
    expect(element).toHaveClass('border-[var(--pd-tooltip-inner-border)]');
    expect(element).toHaveClass('border-[1px]');
  }

  test('Expect basic slot styling', async () => {
    const element = await renderAndHoverTooltip({ tipSlot: 'test' });
    expectTooltipStyling(element);
  });

  test('Expect basic prop styling', async () => {
    const element = await renderAndHoverTooltip({ tip: 'test' });
    expectTooltipStyling(element);
  });

  test('Expect class styling to apply to tip slot div', async () => {
    render(TooltipTestComponent, { classStyle: 'my-[5px] mx-[10px]' });

    const slot = screen.getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(slot);

    await waitFor(() => {
      const slotElement = screen.getByLabelText('tooltip');
      expect(slotElement).toHaveClass('my-[5px] mx-[10px]');
    });
  });

  test('containerClass prop should replace the default class of the container', async () => {
    const { container } = render(TooltipTestComponent, { containerClass: 'w-full' });
    expect(container.childNodes[0]).toHaveClass('w-full');
  });
});
