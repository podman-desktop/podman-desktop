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
import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { tooltip } from './tooltip-attachment.svelte';
import { resetTooltipHideCount } from './tooltip-store';
import TooltipAttachmentTestComponent from './TooltipAttachmentTestComponent.svelte';

vi.mock(import('@floating-ui/dom'));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(computePosition).mockResolvedValue({
    middlewareData: {},
    placement: 'top',
    strategy: 'absolute',
    x: 100,
    y: 200,
  });

  vi.mocked(autoUpdate).mockImplementation((_ref, _tooltip, update) => {
    update();
    return (): void => {};
  });

  resetTooltipHideCount();
});

function createButton(text = 'Click me'): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = text;
  document.body.appendChild(btn);
  return btn;
}

function cleanupBody(): void {
  document.body.innerHTML = '';
}

describe('tooltip attachment', () => {
  beforeEach(() => {
    cleanupBody();
  });

  test('shows tooltip on mouseenter and hides on mouseleave', async () => {
    const btn = createButton();
    const cleanup = tooltip('Hello tooltip')(btn);

    await fireEvent.mouseEnter(btn);
    expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();
    expect(document.querySelector('[role="tooltip"]')).toHaveTextContent('Hello tooltip');

    await fireEvent.mouseLeave(btn);
    expect(document.querySelector('[role="tooltip"]')).not.toBeInTheDocument();

    cleanup?.();
  });

  test('shows tooltip on focusin and hides on focusout', async () => {
    const btn = createButton();
    const cleanup = tooltip('Focus tooltip')(btn);

    await fireEvent.focusIn(btn);
    expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();

    await fireEvent.focusOut(btn);
    expect(document.querySelector('[role="tooltip"]')).not.toBeInTheDocument();

    cleanup?.();
  });

  test('sets aria-describedby on the element when visible', async () => {
    const btn = createButton();
    const cleanup = tooltip('Aria tooltip')(btn);

    await fireEvent.mouseEnter(btn);
    const tooltipEl = screen.getByRole('tooltip');
    expect(btn).toHaveAttribute('aria-describedby', tooltipEl.id);
    expect(tooltipEl.id).toMatch(/^pd-tooltip-/);

    await fireEvent.mouseLeave(btn);
    expect(btn).not.toHaveAttribute('aria-describedby');

    cleanup?.();
  });

  test('keeps an existing aria-describedby and restores it when hidden', async () => {
    const btn = createButton();
    btn.setAttribute('aria-describedby', 'own-description');
    const cleanup = tooltip('Aria tooltip')(btn);

    await fireEvent.mouseEnter(btn);
    expect(btn).toHaveAttribute('aria-describedby', `own-description ${screen.getByRole('tooltip').id}`);

    await fireEvent.mouseLeave(btn);
    expect(btn).toHaveAttribute('aria-describedby', 'own-description');

    await fireEvent.mouseEnter(btn);
    cleanup?.();
    expect(btn).toHaveAttribute('aria-describedby', 'own-description');
  });

  test('keeps an aria-describedby changed by the owner while the tooltip is shown', async () => {
    const btn = createButton();
    btn.setAttribute('aria-describedby', 'err-1');
    const cleanup = tooltip('Aria tooltip')(btn);

    await fireEvent.mouseEnter(btn);
    const tooltipId = screen.getByRole('tooltip').id;
    btn.setAttribute('aria-describedby', `err-2 ${tooltipId}`);

    await fireEvent.mouseLeave(btn);
    expect(btn).toHaveAttribute('aria-describedby', 'err-2');

    cleanup?.();
  });

  test('sets aria-describedby on the first focusable descendant', async () => {
    const container = document.createElement('div');
    const btn = document.createElement('button');
    container.appendChild(btn);
    document.body.appendChild(container);
    const cleanup = tooltip('Nested tooltip')(container);

    await fireEvent.mouseEnter(container);
    expect(btn).toHaveAttribute('aria-describedby', screen.getByRole('tooltip').id);
    expect(container).not.toHaveAttribute('aria-describedby');

    await fireEvent.mouseLeave(container);
    expect(btn).not.toHaveAttribute('aria-describedby');

    cleanup?.();
  });

  test('Escape hides the tooltip and it stays hidden until the pointer re-enters', async () => {
    const btn = createButton();
    const cleanup = tooltip('Escape tooltip')(btn);

    await fireEvent.mouseEnter(btn);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(btn).not.toHaveAttribute('aria-describedby');

    await fireEvent.mouseMove(btn);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await fireEvent.mouseLeave(btn);
    await fireEvent.mouseEnter(btn);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    cleanup?.();
  });

  test('Escape hides a tooltip shown by keyboard focus', async () => {
    const btn = createButton();
    const cleanup = tooltip('Focus tooltip')(btn);

    await fireEvent.focusIn(btn);
    await fireEvent.keyDown(btn, { key: 'Escape' });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(btn).not.toHaveAttribute('aria-describedby');

    cleanup?.();
  });

  test('other keys do not hide the tooltip', async () => {
    const btn = createButton();
    const cleanup = tooltip('Key tooltip')(btn);

    await fireEvent.mouseEnter(btn);
    await fireEvent.keyDown(document, { key: 'Enter' });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    cleanup?.();
  });

  test('does not set aria-describedby when the tip repeats the aria-label', async () => {
    const btn = createButton();
    btn.setAttribute('aria-label', 'Delete Container');
    const cleanup = tooltip('Delete Container')(btn);

    await fireEvent.mouseEnter(btn);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Delete Container');
    expect(btn).not.toHaveAttribute('aria-describedby');

    cleanup?.();
  });

  test('sets aria-describedby when the tip differs from the aria-label', async () => {
    const btn = createButton();
    btn.setAttribute('aria-label', 'Update Image');
    const cleanup = tooltip('Cannot update an image used by a container')(btn);

    await fireEvent.mouseEnter(btn);

    expect(btn).toHaveAttribute('aria-describedby', screen.getByRole('tooltip').id);

    cleanup?.();
  });

  test('compares the tip with the aria-label of the focusable descendant', async () => {
    const container = document.createElement('div');
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', 'Settings');
    container.appendChild(btn);
    document.body.appendChild(container);
    const cleanup = tooltip('Settings')(container);

    await fireEvent.mouseEnter(container);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(btn).not.toHaveAttribute('aria-describedby');
    expect(container).not.toHaveAttribute('aria-describedby');

    cleanup?.();
  });

  test('uses default top placement', async () => {
    const btn = createButton();
    const cleanup = tooltip('Top tooltip')(btn);

    await fireEvent.mouseEnter(btn);

    expect(computePosition).toHaveBeenCalledWith(btn, expect.anything(), expect.objectContaining({ placement: 'top' }));

    cleanup?.();
  });

  test('respects custom placement option', async () => {
    const btn = createButton();
    const cleanup = tooltip('Bottom tooltip', { placement: 'bottom' })(btn);

    await fireEvent.mouseEnter(btn);

    expect(computePosition).toHaveBeenCalledWith(
      btn,
      expect.anything(),
      expect.objectContaining({ placement: 'bottom' }),
    );

    cleanup?.();
  });

  test('calls autoUpdate when tooltip is shown', async () => {
    const btn = createButton();
    const cleanup = tooltip('Auto update')(btn);

    await fireEvent.mouseEnter(btn);
    expect(autoUpdate).toHaveBeenCalled();

    cleanup?.();
  });

  test('hides tooltip when tooltipHidden store becomes true', async () => {
    const btn = createButton();
    const cleanup = tooltip('Hidden tooltip')(btn);

    await fireEvent.mouseEnter(btn);
    expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();

    window.dispatchEvent(new Event('tooltip-hide'));

    expect(document.querySelector('[role="tooltip"]')).not.toBeInTheDocument();

    cleanup?.();
  });

  test('does not show tooltip when tooltipHidden is true', async () => {
    window.dispatchEvent(new Event('tooltip-hide'));

    const btn = createButton();
    const cleanup = tooltip('Blocked tooltip')(btn);

    await fireEvent.mouseEnter(btn);
    expect(document.querySelector('[role="tooltip"]')).not.toBeInTheDocument();

    window.dispatchEvent(new Event('tooltip-show'));
    cleanup?.();
  });

  test('does not show tooltip for empty tip', async () => {
    const btn = createButton();
    const cleanup = tooltip('')(btn);

    await fireEvent.mouseEnter(btn);
    expect(document.querySelector('[role="tooltip"]')).not.toBeInTheDocument();

    cleanup?.();
  });

  test('cleanup removes event listeners and tooltip', async () => {
    const btn = createButton();
    const cleanup = tooltip('Cleanup test')(btn);

    await fireEvent.mouseEnter(btn);
    expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();

    cleanup?.();
    expect(document.querySelector('[role="tooltip"]')).not.toBeInTheDocument();
    expect(btn).not.toHaveAttribute('aria-describedby');
  });

  test('each tooltip gets a unique id', async () => {
    const btn1 = createButton('Button 1');
    const btn2 = createButton('Button 2');

    const cleanup1 = tooltip('First')(btn1);
    const cleanup2 = tooltip('Second')(btn2);

    await fireEvent.mouseEnter(btn1);
    await fireEvent.mouseEnter(btn2);

    const tooltips = screen.getAllByRole('tooltip');
    expect(tooltips).toHaveLength(2);
    expect(new Set(tooltips.map(tooltipEl => tooltipEl.id)).size).toBe(2);

    cleanup1?.();
    cleanup2?.();
  });

  test('focusout does not hide when focus moves within the element', async () => {
    const container = document.createElement('div');
    const btn = document.createElement('button');
    btn.textContent = 'Inner button';
    container.appendChild(btn);
    document.body.appendChild(container);

    const cleanup = tooltip('Stay visible')(container);

    await fireEvent.focusIn(container);
    expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();

    await fireEvent.focusOut(container, { relatedTarget: btn });
    expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();

    cleanup?.();
  });
});

