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

import type { TelemetrySender } from '@podman-desktop/api';
import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { ExtensionInfo } from '/@api/extension-info.js';

import type { ConfigurationRegistry } from '../configuration-registry.js';
import { TelemetryTrustedValue } from '../types/telemetry.js';
import type { EventType } from './telemetry.js';
import { Telemetry, TelemetryLoggerImpl } from './telemetry.js';
import { TelemetrySettings } from './telemetry-settings.js';

const getConfigurationMock = vi.fn();
const onDidChangeConfigurationMock = vi.fn();

const configurationRegistryMock = {
  getConfiguration: getConfigurationMock,
  onDidChangeConfiguration: onDidChangeConfigurationMock,
} as unknown as ConfigurationRegistry;

vi.mock('../../../../../telemetry.json', () => ({
  default: {
    rules: [
      {
        event: 'dropMe',
        disabled: true,
      },
      { event: 'sometimes', ratio: 0.5 },
      { event: 'list', frequency: 'dailyPerInstance' },
    ],
  },
}));

class TelemetryTest extends Telemetry {
  constructor() {
    super(configurationRegistryMock);
  }
  public getLastTimeEvents(): Map<string, number> {
    return this.lastTimeEvents;
  }

  public getAggregateTimeoutEvents(): Map<string, { timeout: NodeJS.Timeout; properties: unknown[] }> {
    return this.aggregateTimeoutEvents;
  }

  public getPendingItems(): { eventName: string; properties?: unknown }[] {
    return this.pendingItems;
  }

  public override shouldDropEvent(eventName: string): boolean {
    return super.shouldDropEvent(eventName);
  }

  public override listenForTelemetryUpdates(): void {
    super.listenForTelemetryUpdates();
  }

  public override createBuiltinTelemetrySender(extensionInfo: ExtensionInfo): TelemetrySender {
    return super.createBuiltinTelemetrySender(extensionInfo);
  }

  public setTelemetryInitialized(value: boolean): void {
    this.telemetryInitialized = value;
  }

  public setTelemetryEnabled(value: boolean): void {
    this.telemetryEnabled = value;
  }

  public override async internalTrack(event: EventType, eventProperties?: unknown): Promise<void> {
    return super.internalTrack(event, eventProperties);
  }
}

let telemetry: TelemetryTest;

beforeEach(() => {
  telemetry = new TelemetryTest();
});

afterEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
});

test('Should not filter out basic event', async () => {
  expect(telemetry.shouldDropEvent('basic')).toBeFalsy();
});

test('Should not filter out a dailyPerInstance event if it is first time', async () => {
  expect(telemetry.shouldDropEvent('listFirstTime')).toBeFalsy();
});

test('Should filter out a dailyPerInstance event if last event was < 24h', async () => {
  // last call was 23h ago
  telemetry.getLastTimeEvents().set('listSecondTime', Date.now() - 1000 * 60 * 60 * 23);
  expect(telemetry.shouldDropEvent('listSecondTime')).toBeTruthy();
});

test('Should not filter out a dailyPerInstance event if last event was > 24h', async () => {
  // last call was 25h ago, so it should not be filtered out
  telemetry.getLastTimeEvents().set('listVeryVeryOldime', Date.now() - 1000 * 60 * 60 * 25);
  expect(telemetry.shouldDropEvent('listVeryVeryOldime')).toBeFalsy();
});

test('Should filter out a disabled event', async () => {
  expect(telemetry.shouldDropEvent('dropMe')).toBeTruthy();
});

test('Should filter out a ratio event sometimes', async () => {
  // this test will flake once every 8x10^62 times. if you are *that* unlucky, sorry
  let count = 0;
  for (let i = 0; i < 100; i++) {
    if (telemetry.shouldDropEvent('sometimes')) {
      count++;
    }
  }

  expect(count === 0).toBeFalsy();
  expect(count === 100).toBeFalsy();
});

test('Check Telemetry is enabled', async () => {
  getConfigurationMock.mockReturnValue({
    get: () => true,
  });

  const enabled = telemetry.isTelemetryEnabled();
  expect(enabled).toBeTruthy();
});

