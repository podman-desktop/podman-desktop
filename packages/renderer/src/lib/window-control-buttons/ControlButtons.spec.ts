/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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
import { describe, expect, test, vi } from 'vitest';

import ControlButtons from './ControlButtons.svelte';

describe.each([{ platform: 'linux' }, { platform: 'win32' }])('Platform($platform)', ({ platform }) => {
  test('Expect all 3 buttons are there', async () => {
    render(ControlButtons, { platform });

    const minimizeButton = screen.getByRole('button', { name: 'Minimize' });
    const maximizeButton = screen.getByRole('button', { name: 'Maximize' });
    const closeButton = screen.getByRole('button', { name: 'Close' });

    expect(minimizeButton).toBeInTheDocument();
    expect(maximizeButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();

    // expect the order of buttons is correct
    expect(minimizeButton.compareDocumentPosition(maximizeButton)).toBe(4);
    expect(maximizeButton.compareDocumentPosition(closeButton)).toBe(4);
    expect(minimizeButton.compareDocumentPosition(closeButton)).toBe(4);
  });

  test('Expect minimize is called', async () => {
    render(ControlButtons, { platform });

    const minimizeButton = screen.getByRole('button', { name: 'Minimize' });
    await fireEvent.click(minimizeButton);
    expect(vi.mocked(window.windowMinimize)).toBeCalled();
  });

  test('Expect maximize is called', async () => {
    render(ControlButtons, { platform });

    const maximizeButton = screen.getByRole('button', { name: 'Maximize' });
    await fireEvent.click(maximizeButton);
    expect(vi.mocked(window.windowMaximize)).toBeCalled();
  });

  test('Expect close is called', async () => {
    render(ControlButtons, { platform });

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await fireEvent.click(closeButton);
    expect(vi.mocked(window.windowClose)).toBeCalled();
  });
});
