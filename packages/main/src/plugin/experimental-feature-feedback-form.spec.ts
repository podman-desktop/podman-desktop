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

import type { Configuration } from '@podman-desktop/api';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { IConfigurationPropertyRecordedSchema } from '/@api/configuration/models.js';

import type { ConfigurationRegistry } from './configuration-registry.js';
import type { Timestamp } from './experimental-feature-feedback-form.js';
import { ExperimentalFeatureFeedbackForm } from './experimental-feature-feedback-form.js';

vi.mock('electron', () => ({
  shell: {
    openExternal: vi.fn().mockResolvedValue(undefined),
  },
}));

const features: Record<string, IConfigurationPropertyRecordedSchema> = {
  'feat.feature1': {
    title: 'feat.feature1',
    parentId: 'parent1',
    experimental: { githubDiscussionLink: 'https://feature.link.1.com' },
  },
  'feat.feature2': {
    title: 'feat.feature2',
    parentId: 'parent2',
    experimental: { githubDiscussionLink: 'https://feature.link.2.com' },
  },
  'feat.feature3': {
    title: 'feat.feature3',
    parentId: 'parent3',
    experimental: { githubDiscussionLink: 'https://feature.link.3.com' },
  },
  feature4: { title: 'feat.feature3', parentId: 'parent3' },
};

const configurationRegistry: ConfigurationRegistry = {
  onDidChangeConfiguration: vi.fn(),
  registerConfigurations: vi.fn(),
  getConfigurationProperties: vi.fn(),
  getConfiguration: vi.fn(),
} as unknown as ConfigurationRegistry;

const configurationGetMock = vi.fn();

const configuration: Configuration = {
  get: configurationGetMock,
  has: () => true,
  update: () => Promise.resolve(),
};

class TestExperimentalFeatureFeedbackForm extends ExperimentalFeatureFeedbackForm {
  override timestamps: Map<string, Timestamp> = new Map<string, Timestamp>();
  override disabled: string[] = [];
  override experimentalFeatures: Set<string> = new Set<string>();

  override setTimestamp(feature: string, days: Timestamp): void {
    return super.setTimestamp(feature, days);
  }

  override setReminder(configurationName: string): void {
    return super.setReminder(configurationName);
  }

  override formatName(id: string): string {
    return super.formatName(id);
  }

  override async save(id: string): Promise<void> {
    return super.save(id);
  }

  override disableFeature(id: string): void {
    return super.disableFeature(id);
  }

  override init(): Promise<void> {
    return super.init();
  }
}

const setReminderSpy = vi.spyOn(TestExperimentalFeatureFeedbackForm.prototype, 'setReminder');
const setTimestampSpy = vi.spyOn(TestExperimentalFeatureFeedbackForm.prototype, 'setTimestamp');

let feedbackForm: TestExperimentalFeatureFeedbackForm;
beforeEach(() => {
  vi.resetAllMocks();
  feedbackForm = new TestExperimentalFeatureFeedbackForm(configurationRegistry);

  vi.spyOn(feedbackForm, 'save').mockImplementation(() => {
    return Promise.resolve();
  });
});

describe('init', () => {
  test('should setup reminders on first run when no timestamps exist', async () => {
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    await feedbackForm.init();

    expect(setReminderSpy).toHaveBeenCalledTimes(3);
    expect(setReminderSpy).toHaveBeenCalledWith('feat.feature1');
    expect(setReminderSpy).toHaveBeenCalledWith('feat.feature2');
    expect(setReminderSpy).toHaveBeenCalledWith('feat.feature3');
  });

  test('should load existing timestamps and show dialog', async () => {
    const conf = { remindAt: 123456, disabled: false };
    configurationGetMock.mockReturnValue(conf);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);

    await feedbackForm.init();

    expect(setReminderSpy).not.toHaveBeenCalled();

    expect(feedbackForm.timestamps.get('feat.feature1')).toBe(123456);
  });
});

describe('setTimestamp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should set timestamp when days are defined', () => {
    const MOCK_NOW = new Date('2025-01-01T12:00:00.000Z');
    vi.setSystemTime(MOCK_NOW);

    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);

    const setSpy = vi.spyOn(feedbackForm.timestamps, 'set');

    const days = 42;
    const expectedTimestamp = new Date(MOCK_NOW.getTime() + days * 24 * 60 * 60 * 1_000).getTime();

    feedbackForm.setTimestamp('feature1', days);

    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith('feature1', expectedTimestamp);
  });

  test('should set timestamp when days are not defined', () => {
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);

    feedbackForm.setTimestamp('feature1', undefined);

    expect(setTimestampSpy).toHaveBeenCalledTimes(1);
    expect(setTimestampSpy).toHaveBeenCalledWith('feature1', undefined);
  });
});

describe('setReminder', () => {
  test('feature is defined in configurationRegistry', () => {
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    configurationGetMock.mockReturnValue(true);

    feedbackForm.setReminder('feat.feature1');
    expect(setTimestampSpy).toBeCalledWith('feat.feature1', 2);
  });

  test('feature is not defined in configurationRegistry', () => {
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    configurationGetMock.mockReturnValue(false);

    const setTimestampSpy = vi.spyOn(feedbackForm, 'setTimestamp');
    feedbackForm.setReminder('feat.feature42');
    expect(setTimestampSpy).toBeCalledWith('feat.feature42', undefined);
  });
});

describe('formatName', () => {
  test.each([
    { id: 'helloWorld', expected: 'hello World' },
    { id: 'parent.childFeature', expected: 'parent child Feature' },
    { id: 'config.sectionName.isEnabled', expected: 'config section Name is Enabled' },
    { id: 'already.formatted string', expected: 'already formatted string' },
  ])('should correctly format "$id" to "$expected"', ({ id, expected }) => {
    const name = feedbackForm.formatName(id);
    expect(name).toBe(expected);
  });
});

describe('disableFeature', () => {
  test('should add feature to disabled', () => {
    const pushDisabledSpy = vi.spyOn(feedbackForm.disabled, 'push');
    feedbackForm.disableFeature('feat.feature1');

    expect(pushDisabledSpy).toBeCalled();
    expect(pushDisabledSpy).toBeCalledWith('feat.feature1');
    expect(feedbackForm.disabled).toContain('feat.feature1');
  });

  test('should NOT add feature to disabled if already there', () => {
    const pushDisabledSpy = vi.spyOn(feedbackForm.disabled, 'push');
    feedbackForm.disabled = ['feat.feature1'];
    feedbackForm.disableFeature('feat.feature1');

    expect(pushDisabledSpy).not.toHaveBeenCalled();
    expect(feedbackForm.disabled).toContain('feat.feature1');
  });
});
