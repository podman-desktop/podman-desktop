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

import { beforeEach, expect, test, vi } from 'vitest';

import { initTranslations, t } from '/@/lib/i18n/translations.svelte';

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({});
});

// must run first: it is the first initTranslations call that registers the event listener
test('Expect language updates pushed by main to replace the active translations', async () => {
  await initTranslations();

  const receiveCall = vi.mocked(window.events.receive).mock.calls.find(call => call[0] === 'i18n-updated');
  expect(receiveCall).toBeDefined();
  const listener = receiveCall?.[1] as (data: unknown) => void;

  listener({ 'b.description': 'Bの訳' });
  expect(t('b.description')).toBe('Bの訳');
});

test('Expect initTranslations to fetch the active translations', async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({ 'a.description': 'Aの訳' });

  await initTranslations();

  expect(window.i18nGetActiveTranslations).toHaveBeenCalled();
  expect(t('a.description')).toBe('Aの訳');
});

test('Expect missing keys to return undefined', async () => {
  await initTranslations();

  expect(t('unknown.key')).toBeUndefined();
});

test('Expect named parameters to preserve Japanese word order and zero counts', async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({
    'selection.description': '{name}：{count}件を選択（合計{count}件）',
  });
  await initTranslations();

  expect(t('selection.description', { name: 'コンテナー', count: 0 })).toBe('コンテナー：0件を選択（合計0件）');
});

test('Expect parameter values to remain literal and unknown placeholders to remain unchanged', async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({
    'selection.description': '{name}：{count}件 {unknown} {toString}',
  });
  await initTranslations();

  expect(t('selection.description', { name: '$& {count}', count: 2 })).toBe('$& {count}：2件 {unknown} {toString}');
  expect(t('selection.description')).toBe('{name}：{count}件 {unknown} {toString}');
  expect(t('unknown.key', { count: 2 })).toBeUndefined();
});

test('Expect a failing fetch to keep the previous translations instead of throwing', async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({ 'keep.description': '保持' });
  await initTranslations();

  vi.mocked(window.i18nGetActiveTranslations).mockRejectedValue(new Error('ipc failure'));
  await initTranslations();

  expect(t('keep.description')).toBe('保持');
});
