/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import CarouselTest from './CarouselTest.svelte';

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

let callback: ResizeObserverCallback;

class ResizeObserver {
  constructor(callback1: ResizeObserverCallback) {
    callback = callback1;
  }

  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

beforeAll(() => {
  Object.defineProperty(window, 'ResizeObserver', { value: ResizeObserver });
});

beforeEach(() => {
  vi.resetAllMocks();
});

test('carousel cards get visible when size permits', async () => {
  render(CarouselTest);
  const card1 = screen.getByText('card 1');
  expect(card1).toBeVisible();

  // Initially all cards are in DOM but may not be visible due to overflow
  const allCards = screen.getAllByText(/card [1-3]/);
  expect(allCards.length).toBe(3);

  // With narrow width, only card 1 should be fully visible in the viewport
  callback([{ contentRect: { width: 360 } }] as ResizeObserverEntry[], new ResizeObserver(callback));

  await waitFor(() => {
    const card1 = screen.getByText('card 1');
    expect(card1).toBeVisible();
  });

  // With wider width, card 2 should also become visible
  callback([{ contentRect: { width: 720 } }] as ResizeObserverEntry[], new ResizeObserver(callback));

  await waitFor(() => {
    const card2 = screen.getByText('card 2');
    expect(card2).toBeVisible();
  });

  // With even wider width, all cards should be visible
  callback([{ contentRect: { width: 1080 } }] as ResizeObserverEntry[], new ResizeObserver(callback));

  await waitFor(() => {
    const card3 = screen.getByText('card 3');
    expect(card3).toBeVisible();
  });
});

test('scroll left button scrolls to show previous cards', async () => {
  render(CarouselTest);

  // Set narrow width so we can scroll
  callback([{ contentRect: { width: 360 } }] as ResizeObserverEntry[], new ResizeObserver(callback));

  // First scroll right to get to a position where we can scroll left
  const right = screen.getByRole('button', { name: 'Scroll right' });
  await fireEvent.click(right);

  // Now test scrolling left
  const left = screen.getByRole('button', { name: 'Scroll left' });
  await fireEvent.click(left);

  // Should return to showing first card
  await waitFor(() => {
    const card1 = screen.getByText('card 1');
    expect(card1).toBeVisible();
  });
});

test('scroll right button scrolls to show next cards', async () => {
  render(CarouselTest);

  // Set narrow width so we can scroll
  callback([{ contentRect: { width: 360 } }] as ResizeObserverEntry[], new ResizeObserver(callback));

  const card1 = screen.getByText('card 1');
  expect(card1).toBeVisible();

  const right = screen.getByRole('button', { name: 'Scroll right' });
  await fireEvent.click(right);

  // After scrolling right, card 2 should become visible
  await waitFor(() => {
    const card2 = screen.getByText('card 2');
    expect(card2).toBeVisible();
  });
});

test('carousel left and right buttons visibility based on scroll state', async () => {
  render(CarouselTest);

  // Set narrow width so scrolling is needed
  callback([{ contentRect: { width: 360 } }] as ResizeObserverEntry[], new ResizeObserver(callback));

  const left = screen.getByRole('button', { name: 'Scroll left' });
  const right = screen.getByRole('button', { name: 'Scroll right' });

  // Initially at start position, left should be invisible/disabled, right should be visible
  await waitFor(() => {
    expect(left).toHaveClass('opacity-0');
    expect(left).toHaveClass('pointer-events-none');
    expect(right).toHaveClass('opacity-100');
    expect(right).not.toHaveClass('pointer-events-none');
  });

  // Make container wide enough to fit all cards
  callback([{ contentRect: { width: 1080 } }] as ResizeObserverEntry[], new ResizeObserver(callback));

  await waitFor(() => {
    const card1 = screen.getByText('card 1');
    expect(card1).toBeVisible();
    const card2 = screen.getByText('card 2');
    expect(card2).toBeVisible();
    const card3 = screen.getByText('card 3');
    expect(card3).toBeVisible();
  });

  // When all cards fit, both buttons should be invisible/disabled
  await waitFor(() => {
    expect(left).toHaveClass('opacity-0');
    expect(left).toHaveClass('pointer-events-none');
    expect(right).toHaveClass('opacity-0');
    expect(right).toHaveClass('pointer-events-none');
  });
});

test('left and right buttons have hover class', async () => {
  render(CarouselTest);

  // Set narrow width so buttons are visible
  callback([{ contentRect: { width: 360 } }] as ResizeObserverEntry[], new ResizeObserver(callback));

  const left = screen.getByRole('button', { name: 'Scroll left' });
  const right = screen.getByRole('button', { name: 'Scroll right' });

  // Check that the inner div elements have hover classes
  const leftInnerDiv = left.querySelector('div');
  const rightInnerDiv = right.querySelector('div');

  expect(leftInnerDiv).toHaveClass(/hover:bg-/);
  expect(rightInnerDiv).toHaveClass(/hover:bg-/);
});

test('horizontal wheel event scrolls carousel horizontally', async () => {
  render(CarouselTest);

  // Set narrow width so scrolling is needed
  callback([{ contentRect: { width: 360 } }] as ResizeObserverEntry[], new ResizeObserver(callback));

  // Find the carousel container by its aria-label
  const carousel = screen.getByLabelText('Carousel container');

  // Mock horizontal wheel event scrolling right (should scroll right in carousel)
  await fireEvent.wheel(carousel, { deltaX: 100, deltaY: 0 });

  await waitFor(() => {
    const card2 = screen.getByText('card 2');
    expect(card2).toBeVisible();
  });

  // Mock horizontal wheel event scrolling left (should scroll left in carousel)
  await fireEvent.wheel(carousel, { deltaX: -100, deltaY: 0 });

  await waitFor(() => {
    const card1 = screen.getByText('card 1');
    expect(card1).toBeVisible();
  });
});

test('mouse drag scrolls carousel', async () => {
  render(CarouselTest);

  // Set narrow width so scrolling is needed
  callback([{ contentRect: { width: 360 } }] as ResizeObserverEntry[], new ResizeObserver(callback));

  // Find the carousel container by its aria-label
  const carousel = screen.getByLabelText('Carousel container');

  // Start drag
  await fireEvent.mouseDown(carousel, { clientX: 100 });

  // Drag to the left (should scroll right in carousel)
  await fireEvent.mouseMove(document, { clientX: 50 });

  // End drag
  await fireEvent.mouseUp(document);

  await waitFor(() => {
    const card2 = screen.getByText('card 2');
    expect(card2).toBeVisible();
  });
});

test('scroll position management maintains proper bounds', async () => {
  render(CarouselTest);

  // Set narrow width so scrolling is needed
  callback([{ contentRect: { width: 360 } }] as ResizeObserverEntry[], new ResizeObserver(callback));

  const right = screen.getByRole('button', { name: 'Scroll right' });
  const left = screen.getByRole('button', { name: 'Scroll left' });

  // Scroll to the right multiple times
  await fireEvent.click(right);
  await fireEvent.click(right);
  await fireEvent.click(right);

  // Should show last card
  await waitFor(() => {
    const card3 = screen.getByText('card 3');
    expect(card3).toBeVisible();
  });

  // Right button should be disabled at max scroll
  await waitFor(() => {
    expect(right).toHaveClass('opacity-0');
    expect(right).toHaveClass('pointer-events-none');
  });

  // Scroll back to start
  await fireEvent.click(left);
  await fireEvent.click(left);
  await fireEvent.click(left);

  // Should show first card
  await waitFor(() => {
    const card1 = screen.getByText('card 1');
    expect(card1).toBeVisible();
  });

  // Left button should be disabled at min scroll
  await waitFor(() => {
    expect(left).toHaveClass('opacity-0');
    expect(left).toHaveClass('pointer-events-none');
  });
});

test('carousel prevents horizontal wheel event default behavior', async () => {
  render(CarouselTest);

  // Set narrow width so scrolling is needed
  callback([{ contentRect: { width: 360 } }] as ResizeObserverEntry[], new ResizeObserver(callback));

  const carousel = screen.getByLabelText('Carousel container');

  // Create a horizontal wheel event with preventDefault method
  const wheelEvent = new WheelEvent('wheel', { deltaX: 100, deltaY: 0 });
  const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault');

  // Trigger wheel event
  carousel.dispatchEvent(wheelEvent);

  expect(preventDefaultSpy).toHaveBeenCalled();
});

test('carousel does not prevent vertical wheel event default behavior', async () => {
  render(CarouselTest);

  // Set narrow width so scrolling is needed
  callback([{ contentRect: { width: 360 } }] as ResizeObserverEntry[], new ResizeObserver(callback));

  const carousel = screen.getByLabelText('Carousel container');

  // Create a vertical wheel event with preventDefault method
  const wheelEvent = new WheelEvent('wheel', { deltaX: 0, deltaY: 100 });
  const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault');

  // Trigger wheel event
  carousel.dispatchEvent(wheelEvent);

  // Vertical scroll should NOT prevent default behavior
  expect(preventDefaultSpy).not.toHaveBeenCalled();

  // Verify that card 1 is still visible (carousel shouldn't have scrolled)
  await waitFor(() => {
    const card1 = screen.getByText('card 1');
    expect(card1).toBeVisible();
  });
});
