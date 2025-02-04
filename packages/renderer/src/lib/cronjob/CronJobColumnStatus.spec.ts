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

import CronJobColumnStatus from './CronJobColumnStatus.svelte';
import type { CronJobUI } from './CronJobUI';

test('Expect cronjob status to be shown', async () => {
  const cronjob: CronJobUI = {
    uid: '123',
    name: 'my-cronjob',
    status: 'RUNNING',
    namespace: '',
    selected: false,
    schedule: '',
    suspended: false,
    lastScheduleTime: new Date(),
    active: 1,
  };
  render(CronJobColumnStatus, { object: cronjob });

  const text = screen.getByRole('status');
  expect(text).toBeInTheDocument();
  expect(text).toHaveClass('bg-[var(--pd-status-running)]');
});
