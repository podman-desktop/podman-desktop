/**********************************************************************
 * Copyright (C) 2023-2026 Red Hat, Inc.
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
/* eslint-disable import/no-duplicates */
import { tick } from 'svelte';
import { get } from 'svelte/store';
/* eslint-enable import/no-duplicates */
import { beforeEach, expect, test, vi } from 'vitest';

import { onboardingList } from '/@/stores/onboarding';
import { providerInfos } from '/@/stores/providers';
import type { ProviderInfo } from '/@api/provider-info';
import type { TelemetryMessages } from '/@api/telemetry';

import WelcomePage from './WelcomePage.svelte';

// fake the window.events object
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.getPodmanDesktopVersion).mockResolvedValue('1.0.0');
  vi.mocked(window.getWelcomeMessages).mockResolvedValue({
    getStartedMessage: 'Get started with Podman Desktop',
    welcomeMessage: 'Welcome to Podman Desktop',
  });
  (window.events as unknown) = {
    receive: (_channel: string, func: () => void): void => {
      func();
    },
  };
});

async function waitRender(customProperties: object): Promise<void> {
  render(WelcomePage, { ...customProperties });
  await tick();
}

test('Expect the close button is on the page', async () => {
  await waitRender({ showWelcome: true });
  const button = screen.getByRole('button', { name: 'Skip' });
  expect(button).toBeInTheDocument();
  expect(button).toBeEnabled();
});

test('Expect that the close button closes the window', async () => {
  await waitRender({ showWelcome: true });
  const button = screen.getByRole('button', { name: 'Skip' });
  await fireEvent.click(button);
  // and the button is gone
  expect(button).not.toBeInTheDocument();
});

test('Expect that telemetry UI is hidden when telemetry has already been prompted', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue('true');
  await waitRender({ showWelcome: true, showTelemetry: false });
  let checkbox;
  try {
    checkbox = screen.getByRole('checkbox', { name: 'Enable telemetry' });
  } catch {
    // ignore errors
  }
  expect(checkbox).toBe(undefined);
});

test('Expect that telemetry UI is visible when necessary', async () => {
  vi.mocked(window.getTelemetryMessages).mockResolvedValue({ acceptMessage: 'Help improve the product' });
  await waitRender({ showWelcome: true, showTelemetry: true });
  const checkbox = screen.getByRole('checkbox', { name: 'Enable telemetry' });
  expect(checkbox).toBeInTheDocument();
});

test('Expect that telemetry messages is visible', async () => {
  const telem: TelemetryMessages = {
    acceptMessage: 'Help improve the product',
  };
  vi.mocked(window.getTelemetryMessages).mockResolvedValue(telem);

  await waitRender({ showWelcome: true, showTelemetry: true });

  const accept = screen.getByText(telem.acceptMessage);
  expect(accept).toBeInTheDocument();
});

test('Expect that telemetry link opens url', async () => {
  const telem: TelemetryMessages = {
    acceptMessage: 'Help improve the product',
    info: {
      link: 'Click here',
      url: 'info-url',
    },
  };
  vi.mocked(window.getTelemetryMessages).mockResolvedValue(telem);

  await waitRender({ showWelcome: true, showTelemetry: true });
  const accept = screen.getByText(telem.acceptMessage);
  expect(accept).toBeInTheDocument();

  const infoLink = screen.getByText(telem.info?.link ?? '');
  expect(infoLink).toBeInTheDocument();

  await fireEvent.click(infoLink);
  await vi.waitFor(() => expect(vi.mocked(window.openExternal)).toBeCalledWith(telem.info?.url));
});

test('Expect that telemetry link is missing when info is not provided', async () => {
  const telem = {
    acceptMessage: 'Help improve the product',
  } as TelemetryMessages;
  vi.mocked(window.getTelemetryMessages).mockResolvedValue(telem);

  await waitRender({ showWelcome: true, showTelemetry: true });

  const infoLink = screen.queryByRole('link');
  expect(infoLink).not.toBeInTheDocument();
});

