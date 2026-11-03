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

const prep = {
  isSupported: vi.fn(),
  refreshContext: vi.fn(),
  prepare: vi.fn(),
} as unknown as HyperVPrep;

const winPlatform = {
  isHyperVInstalledAndRunning: vi.fn(),
} as unknown as WinPlatform;

const telemetryLogger = {
  logError: vi.fn(),
  logUsage: vi.fn(),
} as unknown as TelemetryLogger;

function createService(): HyperVPrepOnboarding {
  const container = new Container();
  container.bind(HyperVPrep).toConstantValue(prep);
  container.bind(WinPlatform).toConstantValue(winPlatform);
  container.bind(TelemetryLoggerSymbol).toConstantValue(telemetryLogger);
  container.bind(HyperVPrepOnboarding).toSelf();
  return container.get(HyperVPrepOnboarding);
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(prep.isSupported).mockResolvedValue(true);
  vi.mocked(prep.refreshContext).mockResolvedValue(HyperVPrepStatus.NOT_APPLIED);
  vi.mocked(winPlatform.isHyperVInstalledAndRunning).mockResolvedValue(true);
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
    vi.mocked(winPlatform.isHyperVInstalledAndRunning).mockResolvedValue(false);
    const service = createService();

    await service.checkHyperVPrep();

    expect(prep.refreshContext).not.toHaveBeenCalled();
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
    vi.mocked(prep.refreshContext).mockResolvedValue(HyperVPrepStatus.APPLIED);
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
    vi.mocked(prep.refreshContext).mockResolvedValue(undefined);
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
    vi.mocked(prep.prepare).mockResolvedValue(true);
    const service = createService();

    await service.runOnboardingHyperVPrep();

    expect(prep.prepare).toHaveBeenCalledWith(HYPERV_PREP_ONBOARDING_COMMAND, { showCompletionMessage: false });
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
    expect(prep.refreshContext).not.toHaveBeenCalled();
  });

  test('leaves outcome pending after cancelled or failed preparation', async () => {
    vi.mocked(prep.prepare).mockResolvedValue(false);
    const service = createService();

    await service.runOnboardingHyperVPrep();

    expect(prep.refreshContext).toHaveBeenCalledOnce();
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_OUTCOME_ONBOARDING_KEY,
      'pending',
      'onboarding',
    );
  });
});
