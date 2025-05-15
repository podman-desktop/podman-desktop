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

import { beforeEach, expect, test, vi } from 'vitest';

import type { IConfigurationPropertyRecordedSchema } from '../../../main/src/plugin/configuration-registry';
import { configurationProperties } from './configurationProperties';
import {
  canBeOpened,
  feedbackFormNotifications,
  formatName,
  remindLater,
  type RemindOption,
  setupFeedback,
  updateNotifyAtDate,
} from './feedbackForm';

const configurationProperty1: IConfigurationPropertyRecordedSchema = {
  title: 'property1',
  id: 'property1',
  parentId: 'preferences.myExtensionId.hello',
  scope: 'DEFAULT',
  experimental: {
    githubDiscussionLink: 'https://example.com',
  },
};

const configurationProperty2: IConfigurationPropertyRecordedSchema = {
  title: 'property2',
  id: 'property2',
  parentId: 'preferences.myExtensionId.hello',
  scope: 'DEFAULT',
  experimental: {
    githubDiscussionLink: 'https://example.com',
  },
};

const configurationProperty3: IConfigurationPropertyRecordedSchema = {
  title: 'property3',
  id: 'property3',
  parentId: 'preferences.myExtensionId.hello',
  scope: 'DEFAULT',
};

beforeEach(() => {
  vi.resetAllMocks();
  Object.defineProperty(global, 'window', {
    value: {
      getConfigurationValue: vi.fn(),
    },
    writable: true,
  });
  vi.mocked(window.getConfigurationValue<boolean>).mockResolvedValue(true);
  vi.mocked(window.getConfigurationValue<boolean>).mockResolvedValueOnce(false);
  configurationProperties.set([configurationProperty1, configurationProperty2, configurationProperty3]);
});

test('setupFeedback', () => {
  setupFeedback();
  expect(feedbackFormNotifications).toContain({
    id: configurationProperty1.title,
    notifyAtDate: undefined,
    featureDisabled: false,
    wasOpened: false,
  });

  expect(feedbackFormNotifications).toContain({
    id: configurationProperty2.title,
    notifyAtDate: undefined,
    featureDisabled: true,
    wasOpened: false,
  });
});

test('formatName', () => {
  expect(formatName('extension.foo')).toBe('Extensionfoo');
  expect(formatName('extension.Foo')).toBe('Extension Foo');
  expect(formatName('extension.FooBar')).toBe('Extension Foo Bar');
});

test('updateNotifyAtDate to be called with undefined', () => {
  updateNotifyAtDate('property1', undefined);

  expect().toBeCalledWith('property1', expect.objectContaining({ notifyAtDate: undefined, wasOpened: true }));
});

test('updateNotifyAtDate to be called with date', () => {
  const date = new Date();
  updateNotifyAtDate('property1', date);

  expect().toBeCalledWith('property1', expect.objectContaining({ notifyAtDate: date, wasOpened: true }));
});

test.each([
  { remindOption: 'Remind me tomorrow', days: 1 },
  { remindOption: 'Remind me in 2 days', days: 2 },
  { remindOption: `Don't show again`, days: undefined },
])('remindLater %s', ({ remindOption, days }) => {
  vi.mocked(updateNotifyAtDate).mockImplementation(vi.fn());
  remindLater('property1', remindOption as RemindOption);

  let expectedDate: Date | undefined = undefined;
  if (typeof days === 'number') {
    expectedDate = new Date();
    expectedDate.setHours(0, 0, 0, 0);
    expectedDate.setDate(expectedDate.getDate() + days);
  }

  expect(vi.mocked(updateNotifyAtDate)).toBeCalledWith('property1', expectedDate);
});

test.each([
  {
    feedbackNotfication: { id: 'property1', notifyAtDate: undefined, featureDisabled: true, wasOpenned: false },
    result: false,
  },
  {
    feedbackNotfication: { id: 'property1', notifyAtDate: undefined, featureDisabled: false, wasOpenned: false },
    result: true,
  },
  {
    feedbackNotfication: { id: 'property1', notifyAtDate: undefined, featureDisabled: false, wasOpenned: true },
    result: false,
  },
  {
    feedbackNotfication: {
      id: 'property1',
      notifyAtDate: new Date().setDate(new Date().getDate() - 42),
      featureDisabled: false,
      wasOpenned: true,
    },
    result: false,
  },
  {
    feedbackNotfication: {
      id: 'property1',
      notifyAtDate: new Date().setDate(new Date().getDate() + 42),
      featureDisabled: false,
      wasOpenned: true,
    },
    result: true,
  },
])('canBeOpenned %s', ({ feedbackNotfication, result }) => {
  feedbackFormNotifications.set('property1', feedbackNotfication);

  expect(canBeOpened).toBe(result);
});
