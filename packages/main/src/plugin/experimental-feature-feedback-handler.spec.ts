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
import type { IConfigurationPropertyRecordedSchema } from '@podman-desktop/core-api/configuration';
import { shell } from 'electron';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { ConfigurationRegistry } from './configuration-registry.js';
import type { ExperimentalConfiguration, Timestamp } from './experimental-feature-feedback-handler.js';
import { ExperimentalFeatureFeedbackHandler } from './experimental-feature-feedback-handler.js';
import type { MessageBox } from './message-box.js';
import type { Telemetry } from './telemetry/telemetry.js';

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

const registerConfigurationsMock = vi.fn();

const configurationRegistry: ConfigurationRegistry = {
  onDidChangeConfiguration: vi.fn(),
  registerConfigurations: registerConfigurationsMock,
  getConfigurationProperties: vi.fn(),
  getConfiguration: vi.fn(),
} as unknown as ConfigurationRegistry;

const configurationGetMock = vi.fn();
const updateMock = vi.fn().mockImplementation(() => Promise.resolve());

const telemetryTrackMock = vi.fn().mockResolvedValue({});
const telemetry: Telemetry = { track: telemetryTrackMock } as unknown as Telemetry;

const configuration: Configuration = {
  get: configurationGetMock,
  has: () => true,
  update: updateMock,
};

const messageBox: MessageBox = {
  showMessageBox: vi.fn(),
} as unknown as MessageBox;

class TestExperimentalFeatureFeedbackHandler extends ExperimentalFeatureFeedbackHandler {
  override experimentalFeatures: Map<string, ExperimentalConfiguration> = new Map<string, ExperimentalConfiguration>();

  override setTimestamp(feature: string, days: Timestamp): void {
    return super.setTimestamp(feature, days);
  }

  override setReminder(configurationName: string): void {
    return super.setReminder(configurationName);
  }

  override async showFeedbackDialog(): Promise<void> {
    return super.showFeedbackDialog();
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
const disableFeatureSpy = vi.spyOn(TestExperimentalFeatureFeedbackHandler.prototype, 'disableFeature');

let feedbackForm: TestExperimentalFeatureFeedbackHandler;
beforeEach(() => {
  vi.resetAllMocks();
  feedbackForm = new TestExperimentalFeatureFeedbackHandler(configurationRegistry, messageBox, telemetry);

  vi.spyOn(feedbackForm, 'save').mockImplementation(() => {
    return Promise.resolve();
  });
});

describe('init', () => {
  test('should register feedback dialog configuration', async () => {
    configurationGetMock.mockReturnValue({});
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);

    await feedbackForm.init();

    expect(registerConfigurationsMock).toHaveBeenCalledTimes(1);
    expect(registerConfigurationsMock).toHaveBeenCalledWith([
      {
        id: 'preferences',
        title: 'Feedback dialog',
        type: 'object',
        properties: {
          'feedback.dialog': {
            description: 'Show feedback dialog for experimental features',
            type: 'boolean',
            default: true,
          },
        },
      },
    ]);
  });

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
    const showFeedbackDialogSpy = vi.spyOn(feedbackForm, 'showFeedbackDialog').mockImplementation(() => {
      return Promise.resolve();
    });
    await feedbackForm.init();

    expect(setReminderSpy).not.toHaveBeenCalled();

    expect(feedbackForm.experimentalFeatures.get('feat.feature1')).toEqual(conf);
    expect(showFeedbackDialogSpy).toBeCalled();
  });

  test(`should remove old configs with 'false' value`, async () => {
    const conf = false;
    configurationGetMock.mockReturnValue(conf);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);

    const setSpy = vi.spyOn(feedbackForm.experimentalFeatures, 'set');
    const saveSpy = vi.spyOn(feedbackForm, 'save');

    await feedbackForm.init();

    expect(setReminderSpy).not.toHaveBeenCalled();
    expect(setSpy).not.toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalledWith('feat.feature1');
    expect(feedbackForm.experimentalFeatures.get('feat.feature1')).toBe(undefined);
  });
});

