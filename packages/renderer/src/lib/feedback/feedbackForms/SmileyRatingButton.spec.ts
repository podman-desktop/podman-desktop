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

import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { expect, test, vi } from 'vitest';

import SmileyRatingButton from './SmileyRatingButton.svelte';

test('Expect button to render with given aria-label', async () => {
  render(SmileyRatingButton, {
    rating: 3,
    selectedRating: 0,
    icon: faSmile,
    ariaLabel: 'happy-smiley',
    onSelect: vi.fn(),
  });

  expect(screen.getByRole('button', { name: 'happy-smiley' })).toBeInTheDocument();
});

test('Expect onSelect to be called with the button rating when clicked', async () => {
  const onSelectMock = vi.fn();
  render(SmileyRatingButton, {
    rating: 3,
    selectedRating: 0,
    icon: faSmile,
    ariaLabel: 'happy-smiley',
    onSelect: onSelectMock,
  });

  const button = screen.getByRole('button', { name: 'happy-smiley' });
  await fireEvent.click(button);

  expect(onSelectMock).toHaveBeenCalledWith(3);
});

test('Expect selected styling when selectedRating matches rating', async () => {
  render(SmileyRatingButton, {
    rating: 3,
    selectedRating: 3,
    icon: faSmile,
    ariaLabel: 'happy-smiley',
    onSelect: vi.fn(),
  });

  const button = screen.getByRole('button', { name: 'happy-smiley' });
  expect(button.querySelector('svg')).toHaveClass('text-(--pd-action-button-primary-text)');
});

test('Expect unselected styling when selectedRating does not match rating', async () => {
  render(SmileyRatingButton, {
    rating: 3,
    selectedRating: 1,
    icon: faSmile,
    ariaLabel: 'happy-smiley',
    onSelect: vi.fn(),
  });

  const button = screen.getByRole('button', { name: 'happy-smiley' });
  expect(button.querySelector('svg')).toHaveClass('text-(--pd-button-disabled-text)');
});
