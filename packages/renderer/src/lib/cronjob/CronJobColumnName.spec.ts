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

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import CronJobColumnName from './CronJobColumnName.svelte';
import type { CronJobUI } from './CronJobUI';

const cronjob: CronJobUI = {
  uid: '123',
  name: 'my-cronjob',
  status: 'RUNNING',
  namespace: 'foobar',
  selected: false,
  schedule: '',
  suspended: false,
  lastScheduleTime: new Date(),
  active: 1,
};

test('Expect simple column styling', async () => {
  render(CronJobColumnName, { object: JSON.parse(JSON.stringify(cronjob)) });

  const text = screen.getByText(cronjob.name);
  expect(text).toBeInTheDocument();
  expect(text).toHaveClass('text-[var(--pd-table-body-text-highlight)]');
});

test('Expect to show namespace in column', async () => {
  render(CronJobColumnName, { object: JSON.parse(JSON.stringify(cronjob)) });

  const text = screen.getByText(cronjob.namespace);
  expect(text).toBeInTheDocument();
});