test('Check Telemetry is disabled', async () => {
  getConfigurationMock.mockReturnValue({
    get: () => false,
  });

  const enabled = telemetry.isTelemetryEnabled();
  expect(enabled).toBeFalsy();
});

test('Check propagate enablement event if configuration is updated', async () => {
  let hasBeenEnabled = false;
  telemetry.onDidChangeTelemetryEnabled(event => {
    hasBeenEnabled = event;
  });

  // simulate configuration change
  onDidChangeConfigurationMock.mockImplementation(callback => {
    // simulate telemetry.enabled = true
    callback({ value: true, key: `${TelemetrySettings.SectionName}.${TelemetrySettings.Enabled}` });
  });

  telemetry.listenForTelemetryUpdates();
  expect(hasBeenEnabled).toBeTruthy();
});

describe('TelemetryLoggerImpl', () => {
  const sendEventDataMock = vi.fn();
  const sendErrorDataMock = vi.fn();
  const senderMock = {
    sendEventData: sendEventDataMock,
    sendErrorData: sendErrorDataMock,
  } as unknown as TelemetrySender;

  const dummyExtensionInfo: ExtensionInfo = {
    name: 'dummy',
    version: '1.0.0',
    publisher: 'bar',
  } as unknown as ExtensionInfo;

  test('check simple event', async () => {
    const telemetryLogger = new TelemetryLoggerImpl(dummyExtensionInfo, senderMock);

    // defaults are setup
    expect(telemetryLogger.isUsageEnabled).toBeTruthy();
    expect(telemetryLogger.isErrorsEnabled).toBeTruthy();
    telemetryLogger.logUsage('foo');
    expect(sendEventDataMock).toBeCalledWith('foo', {
      'common.extensionName': 'bar.dummy',
      'common.extensionVersion': '1.0.0',
    });
  });

  test('check additional properties', async () => {
    const telemetryLogger = new TelemetryLoggerImpl(dummyExtensionInfo, senderMock, {
      additionalCommonProperties: { customProp: 'customVal' },
    });

    telemetryLogger.logUsage('foo');
    expect(sendEventDataMock).toBeCalledWith(
      'foo',
      expect.objectContaining({
        customProp: 'customVal',
      }),
    );
  });

  test('check TelemetryTrustedValue', async () => {
    const telemetryLogger = new TelemetryLoggerImpl(dummyExtensionInfo, senderMock);

    telemetryLogger.logUsage('foo', { prop: new TelemetryTrustedValue('bar') });
    expect(sendEventDataMock).toBeCalledWith(
      'foo',
      expect.objectContaining({
        prop: 'bar',
      }),
    );
  });

  test('check string error event', async () => {
    const telemetryLogger = new TelemetryLoggerImpl(dummyExtensionInfo, senderMock);

    telemetryLogger.logError('foo');
    expect(sendErrorDataMock).toBeCalledWith(expect.any(Error), {
      'common.extensionName': 'bar.dummy',
      'common.extensionVersion': '1.0.0',
    });
  });

  test('check error event', async () => {
    const telemetryLogger = new TelemetryLoggerImpl(dummyExtensionInfo, senderMock);

    const fakeError = new Error('fake error');

    telemetryLogger.logError(fakeError, { add1: 'val1' });
    expect(sendErrorDataMock).toBeCalledWith(
      fakeError,
      expect.objectContaining({
        add1: 'val1',
      }),
    );
  });

  test('dispose', async () => {
    const telemetryLogger = new TelemetryLoggerImpl(dummyExtensionInfo, senderMock);

    expect(telemetryLogger['commonProperties']).toMatchObject({ 'common.extensionVersion': '1.0.0' });
    telemetryLogger.dispose();
    expect(telemetryLogger['commonProperties']).toStrictEqual({});
  });
});

