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

import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { goBack, goForward, navigationHistory } from '/@/stores/navigation-history.svelte';

import NavigationButtons from './NavigationButtons.svelte';

vi.mock(import('/@/stores/navigation-history.svelte'));

beforeEach(() => {
  vi.resetAllMocks();

  // Reset navigation history state
  vi.mocked(navigationHistory).stack = [];
  vi.mocked(navigationHistory).index = -1;
});

describe('button states', () => {
  test('back button should be disabled when no history', () => {
    render(NavigationButtons);

    const backButton = screen.getByTitle('Back (hold for history)');
    expect(backButton).toBeDisabled();
  });

  test('forward button should be disabled when no history', () => {
    render(NavigationButtons);

    const forwardButton = screen.getByTitle('Forward (hold for history)');
    expect(forwardButton).toBeDisabled();
  });

  test('back button should be enabled when can go back', () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 1;

    render(NavigationButtons);

    const backButton = screen.getByTitle('Back (hold for history)');
    expect(backButton).toBeEnabled();
  });

  test('forward button should be enabled when can go forward', () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 0;

    render(NavigationButtons);

    const forwardButton = screen.getByTitle('Forward (hold for history)');
    expect(forwardButton).toBeEnabled();
  });
});

describe('click navigation', () => {
  test('clicking back button should call goBack', async () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 1;

    render(NavigationButtons);

    const backButton = screen.getByTitle('Back (hold for history)');
    await fireEvent.click(backButton);

    expect(goBack).toHaveBeenCalled();
  });

  test('clicking forward button should call goForward', async () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 0;

    render(NavigationButtons);

    const forwardButton = screen.getByTitle('Forward (hold for history)');
    await fireEvent.click(forwardButton);

    expect(goForward).toHaveBeenCalled();
  });
});
