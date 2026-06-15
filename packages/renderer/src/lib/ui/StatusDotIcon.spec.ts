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
 *********************************************************************/

import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import StatusDotIcon from './StatusDotIcon.svelte';

test('starting status uses the clock icon', () => {
  render(StatusDotIcon, { status: 'starting' });

  const icon = screen.getByRole('img', { name: 'Starting' });
  expect(icon).toBeInTheDocument();
  expect(icon.querySelector('path')?.getAttribute('d')).toContain('2.766 2.766');
});

test('unknown status uses the question mark icon', () => {
  render(StatusDotIcon, { status: 'unknown' });

  const icon = screen.getByRole('img', { name: 'Unknown' });
  expect(icon).toBeInTheDocument();
  expect(icon.querySelector('path')?.getAttribute('d')).toContain('1.365.26');
});
