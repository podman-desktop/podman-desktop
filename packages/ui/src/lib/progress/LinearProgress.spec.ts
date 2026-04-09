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

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import LinearProgress from './LinearProgress.svelte';

test('should render a progress element', () => {
  render(LinearProgress);
  const progress = screen.getByRole('progressbar');
  expect(progress).toBeInTheDocument();
});

test('should use color-registry text color instead of hardcoded Tailwind color', () => {
  render(LinearProgress);
  const progress = screen.getByRole('progressbar');
  expect(progress).toHaveClass('text-(--pd-progressBar-text)');
  expect(progress).not.toHaveClass('text-purple-500');
});

test('should have full width and correct base classes', () => {
  render(LinearProgress);
  const progress = screen.getByRole('progressbar');
  expect(progress).toHaveClass('w-full');
  expect(progress).toHaveClass('appearance-none');
  expect(progress).toHaveClass('border-none');
  expect(progress).toHaveClass('h-0.5');
  expect(progress).toHaveClass('pure-material-progress-linear');
});
