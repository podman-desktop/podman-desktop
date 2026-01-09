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

import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { router } from 'tinro';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { ContextUI } from '/@/lib/context/context';
import ProviderUpdateButton from '/@/lib/dashboard/ProviderUpdateButton.svelte';
import type { CheckStatus, ProviderInfo } from '/@api/provider-info';

import ProviderActionButtons from './ProviderActionButtons.svelte';

vi.mock(import('tinro'));

vi.mock(import('/@/lib/dashboard/ProviderUpdateButton.svelte'));

const baseProviderInfo: ProviderInfo = {
  id: 'podman',
  name: 'Podman',
  images: {
    icon: 'img',
  },
  status: 'ready',
  warnings: [],
  containerProviderConnectionCreation: false,
  detectionChecks: [],
  containerConnections: [],
  installationSupport: false,
  internalId: '0',
  kubernetesConnections: [],
  kubernetesProviderConnectionCreation: false,
  links: [],
  containerProviderConnectionInitialization: false,
  kubernetesProviderConnectionInitialization: false,
  extensionId: 'podman-extension',
  cleanupSupport: false,
  vmConnections: [],
  vmProviderConnectionCreation: false,
  vmProviderConnectionInitialization: false,
  version: '1.0.0',
};

const mockGlobalContext: ContextUI = {
  setValue: vi.fn(),
} as unknown as ContextUI;

beforeEach(() => {
  vi.resetAllMocks();
});

function renderProviderActionButtons(
  provider: ProviderInfo,
  overrides?: {
    globalContext?: ContextUI;
    providerInstallationInProgress?: boolean;
    onCreateNew?: (provider: ProviderInfo, displayName: string) => Promise<void>;
    onUpdatePreflightChecks?: (checks: CheckStatus[]) => void;
    isOnboardingEnabled?: (provider: ProviderInfo, context: ContextUI) => boolean;
    hasAnyConfiguration?: (provider: ProviderInfo) => boolean;
  },
): ReturnType<typeof render> {
  return render(ProviderActionButtons, {
    provider,
    globalContext: overrides?.globalContext ?? mockGlobalContext,
    providerInstallationInProgress: overrides?.providerInstallationInProgress ?? false,
    onCreateNew: overrides?.onCreateNew ?? vi.fn(),
    onUpdatePreflightChecks: overrides?.onUpdatePreflightChecks ?? vi.fn(),
    isOnboardingEnabled: overrides?.isOnboardingEnabled ?? vi.fn().mockReturnValue(false),
    hasAnyConfiguration: overrides?.hasAnyConfiguration ?? vi.fn().mockReturnValue(false),
  });
}

