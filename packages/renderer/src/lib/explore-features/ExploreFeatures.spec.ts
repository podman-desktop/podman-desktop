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

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';

import exploreFeatures from '../../../../main/src/plugin/explore-features/features.json';
import ExploreFeatures from './ExploreFeatures.svelte';

vi.mock('svelte/transition', () => ({
  slide: (): { delay: number; duration: number } => ({
    delay: 0,
    duration: 0,
  }),
  fade: (): { delay: number; duration: number } => ({
    delay: 0,
    duration: 0,
  }),
}));

class ResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

beforeAll(() => {
  global.ResizeObserver = ResizeObserver;
});

beforeEach(() => {
  vi.mocked(window.listFeatures).mockResolvedValue(exploreFeatures.features);
});

afterEach(() => {
  vi.resetAllMocks();
});

test('Explore features carousel shows features', async () => {
  render(ExploreFeatures);

  await vi.waitFor(() => {
    const firstCard = screen.getByText(exploreFeatures.features[0].title);
    expect(firstCard).toBeVisible();
  });
});

test('Carousel does not show when there are 0 features to show', async () => {
  vi.mocked(window.listFeatures).mockResolvedValue([{ ...exploreFeatures.features[0], show: false }]);

  render(ExploreFeatures);
  await tick();

  const title = screen.queryByText('Explore Features');

  expect(title).not.toBeInTheDocument();
});

test('Clicking on ExploreFeatures title hides carousel with features', async () => {
  render(ExploreFeatures);
  await tick();

  await vi.waitFor(() => {
    const firstCard = screen.getByText(exploreFeatures.features[0].title);
    expect(firstCard).toBeVisible();
  });

  const button = screen.getByRole('button', { name: 'Explore Features' });
  expect(button).toBeInTheDocument();
  expect(screen.queryByText(exploreFeatures.features[0].title)).toBeInTheDocument();
  await fireEvent.click(button);
  await vi.waitFor(() => {
    expect(screen.queryByText(exploreFeatures.features[0].title)).not.toBeInTheDocument();
  });
});

test('Toggling expansion updates configuration value for expanded state', async () => {
  render(ExploreFeatures);

  await vi.waitFor(() => {
    const carouselTitle = screen.getByText('Explore Features');
    expect(carouselTitle).toBeVisible();
  });

  expect(vi.mocked(window.updateConfigurationValue)).not.toHaveBeenCalled();

  const button = screen.getByRole('button', { name: 'Explore Features' });
  expect(button).toBeInTheDocument();
  await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'true'));

  await fireEvent.click(button);
  expect(vi.mocked(window.updateConfigurationValue)).toHaveBeenCalledWith('exploreFeatures.expanded', false);
  await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'false'));

  await fireEvent.click(button);
  expect(vi.mocked(window.updateConfigurationValue)).toHaveBeenCalledWith('exploreFeatures.expanded', true);
  expect(button).toHaveAttribute('aria-expanded', 'true');
});

test('Expanded when the config value not set', async () => {
  render(ExploreFeatures);
  await vi.waitFor(() => {
    const carouselTitle = screen.getByText('Explore Features');
    expect(carouselTitle).toBeVisible();
  });

  const button = screen.getByRole('button', { name: 'Explore Features' });
  expect(button).toHaveAttribute('aria-expanded', 'true');
});

test.each([true, false])('Carousel aria-expanded value set to returned config value', async expanded => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(expanded);
  render(ExploreFeatures);
  await vi.waitFor(() => {
    const carouselTitle = screen.getByText('Explore Features');
    expect(carouselTitle).toBeVisible();
  });

  await waitFor(() => expect(vi.mocked(window.getConfigurationValue)).toBeCalled());

  const button = screen.getByRole('button', { name: 'Explore Features' });
  expect(button).toHaveAttribute('aria-expanded', `${expanded}`);
});

test('When a feature card is closed, it is removed from the carousel', async () => {
  render(ExploreFeatures);
  await vi.waitFor(() => {
    const carouselTitle = screen.getByText('Explore Features');
    expect(carouselTitle).toBeVisible();
  });

  const closeButtons = screen.getAllByRole('button', { name: 'Close' });
  await fireEvent.click(closeButtons[0]);

  await tick();

  expect(screen.getAllByRole('button', { name: 'Close' }).length).toBe(closeButtons.length - 1);
});
