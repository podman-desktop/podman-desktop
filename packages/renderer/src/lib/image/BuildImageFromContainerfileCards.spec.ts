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

import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeAll, expect, test, vi } from 'vitest';

import BuildImageFromContainerfileCards from './BuildImageFromContainerfileCards.svelte';

// fake the window.events object
beforeAll(() => {
  (window.events as unknown) = {
    receive: (_channel: string, func: () => void): void => {
      func();
    },
  };
});

test('check default on arm64', async () => {
  vi.mocked(window.getOsArch).mockResolvedValue('arm64');

  const platforms = '';
  render(BuildImageFromContainerfileCards, {
    platforms,
  });

  await tick();
  await tick();
  const button = screen.getByRole('button', { name: 'linux/arm64' });
  expect(button).toBeInTheDocument();

  const tooltipTrigger = screen.getByTestId('tooltip-trigger');
  expect(tooltipTrigger).toBeInTheDocument();
  await fireEvent.mouseEnter(tooltipTrigger);

  const tooltip = await screen.findByText('Default platform of your computer');
  expect(tooltip).toBeInTheDocument();
});

test('check default on amd64', async () => {
  vi.mocked(window.getOsArch).mockResolvedValue('x64');

  const platforms = '';
  render(BuildImageFromContainerfileCards, {
    platforms,
  });

  await tick();
  await tick();
  const button = screen.getByRole('button', { name: 'linux/amd64' });
  expect(button).toBeInTheDocument();

  const tooltipTrigger = screen.getByTestId('tooltip-trigger');
  expect(tooltipTrigger).toBeInTheDocument();
  await fireEvent.mouseEnter(tooltipTrigger);

  const tooltip = await screen.findByText('Default platform of your computer');
  expect(tooltip).toBeInTheDocument();
});
