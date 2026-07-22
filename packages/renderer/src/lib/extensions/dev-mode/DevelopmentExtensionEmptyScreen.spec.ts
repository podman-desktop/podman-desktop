/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';

import DevelopmentExtensionEmptyScreen from './DevelopmentExtensionEmptyScreen.svelte';

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.getExtensionDevelopmentDocsLink).mockResolvedValue(undefined);
});

test('Expect we see the text of the empty screen', async () => {
  render(DevelopmentExtensionEmptyScreen);
  const emptyText = await waitFor(() =>
    screen.getByText('Enable Preferences > Extensions > Development Mode to test local extensions'),
  );
  expect(emptyText).toBeInTheDocument();
});

test('Should not show button when extension development link is not configured', async () => {
  render(DevelopmentExtensionEmptyScreen);

  await waitFor(() => {
    expect(window.getExtensionDevelopmentDocsLink).toHaveBeenCalled();
  });

  const button = screen.queryByRole('button', { name: 'How to write your first extension' });
  expect(button).not.toBeInTheDocument();
});

test('Should show button when extension development link is configured and open correct link when clicked', async () => {
  const testLink = 'https://example.com/docs';
  vi.mocked(window.getExtensionDevelopmentDocsLink).mockResolvedValue(testLink);
  render(DevelopmentExtensionEmptyScreen);

  const button = await waitFor(() => screen.getByRole('button', { name: 'How to write your first extension' }));
  expect(button).toBeInTheDocument();

  await userEvent.click(button);
  expect(window.openExternal).toHaveBeenCalledWith(testLink);
});
