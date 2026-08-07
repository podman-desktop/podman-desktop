import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import OnboardingWelcomeTelemetry from './OnboardingWelcomeTelemetry.svelte';

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.getTelemetryMessages).mockResolvedValue({
    acceptMessage: 'Telemetry message',
    privacy: { link: 'Privacy statement', url: 'https://example.test/privacy' },
  });
});

test('persists telemetry using the actual checkbox checked value', async () => {
  render(OnboardingWelcomeTelemetry);

  const checkbox = await screen.findByRole('checkbox', { name: 'Enable telemetry' });
  expect(checkbox).toBeChecked();

  await fireEvent.click(checkbox);
  await vi.waitFor(() => {
    expect(vi.mocked(window.updateConfigurationValue)).toHaveBeenCalledWith(
      'telemetry.enabled',
      false,
      expect.anything(),
    );
    expect(vi.mocked(window.updateConfigurationValue)).toHaveBeenCalledWith('telemetry.check', true, expect.anything());
  });
  expect(vi.mocked(window.telemetryConfigure)).not.toHaveBeenCalled();

  vi.mocked(window.updateConfigurationValue).mockClear();
  vi.mocked(window.telemetryConfigure).mockClear();

  await fireEvent.click(checkbox);
  await vi.waitFor(() => {
    expect(vi.mocked(window.updateConfigurationValue)).toHaveBeenCalledWith(
      'telemetry.enabled',
      true,
      expect.anything(),
    );
    expect(vi.mocked(window.updateConfigurationValue)).toHaveBeenCalledWith('telemetry.check', true, expect.anything());
    expect(vi.mocked(window.telemetryConfigure)).toHaveBeenCalled();
  });
});
