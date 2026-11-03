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

import DashboardHeaderTest from './DashboardHeaderTest.svelte';

test('renders the title as a level 1 heading', () => {
  render(DashboardHeaderTest);

  expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
});

test('renders the actions snippet in the additionalActions group', () => {
  render(DashboardHeaderTest);

  const group = screen.getByRole('group', { name: 'additionalActions' });
  expect(group).toContainElement(screen.getByRole('button', { name: 'edit' }));
  expect(group).toHaveClass('pr-1');
});

test('header row is padded and the title uses the extra-light 27px style', () => {
  render(DashboardHeaderTest);

  expect(screen.getByRole('region', { name: 'header' })).toHaveClass('pt-[9px]', 'pb-[12px]');
  const title = screen.getByRole('heading', { level: 1 });
  expect(title).toHaveClass('font-extralight', 'text-[27px]', 'tracking-[0.03em]', 'select-none');
});