test('Expect welcome screen to show three checked onboarding providers', async () => {
  onboardingList.set([
    {
      extension: 'id',
      removable: true,
      title: 'onboarding',
      name: 'foobar1',
      displayName: 'FooBar1',
      icon: 'data:image/png;base64,foobar1',
      steps: [
        {
          id: 'step',
          title: 'step',
          state: 'failed',
          completionEvents: [],
        },
      ],
      enablement: 'true',
    },
    {
      extension: 'id',
      removable: true,
      title: 'onboarding',
      name: 'foobar2',
      displayName: 'FooBar2',
      icon: 'data:image/png;base64,foobar2',
      steps: [
        {
          id: 'step',
          title: 'step',
          state: 'failed',
          completionEvents: [],
        },
      ],
      enablement: 'true',
    },
    {
      extension: 'id',
      removable: true,
      title: 'onboarding',
      name: 'foobar3',
      displayName: 'FooBar3',
      icon: 'data:image/png;base64,foobar3',
      steps: [
        {
          id: 'step',
          title: 'step',
          state: 'failed',
          completionEvents: [],
        },
      ],
      enablement: 'true',
    },
  ]);

  // wait until the onboarding list is populated
  while (get(onboardingList).length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  await waitRender({ showWelcome: true });

  // wait until aria-label 'providerList' is populated
  while (screen.queryAllByLabelText('providerList').length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Check that the logos for foobar1, foobar2, and foobar3 are present
  const image1 = screen.getByRole('img', { name: 'foobar1 logo' });
  expect(image1).toBeInTheDocument();
  expect(image1).toHaveAttribute('src', 'data:image/png;base64,foobar1');

  const image2 = screen.getByRole('img', { name: 'foobar2 logo' });
  expect(image2).toBeInTheDocument();
  expect(image2).toHaveAttribute('src', 'data:image/png;base64,foobar2');

  const image3 = screen.getByRole('img', { name: 'foobar3 logo' });
  expect(image3).toBeInTheDocument();
  expect(image3).toHaveAttribute('src', 'data:image/png;base64,foobar3');

  // Check that all three are checked as well
  const checkbox1 = screen.getByRole('checkbox', { name: 'FooBar1 checkbox' });
  expect(checkbox1).toBeInTheDocument();
  expect(checkbox1).toBeChecked();

  const checkbox2 = screen.getByRole('checkbox', { name: 'FooBar2 checkbox' });
  expect(checkbox2).toBeInTheDocument();
  expect(checkbox2).toBeChecked();

  const checkbox3 = screen.getByRole('checkbox', { name: 'FooBar3 checkbox' });
  expect(checkbox3).toBeInTheDocument();
  expect(checkbox3).toBeChecked();
});

test('Make sure the provider with name podman appears first even if its 2nd in the list', async () => {
  providerInfos.set([
    {
      extensionId: 'test.extension.id',
      containerConnections: [],
    } as unknown as ProviderInfo,
    {
      extensionId: 'test.extension.id2',
      containerConnections: [],
    } as unknown as ProviderInfo,
    {
      extensionId: 'podman.extension.id',
      containerConnections: [
        {
          name: 'foobar1',
        },
      ],
    } as unknown as ProviderInfo,
  ]);

  // Wait for providerInfos to be populated
  await vi.waitFor(() => {
    return get(providerInfos).length > 0;
  });

  onboardingList.set([
    {
      extension: 'test.extension.id',
      removable: true,
      title: 'onboarding',
      name: 'foobar1',
      displayName: 'FooBar1',
      icon: 'data:image/png;base64,foobar1',
      steps: [
        {
          id: 'step',
          title: 'step',
          state: 'failed',
          completionEvents: [],
        },
      ],
      enablement: 'true',
    },
    {
      extension: 'podman.extension.id',
      removable: true,
      title: 'onboarding',
      name: 'podman',
      displayName: 'Podman',
      icon: 'data:image/png;base64,podman',
      steps: [
        {
          id: 'step',
          title: 'step',
          state: 'failed',
          completionEvents: [],
        },
      ],
      enablement: 'true',
    },
    {
      extension: 'test.extension.id2',
      removable: true,
      title: 'onboarding',
      name: 'foobar3',
      displayName: 'FooBar3',
      icon: 'data:image/png;base64,foobar3',
      steps: [
        {
          id: 'step',
          title: 'step',
          state: 'failed',
          completionEvents: [],
        },
      ],
      enablement: 'true',
    },
  ]);

  // wait until the onboarding list is populated
  await vi.waitFor(() => {
    return get(onboardingList).length > 0;
  });

  await waitRender({ showWelcome: true });

  await vi.waitFor(() => {
    return screen.queryAllByLabelText('providerList').length > 0;
  });

  // In the div 'providerList' the first div should be the one with the name 'podman'
  const providerList = screen.getByLabelText('providerList');
  const firstChild = providerList.children[0];
  expect(firstChild).toHaveTextContent('Podman');
});

test('Expect that releaseNotesBanner.show configuration value is set to current version when showWelcome is set to true', async () => {
  await waitRender({});
  await vi.waitFor(() =>
    expect(vi.mocked(window.updateConfigurationValue)).toBeCalledWith(`releaseNotesBanner.show`, '1.0.0'),
  );
});

test('Expect that releaseNotesBanner.show configuration value is not set to current version when showWelcome is not set to true', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValueOnce('value1');
  await waitRender({});
  expect(vi.mocked(window.updateConfigurationValue)).not.toBeCalledWith(`releaseNotesBanner.show`, '1.0.0');
});