describe('save', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
  });

  test('should call update with valid data for enabled experimental config', async () => {
    const conf = { remindAt: 123456, disabled: false };
    vi.spyOn(feedbackForm.experimentalFeatures, 'get').mockReturnValue(conf);

    await feedbackForm.save('feat.feature1');

    expect(updateMock).toHaveBeenCalledTimes(1);
    expect(updateMock).toHaveBeenCalledWith('feature1', conf);
  });

  test('should call update with empty object and then undefined for missing experimental config', async () => {
    vi.spyOn(feedbackForm.experimentalFeatures, 'get').mockReturnValue(undefined);

    await feedbackForm.save('feat.feature1');

    expect(updateMock).toHaveBeenCalledTimes(2);
    expect(updateMock).toHaveBeenNthCalledWith(1, 'feature1', {});
    expect(updateMock).toHaveBeenNthCalledWith(2, 'feature1', undefined);
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

describe('showFeedbackDialog', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    const MOCK_NOW = new Date('2025-01-01T12:00:00.000Z');
    vi.setSystemTime(MOCK_NOW);
    configurationGetMock.mockReturnValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should open external link when user clicks "Share Feedback"', async () => {
    const pastTimestamp = new Date('2020-01-01T00:00:00.000Z').getTime();
    const existingTimestamps = { remindAt: pastTimestamp, disabled: false };
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(messageBox.showMessageBox).mockResolvedValue({ response: 1 });
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    const openExternalSpy = vi.spyOn(shell, 'openExternal').mockImplementation(() => {
      return Promise.resolve();
    });

    feedbackForm.experimentalFeatures = new Map([['feat.feature1', existingTimestamps]]);
    await feedbackForm.showFeedbackDialog();

    expect(messageBox.showMessageBox).toHaveBeenCalledTimes(1);
    expect(openExternalSpy).toHaveBeenCalledWith('https://feature.link.1.com');
    expect(setTimestampSpy).toHaveBeenCalledWith('feat.feature1', undefined);
    expect(telemetry.track).toHaveBeenCalled();
  });

  test('should set timestamp for 1 day when user selects "Remind me tomorrow"', async () => {
    const pastTimestamp = new Date('2020-01-01T00:00:00.000Z').getTime();
    const existingTimestamps = { remindAt: pastTimestamp, disabled: false };
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(messageBox.showMessageBox).mockResolvedValue({ response: 0, dropdownIndex: 0 });
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    const openExternalSpy = vi.spyOn(shell, 'openExternal').mockImplementation(() => {
      return Promise.resolve();
    });

    feedbackForm.experimentalFeatures = new Map([['feat.feature1', existingTimestamps]]);
    await feedbackForm.showFeedbackDialog();

    expect(setTimestampSpy).toHaveBeenCalledWith('feat.feature1', 1);
    expect(openExternalSpy).not.toHaveBeenCalled();
    expect(telemetry.track).toHaveBeenCalled();
  });

  test('should set timestamp for 2 days when user selects "Remind me in 2 days"', async () => {
    const pastTimestamp = new Date('2020-01-01T00:00:00.000Z').getTime();
    const existingTimestamps = { remindAt: pastTimestamp, disabled: false };
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(messageBox.showMessageBox).mockResolvedValue({ response: 0, dropdownIndex: 1 });
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    const openExternalSpy = vi.spyOn(shell, 'openExternal').mockImplementation(() => {
      return Promise.resolve();
    });

    feedbackForm.experimentalFeatures = new Map([['feat.feature1', existingTimestamps]]);
    await feedbackForm.showFeedbackDialog();

    expect(setTimestampSpy).toHaveBeenCalledWith('feat.feature1', 2);
    expect(openExternalSpy).not.toHaveBeenCalled();
    expect(telemetry.track).toHaveBeenCalled();
  });

  test('should call disableFeature when user selects "Dont show again"', async () => {
    const pastTimestamp = new Date('2020-01-01T00:00:00.000Z').getTime();
    const existingTimestamps = { remindAt: pastTimestamp, disabled: false };
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(messageBox.showMessageBox).mockResolvedValue({ response: 0, dropdownIndex: 2 });
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    const openExternalSpy = vi.spyOn(shell, 'openExternal').mockImplementation(() => {
      return Promise.resolve();
    });

    feedbackForm.experimentalFeatures = new Map([['feat.feature1', existingTimestamps]]);
    await feedbackForm.showFeedbackDialog();

    expect(setTimestampSpy).not.toHaveBeenCalled();
    expect(openExternalSpy).not.toHaveBeenCalled();
    expect(disableFeatureSpy).toBeCalledTimes(1);
    expect(disableFeatureSpy).toBeCalledWith('feat.feature1');
    expect(telemetry.track).toHaveBeenCalled();
  });

  test('should NOT show a dialog if the timestamp is in the future', async () => {
    const futureTimestamp = new Date('2100-01-01T00:00:00.000Z').getTime();
    const existingTimestamps = { remindAt: futureTimestamp, disabled: true };
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);

    feedbackForm.experimentalFeatures = new Map([['feat.feature1', existingTimestamps]]);
    await feedbackForm.showFeedbackDialog();
    expect(messageBox.showMessageBox).not.toHaveBeenCalled();
    expect(telemetry.track).not.toHaveBeenCalled();
  });

  test('should NOT show dialog when is a feature disabled', async () => {
    const pastTimestamp = new Date('2020-01-01T00:00:00.000Z').getTime();
    const existingTimestamps = { remindAt: pastTimestamp, disabled: true };
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);

    feedbackForm.experimentalFeatures = new Map([['feat.feature1', existingTimestamps]]);
    await feedbackForm.showFeedbackDialog();

    expect(setTimestampSpy).not.toHaveBeenCalled();
    expect(disableFeatureSpy).not.toHaveBeenCalled();
    expect(telemetry.track).not.toHaveBeenCalled();
  });

  test('should NOT show dialog when feedback is globally disabled', async () => {
    const pastTimestamp = new Date('2020-01-01T00:00:00.000Z').getTime();
    const existingTimestamps = { remindAt: pastTimestamp, disabled: false };
    configurationGetMock.mockReturnValue(false);
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);

    feedbackForm.experimentalFeatures = new Map([['feat.feature1', existingTimestamps]]);
    await feedbackForm.showFeedbackDialog();

    expect(messageBox.showMessageBox).not.toHaveBeenCalled();
    expect(setTimestampSpy).not.toHaveBeenCalled();
    expect(disableFeatureSpy).not.toHaveBeenCalled();
    expect(telemetry.track).not.toHaveBeenCalled();
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
