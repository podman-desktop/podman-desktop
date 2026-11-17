/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

/* eslint-disable @typescript-eslint/no-explicit-any */

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';

import { initTranslations } from '/@/lib/i18n/translations.svelte';
import type { EventStoreInfo } from '/@/stores/event-store';

import TroubleshootingPageStoreDetails from './TroubleshootingPageStoreDetails.svelte';

beforeEach(async () => {
  Object.defineProperty(window, 'i18nGetActiveTranslations', {
    value: vi.fn().mockResolvedValue({}),
    configurable: true,
  });
  await initTranslations();
});

test('Check details are displayed and works', async () => {
  const clearEventsMock = vi.fn();
  const fetchMock = vi.fn();
  const closeCallback = vi.fn();

  const bufferEvent = {
    name: 'my-test-event',
    args: [],
    length: 5,
    date: new Date().getTime(),
    skipped: false,
  };

  const eventStoreInfo: EventStoreInfo = {
    name: 'my-test-store',
    size: 3,
    bufferEvents: [bufferEvent],
    clearEvents: clearEventsMock,
    fetch: fetchMock,
  };

  render(TroubleshootingPageStoreDetails, { eventStoreInfo, closeCallback });

  // find the label with name size
  const sizeStatus = screen.getByRole('status', { name: 'size' });
  expect(sizeStatus).toBeInTheDocument();
  // value should be 3
  expect(sizeStatus).toHaveTextContent('3');

  // and check we have buffer events
  const bufferEvents = screen.getByRole('list', { name: 'buffer-events' });
  expect(bufferEvents).toBeInTheDocument();

  // expect to have li item in the list
  const bufferEvent1 = screen.getByRole('listitem', { name: 'my-test-event' });
  expect(bufferEvent1).toBeInTheDocument();
  // now check the text content
  expect(bufferEvent1).toHaveTextContent(`Grab ${bufferEvent.length} items from '${bufferEvent.name}' event`);
});

test('Check close button', async () => {
  const clearEventsMock = vi.fn();
  const fetchMock = vi.fn();
  const closeCallback = vi.fn();

  const eventStoreInfo: EventStoreInfo = {
    name: 'my-test-store',
    size: 3,
    bufferEvents: [],
    clearEvents: clearEventsMock,
    fetch: fetchMock,
  };

  render(TroubleshootingPageStoreDetails, { eventStoreInfo, closeCallback });

  const closeButtons = screen.getAllByRole('button', { name: 'Close' });
  expect(closeButtons.length).toBe(2);

  const primaryCloseButton = closeButtons.find(btn => btn.textContent?.trim() === 'Close');
  expect(primaryCloseButton).toBeDefined();

  expect(closeCallback).not.toBeCalled();
  await fireEvent.click(primaryCloseButton!);
  expect(closeCallback).toBeCalled();
});

test('Check ESC key', async () => {
  const clearEventsMock = vi.fn();
  const fetchMock = vi.fn();
  const closeCallback = vi.fn();

  const eventStoreInfo: EventStoreInfo = {
    name: 'my-test-store',
    size: 3,
    bufferEvents: [],
    clearEvents: clearEventsMock,
    fetch: fetchMock,
  };

  render(TroubleshootingPageStoreDetails, { eventStoreInfo, closeCallback });

  // click on Cancel button and expect close callback to be called
  expect(closeCallback).not.toBeCalled();
  // now, press the ESC key
  await userEvent.keyboard('{Escape}');
  expect(closeCallback).toBeCalled();
});

test('Japanese store details preserve the store name and actions', async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({
    'management.details.title': '{name} の詳細',
    'management.size': 'サイズ',
    'management.refresh': '更新',
    'management.events.empty': 'バッファー内にイベントはありません',
    'management.events.help': 'ストアを更新したイベントを追跡します',
    'management.close': '閉じる',
  });
  await initTranslations();
  const eventStoreInfo: EventStoreInfo = {
    name: 'original-store',
    size: 3,
    bufferEvents: [],
    clearEvents: vi.fn(),
    fetch: vi.fn(),
  };
  const closeCallback = vi.fn();
  render(TroubleshootingPageStoreDetails, { eventStoreInfo, closeCallback });

  screen.getByText('original-store の詳細');
  expect(screen.getByRole('status', { name: 'サイズ' })).toHaveTextContent('3');
  screen.getByText('バッファー内にイベントはありません');
  screen.getByText('ストアを更新したイベントを追跡します');
  await fireEvent.click(screen.getByRole('button', { name: '更新' }));
  expect(eventStoreInfo.fetch).toHaveBeenCalledOnce();
  await fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
  expect(closeCallback).toHaveBeenCalledOnce();
});

test('Japanese event details localize elapsed time and preserve event data', async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({
    'management.events.grab': '{count} 件の項目を取得：',
    'management.events.name': 'イベント「{name}」',
    'management.events.ago': '{duration}前。',
    'management.durationLanguage': 'ja',
    'management.events.took': '所要時間：{duration}。',
  });
  await initTranslations();
  const eventStoreInfo: EventStoreInfo = {
    name: 'original-store',
    size: 3,
    bufferEvents: [
      { name: 'event-{count}', args: [], length: 3, date: Date.now() - 1000, skipped: false, humanDuration: 7 },
    ],
    clearEvents: vi.fn(),
    fetch: vi.fn(),
  };
  render(TroubleshootingPageStoreDetails, { eventStoreInfo, closeCallback: vi.fn() });

  const event = screen.getByRole('listitem', { name: 'event-{count}' });
  expect(event).toHaveTextContent('3 件の項目を取得： イベント「event-{count}」');
  expect(event).toHaveTextContent('1 秒前。');
  expect(event).toHaveTextContent('所要時間：7。');
});
