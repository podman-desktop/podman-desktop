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

import type { TelemetryLogger } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { Container } from 'inversify';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
  HYPERV_PREP_AVAILABLE_ONBOARDING_KEY,
  HYPERV_PREP_ONBOARDING_CHECK_COMMAND,
  HYPERV_PREP_ONBOARDING_COMMAND,
  HYPERV_PREP_OUTCOME_ONBOARDING_KEY,
  HYPERV_PREP_RELOGIN_MESSAGE,
  HYPERV_PREP_SUMMARY_ONBOARDING_KEY,
} from '/@/constants';
import { TelemetryLoggerSymbol } from '/@/inject/symbols';
import { WinPlatform } from '/@/platforms/win-platform';
import { HyperVPrep, HyperVPrepStatus } from '/@/platforms/windows/hyperv-prep';
import { HyperVPrepOnboarding } from '/@/platforms/windows/hyperv-prep-onboarding';

vi.mock(import('@podman-desktop/api'));
vi.mock(import('/@/platforms/windows/hyperv-prep'));
vi.mock(import('/@/platforms/win-platform'));

const telemetryLoggerMock: TelemetryLogger = {
  onDidChangeEnableStates: vi.fn(() => ({ dispose: vi.fn() })),
  isUsageEnabled: true,
  isErrorsEnabled: true,
  logError: vi.fn(),
  logUsage: vi.fn(),
  dispose: vi.fn(),
};

// WinPlatform has a decorator-injected constructor: Inversify cannot build the automock with toSelf().
// Only its prototype methods are used, which the automock already stubs.
const winPlatform = Object.create(WinPlatform.prototype) as WinPlatform;

function createService(): HyperVPrepOnboarding {
  const container = new Container();
  container.bind(HyperVPrep).toSelf();
  container.bind(WinPlatform).toConstantValue(winPlatform);
  container.bind(TelemetryLoggerSymbol).toConstantValue(telemetryLoggerMock);
  container.bind(HyperVPrepOnboarding).toSelf();
  return container.get(HyperVPrepOnboarding);
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(HyperVPrep.prototype.isSupported).mockResolvedValue(true);
  vi.mocked(HyperVPrep.prototype.refreshContext).mockResolvedValue(HyperVPrepStatus.NOT_APPLIED);
  vi.mocked(WinPlatform.prototype.isHyperVInstalledAndRunning).mockResolvedValue(true);
  vi.mocked(extensionApi.commands.registerCommand).mockReturnValue({ dispose: vi.fn() });
});

describe('HyperVPrepOnboarding', () => {
  test('registers and disposes onboarding commands', () => {
    const disposable = { dispose: vi.fn() };
    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue(disposable);
    const service = createService();

    expect(extensionApi.commands.registerCommand).toHaveBeenCalledWith(
      HYPERV_PREP_ONBOARDING_CHECK_COMMAND,
      expect.any(Function),
    );
    expect(extensionApi.commands.registerCommand).toHaveBeenCalledWith(
      HYPERV_PREP_ONBOARDING_COMMAND,
      expect.any(Function),
    );

    service.dispose();
    expect(disposable.dispose).toHaveBeenCalledTimes(2);
  });

  test('does not offer preparation when Hyper-V is unavailable', async () => {
    vi.mocked(WinPlatform.prototype.isHyperVInstalledAndRunning).mockResolvedValue(false);
    const service = createService();

    await service.checkHyperVPrep();

    expect(HyperVPrep.prototype.refreshContext).not.toHaveBeenCalled();
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_AVAILABLE_ONBOARDING_KEY,
      false,
      'onboarding',
    );
  });

  test('publishes the availability state and summary for unapplied preparation', async () => {
    const service = createService();

    await service.checkHyperVPrep();

    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_AVAILABLE_ONBOARDING_KEY,
      true,
      'onboarding',
    );
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_SUMMARY_ONBOARDING_KEY,
      'You are not a member of the Hyper-V Administrators group.',
      'onboarding',
    );
  });

  test('does not offer preparation when status is already applied', async () => {
    vi.mocked(HyperVPrep.prototype.refreshContext).mockResolvedValue(HyperVPrepStatus.APPLIED);
    const service = createService();

    await service.checkHyperVPrep();

    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_AVAILABLE_ONBOARDING_KEY,
      false,
      'onboarding',
    );
    expect(extensionApi.context.setValue).not.toHaveBeenCalledWith(
      HYPERV_PREP_AVAILABLE_ONBOARDING_KEY,
      true,
      'onboarding',
    );
  });

  test('keeps the onboarding action available after a status failure', async () => {
    vi.mocked(HyperVPrep.prototype.refreshContext).mockResolvedValue(undefined);
    const service = createService();

    await service.checkHyperVPrep();

    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_AVAILABLE_ONBOARDING_KEY,
      true,
      'onboarding',
    );
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_SUMMARY_ONBOARDING_KEY,
      'Hyper-V preparation status could not be confirmed.',
      'onboarding',
    );
  });

  test('sets the prepared outcome after successful preparation', async () => {
    vi.mocked(HyperVPrep.prototype.prepare).mockResolvedValue(true);
    const service = createService();

    await service.runOnboardingHyperVPrep();

    expect(HyperVPrep.prototype.prepare).toHaveBeenCalledWith({
      telemetryEvent: HYPERV_PREP_ONBOARDING_COMMAND,
      showCompletionMessage: false,
    });
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_OUTCOME_ONBOARDING_KEY,
      'prepared',
      'onboarding',
    );
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_SUMMARY_ONBOARDING_KEY,
      HYPERV_PREP_RELOGIN_MESSAGE,
      'onboarding',
    );
    expect(HyperVPrep.prototype.refreshContext).not.toHaveBeenCalled();
  });

  test('leaves outcome pending after cancelled or failed preparation', async () => {
    vi.mocked(HyperVPrep.prototype.prepare).mockResolvedValue(false);
    const service = createService();

    await service.runOnboardingHyperVPrep();

    expect(HyperVPrep.prototype.refreshContext).toHaveBeenCalledOnce();
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_OUTCOME_ONBOARDING_KEY,
      'pending',
      'onboarding',
    );
  });

  test('reports an error and keeps the step pending when preparation rejects', async () => {
    const error = new Error('podman not found');
    vi.mocked(HyperVPrep.prototype.prepare).mockRejectedValue(error);
    const service = createService();

    await service.runOnboardingHyperVPrep();

    expect(telemetryLoggerMock.logError).toHaveBeenCalledWith('hypervPrepOnboardingFailed', { error });
    expect(HyperVPrep.prototype.refreshContext).toHaveBeenCalledOnce();
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_OUTCOME_ONBOARDING_KEY,
      'pending',
      'onboarding',
    );
  });

  test('reports an error when the status check throws', async () => {
    const error = new Error('status check failed');
    vi.mocked(HyperVPrep.prototype.isSupported).mockRejectedValue(error);
    const service = createService();

    await service.checkHyperVPrep();

    expect(telemetryLoggerMock.logError).toHaveBeenCalledWith('hypervPrepOnboardingStatusCheckFailed', { error });
  });
});