// New tests for aggregateTrack
describe('aggregateTrack', () => {
  let internalTrackSpy: MockInstance;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
    telemetry.setTelemetryInitialized(true);
    telemetry.setTelemetryEnabled(true);
    internalTrackSpy = vi.spyOn(telemetry, 'internalTrack').mockResolvedValue();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  test('should skip event if shouldDropEvent returns true', () => {
    vi.spyOn(telemetry, 'shouldDropEvent').mockReturnValue(true);

    telemetry.aggregateTrack('dropMe', { foo: 'bar' });
    expect(telemetry.getAggregateTimeoutEvents().size).toBe(0);
  });
  test('should store in pendingItems if telemetry not initialized', () => {
    telemetry.setTelemetryInitialized(false);

    telemetry.aggregateTrack('eventA', { prop: 1 });
    expect(telemetry.getPendingItems()).toEqual([{ eventName: 'eventA', properties: [{ prop: 1 }] }]);
  });

  test('should aggregate and send after delay', async () => {
    telemetry.aggregateTrack('eventX', { count: 1 });
    telemetry.aggregateTrack('eventX', { count: 2 });

    expect(telemetry.getAggregateTimeoutEvents().get('eventX')?.properties).toEqual([{ count: 1 }, { count: 2 }]);

    vi.runAllTimers();
    await vi.waitFor(() =>
      expect(internalTrackSpy).toBeCalledWith('eventX', { aggregated: [{ count: 1 }, { count: 2 }] }),
    );
  });

  test('should clear previous timeout and reset it on repeated event', () => {
    telemetry.aggregateTrack('eventY', { value: 'first' });

    const initialTimeout = telemetry.getAggregateTimeoutEvents().get('eventY')?.timeout;
    telemetry.aggregateTrack('eventY', { value: 'second' });

    const updatedTimeout = telemetry.getAggregateTimeoutEvents().get('eventY')?.timeout;
    expect(initialTimeout).not.toBe(updatedTimeout);

    vi.runAllTimers();
    expect(internalTrackSpy).toBeCalledWith('eventY', { aggregated: [{ value: 'first' }, { value: 'second' }] });
  });

  test('should use default delay if not provided', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    telemetry.aggregateTrack('eventZ', { key: 'val' });
    vi.runAllTimers();
    await vi.waitFor(() =>
      expect(setTimeoutSpy).toBeCalledWith(expect.any(Function), Telemetry.DEFAULT_DELAY_AGGREGATE),
    );
  });

  test('should respect custom delay', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    telemetry.aggregateTrack('eventZ', { key: 'val' }, 5000);
    vi.runAllTimers();
    await vi.waitFor(() => expect(setTimeoutSpy).toBeCalledWith(expect.any(Function), 5_000));
  });

  test('should overwrite non-array properties in pendingItems if malformed', () => {
    telemetry.setTelemetryInitialized(false);
    telemetry.getPendingItems().push({
      eventName: 'badEvent',
      properties: { unexpected: 'format' }, // malformed
    });

    telemetry.aggregateTrack('badEvent', { corrected: true });
    expect(telemetry.getPendingItems().find(e => e.eventName === 'badEvent')?.properties).toEqual([
      { corrected: true },
    ]);
  });

  test('should skip event if telemetry is disabled', () => {
    telemetry.setTelemetryEnabled(false);

    telemetry.aggregateTrack('disabledEvent', { foo: 'bar' });

    expect(telemetry.getAggregateTimeoutEvents().size).toBe(0);
    expect(internalTrackSpy).not.toHaveBeenCalled();
  });

  test('should append properties to existing pending event when telemetry is not initialized', () => {
    telemetry.setTelemetryInitialized(false);

    // Push an initial pending item for the same event
    telemetry.getPendingItems().push({
      eventName: 'initEvent',
      properties: [{ foo: 1 }],
    });

    telemetry.aggregateTrack('initEvent', { bar: 2 });

    const pending = telemetry.getPendingItems().find(item => item.eventName === 'initEvent');
    expect(pending).toBeDefined();
    expect(Array.isArray(pending?.properties)).toBe(true);
    expect(pending?.properties).toEqual([{ foo: 1 }, { bar: 2 }]);
  });
});
