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

import type { IConfigurationPropertyRecordedSchema } from '@desktop-framework/api/configuration';
import { beforeEach, expect, test, vi } from 'vitest';

import { initTranslations } from '/@/lib/i18n/translations.svelte';

import { checkNumericValueValid } from './NumberItemUtils';

beforeEach(async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({});
  await initTranslations();
});

test.each([
  [NaN, '数値を入力してください。値は1以上、34以下である必要があります'],
  [0, '値は1以上である必要があります'],
  [35, '値は34以下である必要があります'],
])('Japanese numeric validation preserves the bounds for %s', async (value, error) => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({
    'settings.number.expectedRange': '数値を入力してください。値は{minimum}以上、{maximum}以下である必要があります',
    'settings.number.expectedMinimum': '数値を入力してください。値は{minimum}以上である必要があります',
    'settings.number.minimum': '値は{minimum}以上である必要があります',
    'settings.number.maximum': '値は{maximum}以下である必要があります',
  });
  await initTranslations();
  expect(
    checkNumericValueValid(
      { id: 'record', title: 'record', parentId: '', type: 'number', minimum: 1, maximum: 34 },
      value,
    ),
  ).toEqual({ valid: false, error });
});

test('Expect an error message if value input is NaN', async () => {
  const record: IConfigurationPropertyRecordedSchema = {
    id: 'record',
    title: 'record',
    parentId: 'parent.record',
    description: 'record-description',
    type: 'number',
    minimum: 1,
    maximum: 34,
  };
  const value = Number('unknown');

  const numericValueValid = checkNumericValueValid(record, value);
  expect(numericValueValid.valid).toBeFalsy();
  expect(numericValueValid.error).toBeDefined();
  expect(numericValueValid.error).toEqual(
    `Expecting a number. The value cannot be less than ${record.minimum}${
      record.maximum ? ` or greater than ${record.maximum}` : ''
    }`,
  );
});

test('Expect an error message if value input is above the upper range', async () => {
  const record: IConfigurationPropertyRecordedSchema = {
    id: 'record',
    title: 'record',
    parentId: 'parent.record',
    description: 'record-description',
    type: 'number',
    minimum: 1,
    maximum: 34,
  };
  const value = 40;

  const numericValueValid = checkNumericValueValid(record, value);
  expect(numericValueValid.valid).toBeFalsy();
  expect(numericValueValid.error).toBeDefined();
  expect(numericValueValid.error).toEqual(`The value cannot be greater than ${record.maximum}`);
});

test('Expect an error message if value input is below the lower range', async () => {
  const record: IConfigurationPropertyRecordedSchema = {
    id: 'record',
    title: 'record',
    parentId: 'parent.record',
    description: 'record-description',
    type: 'number',
    minimum: 1,
    maximum: 34,
  };
  const value = 0;

  const numericValueValid = checkNumericValueValid(record, value);
  expect(numericValueValid.valid).toBeFalsy();
  expect(numericValueValid.error).toBeDefined();
  expect(numericValueValid.error).toEqual(`The value cannot be less than ${record.minimum}`);
});

test('Expect no error if value input is valid', async () => {
  const record: IConfigurationPropertyRecordedSchema = {
    id: 'record',
    title: 'record',
    parentId: 'parent.record',
    description: 'record-description',
    type: 'number',
    minimum: 1,
    maximum: 34,
  };
  const value = 2;

  const numericValueValid = checkNumericValueValid(record, value);
  expect(numericValueValid.valid).toBeTruthy();
  expect(numericValueValid.error).toBeUndefined();
});
