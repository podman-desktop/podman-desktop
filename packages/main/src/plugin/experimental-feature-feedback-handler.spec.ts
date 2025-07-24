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
import type { ExperimentalConfiguration, Timestamp } from './experimental-feature-feedback-handler.js';
import { ExperimentalFeatureFeedbackHandler } from './experimental-feature-feedback-handler.js';

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

class TestExperimentalFeatureFeedbackHandler extends ExperimentalFeatureFeedbackHandler {
  override experimentalFeatures: Map<string, ExperimentalConfiguration> = new Map<string, ExperimentalConfiguration>();

  override setTimestamp(feature: string, days: Timestamp): void {
    return super.setTimestamp(feature, days);
  }

  override setReminder(configurationName: string): void {
    return super.setReminder(configurationName);
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

const setReminderSpy = vi.spyOn(TestExperimentalFeatureFeedbackHandler.prototype, 'setReminder');
const setTimestampSpy = vi.spyOn(TestExperimentalFeatureFeedbackHandler.prototype, 'setTimestamp');

let feedbackForm: TestExperimentalFeatureFeedbackHandler;
beforeEach(() => {
  vi.resetAllMocks();
  feedbackForm = new TestExperimentalFeatureFeedbackHandler(configurationRegistry);

  vi.spyOn(feedbackForm, 'save').mockImplementation(() => {
    return Promise.resolve();
  });
});

describe('init', () => {
  test('should setup reminders on first run', async () => {
    configurationGetMock.mockReturnValue({});
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    await feedbackForm.init();

    expect(setReminderSpy).toHaveBeenCalledTimes(3);
    expect(setReminderSpy).toHaveBeenCalledWith('feat.feature1');
    expect(setReminderSpy).toHaveBeenCalledWith('feat.feature2');
    expect(setReminderSpy).toHaveBeenCalledWith('feat.feature3');
  });

  test('should NOT setup reminders when no configuration exist', async () => {
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    await feedbackForm.init();

    expect(setReminderSpy).not.toBeCalled();
  });

  test('should load existing configurations and show dialog', async () => {
    const conf = { remindAt: 123456, disabled: false };
    configurationGetMock.mockReturnValue(conf);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);

    await feedbackForm.init();

    expect(setReminderSpy).not.toHaveBeenCalled();

    expect(feedbackForm.experimentalFeatures.get('feat.feature1')).toEqual(conf);
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

    const setSpy = vi.spyOn(feedbackForm.experimentalFeatures, 'set');

    const days = 42;
    const expectedTimestamp = new Date(MOCK_NOW.getTime() + days * 24 * 60 * 60 * 1_000).getTime();

    feedbackForm.setTimestamp('feature1', days);

    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith('feature1', { remindAt: expectedTimestamp, disabled: false });
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

describe('disableFeature', () => {
  test('should set disable of enabled feature', () => {
    const feat = 'feat.feature1';
    const pastTimestamp = new Date('2020-01-01T00:00:00.000Z').getTime();
    const existingTimestamps = { remindAt: pastTimestamp, disabled: false };
    feedbackForm.experimentalFeatures = new Map([[feat, existingTimestamps]]);
    const setSpy = vi.spyOn(feedbackForm.experimentalFeatures, 'set');
    feedbackForm.disableFeature(feat);

    expect(setSpy).toHaveBeenCalledWith(feat, { remindAt: pastTimestamp, disabled: true });
  });

  test('should NOT set disable of feature that is not enabled', () => {
    const feat = 'feat.feature1';
    const setSpy = vi.spyOn(feedbackForm.experimentalFeatures, 'set');
    feedbackForm.disableFeature(feat);

    expect(setSpy).not.toBeCalled();
  });
});
