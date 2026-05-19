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

test('should render with role="progressbar"', () => {
  render(LinearProgress);
  const progressBar = screen.getByRole('progressbar');
  expect(progressBar).toBeInTheDocument();
});

test('should have correct ARIA attributes for indeterminate mode', () => {
  render(LinearProgress);
  const progressBar = screen.getByRole('progressbar');
  expect(progressBar).toHaveAttribute('aria-valuemin', '0');
  expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  expect(progressBar).not.toHaveAttribute('aria-valuenow');
});

test('should use color-registry background token on outer container', () => {
  const { container } = render(LinearProgress);
  expect(container.children[0]).toHaveClass('bg-(--pd-progressBar-bg)');
});

test('should use color-registry tokens on animated bar', () => {
  render(LinearProgress);
  const progressBar = screen.getByRole('progressbar');
  expect(progressBar).toHaveClass('bg-(--pd-progressBar-in-progress-bg)');
  expect(progressBar).toHaveClass('outline-(--pd-progressBar-in-progress-border)');
});

test('should have full width on outer container', () => {
  const { container } = render(LinearProgress);
  expect(container.children[0]).toHaveClass('w-full');
});

test('should have indeterminate animation class', () => {
  render(LinearProgress);
  const progressBar = screen.getByRole('progressbar');
  expect(progressBar).toHaveClass('linear-progress-indeterminate');
});

test('should have high-contrast guide line element', () => {
  const { container } = render(LinearProgress);
  const outerDiv = container.children[0];
  const hcLine = outerDiv.querySelector('.bg-\\(--pd-progressBar-hc-line-bg\\)');
  expect(hcLine).toBeInTheDocument();
});

test('should propagate class to outer container', () => {
  const { container } = render(LinearProgress, { class: 'custom-class' });
  expect(container.children[0]).toHaveClass('custom-class');
});

test('should propagate aria-label to progressbar element', () => {
  render(LinearProgress, { 'aria-label': 'Loading page' });
  const progressBar = screen.getByRole('progressbar');
  expect(progressBar).toHaveAttribute('aria-label', 'Loading page');
});
