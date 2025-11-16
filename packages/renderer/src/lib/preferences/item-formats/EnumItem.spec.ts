/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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
import { beforeAll, expect, test, vi } from 'vitest';

import type { IConfigurationPropertyRecordedSchema } from '/@api/configuration/models';

import EnumItem from './EnumItem.svelte';

beforeAll(() => {
  Object.defineProperty(window, 'getConfigurationValue', { value: vi.fn() });
});

test('Enum without default', async () => {
  const record: IConfigurationPropertyRecordedSchema = {
    id: 'record',
    title: 'record',
    parentId: 'parent.record',
    description: 'record-description',
    enum: ['hello', 'world'],
  };

  render(EnumItem, { record, value: undefined });
  const input = screen.getByLabelText('record-description');
  expect(input).toBeInTheDocument();
  expect(input).toHaveTextContent('hello');
});

test('Enum with default', async () => {
  const record: IConfigurationPropertyRecordedSchema & { default: string } = {
    id: 'record',
    title: 'record',
    parentId: 'parent.record',
    description: 'record-description',
    enum: ['hello', 'world'],
    default: 'world',
  };

  render(EnumItem, { record, value: record.default });
  const input = screen.getByLabelText('record-description');
  expect(input).toBeInTheDocument();
  expect(input).toHaveTextContent('world');
});

test('EnumItem is disabled when disabled prop is true', async () => {
  const record: IConfigurationPropertyRecordedSchema = {
    id: 'record',
    title: 'record',
    parentId: 'parent.record',
    description: 'record-description',
    enum: ['hello', 'world'],
  };

  const onChange = vi.fn();
  render(EnumItem, { record, value: 'hello', disabled: true, onChange });
  const dropdown = screen.getByLabelText('record-description');
  expect(dropdown).toBeInTheDocument();

  // Verify the dropdown shows disabled styling (readonly border)
  expect(dropdown.className).toContain('border-b-[var(--pd-input-field-stroke-readonly)]');

  // Verify onChange is not called
  expect(onChange).not.toHaveBeenCalled();
});