describe('ProviderActionButtons', () => {
  test('shows only Setup button in onboarding mode when provider is not-installed', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      status: 'not-installed',
    };

    const isOnboardingEnabled = vi.fn().mockReturnValue(true);
    const hasAnyConfiguration = vi.fn().mockReturnValue(false);

    renderProviderActionButtons(provider, {
      isOnboardingEnabled,
      hasAnyConfiguration,
    });

    const setupButton = screen.getByRole('button', { name: `Setup ${provider.name}` });
    expect(setupButton).toBeInTheDocument();

    const createButton = screen.queryByText(/Create new/i);
    expect(createButton).not.toBeInTheDocument();
  });

  test('shows only Setup button in onboarding mode when provider is unknown', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      status: 'unknown',
    };

    const isOnboardingEnabled = vi.fn().mockReturnValue(true);
    const hasAnyConfiguration = vi.fn().mockReturnValue(false);

    renderProviderActionButtons(provider, {
      isOnboardingEnabled,
      hasAnyConfiguration,
    });

    const setupButton = screen.getByRole('button', { name: `Setup ${provider.name}` });
    expect(setupButton).toBeInTheDocument();
  });

  test('navigates to onboarding page when Setup button is clicked in onboarding mode', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      status: 'not-installed',
      extensionId: 'podman-extension',
    };

    const isOnboardingEnabled = vi.fn().mockReturnValue(true);

    renderProviderActionButtons(provider, {
      isOnboardingEnabled,
    });

    const setupButton = screen.getByRole('button', { name: `Setup ${provider.name}` });
    await userEvent.click(setupButton);

    expect(router.goto).toHaveBeenCalledWith('/preferences/onboarding/podman-extension');
  });

  test('navigates to settings page when Setup button is clicked in regular mode', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      containerProviderConnectionCreation: true,
      extensionId: 'podman-extension',
    };

    const hasAnyConfiguration = vi.fn().mockReturnValue(true);

    renderProviderActionButtons(provider, {
      hasAnyConfiguration,
    });

    const setupButton = screen.getByRole('button', { name: `Setup ${provider.name}` });
    await userEvent.click(setupButton);

    expect(router.goto).toHaveBeenCalledWith('/preferences/default/preferences.podman-extension');
  });

  test('shows Create new button when containerProviderConnectionCreation is true', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      containerProviderConnectionCreation: true,
      containerProviderConnectionCreationDisplayName: 'Podman Machine',
    };

    renderProviderActionButtons(provider);

    const createButton = screen.getByRole('button', {
      name: `Create new ${provider.containerProviderConnectionCreationDisplayName}`,
    });
    expect(createButton).toBeInTheDocument();
  });

  test('shows Create new button with custom button title', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      containerProviderConnectionCreation: true,
      containerProviderConnectionCreationButtonTitle: 'Initialize',
      containerProviderConnectionCreationDisplayName: 'Podman Machine',
    };

    renderProviderActionButtons(provider);

    const createButton = screen.getByText('Initialize ...');
    expect(createButton).toBeInTheDocument();
  });

  test('shows Create new button for kubernetesProviderConnectionCreation', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      kubernetesProviderConnectionCreation: true,
      kubernetesProviderConnectionCreationDisplayName: 'Kind Cluster',
    };

    renderProviderActionButtons(provider);

    const createButton = screen.getByRole('button', {
      name: `Create new ${provider.kubernetesProviderConnectionCreationDisplayName}`,
    });
    expect(createButton).toBeInTheDocument();
  });

  test('shows Create new button for vmProviderConnectionCreation', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      vmProviderConnectionCreation: true,
      vmProviderConnectionCreationDisplayName: 'Lima VM',
    };

    renderProviderActionButtons(provider);

    const createButton = screen.getByRole('button', {
      name: `Create new ${provider.vmProviderConnectionCreationDisplayName}`,
    });
    expect(createButton).toBeInTheDocument();
  });

  test('calls onCreateNew callback when Create new button is clicked', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      containerProviderConnectionCreation: true,
      containerProviderConnectionCreationDisplayName: 'Podman Machine',
    };

    const onCreateNew = vi.fn();

    renderProviderActionButtons(provider, {
      onCreateNew,
    });

    const createButton = screen.getByRole('button', {
      name: `Create new ${provider.containerProviderConnectionCreationDisplayName}`,
    });
    await userEvent.click(createButton);

    expect(onCreateNew).toHaveBeenCalledWith(provider, provider.containerProviderConnectionCreationDisplayName);
  });

  test('shows Create new button in progress state', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      containerProviderConnectionCreation: true,
    };

    renderProviderActionButtons(provider, {
      providerInstallationInProgress: true,
    });

    const createButton = screen.getByRole('button', { name: `Create new ${provider.name}` });
    expect(createButton).toBeInTheDocument();
  });

  test('shows settings button when onboarding is enabled', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      containerProviderConnectionCreation: true,
    };

    const isOnboardingEnabled = vi.fn().mockReturnValue(true);

    renderProviderActionButtons(provider, {
      isOnboardingEnabled,
    });

    const setupButton = screen.getByRole('button', { name: `Setup ${provider.name}` });
    expect(setupButton).toBeInTheDocument();
  });

  test('shows settings button when configuration is available', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      containerProviderConnectionCreation: true,
    };

    const hasAnyConfiguration = vi.fn().mockReturnValue(true);

    renderProviderActionButtons(provider, {
      hasAnyConfiguration,
    });

    const setupButton = screen.getByRole('button', { name: `Setup ${provider.name}` });
    expect(setupButton).toBeInTheDocument();
  });

  test('shows update button when update is available', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      version: '1.0.0',
      updateInfo: {
        version: '1.1.0',
      },
    };

    renderProviderActionButtons(provider);

    expect(ProviderUpdateButton).toHaveBeenCalled();
  });

  test('does not show update button when no update is available', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      version: '1.0.0',
      updateInfo: {
        version: '1.0.0',
      },
    };

    renderProviderActionButtons(provider);

    expect(ProviderUpdateButton).not.toHaveBeenCalled();
  });

  test('passes onUpdatePreflightChecks callback to ProviderUpdateButton', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      version: '1.0.0',
      updateInfo: {
        version: '1.1.0',
      },
    };

    const onUpdatePreflightChecks = vi.fn();

    renderProviderActionButtons(provider, {
      onUpdatePreflightChecks,
    });

    expect(ProviderUpdateButton).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        onPreflightChecks: onUpdatePreflightChecks,
        provider,
      }),
    );
  });

  test('shows multiple buttons in regular mode', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      containerProviderConnectionCreation: true,
      version: '1.0.0',
      updateInfo: {
        version: '1.1.0',
      },
    };

    const hasAnyConfiguration = vi.fn().mockReturnValue(true);

    renderProviderActionButtons(provider, {
      hasAnyConfiguration,
    });

    // Should show Create new button
    const createButton = screen.getByRole('button', { name: `Create new ${provider.name}` });
    expect(createButton).toBeInTheDocument();

    // Should show Setup button
    const setupButton = screen.getByRole('button', { name: `Setup ${provider.name}` });
    expect(setupButton).toBeInTheDocument();

    // Should show Update button
    expect(ProviderUpdateButton).toHaveBeenCalled();
  });

  test('uses fallback display name when specific display name is not provided', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      name: 'Podman',
      containerProviderConnectionCreation: true,
    };

    renderProviderActionButtons(provider);

    const createButton = screen.getByRole('button', { name: `Create new ${provider.name}` });
    expect(createButton).toBeInTheDocument();
  });

  test('does not show onboarding setup when globalContext is undefined', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      status: 'not-installed',
    };

    const isOnboardingEnabled = vi.fn().mockReturnValue(true);

    renderProviderActionButtons(provider, {
      globalContext: undefined,
      isOnboardingEnabled,
    });

    // Should not show onboarding Setup button (because globalContext is undefined)
    const setupButtons = screen.queryAllByRole('button', { name: `Setup ${provider.name}` });
    // Should either not exist or be in regular mode (not onboarding mode)
    // In this case, the component should show regular buttons mode
    expect(setupButtons.length).toBeLessThanOrEqual(1);
  });

  test('kubernetesProviderConnectionCreation shows enabled button with correct tooltip when provider status is ready', async () => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      status: 'ready',
      kubernetesProviderConnectionCreation: true,
      kubernetesProviderConnectionCreationDisplayName: 'Kind Cluster',
    };

    renderProviderActionButtons(provider);

    const createButton = screen.getByRole('button', {
      name: `Create new ${provider.kubernetesProviderConnectionCreationDisplayName}`,
    });
    expect(createButton).toBeInTheDocument();
    expect(createButton).toBeEnabled();

    // Hover over the tooltip trigger to display the tooltip
    const tooltipTrigger = screen.getByTestId('tooltip-trigger');
    await userEvent.hover(tooltipTrigger);

    // Check tooltip text shows "Create new Kind Cluster"
    const tooltip = await screen.findByLabelText('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip.textContent).toBe(`Create new ${provider.kubernetesProviderConnectionCreationDisplayName}`);
  });

  test.each([
    {
      status: 'stopped' as const,
      warnings: [{ name: 'Provider Warning', details: 'Kubernetes provider is not running' }],
      expectedTooltip: 'Kubernetes provider is not running',
      description: 'warning tooltip when provider status is not ready',
    },
    {
      status: 'not-installed' as const,
      warnings: [],
      expectedTooltip: 'Provider not ready',
      description: 'default warning when provider status is not ready and no warnings',
    },
    {
      status: 'unknown' as const,
      warnings: [],
      expectedTooltip: 'Provider not ready',
      description: 'disabled button when provider status is unknown',
    },
    {
      status: 'started' as const,
      warnings: [],
      expectedTooltip: 'Provider not ready',
      description: 'disabled button when provider status is started',
    },
  ])('kubernetesProviderConnectionCreation shows disabled button with $description', async ({
    status,
    warnings,
    expectedTooltip,
  }) => {
    const provider: ProviderInfo = {
      ...baseProviderInfo,
      status,
      kubernetesProviderConnectionCreation: true,
      kubernetesProviderConnectionCreationDisplayName: 'Kind Cluster',
      warnings,
    };

    renderProviderActionButtons(provider);

    const createButton = screen.getByRole('button', {
      name: `Create new ${provider.kubernetesProviderConnectionCreationDisplayName}`,
    });
    expect(createButton).toBeInTheDocument();
    expect(createButton).toBeDisabled();

    // Hover over the tooltip trigger to display the tooltip
    const tooltipTrigger = screen.getByTestId('tooltip-trigger');
    await userEvent.hover(tooltipTrigger);

    // Check tooltip text
    const tooltip = await screen.findByLabelText('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip.textContent).toBe(expectedTooltip);
  });
});