describe('tooltip attachment with a getter', () => {
  test('updates the text of a visible tooltip when the tip changes', async () => {
    const { rerender } = render(TooltipAttachmentTestComponent, { tip: 'Update all tags of this image' });
    const btn = screen.getByRole('button', { name: 'trigger' });

    await fireEvent.mouseEnter(btn);
    const tooltipId = screen.getByRole('tooltip').id;

    await rerender({ tip: 'Updating image' });

    const tooltipEl = screen.getByRole('tooltip');
    expect(tooltipEl).toHaveTextContent('Updating image');
    expect(tooltipEl.id).toBe(tooltipId);
    expect(btn).toHaveAttribute('aria-describedby', tooltipId);
  });

  test('hides a visible tooltip when the tip becomes empty', async () => {
    const { rerender } = render(TooltipAttachmentTestComponent, { tip: 'Some tip' });
    const btn = screen.getByRole('button', { name: 'trigger' });

    await fireEvent.mouseEnter(btn);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await rerender({ tip: '' });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(btn).not.toHaveAttribute('aria-describedby');
  });

  test('adds or removes aria-describedby as the tip stops or starts repeating the aria-label', async () => {
    const { rerender } = render(TooltipAttachmentTestComponent, { tip: 'Update Image', ariaLabel: 'Update Image' });
    const btn = screen.getByRole('button', { name: 'Update Image' });

    await fireEvent.mouseEnter(btn);
    expect(btn).not.toHaveAttribute('aria-describedby');

    await rerender({ tip: 'Updating image' });
    expect(btn).toHaveAttribute('aria-describedby', screen.getByRole('tooltip').id);

    await rerender({ tip: 'Update Image' });
    expect(btn).not.toHaveAttribute('aria-describedby');
  });

  test('keeps an aria-describedby re-rendered by the component while the tooltip is shown', async () => {
    const { rerender } = render(TooltipAttachmentTestComponent, { tip: 'Some tip', describedBy: 'err-1' });
    const btn = screen.getByRole('button', { name: 'trigger' });

    await fireEvent.mouseEnter(btn);
    await rerender({ describedBy: 'err-2' });
    await fireEvent.mouseLeave(btn);

    expect(btn).toHaveAttribute('aria-describedby', 'err-2');
  });
});
