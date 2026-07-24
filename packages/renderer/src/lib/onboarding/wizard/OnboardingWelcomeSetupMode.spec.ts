import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import OnboardingWelcomeSetupMode from './OnboardingWelcomeSetupMode.svelte';
import { DEFAULT_SETUP_SELECTION } from './OnboardingWelcomeSetupMode.types';

describe('OnboardingWelcomeSetupMode', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(window.getPodmanDesktopVersion).mockResolvedValue('1.2.3');
  });

  test('renders welcome heading with setup mode options', async () => {
    render(OnboardingWelcomeSetupMode);

    expect(await screen.findByText('Welcome to Podman Desktop v1.2.3!')).toBeInTheDocument();
    expect(screen.getByLabelText('Use recommended setup')).toBeInTheDocument();
    expect(screen.getByLabelText('Use advanced setup')).toBeInTheDocument();
  });

  test('reveals advanced controls when advanced mode is selected', async () => {
    render(OnboardingWelcomeSetupMode);
    await fireEvent.click(await screen.findByLabelText('Use advanced setup'));

    expect(screen.getByText('Container engine')).toBeInTheDocument();
    expect(screen.getByText('kubectl')).toBeInTheDocument();
    expect(screen.getByText('compose')).toBeInTheDocument();
  });

  test('surfaces setup selection changes to parent layer', async () => {
    const onSelectionChange = vi.fn();
    render(OnboardingWelcomeSetupMode, { onSelectionChange });

    await vi.waitFor(() => expect(onSelectionChange).toHaveBeenCalledWith(DEFAULT_SETUP_SELECTION));

    await fireEvent.click(screen.getByLabelText('Use advanced setup'));
    await vi.waitFor(() =>
      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({
          setupMode: 'advanced',
        }),
      ),
    );

    await fireEvent.click(screen.getByRole('checkbox', { name: 'kubectl' }));
    await vi.waitFor(() =>
      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({
          installKubectl: false,
        }),
      ),
    );
  });
});
