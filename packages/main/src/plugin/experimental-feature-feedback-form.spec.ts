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
import { shell } from 'electron';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { IConfigurationChangeEvent, IConfigurationPropertyRecordedSchema } from '/@api/configuration/models.js';

import type { ConfigurationRegistry } from './configuration-registry.js';
import type { Timestamp } from './experimental-feature-feedback-form.js';
import { ExperimentalFeatureFeedbackForm } from './experimental-feature-feedback-form.js';
import type { MessageBox } from './message-box.js';

vi.mock('electron', () => ({
  shell: {
    openExternal: vi.fn().mockResolvedValue(undefined),
  },
}));

const MAX_NUMBER: number = Number.MAX_SAFE_INTEGER;
const features: Record<string, IConfigurationPropertyRecordedSchema> = {
  feature1: {
    title: 'feat.feature1',
    parentId: 'parent1',
    experimental: { githubDiscussionLink: 'https://feature.link.1.com' },
  },
  feature2: {
    title: 'feat.feature2',
    parentId: 'parent2',
    experimental: { githubDiscussionLink: 'https://feature.link.2.com' },
  },
  feature3: { title: 'feat.feature3', parentId: 'parent3' },
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

const messageBox: MessageBox = {
  showMessageBox: vi.fn(),
} as unknown as MessageBox;

class TestExperimentalFeatureFeedbackForm extends ExperimentalFeatureFeedbackForm {
  override setTimestamp(feature: string, days: number | undefined): void {
    return super.setTimestamp(feature, days);
  }

  override setReminder(configurationName: string): void {
    return super.setReminder(configurationName);
  }

  override formatName(id: string): string {
    return super.formatName(id);
  }

  override async showFeedbackDialog(): Promise<void> {
    return super.showFeedbackDialog();
  }

  override async save(): Promise<void> {
    return super.save();
  }

  override getTimestampsMap(): Map<string, Timestamp> {
    return super.getTimestampsMap();
  }

  override init(): Promise<void> {
    return super.init();
  }
}

const setReminderSpy = vi.spyOn(TestExperimentalFeatureFeedbackForm.prototype, 'setReminder');
const showFeedbackDialogSpy = vi.spyOn(TestExperimentalFeatureFeedbackForm.prototype, 'showFeedbackDialog');
const setTimestampSpy = vi.spyOn(TestExperimentalFeatureFeedbackForm.prototype, 'setTimestamp');

let feedbackForm: TestExperimentalFeatureFeedbackForm;
beforeEach(() => {
  vi.resetAllMocks();
  feedbackForm = new TestExperimentalFeatureFeedbackForm(configurationRegistry, messageBox);

  vi.spyOn(feedbackForm, 'save').mockImplementation(() => {
    return Promise.resolve();
  });
});

describe('init', () => {
  test('should setup reminders on first run when no timestamps exist', async () => {
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    await feedbackForm.init();

    expect(setReminderSpy).toHaveBeenCalledTimes(2);
    expect(setReminderSpy).toHaveBeenCalledWith('feature1');
    expect(setReminderSpy).toHaveBeenCalledWith('feature2');

    expect(showFeedbackDialogSpy).not.toHaveBeenCalled();
  });

  test('should load existing timestamps and show dialog', async () => {
    const existingTimestamps = { feature1: 123456, feature2: 789012 };
    configurationGetMock.mockReturnValue(existingTimestamps);
    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);

    const showFeedbackDialogSpy = vi.spyOn(feedbackForm, 'showFeedbackDialog').mockImplementation(() => {
      return Promise.resolve();
    });
    await feedbackForm.init();

    expect(showFeedbackDialogSpy).toHaveBeenCalledTimes(1);
    expect(setReminderSpy).not.toHaveBeenCalled();

    const internalMap = feedbackForm.getTimestampsMap();
    expect(internalMap.get('feature1')).toBe(123456);
    expect(internalMap.get('feature2')).toBe(789012);
  });

  describe('onDidChangeConfiguration event handler', () => {
    let capturedCallback: (e: IConfigurationChangeEvent) => void;

    beforeEach(() => {
      vi.mocked(configurationRegistry.onDidChangeConfiguration).mockImplementation(callback => {
        capturedCallback = callback;
        return { dispose: vi.fn() };
      });

      vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
      configurationGetMock.mockReturnValue(undefined);
      vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    });

    test('should call setTimestamp with days when an experimental feature is enabled', async () => {
      await feedbackForm.init();
      capturedCallback({ key: 'feature1', value: true, scope: 'default' });
      expect(setTimestampSpy).toHaveBeenCalledWith('feature1', 2);
    });

    test('should call setTimestamp with undefined when an experimental feature is disabled', async () => {
      await feedbackForm.init();
      capturedCallback({ key: 'feature1', value: false, scope: 'default' });
      expect(setTimestampSpy).toHaveBeenCalledWith('feature1', undefined);
    });

    test('should NOT call setTimestamp for a non-experimental feature change', async () => {
      await feedbackForm.init();
      capturedCallback({ key: 'regularFeature', value: true, scope: 'default' });
      expect(setTimestampSpy).not.toHaveBeenCalled();
    });
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

    const timestampsMap = feedbackForm.getTimestampsMap();
    const setSpy = vi.spyOn(timestampsMap, 'set');

    const days = 42;
    const expectedTimestamp = new Date(MOCK_NOW.getTime() + days * 24 * 60 * 60 * 1000).getTime();

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

describe('showFeedbackDialog', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    const MOCK_NOW = new Date('2025-01-01T12:00:00.000Z');
    vi.setSystemTime(MOCK_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should open external link when user clicks "Share Feedback"', async () => {
    const pastTimestamp = new Date('2020-01-01T00:00:00.000Z').getTime();
    const existingTimestamps = { feature1: pastTimestamp };
    configurationGetMock.mockReturnValue(existingTimestamps);

    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(messageBox.showMessageBox).mockResolvedValue({ response: 1 });
    const openExternalSpy = vi.spyOn(shell, 'openExternal').mockImplementation(() => {
      return Promise.resolve();
    });
    // For setting timestamps
    await feedbackForm.init();

    expect(messageBox.showMessageBox).toHaveBeenCalledTimes(1);
    expect(openExternalSpy).toHaveBeenCalledWith('https://feature.link.1.com');
    expect(setTimestampSpy).toHaveBeenCalledWith('feature1', undefined);
  });

  test('should set timestamp for 1 day when user selects "Remind me tomorrow"', async () => {
    const pastTimestamp = new Date('2020-01-01T00:00:00.000Z').getTime();
    const existingTimestamps = { feature1: pastTimestamp };
    configurationGetMock.mockReturnValue(existingTimestamps);

    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(messageBox.showMessageBox).mockResolvedValue({ response: 0, dropdownIndex: 0 });
    const openExternalSpy = vi.spyOn(shell, 'openExternal').mockImplementation(() => {
      return Promise.resolve();
    });
    // For setting timestamps
    await feedbackForm.init();

    expect(setTimestampSpy).toHaveBeenCalledWith('feature1', 1);
    expect(openExternalSpy).not.toHaveBeenCalled();
  });

  test('should set a very large timestamp when user selects "Dont show again"', async () => {
    const pastTimestamp = new Date('2020-01-01T00:00:00.000Z').getTime();
    const existingTimestamps = { feature1: pastTimestamp };
    configurationGetMock.mockReturnValue(existingTimestamps);

    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);
    vi.mocked(messageBox.showMessageBox).mockResolvedValue({ response: 0, dropdownIndex: 2 });
    const openExternalSpy = vi.spyOn(shell, 'openExternal').mockImplementation(() => {
      return Promise.resolve();
    });
    // For setting timestamps
    await feedbackForm.init();

    expect(setTimestampSpy).toHaveBeenCalledWith('feature1', MAX_NUMBER);
    expect(openExternalSpy).not.toHaveBeenCalled();
  });

  test('should NOT show a dialog if the timestamp is in the future', async () => {
    const futureTimestamp = new Date('2100-01-01T00:00:00.000Z').getTime();
    const existingTimestamps = { feature1: futureTimestamp };
    configurationGetMock.mockReturnValue(existingTimestamps);

    vi.mocked(configurationRegistry.getConfiguration).mockReturnValue(configuration);
    vi.mocked(configurationRegistry.getConfigurationProperties).mockReturnValue(features);

    // For setting timestamps
    await feedbackForm.init();
    expect(messageBox.showMessageBox).not.toHaveBeenCalled();
  });
});
