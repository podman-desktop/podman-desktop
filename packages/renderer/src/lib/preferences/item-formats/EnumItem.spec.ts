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

import type { IConfigurationPropertyRecordedSchema } from '@desktop-framework/api/configuration';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { tick } from 'svelte';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import { initTranslations } from '/@/lib/i18n/translations.svelte';

import EnumItem from './EnumItem.svelte';

beforeAll(() => {
  Object.defineProperty(window, 'getConfigurationValue', { value: vi.fn() });
});

beforeEach(async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({});
  await initTranslations();
});

test('Translate enum labels and accessible description while preserving configuration values', async () => {
  const record: IConfigurationPropertyRecordedSchema = {
    id: 'preferences.appearance',
    title: 'Appearance',
    parentId: 'preferences.appearance',
    description: 'Select a theme',
    enum: ['system', 'dark'],
    enumLabels: ['System', 'Dark'],
  };
  const onChange = vi.fn().mockResolvedValue(undefined);
  render(EnumItem, { record, value: 'system', onChange });
  expect(screen.getByLabelText('Select a theme')).toHaveTextContent('System');

  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({
    'preferences.appearance.description': 'テーマを選択',
    'preferences.appearance.enum.system': 'システム設定に従う',
    'preferences.appearance.enum.dark': 'ダーク',
  });
  await initTranslations();
  await tick();
  const dropdown = screen.getByLabelText('テーマを選択');
  expect(dropdown).toHaveTextContent('システム設定に従う');
  await userEvent.click(screen.getByRole('button', { name: 'システム設定に従う' }));
  await userEvent.click(screen.getByRole('button', { name: 'ダーク' }));
  expect(onChange).toHaveBeenCalledWith('preferences.appearance', 'dark');
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

test('Expect enumLabels to be used as display labels when provided', async () => {
  const record: IConfigurationPropertyRecordedSchema = {
    id: 'record',
    title: 'record',
    parentId: 'parent.record',
    description: 'record-description',
    enum: ['system', 'en', 'ja'],
    enumLabels: ['Follow system language', 'English', '日本語'],
  };

  render(EnumItem, { record, value: 'ja' });
  const input = screen.getByLabelText('record-description');
  expect(input).toBeInTheDocument();
  expect(input).toHaveTextContent('日本語');
});

test('Expect enum value fallback when enumLabels is absent', async () => {
  const record: IConfigurationPropertyRecordedSchema = {
    id: 'record',
    title: 'record',
    parentId: 'parent.record',
    description: 'record-description',
    enum: ['hello', 'world'],
  };

  render(EnumItem, { record, value: 'world' });
  const input = screen.getByLabelText('record-description');
  expect(input).toBeInTheDocument();
  expect(input).toHaveTextContent('world');
});

test('Expect enum value fallback when enumLabels index is out of range', async () => {
  const record: IConfigurationPropertyRecordedSchema = {
    id: 'record',
    title: 'record',
    parentId: 'parent.record',
    description: 'record-description',
    enum: ['hello', 'world'],
    enumLabels: ['hello-label'],
  };

  // 'world' is at index 1, outside enumLabels (length 1): it falls back to the raw enum value
  render(EnumItem, { record, value: 'world' });
  const input = screen.getByLabelText('record-description');
  expect(input).toBeInTheDocument();
  expect(input).toHaveTextContent('world');
});

test('Expect dropdown to be disabled when record.readonly is true', async () => {
  const record: IConfigurationPropertyRecordedSchema = {
    id: 'record',
    title: 'record',
    parentId: 'parent.record',
    description: 'record-description',
    enum: ['hello', 'world'],
    readonly: true,
  };

  render(EnumItem, { record, value: 'hello' });
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expect(button).toBeDisabled();
});

test('Expect dropdown to be disabled when record.locked is true', async () => {
  const record: IConfigurationPropertyRecordedSchema = {
    id: 'record',
    title: 'record',
    parentId: 'parent.record',
    description: 'record-description',
    enum: ['hello', 'world'],
    locked: true,
  };

  render(EnumItem, { record, value: 'hello' });
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expect(button).toBeDisabled();
});
