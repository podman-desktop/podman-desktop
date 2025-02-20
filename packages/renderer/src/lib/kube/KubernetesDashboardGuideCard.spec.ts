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

import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import KubernetesDashboardGuideCard from './KubernetesDashboardGuideCard.svelte';

test('Verify basic card format', async () => {
  const title = 'a title';
  render(KubernetesDashboardGuideCard, { title: title, link: 'test', image: '' });

  const titleComp = screen.getByText(title);
  expect(titleComp).toBeInTheDocument();
  expect(titleComp).toHaveClass('text-[var(--pd-content-card-carousel-card-header-text)]');
  expect(titleComp).toHaveClass('text-center');
  expect(titleComp).toHaveClass('font-semibold');

  expect(titleComp.parentElement).toHaveClass('bg-[var(--pd-content-card-carousel-card-bg)]');
  expect(titleComp.parentElement).toHaveClass('hover:bg-[var(--pd-content-card-carousel-card-hover-bg)]');
  expect(titleComp.parentElement).toHaveClass('rounded-md');
  expect(titleComp.parentElement).toHaveClass('items-center');

  const button = screen.getByRole('button', { name: 'Read more' });
  expect(button).toBeInTheDocument();
});

test('Expect clicking works', async () => {
  const params = { title: 'a title', link: 'test-link', image: '' };
  render(KubernetesDashboardGuideCard, params);

  const button = screen.getByRole('button', { name: 'Read more' });
  expect(button).toBeInTheDocument();

  await userEvent.click(button);
  expect(window.openExternal).toHaveBeenCalledWith(params.link);
  expect(window.telemetryTrack).toHaveBeenCalledWith('kubernetes.dashboard.guide', {
    title: params.title,
    link: params.link,
  });
});
