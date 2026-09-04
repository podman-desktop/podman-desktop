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
import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { WelcomeUtils } from '/@/lib/welcome/welcome-utils';

import OnboardingWelcomeTelemetry from './OnboardingWelcomeTelemetry.svelte';

vi.mock(import('/@/lib/welcome/welcome-utils'));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(WelcomeUtils.prototype.havePromptedForTelemetry).mockResolvedValue(false);
  vi.mocked(WelcomeUtils.prototype.setTelemetry).mockResolvedValue();
  vi.mocked(window.getTelemetryMessages).mockResolvedValue({
    acceptMessage: 'Help us improve',
    info: { url: 'https://example.com/privacy', link: 'Privacy statement' },
  });
});

describe('OnboardingWelcomeTelemetry', () => {
  test('shows telemetry checkbox when not previously prompted', async () => {
    render(OnboardingWelcomeTelemetry);

    await vi.waitFor(() => {
      expect(screen.getByRole('checkbox', { name: 'Enable telemetry' })).toBeInTheDocument();
    });
  });

  test('persists default telemetry value (true) on mount when not previously prompted', async () => {
    render(OnboardingWelcomeTelemetry);

    await vi.waitFor(() => {
      expect(vi.mocked(WelcomeUtils.prototype.setTelemetry)).toHaveBeenCalledWith(true);
    });
  });

  test('hides telemetry when already prompted', async () => {
    vi.mocked(WelcomeUtils.prototype.havePromptedForTelemetry).mockResolvedValue(true);
    render(OnboardingWelcomeTelemetry);

    await vi.waitFor(() => {
      expect(vi.mocked(WelcomeUtils.prototype.havePromptedForTelemetry)).toHaveBeenCalled();
    });

    expect(screen.queryByRole('checkbox', { name: 'Enable telemetry' })).not.toBeInTheDocument();
  });

  test('displays telemetry accept message and privacy link', async () => {
    render(OnboardingWelcomeTelemetry);

    await vi.waitFor(() => {
      expect(screen.getByText('Help us improve')).toBeInTheDocument();
    });
    expect(screen.getByText('Privacy statement')).toBeInTheDocument();
    expect(screen.getByText(/You can always modify this preference later/)).toBeInTheDocument();
  });

  test('checkbox is checked by default', async () => {
    render(OnboardingWelcomeTelemetry);

    await vi.waitFor(() => {
      expect(screen.getByRole('checkbox', { name: 'Enable telemetry' })).toBeChecked();
    });
  });

  test('persists telemetry as false immediately when unchecked', async () => {
    render(OnboardingWelcomeTelemetry);

    await vi.waitFor(() => {
      expect(screen.getByRole('checkbox', { name: 'Enable telemetry' })).toBeInTheDocument();
    });

    vi.mocked(WelcomeUtils.prototype.setTelemetry).mockClear();
    const checkbox = screen.getByRole('checkbox', { name: 'Enable telemetry' });
    await fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(vi.mocked(WelcomeUtils.prototype.setTelemetry)).toHaveBeenCalledWith(false);
  });

  test('persists telemetry as true immediately when re-checked', async () => {
    render(OnboardingWelcomeTelemetry);

    await vi.waitFor(() => {
      expect(screen.getByRole('checkbox', { name: 'Enable telemetry' })).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox', { name: 'Enable telemetry' });
    await fireEvent.click(checkbox);
    vi.mocked(WelcomeUtils.prototype.setTelemetry).mockClear();
    await fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(vi.mocked(WelcomeUtils.prototype.setTelemetry)).toHaveBeenCalledWith(true);
  });

  test('clicking the visible Telemetry label toggles the checkbox', async () => {
    render(OnboardingWelcomeTelemetry);

    await vi.waitFor(() => {
      expect(screen.getByRole('checkbox', { name: 'Enable telemetry' })).toBeChecked();
    });

    vi.mocked(WelcomeUtils.prototype.setTelemetry).mockClear();
    await fireEvent.click(screen.getByText('Telemetry:'));

    expect(screen.getByRole('checkbox', { name: 'Enable telemetry' })).not.toBeChecked();
    expect(vi.mocked(WelcomeUtils.prototype.setTelemetry)).toHaveBeenCalledWith(false);
  });

  test('does not show or persist telemetry when already prompted', async () => {
    vi.mocked(WelcomeUtils.prototype.havePromptedForTelemetry).mockResolvedValue(true);
    render(OnboardingWelcomeTelemetry);

    await vi.waitFor(() => {
      expect(vi.mocked(WelcomeUtils.prototype.havePromptedForTelemetry)).toHaveBeenCalled();
    });

    expect(screen.queryByRole('checkbox', { name: 'Enable telemetry' })).not.toBeInTheDocument();
    expect(vi.mocked(WelcomeUtils.prototype.setTelemetry)).not.toHaveBeenCalled();
  });
});
