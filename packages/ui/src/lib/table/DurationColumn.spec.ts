/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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

import DurationColumn from './DurationColumn.svelte';

test('Expect simple column styling', async () => {
  // pick a date an hour ago
  const date = new Date();
  date.setTime(date.getTime() - 3_600_000);
  render(DurationColumn, { object: date });

  const text = screen.getByText('1 hour');
  expect(text).toBeInTheDocument();
  expect(text).toHaveClass('text-[var(--pd-table-body-text)]');
});

test('Expect 2s refresh on values less than a minute', async () => {
  const { component } = render(DurationColumn, { object: undefined });
  expect(component.computeInterval(500)).toEqual(2_000);
});

test('Expect 2s refresh on values less than a minute (2)', async () => {
  const { component } = render(DurationColumn, { object: undefined });
  expect(component.computeInterval(53_400)).toEqual(2_000);
});

test('Expect to refresh 59.9s on next minute', async () => {
  const { component } = render(DurationColumn, { object: undefined });
  // 59.999s = should refresh in 1ms
  expect(component.computeInterval(59_999)).toEqual(1);
});

test('Expect to refresh 60s on next minute', async () => {
  const { component } = render(DurationColumn, { object: undefined });
  // 60s = 1m - should refresh in 1m
  expect(component.computeInterval(60_000)).toEqual(60_000);
});

test('Expect to refresh 61s on next minute', async () => {
  const { component } = render(DurationColumn, { object: undefined });
  // 61s = 1m1s - should refresh in 59s
  expect(component.computeInterval(61_000)).toEqual(59_000);
});

test('Expect to refresh 89s on next minute', async () => {
  const { component } = render(DurationColumn, { object: undefined });
  // 89s = 1m19s - should refresh in 31s (at 2m)
  expect(component.computeInterval(89_000)).toEqual(31_000);
});

test('Expect to refresh 1h on next hour', async () => {
  const { component } = render(DurationColumn, { object: undefined });
  // 362s = 1h2s - should refresh in 58m (at 2h)
  expect(component.computeInterval(3_600_000)).toEqual(60 * 60_000);
});

test('Expect to refresh 3h25m on next hour', async () => {
  const { component } = render(DurationColumn, { object: undefined });
  // 3h25m - should refresh in 35m (at 4h)
  expect(component.computeInterval(12_300_000)).toEqual(2_100_000);
});

test('Expect to refresh 1d on next day', async () => {
  const { component } = render(DurationColumn, { object: undefined });
  expect(component.computeInterval(86_400_000)).toEqual(86_400_000);
});

test('Expect to refresh 1d1m on next day', async () => {
  const { component } = render(DurationColumn, { object: undefined });
  expect(component.computeInterval(86_460_000)).toEqual(86_340_000);
});
